"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ImportService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const transaction_service_1 = require("../transaction/transaction.service");
let ImportService = ImportService_1 = class ImportService {
    constructor(prisma, transactionService) {
        this.prisma = prisma;
        this.transactionService = transactionService;
        this.logger = new common_1.Logger(ImportService_1.name);
        this.connectorRegistry = [
            { id: 'cams', name: 'CAMS', category: 'RTA', status: 'active', authType: 'OTP', popularity: 98 },
            { id: 'kfintech', name: 'KFintech', category: 'RTA', status: 'active', authType: 'OTP', popularity: 95 },
            { id: 'zerodha', name: 'Zerodha', category: 'BROKER', status: 'active', authType: 'OAUTH', popularity: 92 },
            { id: 'upstox', name: 'Upstox', category: 'BROKER', status: 'active', authType: 'OAUTH', popularity: 88 },
            { id: 'groww', name: 'Groww', category: 'BROKER', status: 'active', authType: 'OAUTH', popularity: 85 },
            { id: 'hdfc', name: 'HDFC Securities', category: 'BROKER', status: 'active', authType: 'CREDENTIALS', popularity: 75 },
            { id: 'icici', name: 'ICICI Direct', category: 'BROKER', status: 'active', authType: 'CREDENTIALS', popularity: 70 },
            { id: 'sbi', name: 'SBI Securities', category: 'BROKER', status: 'deprecated', authType: 'CREDENTIALS', popularity: 40 },
        ];
        this.panAggregationSources = [
            { sourceId: 'mf-cas', sourceName: 'MF Consolidated Account Statement', sourceType: 'CAS_STATEMENT' },
            { sourceId: 'mf-central', sourceName: 'MF Central', sourceType: 'MF_CENTRAL' },
            { sourceId: 'cams', sourceName: 'CAMS (Computer Age Mgmt Services)', sourceType: 'CAMS' },
            { sourceId: 'kfintech', sourceName: 'KFintech', sourceType: 'KFINTECH' },
            { sourceId: 'nsdl', sourceName: 'NSDL Demat Holdings', sourceType: 'NSDL' },
            { sourceId: 'cdsl', sourceName: 'CDSL Demat Holdings', sourceType: 'CDSL' },
            { sourceId: 'broker-api', sourceName: 'Broker-Linked Holdings', sourceType: 'BROKER_API' },
        ];
    }
    getConnectorRegistry() {
        return this.connectorRegistry;
    }
    async startPanAggregation(userId, tenantId, pan, portfolioId, importPeriod) {
        this.logger.log(`Initiating PAN aggregation for user ${userId}, period: ${importPeriod}`);
        const sourceStatuses = this.panAggregationSources.map(s => ({
            ...s,
            status: 'QUEUED',
            recordsFound: 0,
        }));
        const job = await this.prisma.importJob.create({
            data: {
                userId,
                portfolioId,
                sourceType: client_1.ImportSourceType.PAN_AGGREGATION,
                status: client_1.ImportJobStatus.PROCESSING,
                metadata: {
                    pan: pan.substring(0, 5) + '****' + pan.substring(9),
                    importPeriod,
                    sources: JSON.parse(JSON.stringify(sourceStatuses)),
                },
            },
        });
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
    async simulateSourceFetching(jobId, userId) {
        const recordCounts = [8, 6, 5, 4, 12, 9, 3];
        const delays = [1200, 1800, 2400, 2000, 3000, 3500, 1500];
        const failIndex = 3;
        for (let i = 0; i < this.panAggregationSources.length; i++) {
            const source = this.panAggregationSources[i];
            const delay = delays[i];
            setTimeout(async () => {
                try {
                    const job = await this.prisma.importJob.findUnique({ where: { id: jobId } });
                    if (!job)
                        return;
                    const meta = job.metadata;
                    const sources = meta.sources || [];
                    const idx = sources.findIndex((s) => s.sourceId === source.sourceId);
                    if (idx === -1)
                        return;
                    if (i === failIndex) {
                        sources[idx].status = 'FAILED';
                        sources[idx].errorMessage = 'Authentication timeout — please re-authorize KFintech';
                        sources[idx].completedAt = new Date().toISOString();
                    }
                    else {
                        sources[idx].status = 'COMPLETED';
                        sources[idx].recordsFound = recordCounts[i];
                        sources[idx].completedAt = new Date().toISOString();
                    }
                    const completed = sources.filter((s) => s.status === 'COMPLETED' || s.status === 'FAILED');
                    const successful = sources.filter((s) => s.status === 'COMPLETED');
                    const failed = sources.filter((s) => s.status === 'FAILED');
                    const totalRecords = successful.reduce((sum, s) => sum + s.recordsFound, 0);
                    const allDone = completed.length === sources.length;
                    const overallStatus = allDone
                        ? (failed.length > 0 ? client_1.ImportJobStatus.PARTIAL_SUCCESS : client_1.ImportJobStatus.COMPLETED)
                        : client_1.ImportJobStatus.PROCESSING;
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
                }
                catch (err) {
                    this.logger.error(`Error processing source ${source.sourceName}:`, err);
                }
            }, delay);
        }
    }
    async getAggregationStatus(jobId, userId) {
        const job = await this.prisma.importJob.findUnique({ where: { id: jobId } });
        if (!job || job.userId !== userId) {
            throw new common_1.NotFoundException('Aggregation job not found');
        }
        const meta = job.metadata;
        const sources = meta.sources || [];
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
    async processDocumentUpload(userId, tenantId, file, password) {
        let sourceType = client_1.ImportSourceType.PDF_UPLOAD;
        if (file.originalname.endsWith('.csv'))
            sourceType = client_1.ImportSourceType.CSV_UPLOAD;
        else if (file.originalname.endsWith('.xlsx'))
            sourceType = client_1.ImportSourceType.EXCEL_UPLOAD;
        else if (file.originalname.toLowerCase().includes('cas'))
            sourceType = client_1.ImportSourceType.CAS_STATEMENT;
        else if (file.originalname.toLowerCase().includes('contract'))
            sourceType = client_1.ImportSourceType.CONTRACT_NOTE;
        const job = await this.prisma.importJob.create({
            data: {
                userId,
                sourceType,
                status: client_1.ImportJobStatus.PROCESSING,
                fileName: file.originalname,
                metadata: {
                    fileSize: file.size,
                    mimeType: file.mimetype,
                    passwordProvided: !!password
                },
            }
        });
        setTimeout(async () => {
            if (file.originalname.toLowerCase().includes('fail')) {
                await this.prisma.importJob.update({
                    where: { id: job.id },
                    data: {
                        status: client_1.ImportJobStatus.FAILED,
                        metadata: { error: 'Failed to parse document: Unknown format' },
                        completedAt: new Date()
                    }
                });
                return;
            }
            const isPartial = file.originalname.toLowerCase().includes('partial');
            await this.prisma.importJob.update({
                where: { id: job.id },
                data: {
                    status: isPartial ? client_1.ImportJobStatus.PARTIAL_SUCCESS : client_1.ImportJobStatus.COMPLETED,
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
    async syncPanLinkedAccounts(userId, tenantId, pan) {
        this.logger.log(`Initiating real-time PAN-linked sync for user ${userId}`);
        const job = await this.prisma.importJob.create({
            data: {
                userId,
                sourceType: client_1.ImportSourceType.PAN_AGGREGATION,
                status: client_1.ImportJobStatus.PROCESSING,
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
                    status: client_1.ImportJobStatus.COMPLETED,
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
    async startBrokerSync(userId, tenantId, brokerType, credentials) {
        if (![client_1.ImportSourceType.BROKER_API, client_1.ImportSourceType.INSTITUTIONAL].includes(brokerType)) {
            throw new common_1.BadRequestException('Invalid broker type for sync');
        }
        const job = await this.prisma.importJob.create({
            data: {
                userId,
                sourceType: brokerType,
                status: client_1.ImportJobStatus.QUEUED,
                metadata: { brokerType },
            }
        });
        return {
            jobId: job.id,
            status: job.status,
            message: `${brokerType} sync initiated.`,
        };
    }
    async getJobStatus(jobId, userId) {
        const job = await this.prisma.importJob.findUnique({
            where: { id: jobId }
        });
        if (!job || job.userId !== userId) {
            throw new common_1.NotFoundException('Import job not found');
        }
        return job;
    }
};
exports.ImportService = ImportService;
exports.ImportService = ImportService = ImportService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        transaction_service_1.TransactionService])
], ImportService);
//# sourceMappingURL=import.service.js.map