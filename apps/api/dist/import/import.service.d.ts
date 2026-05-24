import { PrismaService } from '../prisma/prisma.service';
import { ImportSourceType } from '@prisma/client';
import { TransactionService } from '../transaction/transaction.service';
export declare class ImportService {
    private prisma;
    private transactionService;
    private readonly logger;
    constructor(prisma: PrismaService, transactionService: TransactionService);
    private connectorRegistry;
    startCASImport(userId: string, tenantId: string, fileBuffer: Buffer, password?: string): Promise<{
        jobId: string;
        status: import(".prisma/client").$Enums.ImportJobStatus;
        message: string;
    }>;
    syncPanLinkedAccounts(userId: string, tenantId: string, pan: string): Promise<{
        jobId: string;
        status: import(".prisma/client").$Enums.ImportJobStatus;
        message: string;
        activeConnectors: number;
    }>;
    startBrokerSync(userId: string, tenantId: string, brokerType: ImportSourceType, credentials: any): Promise<{
        jobId: string;
        status: import(".prisma/client").$Enums.ImportJobStatus;
        message: string;
    }>;
    getJobStatus(jobId: string, userId: string): Promise<{
        id: string;
        sourceType: import(".prisma/client").$Enums.ImportSourceType;
        portfolioId: string | null;
        status: import(".prisma/client").$Enums.ImportJobStatus;
        totalRecords: number;
        processedRecords: number;
        successRecords: number;
        failedRecords: number;
        fileName: string | null;
        fileUrl: string | null;
        errorLog: import("@prisma/client/runtime/library").JsonValue | null;
        metadata: import("@prisma/client/runtime/library").JsonValue;
        startedAt: Date | null;
        completedAt: Date | null;
        createdAt: Date;
        sourceId: string | null;
        userId: string;
    }>;
}
