import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// ─── VERSIONED TAX RULES ENGINE (FR-13.5) ───
const TAX_RULES = {
  '2024-25': {
    equityLTCGThreshold: 100000,
    equityLTCGRate: 0.10, // 10% on gains > 1L
    equitySTCGRate: 0.15, // 15%
    debtLTCGRateWithIndexation: 0.20,
    grandfatheringDate: new Date('2018-01-31T23:59:59Z'),
  },
  '2023-24': {
    equityLTCGThreshold: 100000,
    equityLTCGRate: 0.10,
    equitySTCGRate: 0.15,
    debtLTCGRateWithIndexation: 0.20,
    grandfatheringDate: new Date('2018-01-31T23:59:59Z'),
  }
};

@Injectable()
export class TaxService {
  private readonly logger = new Logger(TaxService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Calculates realized capital gains for a given financial year
   */
  async getCapitalGains(userId: string, financialYearStart: string, financialYearEnd: string, portfolioId?: string) {
    const rules = TAX_RULES['2024-25']; // Default to current FY for rules engine

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

    // Fetch CII Table for indexation (FR-13.2)
    const ciiRecords = await this.prisma.cIITable.findMany();
    const ciiMap = new Map(ciiRecords.map(c => [c.fiscalYear, c.indexValue]));

    let totalSTCG = 0;
    let totalLTCG = 0;

    const records = [];

    // Process each sell transaction using FIFO tax lot consumption
    for (const tx of sellTransactions) {
      const taxLots = await this.prisma.taxLot.findMany({
        where: {
          holdingId: tx.portfolioId + '_' + tx.assetId,
          remainingQuantity: { gt: 0 },
        },
        orderBy: { acquisitionDate: 'asc' },
      });

      if (!taxLots || taxLots.length === 0) {
        // Fallback for missing tax lots
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
        
        // Determine STCG vs LTCG based on holding period
        const holdingPeriodMs = new Date(tx.date).getTime() - new Date(lot.acquisitionDate).getTime();
        const isEquity = tx.asset.category === 'EQUITY' || tx.asset.category === 'MUTUAL_FUND';
        const isDebt = tx.asset.category === 'DEBT';
        
        const oneYearMs = 365 * 24 * 60 * 60 * 1000;
        const threeYearsMs = 3 * 365 * 24 * 60 * 60 * 1000;
        const isLTCG = isEquity ? holdingPeriodMs > oneYearMs : holdingPeriodMs > threeYearsMs;

        let effectiveUnitCost = Number(lot.costBasis);

        // ─── GRANDFATHERING LOGIC (FR-13.3) ───
        if (isEquity && new Date(lot.acquisitionDate) < rules.grandfatheringDate) {
          const fmv = lot.grandfatheredFMV ? Number(lot.grandfatheredFMV) : effectiveUnitCost;
          const lowerOfFmvAndSale = Math.min(fmv, Number(tx.price));
          effectiveUnitCost = Math.max(effectiveUnitCost, lowerOfFmvAndSale);
        }

        // ─── INDEXATION LOGIC (FR-13.2) ───
        if (isDebt && isLTCG && lot.ciiYearAcquisition) {
           const ciiAcquisition = ciiMap.get(lot.ciiYearAcquisition) || 100;
           // Hardcoded current year CII for demonstration purposes (e.g., 348 for FY2023-24)
           const ciiSale = ciiMap.get('2023-24') || 348;
           effectiveUnitCost = effectiveUnitCost * (ciiSale / ciiAcquisition);
        }

        const lotCostBasis = effectiveUnitCost * qtyFromLot;
        const lotGain = lotSaleValue - lotCostBasis;

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
      }

      records.push({
        transactionId: tx.id,
        assetName: tx.asset.name,
        date: tx.date,
        quantitySold: tx.quantity,
        saleValue: saleValueAccumulator,
        costBasis: costBasisAccumulator,
        gain: lotLTCG + lotSTCG,
        type: lotLTCG > lotSTCG ? 'LTCG' : 'STCG',
        method: 'FIFO_LOT_MATCHING'
      });
    }

    return {
      financialYear: `${financialYearStart} to ${financialYearEnd}`,
      summary: {
        totalSTCG,
        totalLTCG,
        taxableLTCG: Math.max(0, totalLTCG - rules.equityLTCGThreshold), 
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
