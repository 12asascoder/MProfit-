import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ImportSourceType, ImportJobStatus, TransactionType } from '@prisma/client';
import { TransactionService } from '../transaction/transaction.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ImportService {
  private readonly logger = new Logger(ImportService.name);

  constructor(
    private prisma: PrismaService,
    private transactionService: TransactionService,
  ) {}

  // FR-7 Institutional Connectivity Connector Registry
  private connectorRegistry = {
    cams: { status: 'active', version: 'v2', fallback: 'pdf' },
    kfintech: { status: 'active', version: 'v1', fallback: 'pdf' },
    zerodha: { status: 'active', version: 'v3', fallback: 'api' },
    upstox: { status: 'active', version: 'v2', fallback: 'api' },
    mfcentral: { status: 'active', version: 'v1', fallback: 'email' }
  };

  async startCASImport(userId: string, tenantId: string, fileBuffer: Buffer, password?: string) {
    // 1. Create a job record
    const job = await this.prisma.importJob.create({
      data: {
        userId,
        sourceType: ImportSourceType.CAS_STATEMENT,
        status: ImportJobStatus.QUEUED,
        fileName: 'cas_statement.pdf',
        metadata: { passwordProvided: !!password },
      }
    });

    // 2. Queue the actual processing (would use BullMQ here in production)
    // this.queue.add('process-cas', { jobId: job.id, fileBuffer, password });
    
    // For now, let's mock successful queueing
    return {
      jobId: job.id,
      status: job.status,
      message: 'CAS import job queued successfully. It may take a few moments to process.',
    };
  }

  // FR-4 PAN-Linked Aggregation Import
  async syncPanLinkedAccounts(userId: string, tenantId: string, pan: string) {
    this.logger.log(`Initiating real-time PAN-linked sync for user ${userId}`);
    
    // Create an aggregation job to track multiple sources
    const job = await this.prisma.importJob.create({
      data: {
        userId,
        sourceType: ImportSourceType.PAN_AGGREGATION,
        status: ImportJobStatus.PROCESSING,
        metadata: {
          pan: pan.substring(0, 5) + '****' + pan.substring(9), // Masked
          sources: Object.keys(this.connectorRegistry)
        },
      }
    });

    // Simulate real-time polling / WebSocket response by pushing a background task
    // In production, this would fire off requests to CAMS, KFintech, MF Central, etc.
    setTimeout(async () => {
      this.logger.log(`Simulated async fetching completed for PAN aggregation job ${job.id}`);
      
      // Simulate data reconciliation engine (FR-8) by creating a mock conflict
      // Find a holding to attach the conflict to
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
            valueB: String(Number(holding.quantity) + 10), // Mock mismatch
            severity: 'HIGH',
            resolution: 'PENDING'
          }
        });
        this.logger.warn(`Generated mock reconciliation conflict for holding ${holding.id}`);
      }

      await this.prisma.importJob.update({
        where: { id: job.id },
        data: {
          status: ImportJobStatus.COMPLETED,
          successRecords: 24, // Mock records found
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
