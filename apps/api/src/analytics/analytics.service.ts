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

  // ─── FR-11.3: Newton-Raphson XIRR ───────────────────────────────
  
  private xirr(cashflows: { amount: number; date: Date }[], guess = 0.1): number {
    if (cashflows.length < 2) return 0;
    
    // Sort chronologically
    const cfs = [...cashflows].sort((a, b) => a.date.getTime() - b.date.getTime());
    const d0 = cfs[0].date.getTime();

    // Helper: calculate NPV (Net Present Value)
    const npv = (rate: number) => {
      return cfs.reduce((sum, cf) => {
        const days = (cf.date.getTime() - d0) / (1000 * 60 * 60 * 24);
        return sum + cf.amount / Math.pow(1 + rate, days / 365.0);
      }, 0);
    };

    // Helper: calculate derivative of NPV
    const dnpv = (rate: number) => {
      return cfs.reduce((sum, cf) => {
        const days = (cf.date.getTime() - d0) / (1000 * 60 * 60 * 24);
        return sum - (days / 365.0) * cf.amount / Math.pow(1 + rate, (days / 365.0) + 1);
      }, 0);
    };

    // Newton-Raphson iterations
    let rate = guess;
    const maxIters = 100;
    const epsilon = 1e-6;

    for (let i = 0; i < maxIters; i++) {
      const p = npv(rate);
      if (Math.abs(p) < epsilon) return rate * 100; // Return as percentage
      const dp = dnpv(rate);
      if (dp === 0) break; // Avoid division by zero
      rate = rate - p / dp;
    }

    return rate * 100; // Might fail to converge, return best guess
  }

  async getPerformanceMetrics(userId: string, portfolioId?: string) {
    // 1. Fetch transactions (Cash flows)
    const transactions = await this.prisma.transaction.findMany({
      where: {
        portfolio: {
          userId,
          ...(portfolioId && { id: portfolioId }),
        }
      }
    });

    // 2. Fetch current holdings to act as terminal value
    const holdings = await this.prisma.holding.findMany({
      where: {
        portfolio: {
          userId,
          ...(portfolioId && { id: portfolioId }),
        }
      }
    });

    let xirr = 0;
    let absoluteReturn = 0;
    
    if (transactions.length > 0 && holdings.length > 0) {
      // Build cash flow array
      // Buys are negative cash flows, Sells/Dividends are positive
      const cashflows = transactions.map(t => ({
        date: t.date,
        amount: (t.type === 'BUY' || t.type === 'SIP') ? -Number(t.amount) : Number(t.amount)
      }));

      // Terminal value (Current Value of portfolio) is a positive cash flow as of today
      const totalCurrentValue = holdings.reduce((sum, h) => sum + Number(h.currentValue), 0);
      cashflows.push({
        date: new Date(),
        amount: totalCurrentValue
      });

      try {
        xirr = this.xirr(cashflows);
        // Cap absurdly high/low XIRRs due to bad data
        if (xirr > 10000 || xirr < -100) xirr = 0; 
      } catch (e) {
        xirr = 0;
      }

      // Calculate absolute return
      const totalInvested = holdings.reduce((sum, h) => sum + Number(h.investedValue), 0);
      if (totalInvested > 0) {
        absoluteReturn = ((totalCurrentValue - totalInvested) / totalInvested) * 100;
      }
    }

    return {
      cagr: absoluteReturn / 3, // Mock CAGR estimation
      xirr: Number(xirr.toFixed(2)),
      absoluteReturn: Number(absoluteReturn.toFixed(2)),
      alpha: 2.1, // Mocked outperformance vs benchmark
      beta: 0.85, // Mocked volatility vs market
      sharpeRatio: 1.4,
    };
  }
}
