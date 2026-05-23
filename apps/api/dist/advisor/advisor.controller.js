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
exports.AdvisorController = void 0;
const common_1 = require("@nestjs/common");
const advisor_service_1 = require("./advisor.service");
let AdvisorController = class AdvisorController {
    constructor(advisorService) {
        this.advisorService = advisorService;
    }
    inviteClient(req, body) {
        const advisorId = req.user?.id || 'mock-advisor-id';
        const tenantId = req.user?.tenantId || 'mock-tenant-id';
        return this.advisorService.inviteClient(advisorId, tenantId, body.email, body.name);
    }
    getClients(req) {
        const advisorId = req.user?.id || 'mock-advisor-id';
        const tenantId = req.user?.tenantId || 'mock-tenant-id';
        return this.advisorService.getClients(advisorId, tenantId);
    }
    getClientSummary(clientId, req) {
        const advisorId = req.user?.id || 'mock-advisor-id';
        return this.advisorService.getClientPortfolioSummary(advisorId, clientId);
    }
};
exports.AdvisorController = AdvisorController;
__decorate([
    (0, common_1.Post)('invite'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdvisorController.prototype, "inviteClient", null);
__decorate([
    (0, common_1.Get)('clients'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdvisorController.prototype, "getClients", null);
__decorate([
    (0, common_1.Get)('clients/:clientId/summary'),
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdvisorController.prototype, "getClientSummary", null);
exports.AdvisorController = AdvisorController = __decorate([
    (0, common_1.Controller)('advisor'),
    __metadata("design:paramtypes", [advisor_service_1.AdvisorService])
], AdvisorController);
//# sourceMappingURL=advisor.controller.js.map