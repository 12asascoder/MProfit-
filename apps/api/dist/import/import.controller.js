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
    async importDocument(req, file, password) {
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        const userId = req.user?.id || 'mock-user-id';
        const tenantId = req.user?.tenantId || 'mock-tenant-id';
        return this.importService.processDocumentUpload(userId, tenantId, file, password);
    }
    getConnectors() {
        return this.importService.getConnectorRegistry();
    }
    async startPanAggregation(req, body) {
        if (!body.pan || body.pan.length !== 10) {
            throw new common_1.BadRequestException('Valid 10-character PAN is required');
        }
        if (!body.portfolioId) {
            throw new common_1.BadRequestException('portfolioId is required');
        }
        const userId = req.user?.id || 'mock-user-id';
        const tenantId = req.user?.tenantId || 'mock-tenant-id';
        return this.importService.startPanAggregation(userId, tenantId, body.pan, body.portfolioId, body.importPeriod || 'all_time');
    }
    async getAggregationStatus(jobId, req) {
        const userId = req.user?.id || 'mock-user-id';
        return this.importService.getAggregationStatus(jobId, userId);
    }
    async syncPanLinkedAccounts(req, pan) {
        if (!pan) {
            throw new common_1.BadRequestException('PAN is required for aggregation sync');
        }
        const userId = req.user?.id || 'mock-user-id';
        const tenantId = req.user?.tenantId || 'mock-tenant-id';
        return this.importService.syncPanLinkedAccounts(userId, tenantId, pan);
    }
    async syncBroker(req, body) {
        const userId = req.user?.id || 'mock-user-id';
        const tenantId = req.user?.tenantId || 'mock-tenant-id';
        return this.importService.startBrokerSync(userId, tenantId, body.brokerType, body.credentials);
    }
    getJobStatus(id, req) {
        const userId = req.user?.id || 'mock-user-id';
        return this.importService.getJobStatus(id, userId);
    }
};
exports.ImportController = ImportController;
__decorate([
    (0, common_1.Post)('document'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        limits: { fileSize: 25 * 1024 * 1024 }
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ImportController.prototype, "importDocument", null);
__decorate([
    (0, common_1.Get)('connectors'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ImportController.prototype, "getConnectors", null);
__decorate([
    (0, common_1.Post)('pan/aggregate'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ImportController.prototype, "startPanAggregation", null);
__decorate([
    (0, common_1.Get)('pan/aggregate/:jobId'),
    __param(0, (0, common_1.Param)('jobId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ImportController.prototype, "getAggregationStatus", null);
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