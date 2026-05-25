import { ImportService } from './import.service';
import { ImportSourceType } from '@prisma/client';
export declare class ImportController {
    private readonly importService;
    constructor(importService: ImportService);
    importDocument(req: any, file: Express.Multer.File, password?: string): Promise<{
        jobId: string;
        status: import(".prisma/client").$Enums.ImportJobStatus;
        message: string;
    }>;
    getConnectors(): {
        id: string;
        name: string;
        category: string;
        status: string;
        authType: string;
        popularity: number;
    }[];
    startPanAggregation(req: any, body: {
        pan: string;
        portfolioId: string;
        importPeriod: string;
    }): Promise<import("./import.service").PanAggregationResult>;
    getAggregationStatus(jobId: string, req: any): Promise<import("./import.service").PanAggregationResult>;
    syncPanLinkedAccounts(req: any, pan: string): Promise<{
        jobId: string;
        status: import(".prisma/client").$Enums.ImportJobStatus;
        message: string;
        activeConnectors: number;
    }>;
    syncBroker(req: any, body: {
        brokerType: ImportSourceType;
        credentials: any;
    }): Promise<{
        jobId: string;
        status: import(".prisma/client").$Enums.ImportJobStatus;
        message: string;
    }>;
    getJobStatus(id: string, req: any): Promise<{
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
