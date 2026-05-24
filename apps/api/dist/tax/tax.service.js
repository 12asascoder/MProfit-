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
let TaxService = TaxService_1 = class TaxService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(TaxService_1.name);
    }
    async getCapitalGains(userId, financialYearStart, financialYearEnd, portfolioId) {
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
                const lotCostBasis = Number(lot.costBasis) * qtyFromLot;
                const lotGain = lotSaleValue - lotCostBasis;
                const holdingPeriodMs = new Date(tx.date).getTime() - new Date(lot.acquisitionDate).getTime();
                const oneYearMs = 365 * 24 * 60 * 60 * 1000;
                const isLTCG = holdingPeriodMs > oneYearMs;
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
                taxableLTCG: Math.max(0, totalLTCG - 100000),
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