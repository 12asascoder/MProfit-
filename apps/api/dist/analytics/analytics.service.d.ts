import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getAssetAllocation(userId: string, portfolioId?: string): Promise<{
        category: string;
        value: number;
        percentage: number;
    }[]>;
    private xirr;
    getPerformanceMetrics(userId: string, portfolioId?: string): Promise<{
        cagr: number;
        xirr: number;
        absoluteReturn: number;
        alpha: number;
        beta: number;
        sharpeRatio: number;
    }>;
}
