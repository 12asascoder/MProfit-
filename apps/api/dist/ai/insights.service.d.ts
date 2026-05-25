import { PrismaService } from '../prisma/prisma.service';
export declare class InsightsService {
    private prisma;
    private readonly logger;
    private openai;
    constructor(prisma: PrismaService);
    generateInsightsForPortfolio(portfolioId: string): Promise<any[]>;
    private getMockInsights;
    getActiveInsights(portfolioId: string): Promise<{
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.AIInsightType;
        expiresAt: Date | null;
        portfolioId: string;
        title: string;
        body: string;
        confidence: import("@prisma/client/runtime/library").Decimal;
        whyGenerated: string;
        dataTrigger: string;
        assumptionsUsed: import("@prisma/client/runtime/library").JsonValue;
        estimatedImpact: string | null;
        disclaimer: string;
        actionLabel: string | null;
        actionUrl: string | null;
        isRead: boolean;
        isDismissed: boolean;
    }[]>;
    dismissInsight(insightId: string): Promise<{
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.AIInsightType;
        expiresAt: Date | null;
        portfolioId: string;
        title: string;
        body: string;
        confidence: import("@prisma/client/runtime/library").Decimal;
        whyGenerated: string;
        dataTrigger: string;
        assumptionsUsed: import("@prisma/client/runtime/library").JsonValue;
        estimatedImpact: string | null;
        disclaimer: string;
        actionLabel: string | null;
        actionUrl: string | null;
        isRead: boolean;
        isDismissed: boolean;
    }>;
}
