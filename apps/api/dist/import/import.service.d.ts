import { PrismaService } from '../prisma/prisma.service';
import { ImportSourceType } from '@prisma/client';
import { TransactionService } from '../transaction/transaction.service';
export declare class ImportService {
    private prisma;
    private transactionService;
    private readonly logger;
    constructor(prisma: PrismaService, transactionService: TransactionService);
    startCASImport(userId: string, tenantId: string, fileBuffer: Buffer, password?: string): Promise<{
        jobId: string;
        status: import(".prisma/client").$Enums.ImportJobStatus;
        message: string;
    }>;
    startBrokerSync(userId: string, tenantId: string, brokerType: ImportSourceType, credentials: any): Promise<{
        jobId: string;
        status: import(".prisma/client").$Enums.ImportJobStatus;
        message: string;
    }>;
    getJobStatus(jobId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        portfolioId: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue;
        sourceType: import(".prisma/client").$Enums.ImportSourceType;
        status: import(".prisma/client").$Enums.ImportJobStatus;
        totalRecords: number;
        processedRecords: number;
        successRecords: number;
        failedRecords: number;
        fileName: string | null;
        fileUrl: string | null;
        errorLog: import("@prisma/client/runtime/library").JsonValue | null;
        startedAt: Date | null;
        completedAt: Date | null;
        sourceId: string | null;
    }>;
}
