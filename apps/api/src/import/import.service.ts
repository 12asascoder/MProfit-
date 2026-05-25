import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ImportSourceType, ImportJobStatus, TransactionType } from '@prisma/client';
import { TransactionService } from '../transaction/transaction.service';
import { v4 as uuidv4 } from 'uuid';

// ─── Source status tracking for PAN aggregation (FR-4.4) ─────────
export interface AggregationSourceStatus {
  sourceId: string;
  sourceName: string;
  sourceType: string;
  status: 'QUEUED' | 'CONNECTING' | 'FETCHING' | 'RECONCILING' | 'COMPLETED' | 'FAILED';
  recordsFound: number;
  errorMessage?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface PanAggregationResult {
  jobId: string;
  overallStatus: string;
  sources: AggregationSourceStatus[];
  totalRecordsFound: number;
  successfulSources: number;
  failedSources: number;
  message: string;
}

@Injectable()
export class ImportService {
  private readonly logger = new Logger(ImportService.name);

  constructor(
    private prisma: PrismaService,
    private transactionService: TransactionService,
  ) {}

  // FR-7 Institutional Connectivity Connector Registry (mocking 700+)
  private connectorRegistry = [
    { id: 'cams', name: 'CAMS', category: 'RTA', status: 'active', authType: 'OTP', popularity: 98 },
    { id: 'kfintech', name: 'KFintech', category: 'RTA', status: 'active', authType: 'OTP', popularity: 95 },
    { id: 'zerodha', name: 'Zerodha', category: 'BROKER', status: 'active', authType: 'OAUTH', popularity: 92 },
    { id: 'upstox', name: 'Upstox', category: 'BROKER', status: 'active', authType: 'OAUTH', popularity: 88 },
    { id: 'groww', name: 'Groww', category: 'BROKER', status: 'active', authType: 'OAUTH', popularity: 85 },
    { id: 'hdfc', name: 'HDFC Securities', category: 'BROKER', status: 'active', authType: 'CREDENTIALS', popularity: 75 },
    { id: 'icici', name: 'ICICI Direct', category: 'BROKER', status: 'active', authType: 'CREDENTIALS', popularity: 70 },
    { id: 'sbi', name: 'SBI Securities', category: 'BROKER', status: 'deprecated', authType: 'CREDENTIALS', popularity: 40 },
    // ... representing 700+ connectors
  ];

  getConnectorRegistry() {
    return this.connectorRegistry;
  }

  // ─── FR-4.1 PAN-Linked Aggregation Sources ──────────────────────
  private panAggregationSources = [
    { sourceId: 'mf-cas',      sourceName: 'MF Consolidated Account Statement',  sourceType: 'CAS_STATEMENT' },
    { sourceId: 'mf-central',  sourceName: 'MF Central',                         sourceType: 'MF_CENTRAL' },
    { sourceId: 'cams',        sourceName: 'CAMS (Computer Age Mgmt Services)',  sourceType: 'CAMS' },
    { sourceId: 'kfintech',    sourceName: 'KFintech',                           sourceType: 'KFINTECH' },
    { sourceId: 'nsdl',        sourceName: 'NSDL Demat Holdings',                sourceType: 'NSDL' },
    { sourceId: 'cdsl',        sourceName: 'CDSL Demat Holdings',                sourceType: 'CDSL' },
    { sourceId: 'broker-api',  sourceName: 'Broker-Linked Holdings',             sourceType: 'BROKER_API' },
  ];

  // ─── FR-4.2 Start PAN Aggregation with period selection ─────────
  async startPanAggregation(
    userId: string,
    tenantId: string,
    pan: string,
    portfolioId: string,
    importPeriod: string, // 'last_1y', 'last_3y', 'last_5y', 'all_time'
  ): Promise<PanAggregationResult> {
    this.logger.log(`Initiating PAN aggregation for user ${userId}, period: ${importPeriod}`);

    // Build initial per-source statuses
    const sourceStatuses: AggregationSourceStatus[] = this.panAggregationSources.map(s => ({
      ...s,
      status: 'QUEUED' as const,
      recordsFound: 0,
    }));

    // Create the master import job with source metadata (FR-4.3 — source attribution)
    const job = await this.prisma.importJob.create({
      data: {
        userId,
        portfolioId,
        sourceType: ImportSourceType.PAN_AGGREGATION,
        status: ImportJobStatus.PROCESSING,
        metadata: {
          pan: pan.substring(0, 5) + '****' + pan.substring(9),
          importPeriod,
          sources: JSON.parse(JSON.stringify(sourceStatuses)),
        } as any,
      },
    });

    // Simulate async per-source fetching (in production: Kafka events / BullMQ)
    this.simulateSourceFetching(job.id, userId);

    return {
      jobId: job.id,
      overallStatus: 'PROCESSING',
      sources: sourceStatuses,
      totalRecordsFound: 0,
      successfulSources: 0,
      failedSources: 0,
      message: 'PAN aggregation initiated across all registered sources. Poll for real-time status.',
    };
  }

  // ─── FR-4.4 Simulate per-source fetching with partial-success ───
  private async simulateSourceFetching(jobId: string, userId: string) {
    const recordCounts = [8, 6, 5, 4, 12, 9, 3]; // mock records per source
    const delays =       [1200, 1800, 2400, 2000, 3000, 3500, 1500]; // staggered ms
    const failIndex = 3; // KFintech will fail to demonstrate partial-success (FR-4.4)

    for (let i = 0; i < this.panAggregationSources.length; i++) {
      const source = this.panAggregationSources[i];
      const delay = delays[i];

      setTimeout(async () => {
        try {
          // Fetch current job state
          const job = await this.prisma.importJob.findUnique({ where: { id: jobId } });
          if (!job) return;

          const meta = job.metadata as any;
          const sources: AggregationSourceStatus[] = meta.sources || [];

          // Locate this source's entry
          const idx = sources.findIndex((s: any) => s.sourceId === source.sourceId);
          if (idx === -1) return;

          if (i === failIndex) {
            // FR-4.4 — one source fails, others continue
            sources[idx].status = 'FAILED';
            sources[idx].errorMessage = 'Authentication timeout — please re-authorize KFintech';
            sources[idx].completedAt = new Date().toISOString();
          } else {
            // FR-4.3 — each record tagged with sourceType
            sources[idx].status = 'COMPLETED';
            sources[idx].recordsFound = recordCounts[i];
            sources[idx].completedAt = new Date().toISOString();
          }

          // Compute overall counts
          const completed = sources.filter((s: AggregationSourceStatus) => s.status === 'COMPLETED' || s.status === 'FAILED');
          const successful = sources.filter((s: AggregationSourceStatus) => s.status === 'COMPLETED');
          const failed = sources.filter((s: AggregationSourceStatus) => s.status === 'FAILED');
          const totalRecords = successful.reduce((sum: number, s: AggregationSourceStatus) => sum + s.recordsFound, 0);

          const allDone = completed.length === sources.length;
          const overallStatus = allDone
            ? (failed.length > 0 ? ImportJobStatus.PARTIAL_SUCCESS : ImportJobStatus.COMPLETED)
            : ImportJobStatus.PROCESSING;

          await this.prisma.importJob.update({
            where: { id: jobId },
            data: {
              status: overallStatus,
              totalRecords: sources.length,
              processedRecords: completed.length,
              successRecords: successful.length,
              failedRecords: failed.length,
              metadata: { ...meta, sources },
              ...(allDone ? { completedAt: new Date() } : {}),
            },
          });

          this.logger.log(`Source ${source.sourceName}: ${sources[idx].status} (${sources[idx].recordsFound} records)`);
        } catch (err) {
          this.logger.error(`Error processing source ${source.sourceName}:`, err);
        }
      }, delay);
    }
  }

  // ─── Get per-source aggregation status ──────────────────────────
  async getAggregationStatus(jobId: string, userId: string): Promise<PanAggregationResult> {
    const job = await this.prisma.importJob.findUnique({ where: { id: jobId } });

    if (!job || job.userId !== userId) {
      throw new NotFoundException('Aggregation job not found');
    }

    const meta = job.metadata as any;
    const sources: AggregationSourceStatus[] = meta.sources || [];
    const successful = sources.filter(s => s.status === 'COMPLETED');
    const failed = sources.filter(s => s.status === 'FAILED');

    return {
      jobId: job.id,
      overallStatus: String(job.status),
      sources,
      totalRecordsFound: successful.reduce((sum, s) => sum + s.recordsFound, 0),
      successfulSources: successful.length,
      failedSources: failed.length,
      message: job.status === 'PROCESSING'
        ? `Aggregating data... (${job.processedRecords}/${job.totalRecords} sources completed)`
        : job.status === 'PARTIAL_SUCCESS'
          ? `Completed with ${failed.length} source(s) failed. ${successful.length} sources imported successfully.`
          : 'All sources imported successfully.',
    };
  }

  // ─── FR-6: Document-Based Imports ───────────────────────────────
  async processDocumentUpload(userId: string, tenantId: string, file: Express.Multer.File, password?: string) {
    let sourceType: ImportSourceType = ImportSourceType.PDF_UPLOAD;
    if (file.originalname.endsWith('.csv')) sourceType = ImportSourceType.CSV_UPLOAD;
    else if (file.originalname.endsWith('.xlsx')) sourceType = ImportSourceType.EXCEL_UPLOAD;
    else if (file.originalname.toLowerCase().includes('cas')) sourceType = ImportSourceType.CAS_STATEMENT;
    else if (file.originalname.toLowerCase().includes('contract')) sourceType = ImportSourceType.CONTRACT_NOTE;

    const job = await this.prisma.importJob.create({
      data: {
        userId,
        sourceType,
        status: ImportJobStatus.PROCESSING,
        fileName: file.originalname,
        metadata: {
          fileSize: file.size,
          mimeType: file.mimetype,
          passwordProvided: !!password
        },
      }
    });

    // Simulate async parsing logic with partial extraction (FR-6.3)
    setTimeout(async () => {
      // Mock failure simulation for files containing "fail"
      if (file.originalname.toLowerCase().includes('fail')) {
        await this.prisma.importJob.update({
          where: { id: job.id },
          data: {
            status: ImportJobStatus.FAILED,
            metadata: { error: 'Failed to parse document: Unknown format' },
            completedAt: new Date()
          }
        });
        return;
      }

      // Mock partial success if file contains "partial"
      const isPartial = file.originalname.toLowerCase().includes('partial');

      await this.prisma.importJob.update({
        where: { id: job.id },
        data: {
          status: isPartial ? ImportJobStatus.PARTIAL_SUCCESS : ImportJobStatus.COMPLETED,
          totalRecords: 15,
          successRecords: isPartial ? 10 : 15,
          failedRecords: isPartial ? 5 : 0,
          metadata: {
            extractedHoldings: isPartial ? 10 : 15,
            extractionErrors: isPartial ? ['Line 12: Invalid ISIN format', 'Line 14: Negative quantity'] : []
          },
          completedAt: new Date()
        }
      });
    }, 2000);

    return {
      jobId: job.id,
      status: job.status,
      message: `Document ${file.originalname} upload accepted and parsing started.`,
    };
  }

  // Legacy PAN sync (Fallback)
  async syncPanLinkedAccounts(userId: string, tenantId: string, pan: string) {
    this.logger.log(`Initiating real-time PAN-linked sync for user ${userId}`);
    
    const job = await this.prisma.importJob.create({
      data: {
        userId,
        sourceType: ImportSourceType.PAN_AGGREGATION,
        status: ImportJobStatus.PROCESSING,
        metadata: {
          pan: pan.substring(0, 5) + '****' + pan.substring(9),
          sources: Object.keys(this.connectorRegistry)
        },
      }
    });

    setTimeout(async () => {
      this.logger.log(`Simulated async fetching completed for PAN aggregation job ${job.id}`);
      
      const holding = await this.prisma.holding.findFirst({
        where: { portfolio: { userId } }
      });

      if (holding) {
        await this.prisma.reconciliationConflict.create({
          data: {
            holdingId: holding.id,
            sourceA: 'USER_LEDGER',
            sourceB: 'CAMS_CAS',
            field: 'quantity',
            valueA: String(holding.quantity),
            valueB: String(Number(holding.quantity) + 10),
            severity: 'HIGH',
            resolution: 'PENDING'
          }
        });
      }

      await this.prisma.importJob.update({
        where: { id: job.id },
        data: {
          status: ImportJobStatus.COMPLETED,
          successRecords: 24,
          completedAt: new Date()
        }
      });
    }, 5000);

    return {
      jobId: job.id,
      status: job.status,
      message: 'PAN-linked account aggregation started across all registered institutions. Poll job status for real-time updates.',
      activeConnectors: Object.keys(this.connectorRegistry).length
    };
  }

  async startBrokerSync(userId: string, tenantId: string, brokerType: ImportSourceType, credentials: any) {
    if (!([ImportSourceType.BROKER_API, ImportSourceType.INSTITUTIONAL] as ImportSourceType[]).includes(brokerType)) {
      throw new BadRequestException('Invalid broker type for sync');
    }

    const job = await this.prisma.importJob.create({
      data: {
        userId,
        sourceType: brokerType,
        status: ImportJobStatus.QUEUED,
        metadata: { brokerType },
      }
    });

    return {
      jobId: job.id,
      status: job.status,
      message: `${brokerType} sync initiated.`,
    };
  }

  async getJobStatus(jobId: string, userId: string) {
    const job = await this.prisma.importJob.findUnique({
      where: { id: jobId }
    });

    if (!job || job.userId !== userId) {
      throw new NotFoundException('Import job not found');
    }

    return job;
  }
}
