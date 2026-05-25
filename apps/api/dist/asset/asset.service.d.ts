import { PrismaService } from '../prisma/prisma.service';
import { AssetCategory } from '@prisma/client';
export declare class AssetService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findAll(query: {
        category?: AssetCategory;
        search?: string;
    }): Promise<{
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
    }[]>;
    findOne(id: string): Promise<{
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
    }>;
    findByIsin(isin: string): Promise<{
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
    }>;
}
