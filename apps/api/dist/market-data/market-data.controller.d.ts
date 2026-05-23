import { MarketDataService } from './market-data.service';
export declare class MarketDataController {
    private readonly marketDataService;
    constructor(marketDataService: MarketDataService);
    getLatestPrice(assetId: string): Promise<{
        date: Date;
        close: import("@prisma/client/runtime/library").Decimal;
    } | null>;
    getHistoricalPrices(assetId: string, days?: number): Promise<{
        date: string;
        price: number;
    }[]>;
}
