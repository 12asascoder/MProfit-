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
var MarketDataService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketDataService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MarketDataService = MarketDataService_1 = class MarketDataService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(MarketDataService_1.name);
    }
    async getLatestPrice(assetId) {
        const marketPrice = await this.prisma.marketPrice.findFirst({
            where: { assetId },
            orderBy: { date: 'desc' },
            select: { close: true, date: true }
        });
        return marketPrice;
    }
    async getHistoricalPrices(assetId, days = 30) {
        const prices = [];
        const basePrice = 1000;
        const now = new Date();
        for (let i = days; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            prices.push({
                date: date.toISOString().split('T')[0],
                price: basePrice + (Math.random() * 50 - 25),
            });
        }
        return prices;
    }
    async syncEndOfDayPrices() {
        this.logger.log('Starting end of day market data sync (simulated)');
    }
};
exports.MarketDataService = MarketDataService;
exports.MarketDataService = MarketDataService = MarketDataService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MarketDataService);
//# sourceMappingURL=market-data.service.js.map