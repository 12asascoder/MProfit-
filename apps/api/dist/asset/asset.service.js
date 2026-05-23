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
exports.AssetService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AssetService = class AssetService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        return this.prisma.asset.findMany({
            where: {
                isActive: true,
                ...(query.category && { category: query.category }),
                ...(query.search && {
                    OR: [
                        { name: { contains: query.search, mode: 'insensitive' } },
                        { symbol: { contains: query.search, mode: 'insensitive' } },
                        { isin: { contains: query.search, mode: 'insensitive' } },
                    ],
                }),
            },
            take: 50,
        });
    }
    async findOne(id) {
        const asset = await this.prisma.asset.findUnique({
            where: { id },
        });
        if (!asset) {
            throw new common_1.NotFoundException(`Asset with ID ${id} not found`);
        }
        return asset;
    }
    async findByIsin(isin) {
        const asset = await this.prisma.asset.findUnique({
            where: { isin },
        });
        if (!asset) {
            throw new common_1.NotFoundException(`Asset with ISIN ${isin} not found`);
        }
        return asset;
    }
};
exports.AssetService = AssetService;
exports.AssetService = AssetService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AssetService);
//# sourceMappingURL=asset.service.js.map