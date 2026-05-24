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
exports.FamilyGroupController = void 0;
const common_1 = require("@nestjs/common");
const family_service_1 = require("./family.service");
let FamilyGroupController = class FamilyGroupController {
    constructor(familyService) {
        this.familyService = familyService;
    }
    async create(req, name) {
        return this.familyService.create(req.user.userId, req.user.tenantId, name);
    }
    async addMember(id, req, memberUserId, relationship) {
        return this.familyService.addMember(id, req.user.userId, memberUserId, relationship);
    }
    async getFamilyPortfolios(id, req) {
        return this.familyService.getFamilyPortfolios(id, req.user.userId);
    }
};
exports.FamilyGroupController = FamilyGroupController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FamilyGroupController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/members'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)('userId')),
    __param(3, (0, common_1.Body)('relationship')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String]),
    __metadata("design:returntype", Promise)
], FamilyGroupController.prototype, "addMember", null);
__decorate([
    (0, common_1.Get)(':id/portfolios'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FamilyGroupController.prototype, "getFamilyPortfolios", null);
exports.FamilyGroupController = FamilyGroupController = __decorate([
    (0, common_1.Controller)('family'),
    __metadata("design:paramtypes", [family_service_1.FamilyGroupService])
], FamilyGroupController);
//# sourceMappingURL=family.controller.js.map