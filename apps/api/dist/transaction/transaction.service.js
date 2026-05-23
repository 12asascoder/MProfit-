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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let TransactionService = class TransactionService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, tenantId, dto) {
        const portfolio = await this.prisma.portfolio.findFirst({
            where: {
                id: dto.portfolioId,
                userId,
                tenantId,
            }
        });
        if (!portfolio) {
            throw new common_1.NotFoundException('Portfolio not found or access denied');
        }
        const asset = await this.prisma.asset.findUnique({
            where: { id: dto.assetId }
        });
        if (!asset) {
            throw new common_1.NotFoundException('Asset not found');
        }
        return this.prisma.$transaction(async (tx) => {
            const transaction = await tx.transaction.create({
                data: {
                    ...dto,
                }
            });
            let holding = await tx.holding.findUnique({
                where: {
                    portfolioId_assetId_folioNumber: {
                        portfolioId: dto.portfolioId,
                        assetId: dto.assetId,
                        folioNumber: dto.folioNumber || '',
                    }
                }
            });
            if (dto.type === client_1.TransactionType.BUY || dto.type === client_1.TransactionType.SIP) {
                if (!holding) {
                    holding = await tx.holding.create({
                        data: {
                            portfolioId: dto.portfolioId,
                            assetId: dto.assetId,
                            folioNumber: dto.folioNumber || '',
                            quantity: dto.quantity,
                            averageCost: dto.price,
                            investedValue: dto.amount,
                            currentPrice: dto.price,
                            currentValue: dto.amount,
                        }
                    });
                }
                else {
                    const currentQty = Number(holding.quantity);
                    const currentAvgCost = Number(holding.averageCost);
                    const newTotalQty = currentQty + dto.quantity;
                    const newTotalInvested = (currentQty * currentAvgCost) + dto.amount;
                    const newAvgCost = newTotalInvested / newTotalQty;
                    holding = await tx.holding.update({
                        where: { id: holding.id },
                        data: {
                            quantity: newTotalQty,
                            averageCost: newAvgCost,
                            investedValue: newTotalInvested,
                            currentValue: Number(holding.currentPrice) * newTotalQty,
                        }
                    });
                }
                await tx.taxLot.create({
                    data: {
                        holdingId: holding.id,
                        assetId: dto.assetId,
                        acquisitionDate: new Date(dto.date),
                        quantity: dto.quantity,
                        remainingQuantity: dto.quantity,
                        costBasis: dto.price,
                        totalCost: dto.amount,
                    }
                });
            }
            else if (dto.type === client_1.TransactionType.SELL) {
                if (!holding || Number(holding.quantity) < dto.quantity) {
                    throw new common_1.BadRequestException('Insufficient quantity to sell');
                }
                const newTotalQty = Number(holding.quantity) - dto.quantity;
                const newTotalInvested = Number(holding.investedValue) - (Number(holding.averageCost) * dto.quantity);
                holding = await tx.holding.update({
                    where: { id: holding.id },
                    data: {
                        quantity: newTotalQty,
                        investedValue: newTotalInvested > 0 ? newTotalInvested : 0,
                        currentValue: Number(holding.currentPrice) * newTotalQty,
                    }
                });
            }
            return transaction;
        });
    }
    async findAllByPortfolio(portfolioId, userId, tenantId) {
        const portfolio = await this.prisma.portfolio.findFirst({
            where: { id: portfolioId, userId, tenantId }
        });
        if (!portfolio) {
            throw new common_1.NotFoundException('Portfolio not found or access denied');
        }
        return this.prisma.transaction.findMany({
            where: { portfolioId },
            include: {
                asset: true,
            },
            orderBy: {
                date: 'desc'
            }
        });
    }
};
exports.TransactionService = TransactionService;
exports.TransactionService = TransactionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionService);
//# sourceMappingURL=transaction.service.js.map