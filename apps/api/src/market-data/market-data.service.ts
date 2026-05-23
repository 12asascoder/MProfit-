import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class MarketDataService {
  private readonly logger = new Logger(MarketDataService.name);

  constructor(private prisma: PrismaService) {}

  async getLatestPrice(assetId: string) {
    const marketPrice = await this.prisma.marketPrice.findFirst({
      where: { assetId },
      orderBy: { date: 'desc' },
      select: { close: true, date: true }
    });
    return marketPrice;
  }

  async getHistoricalPrices(assetId: string, days: number = 30) {
    // Simulated historical data
    // In production, fetch from TimescaleDB hypertable
    const prices = [];
    const basePrice = 1000;
    const now = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      prices.push({
        date: date.toISOString().split('T')[0],
        price: basePrice + (Math.random() * 50 - 25), // +/- 2.5% random walk
      });
    }

    return prices;
  }

  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncEndOfDayPrices() {
    this.logger.log('Starting end of day market data sync (simulated)');
    // This would connect to NSE/BSE/Yahoo Finance APIs to pull EOD prices
  }
}
