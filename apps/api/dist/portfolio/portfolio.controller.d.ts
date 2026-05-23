import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
export declare class PortfolioController {
    private readonly portfolioService;
    constructor(portfolioService: PortfolioService);
    create(req: any, createPortfolioDto: CreatePortfolioDto): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        type: import(".prisma/client").$Enums.PortfolioType;
        userId: string;
        parentId: string | null;
        description: string | null;
        goalAmount: import("@prisma/client/runtime/library").Decimal | null;
        goalDate: Date | null;
        isDefault: boolean;
    }>;
    findAll(req: any): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        type: import(".prisma/client").$Enums.PortfolioType;
        userId: string;
        parentId: string | null;
        description: string | null;
        goalAmount: import("@prisma/client/runtime/library").Decimal | null;
        goalDate: Date | null;
        isDefault: boolean;
    }[]>;
    findOne(id: string, req: any): Promise<{
        holdings: ({
            asset: {
                symbol: string | null;
                name: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                isin: string | null;
                assetType: import(".prisma/client").$Enums.AssetType;
                category: import(".prisma/client").$Enums.AssetCategory;
                exchange: string | null;
                sector: string | null;
                industry: string | null;
                currency: string;
                lotSize: number;
                faceValue: import("@prisma/client/runtime/library").Decimal | null;
                metadata: import("@prisma/client/runtime/library").JsonValue;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            portfolioId: string;
            assetId: string;
            quantity: import("@prisma/client/runtime/library").Decimal;
            averageCost: import("@prisma/client/runtime/library").Decimal;
            currentPrice: import("@prisma/client/runtime/library").Decimal;
            currentValue: import("@prisma/client/runtime/library").Decimal;
            investedValue: import("@prisma/client/runtime/library").Decimal;
            unrealizedGain: import("@prisma/client/runtime/library").Decimal;
            unrealizedGainPct: import("@prisma/client/runtime/library").Decimal;
            dayChange: import("@prisma/client/runtime/library").Decimal;
            dayChangePct: import("@prisma/client/runtime/library").Decimal;
            allocation: import("@prisma/client/runtime/library").Decimal;
            source: string;
            folioNumber: string | null;
            lastUpdated: Date;
        })[];
    } & {
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        type: import(".prisma/client").$Enums.PortfolioType;
        userId: string;
        parentId: string | null;
        description: string | null;
        goalAmount: import("@prisma/client/runtime/library").Decimal | null;
        goalDate: Date | null;
        isDefault: boolean;
    }>;
    getSummary(id: string, req: any): Promise<{
        netWorth: number;
        investedAmount: number;
        currentValue: number;
        todaysGain: number;
        unrealizedGain: number;
        absoluteReturnPercent: number;
        lastSyncAt: Date;
    }>;
}
