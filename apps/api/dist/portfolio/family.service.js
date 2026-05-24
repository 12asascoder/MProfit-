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
exports.FamilyGroupService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FamilyGroupService = class FamilyGroupService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, tenantId, name) {
        return this.prisma.familyGroup.create({
            data: {
                name,
                adminUserId: userId,
                tenantId,
                members: {
                    create: {
                        userId,
                        relationship: 'SELF'
                    }
                }
            },
            include: {
                members: true
            }
        });
    }
    async addMember(groupId, adminUserId, memberUserId, relationship) {
        const group = await this.prisma.familyGroup.findUnique({ where: { id: groupId } });
        if (!group || group.adminUserId !== adminUserId) {
            throw new common_1.ForbiddenException('Only the family admin can add members');
        }
        const existingMember = await this.prisma.familyMember.findUnique({
            where: {
                familyGroupId_userId: {
                    familyGroupId: groupId,
                    userId: memberUserId
                }
            }
        });
        if (existingMember) {
            throw new common_1.BadRequestException('User is already a member of this family group');
        }
        return this.prisma.familyMember.create({
            data: {
                familyGroupId: groupId,
                userId: memberUserId,
                relationship
            }
        });
    }
    async getFamilyPortfolios(groupId, userId) {
        const membership = await this.prisma.familyMember.findUnique({
            where: {
                familyGroupId_userId: {
                    familyGroupId: groupId,
                    userId
                }
            }
        });
        if (!membership) {
            throw new common_1.ForbiddenException('Not a member of this family group');
        }
        const members = await this.prisma.familyMember.findMany({
            where: { familyGroupId: groupId }
        });
        const userIds = members.map(m => m.userId);
        return this.prisma.portfolio.findMany({
            where: {
                userId: { in: userIds },
                isActive: true
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true }
                }
            }
        });
    }
};
exports.FamilyGroupService = FamilyGroupService;
exports.FamilyGroupService = FamilyGroupService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FamilyGroupService);
//# sourceMappingURL=family.service.js.map