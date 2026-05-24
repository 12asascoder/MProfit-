import { TaxService } from './tax.service';
export declare class TaxController {
    private readonly taxService;
    constructor(taxService: TaxService);
    getCapitalGains(req: any, startDate: string, endDate: string, portfolioId?: string): Promise<{
        financialYear: string;
        summary: {
            totalSTCG: number;
            totalLTCG: number;
            taxableLTCG: number;
        };
        records: ({
            transactionId: string;
            assetName: string;
            date: Date;
            quantitySold: import("@prisma/client/runtime/library").Decimal;
            saleValue: number;
            gain: number;
            type: string;
            method: string;
            costBasis?: undefined;
        } | {
            transactionId: string;
            assetName: string;
            date: Date;
            quantitySold: import("@prisma/client/runtime/library").Decimal;
            saleValue: number;
            costBasis: number;
            gain: number;
            type: string;
            method: string;
        })[];
    }>;
    getTaxLots(holdingId: string): Promise<{
        id: string;
        assetId: string;
        quantity: import("@prisma/client/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
        holdingId: string;
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
    }[]>;
}
