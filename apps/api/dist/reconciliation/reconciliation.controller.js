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
exports.ReconciliationController = void 0;
const common_1 = require("@nestjs/common");
const reconciliation_service_1 = require("./reconciliation.service");
let ReconciliationController = class ReconciliationController {
    constructor(reconciliationService) {
        this.reconciliationService = reconciliationService;
    }
    getConflicts(req, portfolioId) {
        const userId = req.user.userId;
        return this.reconciliationService.getConflicts(userId, portfolioId);
    }
    resolveConflict(id, req, body) {
        const userId = req.user.userId;
        return this.reconciliationService.resolveConflict(id, userId, body.resolvedValue, body.notes);
    }
    dismissConflict(id, req) {
        const userId = req.user.userId;
        return this.reconciliationService.dismissConflict(id, userId);
    }
};
exports.ReconciliationController = ReconciliationController;
__decorate([
    (0, common_1.Get)('conflicts'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('portfolioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ReconciliationController.prototype, "getConflicts", null);
__decorate([
    (0, common_1.Post)('conflicts/:id/resolve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ReconciliationController.prototype, "resolveConflict", null);
__decorate([
    (0, common_1.Post)('conflicts/:id/dismiss'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ReconciliationController.prototype, "dismissConflict", null);
exports.ReconciliationController = ReconciliationController = __decorate([
    (0, common_1.Controller)('reconciliation'),
    __metadata("design:paramtypes", [reconciliation_service_1.ReconciliationService])
], ReconciliationController);
//# sourceMappingURL=reconciliation.controller.js.map