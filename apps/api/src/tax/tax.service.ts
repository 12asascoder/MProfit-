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

    const records = [];

    // Process each sell transaction using FIFO tax lot consumption
    for (const tx of sellTransactions) {
      // Get remaining tax lots for this holding in FIFO order
      const taxLots = await this.prisma.taxLot.findMany({
        where: {
          holdingId: tx.portfolioId + '_' + tx.assetId, // Simplistic proxy for holding id
          remainingQuantity: { gt: 0 },
        },
        orderBy: { acquisitionDate: 'asc' },
      });

      // If no valid holding/lots, fallback to simplistic calculation
      if (!taxLots || taxLots.length === 0) {
        // Fallback mock logic for demo
        const isLTCG = tx.asset.category === 'EQUITY';
        const gain = (Number(tx.amount) - (Number(tx.price) * 0.8 * Number(tx.quantity)));
        if (isLTCG) totalLTCG += gain; else totalSTCG += gain;
        
        records.push({
          transactionId: tx.id,
          assetName: tx.asset.name,
          date: tx.date,
          quantitySold: tx.quantity,
          saleValue: Number(tx.amount),
          gain,
          type: isLTCG ? 'LTCG' : 'STCG',
          method: 'FALLBACK_NO_LOTS'
        });
        continue;
      }

      let remainingToSell = Number(tx.quantity);
      let saleValueAccumulator = 0;
      let costBasisAccumulator = 0;
      let lotLTCG = 0;
      let lotSTCG = 0;

      for (const lot of taxLots) {
        if (remainingToSell <= 0) break;

        const qtyFromLot = Math.min(Number(lot.remainingQuantity), remainingToSell);
        const ratio = qtyFromLot / Number(tx.quantity);
        
        const lotSaleValue = Number(tx.amount) * ratio;
        const lotCostBasis = Number(lot.costBasis) * qtyFromLot;
        const lotGain = lotSaleValue - lotCostBasis;

        // Determine STCG vs LTCG based on 1-year holding period
        const holdingPeriodMs = new Date(tx.date).getTime() - new Date(lot.acquisitionDate).getTime();
        const oneYearMs = 365 * 24 * 60 * 60 * 1000;
        const isLTCG = holdingPeriodMs > oneYearMs;

        if (isLTCG) {
          lotLTCG += lotGain;
          totalLTCG += lotGain;
        } else {
          lotSTCG += lotGain;
          totalSTCG += lotGain;
        }

        saleValueAccumulator += lotSaleValue;
        costBasisAccumulator += lotCostBasis;
        remainingToSell -= qtyFromLot;

        // Note: In a real system, we'd also update the taxLot.remainingQuantity in the DB here!
        // But for this idempotent report, we just calculate.
      }

      records.push({
        transactionId: tx.id,
        assetName: tx.asset.name,
        date: tx.date,
        quantitySold: tx.quantity,
        saleValue: saleValueAccumulator,
        costBasis: costBasisAccumulator,
        gain: lotLTCG + lotSTCG,
        type: lotLTCG > lotSTCG ? 'LTCG' : 'STCG', // Simplified categorization
        method: 'FIFO_LOT_MATCHING'
      });
    }

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
