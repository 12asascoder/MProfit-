import { ImportService } from './import.service';
import { ImportSourceType } from '@prisma/client';
export declare class ImportController {
    private readonly importService;
    constructor(importService: ImportService);
    importCAS(req: any, file: Express.Multer.File, password?: string): Promise<{
        jobId: string;
        status: import(".prisma/client").$Enums.ImportJobStatus;
        message: string;
    }>;
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
