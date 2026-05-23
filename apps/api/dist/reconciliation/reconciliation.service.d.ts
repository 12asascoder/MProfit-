import { PrismaService } from '../prisma/prisma.service';
export declare class ReconciliationService {
    private prisma;
    constructor(prisma: PrismaService);
    getConflicts(userId: string, portfolioId?: string): Promise<({
        holding: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        holdingId: string;
        sourceA: string;
        sourceB: string;
        field: string;
        valueA: string;
        valueB: string;
        severity: import(".prisma/client").$Enums.ConflictSeverity;
        resolution: import(".prisma/client").$Enums.ConflictResolution;
        resolvedBy: string | null;
        resolvedAt: Date | null;
        resolvedValue: string | null;
    })[]>;
    resolveConflict(conflictId: string, userId: string, resolvedValue: string, notes?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        holdingId: string;
        sourceA: string;
        sourceB: string;
        field: string;
        valueA: string;
        valueB: string;
        severity: import(".prisma/client").$Enums.ConflictSeverity;
        resolution: import(".prisma/client").$Enums.ConflictResolution;
        resolvedBy: string | null;
        resolvedAt: Date | null;
        resolvedValue: string | null;
    }>;
    dismissConflict(conflictId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        holdingId: string;
        sourceA: string;
        sourceB: string;
        field: string;
        valueA: string;
        valueB: string;
        severity: import(".prisma/client").$Enums.ConflictSeverity;
        resolution: import(".prisma/client").$Enums.ConflictResolution;
        resolvedBy: string | null;
        resolvedAt: Date | null;
        resolvedValue: string | null;
    }>;
}
