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
exports.PortfolioService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PortfolioService = class PortfolioService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, tenantId, dto) {
        if (dto.isDefault) {
            await this.prisma.portfolio.updateMany({
                where: { userId, tenantId, isDefault: true },
                data: { isDefault: false },
            });
        }
        return this.prisma.portfolio.create({
            data: {
                ...dto,
                userId,
                tenantId,
                isDefault: dto.isDefault ?? false,
            },
        });
    }
    async findAll(userId, tenantId) {
        return this.prisma.portfolio.findMany({
            where: { userId, tenantId, isActive: true },
            include: {
                children: true,
                members: true,
            },
            orderBy: [
                { isDefault: 'desc' },
                { createdAt: 'desc' }
            ],
        });
    }
    async findOne(id, userId, tenantId) {
        const portfolio = await this.prisma.portfolio.findUnique({
            where: { id },
            include: {
                holdings: {
                    include: {
                        asset: true,
                    }
                },
            }
        });
        if (!portfolio || !portfolio.isActive) {
            throw new common_1.NotFoundException('Portfolio not found');
        }
        if (portfolio.userId !== userId || portfolio.tenantId !== tenantId) {
            const member = await this.prisma.portfolioMember.findUnique({
                where: {
                    portfolioId_userId: {
                        portfolioId: id,
                        userId,
                    }
                }
            });
            if (!member) {
                throw new common_1.ForbiddenException('Access denied to this portfolio');
            }
        }
        return portfolio;
    }
    async getSummary(id, userId, tenantId) {
        const portfolio = await this.findOne(id, userId, tenantId);
        const holdings = portfolio.holdings || [];
        const investedAmount = holdings.reduce((sum, h) => sum + Number(h.investedValue), 0);
        const currentValue = holdings.reduce((sum, h) => sum + Number(h.currentValue), 0);
        const todaysGain = holdings.reduce((sum, h) => sum + Number(h.dayChange) * Number(h.quantity), 0);
        const unrealizedGain = currentValue - investedAmount;
        return {
            netWorth: currentValue,
            investedAmount,
            currentValue,
            todaysGain,
            unrealizedGain,
            absoluteReturnPercent: investedAmount > 0 ? (unrealizedGain / investedAmount) * 100 : 0,
            lastSyncAt: new Date(),
        };
    }
};
exports.PortfolioService = PortfolioService;
exports.PortfolioService = PortfolioService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PortfolioService);
//# sourceMappingURL=portfolio.service.js.map