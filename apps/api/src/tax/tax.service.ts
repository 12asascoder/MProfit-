import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TaxService {
  private readonly logger = new Logger(TaxService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Calculates realized capital gains for a given financial year
   */
  async getCapitalGains(userId: string, financialYearStart: string, financialYearEnd: string, portfolioId?: string) {
    // 1. Fetch all sell transactions in this financial year
    const sellTransactions = await this.prisma.transaction.findMany({
      where: {
        portfolio: {
          userId,
          ...(portfolioId && { id: portfolioId }),
        },
        type: 'SELL',
        date: {
          gte: new Date(financialYearStart),
          lte: new Date(financialYearEnd),
        },
      },
      include: {
        asset: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    let totalSTCG = 0;
    let totalLTCG = 0;

    // A real app would have a complex tax lot matching engine here
    // For this prototype, we mock the calculation based on arbitrary thresholds
    const records = sellTransactions.map(tx => {
      // Mock logic: randomly assign STCG or LTCG for demo purposes based on asset category
      const isLTCG = tx.asset.category === 'EQUITY' ? Math.random() > 0.5 : Math.random() > 0.3;
      const gain = (Number(tx.amount) - (Number(tx.price) * 0.8 * Number(tx.quantity))); // Mock 20% gain

      if (isLTCG) {
        totalLTCG += gain;
      } else {
        totalSTCG += gain;
      }

      return {
        transactionId: tx.id,
        assetName: tx.asset.name,
        date: tx.date,
        quantitySold: tx.quantity,
        saleValue: tx.amount,
        gain,
        type: isLTCG ? 'LTCG' : 'STCG',
      };
    });

    return {
      financialYear: `${financialYearStart} to ${financialYearEnd}`,
      summary: {
        totalSTCG,
        totalLTCG,
        taxableLTCG: Math.max(0, totalLTCG - 100000), // 1L exemption for equity (mock)
      },
      records,
    };
  }

  async getTaxLots(holdingId: string) {
    return this.prisma.taxLot.findMany({
      where: {
        holdingId,
        remainingQuantity: { gt: 0 },
      },
      orderBy: {
        acquisitionDate: 'asc', // FIFO order
      },
    });
  }
}
