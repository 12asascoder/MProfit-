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