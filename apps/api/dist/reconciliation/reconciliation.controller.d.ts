import { ReconciliationService } from './reconciliation.service';
export declare class ReconciliationController {
    private readonly reconciliationService;
    constructor(reconciliationService: ReconciliationService);
    getConflicts(req: any, portfolioId?: string): Promise<({
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
    resolveConflict(id: string, req: any, body: {
        resolvedValue: string;
        notes?: string;
    }): Promise<{
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
    dismissConflict(id: string, req: any): Promise<{
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
    runEngine(req: any, portfolioId: string): Promise<{
        message: string;
        conflictsDetected: number;
        conflicts: {
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
        }[];
    }>;
}
