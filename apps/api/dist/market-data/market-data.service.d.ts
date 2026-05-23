import { PrismaService } from '../prisma/prisma.service';
export declare class MarketDataService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getLatestPrice(assetId: string): Promise<{
        date: Date;
        close: import("@prisma/client/runtime/library").Decimal;
    } | null>;
    getHistoricalPrices(assetId: string, days?: number): Promise<{
        date: string;
        price: number;
    }[]>;
    syncEndOfDayPrices(): Promise<void>;
}
