import { Controller, Get, Param, Query } from '@nestjs/common';
import { MarketDataService } from './market-data.service';

@Controller('market-data')
export class MarketDataController {
  constructor(private readonly marketDataService: MarketDataService) {}

  @Get(':assetId/price')
  getLatestPrice(@Param('assetId') assetId: string) {
    return this.marketDataService.getLatestPrice(assetId);
  }

  @Get(':assetId/historical')
  getHistoricalPrices(
    @Param('assetId') assetId: string,
    @Query('days') days?: number,
  ) {
    return this.marketDataService.getHistoricalPrices(assetId, days ? Number(days) : 30);
  }
}
