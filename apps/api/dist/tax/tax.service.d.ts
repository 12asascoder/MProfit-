import { PrismaService } from '../prisma/prisma.service';
export declare class TaxService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getCapitalGains(userId: string, financialYearStart: string, financialYearEnd: string, portfolioId?: string): Promise<{
        financialYear: string;
        summary: {
            totalSTCG: number;
            totalLTCG: number;
            taxableLTCG: number;
        };
        records: {
            transactionId: string;
            assetName: string;
            date: Date;
            quantitySold: import("@prisma/client/runtime/library").Decimal;
            saleValue: import("@prisma/client/runtime/library").Decimal;
            gain: number;
            type: string;
        }[];
    }>;
    getTaxLots(holdingId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        assetId: string;
        quantity: import("@prisma/client/runtime/library").Decimal;
        acquisitionDate: Date;
        remainingQuantity: import("@prisma/client/runtime/library").Decimal;
        costBasis: import("@prisma/client/runtime/library").Decimal;
        totalCost: import("@prisma/client/runtime/library").Decimal;
        isGrandfathered: boolean;
        grandfatheredFMV: import("@prisma/client/runtime/library").Decimal | null;
        ciiYearAcquisition: string | null;
        indexedCost: import("@prisma/client/runtime/library").Decimal | null;
        sellDate: Date | null;
        sellPrice: import("@prisma/client/runtime/library").Decimal | null;
        realizedGain: import("@prisma/client/runtime/library").Decimal | null;
        taxType: import(".prisma/client").$Enums.TaxType | null;
        isClosed: boolean;
        holdingId: string;
    }[]>;
}
