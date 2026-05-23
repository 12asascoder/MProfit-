import { PrismaService } from '../prisma/prisma.service';
import { ReportType, ReportFormat } from '@prisma/client';
export declare class ReportService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    generateReport(userId: string, type: ReportType, format: ReportFormat, filters: any): Promise<{
        reportId: string;
        status: import(".prisma/client").$Enums.ReportStatus;
        message: string;
    }>;
    getReportStatus(reportId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.ReportType;
        userId: string;
        portfolioId: string;
        status: import(".prisma/client").$Enums.ReportStatus;
        fileName: string | null;
        fileUrl: string | null;
        format: import(".prisma/client").$Enums.ReportFormat;
        fileSize: number | null;
        filters: import("@prisma/client/runtime/library").JsonValue;
        generatedAt: Date | null;
        expiresAt: Date | null;
    }>;
    listUserReports(userId: string): Promise<{
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.ReportType;
        userId: string;
        portfolioId: string;
        status: import(".prisma/client").$Enums.ReportStatus;
        fileName: string | null;
        fileUrl: string | null;
        format: import(".prisma/client").$Enums.ReportFormat;
        fileSize: number | null;
        filters: import("@prisma/client/runtime/library").JsonValue;
        generatedAt: Date | null;
        expiresAt: Date | null;
    }[]>;
    private mockAsyncGeneration;
}
