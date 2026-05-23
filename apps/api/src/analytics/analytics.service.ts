import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private prisma: PrismaService) {}

  async getAssetAllocation(userId: string, portfolioId?: string) {
    const holdings = await this.prisma.holding.findMany({
      where: {
        portfolio: {
          userId,
          ...(portfolioId && { id: portfolioId }),
        },
        quantity: { gt: 0 },
      },
      include: {
        asset: true,
      }
    });

    // Group by category
    const allocation = holdings.reduce((acc, h) => {
      const category = h.asset.category;
      if (!acc[category]) acc[category] = 0;
      acc[category] += Number(h.currentValue);
      return acc;
    }, {} as Record<string, number>);

    // Calculate percentages
    const totalValue = Object.values(allocation).reduce((a, b) => a + b, 0);
    
    return Object.entries(allocation).map(([category, value]) => ({
      category,
      value,
      percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
    }));
  }

  async getPerformanceMetrics(userId: string, portfolioId?: string) {
    // In a real application, this would calculate true XIRR based on all cash flows
    // We mock this logic for prototype
    
    return {
      cagr: 12.5, // Mocked 12.5% CAGR
      xirr: 15.2, // Mocked 15.2% XIRR
      absoluteReturn: 24.5, // Mocked 24.5% absolute
      alpha: 2.1, // Mocked outperformance vs benchmark
      beta: 0.85, // Mocked volatility vs market
      sharpeRatio: 1.4,
    };
  }
}
