"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TaxService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const TAX_RULES = {
    '2024-25': {
        equityLTCGThreshold: 100000,
        equityLTCGRate: 0.10,
        equitySTCGRate: 0.15,
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
let TaxService = TaxService_1 = class TaxService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(TaxService_1.name);
    }
    async getCapitalGains(userId, financialYearStart, financialYearEnd, portfolioId) {
        const rules = TAX_RULES['2024-25'];
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
        const ciiRecords = await this.prisma.cIITable.findMany();
        const ciiMap = new Map(ciiRecords.map(c => [c.fiscalYear, c.indexValue]));
        let totalSTCG = 0;
        let totalLTCG = 0;
        const records = [];
        for (const tx of sellTransactions) {
            const taxLots = await this.prisma.taxLot.findMany({
                where: {
                    holdingId: tx.portfolioId + '_' + tx.assetId,
                    remainingQuantity: { gt: 0 },
                },
                orderBy: { acquisitionDate: 'asc' },
            });
            if (!taxLots || taxLots.length === 0) {
                const isLTCG = tx.asset.category === 'EQUITY';
                const gain = (Number(tx.amount) - (Number(tx.price) * 0.8 * Number(tx.quantity)));
                if (isLTCG)
                    totalLTCG += gain;
                else
                    totalSTCG += gain;
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
                if (remainingToSell <= 0)
                    break;
                const qtyFromLot = Math.min(Number(lot.remainingQuantity), remainingToSell);
                const ratio = qtyFromLot / Number(tx.quantity);
                const lotSaleValue = Number(tx.amount) * ratio;
                const holdingPeriodMs = new Date(tx.date).getTime() - new Date(lot.acquisitionDate).getTime();
                const isEquity = tx.asset.category === 'EQUITY';
                const isDebt = tx.asset.category === 'DEBT';
                const oneYearMs = 365 * 24 * 60 * 60 * 1000;
                const threeYearsMs = 3 * 365 * 24 * 60 * 60 * 1000;
                const isLTCG = isEquity ? holdingPeriodMs > oneYearMs : holdingPeriodMs > threeYearsMs;
                let effectiveUnitCost = Number(lot.costBasis);
                if (isEquity && new Date(lot.acquisitionDate) < rules.grandfatheringDate) {
                    const fmv = lot.grandfatheredFMV ? Number(lot.grandfatheredFMV) : effectiveUnitCost;
                    const lowerOfFmvAndSale = Math.min(fmv, Number(tx.price));
                    effectiveUnitCost = Math.max(effectiveUnitCost, lowerOfFmvAndSale);
                }
                if (isDebt && isLTCG && lot.ciiYearAcquisition) {
                    const ciiAcquisition = ciiMap.get(lot.ciiYearAcquisition) || 100;
                    const ciiSale = ciiMap.get('2023-24') || 348;
                    effectiveUnitCost = effectiveUnitCost * (ciiSale / ciiAcquisition);
                }
                const lotCostBasis = effectiveUnitCost * qtyFromLot;
                const lotGain = lotSaleValue - lotCostBasis;
                if (isLTCG) {
                    lotLTCG += lotGain;
                    totalLTCG += lotGain;
                }
                else {
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
    async getTaxLots(holdingId) {
        return this.prisma.taxLot.findMany({
            where: {
                holdingId,
                remainingQuantity: { gt: 0 },
            },
            orderBy: {
                acquisitionDate: 'asc',
            },
        });
    }
};
exports.TaxService = TaxService;
exports.TaxService = TaxService = TaxService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TaxService);
//# sourceMappingURL=tax.service.js.map