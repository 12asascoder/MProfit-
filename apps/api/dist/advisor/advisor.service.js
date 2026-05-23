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
exports.AdvisorService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdvisorService = class AdvisorService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async inviteClient(advisorId, tenantId, email, name) {
        const client = await this.prisma.user.findUnique({
            where: { email }
        });
        const relationship = await this.prisma.advisorClient.create({
            data: {
                advisorId,
                clientId: client ? client.id : 'placeholder-id-for-invite',
                status: 'PENDING',
            }
        });
        return {
            invitationId: relationship.id,
            status: relationship.status,
            message: `Invitation sent to ${email}`,
        };
    }
    async getClients(advisorId, tenantId) {
        const relationships = await this.prisma.advisorClient.findMany({
            where: { advisorId },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        kycStatus: true,
                    }
                },
            }
        });
        return relationships.map(r => ({
            clientId: r.clientId,
            name: r.client.name,
            email: r.client.email,
            kycStatus: r.client.kycStatus,
            status: r.status,
            permissions: r.permissions,
            since: r.createdAt,
        }));
    }
    async getClientPortfolioSummary(advisorId, clientId) {
        const relationship = await this.prisma.advisorClient.findUnique({
            where: {
                advisorId_clientId: {
                    advisorId,
                    clientId,
                }
            }
        });
        if (!relationship || relationship.status !== 'ACTIVE') {
            throw new common_1.NotFoundException('Client relationship not found or inactive');
        }
        return {
            clientId,
            totalAUM: 5400000,
            activePortfolios: 2,
            lastSync: new Date(),
        };
    }
};
exports.AdvisorService = AdvisorService;
exports.AdvisorService = AdvisorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdvisorService);
//# sourceMappingURL=advisor.service.js.map