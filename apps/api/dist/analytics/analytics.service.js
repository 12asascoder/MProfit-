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
var AnalyticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnalyticsService = AnalyticsService_1 = class AnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(AnalyticsService_1.name);
    }
    async getAssetAllocation(userId, portfolioId) {
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
        const allocation = holdings.reduce((acc, h) => {
            const category = h.asset.category;
            if (!acc[category])
                acc[category] = 0;
            acc[category] += Number(h.currentValue);
            return acc;
        }, {});
        const totalValue = Object.values(allocation).reduce((a, b) => a + b, 0);
        return Object.entries(allocation).map(([category, value]) => ({
            category,
            value,
            percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
        }));
    }
    async getPerformanceMetrics(userId, portfolioId) {
        return {
            cagr: 12.5,
            xirr: 15.2,
            absoluteReturn: 24.5,
            alpha: 2.1,
            beta: 0.85,
            sharpeRatio: 1.4,
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = AnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map