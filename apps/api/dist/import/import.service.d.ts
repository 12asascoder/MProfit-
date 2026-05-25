import { PrismaService } from '../prisma/prisma.service';
import { ImportSourceType } from '@prisma/client';
import { TransactionService } from '../transaction/transaction.service';
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
export declare class ImportService {
    private prisma;
    private transactionService;
    private readonly logger;
    constructor(prisma: PrismaService, transactionService: TransactionService);
    private connectorRegistry;
    getConnectorRegistry(): {
        id: string;
        name: string;
        category: string;
        status: string;
        authType: string;
        popularity: number;
    }[];
    private panAggregationSources;
    startPanAggregation(userId: string, tenantId: string, pan: string, portfolioId: string, importPeriod: string): Promise<PanAggregationResult>;
    private simulateSourceFetching;
    getAggregationStatus(jobId: string, userId: string): Promise<PanAggregationResult>;
    processDocumentUpload(userId: string, tenantId: string, file: Express.Multer.File, password?: string): Promise<{
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
