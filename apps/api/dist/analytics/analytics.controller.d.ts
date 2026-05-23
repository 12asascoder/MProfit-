import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getAssetAllocation(req: any, portfolioId?: string): Promise<{
        category: string;
        value: number;
        percentage: number;
    }[]>;
    getPerformanceMetrics(req: any, portfolioId?: string): Promise<{
        cagr: number;
        xirr: number;
        absoluteReturn: number;
        alpha: number;
        beta: number;
        sharpeRatio: number;
    }>;
}
