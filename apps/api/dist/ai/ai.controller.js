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
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const insights_service_1 = require("./insights.service");
const copilot_service_1 = require("./copilot.service");
const scenario_service_1 = require("./scenario.service");
let AiController = class AiController {
    constructor(insightsService, copilotService, scenarioService) {
        this.insightsService = insightsService;
        this.copilotService = copilotService;
        this.scenarioService = scenarioService;
    }
    getActiveInsights(portfolioId) {
        return this.insightsService.getActiveInsights(portfolioId);
    }
    dismissInsight(id) {
        return this.insightsService.dismissInsight(id);
    }
    generateInsights(portfolioId) {
        return this.insightsService.generateInsightsForPortfolio(portfolioId);
    }
    startConversation(req, portfolioId) {
        const userId = req.user?.id || 'mock-user-id';
        return this.copilotService.startConversation(userId, portfolioId);
    }
    sendMessage(req, id, content) {
        const userId = req.user?.id || 'mock-user-id';
        return this.copilotService.sendMessage(id, content, userId);
    }
    getConversation(req, id) {
        const userId = req.user?.id || 'mock-user-id';
        return this.copilotService.getConversationHistory(id, userId);
    }
    runScenario(req, conversationId, parameters) {
        const userId = req.user?.id || 'mock-user-id';
        return this.scenarioService.runSimulation(conversationId, parameters, userId);
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Get)('insights'),
    __param(0, (0, common_1.Query)('portfolioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "getActiveInsights", null);
__decorate([
    (0, common_1.Post)('insights/:id/dismiss'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "dismissInsight", null);
__decorate([
    (0, common_1.Post)('insights/generate'),
    __param(0, (0, common_1.Body)('portfolioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "generateInsights", null);
__decorate([
    (0, common_1.Post)('copilot/start'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('portfolioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "startConversation", null);
__decorate([
    (0, common_1.Post)('copilot/:id/message'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('content')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('copilot/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "getConversation", null);
__decorate([
    (0, common_1.Post)('scenario/:conversationId/run'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('conversationId')),
    __param(2, (0, common_1.Body)('parameters')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "runScenario", null);
exports.AiController = AiController = __decorate([
    (0, common_1.Controller)('ai'),
    __metadata("design:paramtypes", [insights_service_1.InsightsService,
        copilot_service_1.CopilotService,
        scenario_service_1.ScenarioService])
], AiController);
//# sourceMappingURL=ai.controller.js.map