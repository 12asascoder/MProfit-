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
exports.ImportController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const import_service_1 = require("./import.service");
let ImportController = class ImportController {
    constructor(importService) {
        this.importService = importService;
    }
    async importCAS(req, file, password) {
        if (!file) {
            throw new common_1.BadRequestException('CAS PDF file is required');
        }
        const userId = req.user?.id || 'mock-user-id';
        const tenantId = req.user?.tenantId || 'mock-tenant-id';
        return this.importService.startCASImport(userId, tenantId, file.buffer, password);
    }
    async syncPanLinkedAccounts(req, pan) {
        if (!pan) {
            throw new common_1.BadRequestException('PAN is required for aggregation sync');
        }
        const userId = req.user.userId;
        const tenantId = req.user.tenantId;
        return this.importService.syncPanLinkedAccounts(userId, tenantId, pan);
    }
    async syncBroker(req, body) {
        const userId = req.user.userId;
        const tenantId = req.user.tenantId;
        return this.importService.startBrokerSync(userId, tenantId, body.brokerType, body.credentials);
    }
    getJobStatus(id, req) {
        const userId = req.user.userId;
        return this.importService.getJobStatus(id, userId);
    }
};
exports.ImportController = ImportController;
__decorate([
    (0, common_1.Post)('cas'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ImportController.prototype, "importCAS", null);
__decorate([
    (0, common_1.Post)('pan/sync'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('pan')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ImportController.prototype, "syncPanLinkedAccounts", null);
__decorate([
    (0, common_1.Post)('broker/sync'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ImportController.prototype, "syncBroker", null);
__decorate([
    (0, common_1.Get)('job/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ImportController.prototype, "getJobStatus", null);
exports.ImportController = ImportController = __decorate([
    (0, common_1.Controller)('import'),
    __metadata("design:paramtypes", [import_service_1.ImportService])
], ImportController);
//# sourceMappingURL=import.controller.js.map