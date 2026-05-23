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
exports.ScenarioService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ScenarioService = class ScenarioService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async runSimulation(conversationId, parameters, userId) {
        const conversation = await this.prisma.aIConversation.findFirst({
            where: { id: conversationId, userId }
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        const mockResult = {
            expectedReturn: 14.2,
            worstCaseDrawdown: -18.5,
            probabilityOfSuccess: 0.85,
            simulatedValueIn5Years: 8500000,
        };
        const mockChartData = {
            labels: ['2025', '2026', '2027', '2028', '2029', '2030'],
            median: [5000, 5700, 6400, 7200, 8000, 8500],
            optimistic: [5000, 6200, 7500, 8900, 10500, 12000],
            pessimistic: [5000, 4800, 5100, 5500, 6000, 6300],
        };
        const scenario = await this.prisma.aIScenario.create({
            data: {
                conversationId,
                variables: parameters,
                result: mockResult,
                chartData: mockChartData,
            }
        });
        return scenario;
    }
};
exports.ScenarioService = ScenarioService;
exports.ScenarioService = ScenarioService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ScenarioService);
//# sourceMappingURL=scenario.service.js.map