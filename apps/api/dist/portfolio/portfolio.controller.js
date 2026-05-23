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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioController = void 0;
const common_1 = require("@nestjs/common");
const portfolio_service_1 = require("./portfolio.service");
const create_portfolio_dto_1 = require("./dto/create-portfolio.dto");
let PortfolioController = class PortfolioController {
    constructor(portfolioService) {
        this.portfolioService = portfolioService;
    }
    create(req, createPortfolioDto) {
        const userId = req.user?.id || 'mock-user-id';
        const tenantId = req.user?.tenantId || 'mock-tenant-id';
        return this.portfolioService.create(userId, tenantId, createPortfolioDto);
    }
    findAll(req) {
        const userId = req.user?.id || 'mock-user-id';
        const tenantId = req.user?.tenantId || 'mock-tenant-id';
        return this.portfolioService.findAll(userId, tenantId);
    }
    findOne(id, req) {
        const userId = req.user?.id || 'mock-user-id';
        const tenantId = req.user?.tenantId || 'mock-tenant-id';
        return this.portfolioService.findOne(id, userId, tenantId);
    }
    getSummary(id, req) {
        const userId = req.user?.id || 'mock-user-id';
        const tenantId = req.user?.tenantId || 'mock-tenant-id';
        return this.portfolioService.getSummary(id, userId, tenantId);
    }
};
exports.PortfolioController = PortfolioController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_portfolio_dto_1.CreatePortfolioDto]),
    __metadata("design:returntype", void 0)
], PortfolioController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PortfolioController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PortfolioController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/summary'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PortfolioController.prototype, "getSummary", null);
exports.PortfolioController = PortfolioController = __decorate([
    (0, common_1.Controller)('portfolios'),
    __metadata("design:paramtypes", [portfolio_service_1.PortfolioService])
], PortfolioController);
//# sourceMappingURL=portfolio.controller.js.map