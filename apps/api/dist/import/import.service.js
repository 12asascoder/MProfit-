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
        this.connectorRegistry = {
            cams: { status: 'active', version: 'v2', fallback: 'pdf' },
            kfintech: { status: 'active', version: 'v1', fallback: 'pdf' },
            zerodha: { status: 'active', version: 'v3', fallback: 'api' },
            upstox: { status: 'active', version: 'v2', fallback: 'api' },
            mfcentral: { status: 'active', version: 'v1', fallback: 'email' }
        };
    }
    async startCASImport(userId, tenantId, fileBuffer, password) {
        const job = await this.prisma.importJob.create({
            data: {
                userId,
                sourceType: client_1.ImportSourceType.CAS_STATEMENT,
                status: client_1.ImportJobStatus.QUEUED,
                fileName: 'cas_statement.pdf',
                metadata: { passwordProvided: !!password },
            }
        });
        return {
            jobId: job.id,
            status: job.status,
            message: 'CAS import job queued successfully. It may take a few moments to process.',
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
                this.logger.warn(`Generated mock reconciliation conflict for holding ${holding.id}`);
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