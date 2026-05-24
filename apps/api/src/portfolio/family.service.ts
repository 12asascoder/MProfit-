import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FamilyGroupService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, tenantId: string, name: string) {
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

  async addMember(groupId: string, adminUserId: string, memberUserId: string, relationship: string) {
    const group = await this.prisma.familyGroup.findUnique({ where: { id: groupId } });
    if (!group || group.adminUserId !== adminUserId) {
      throw new ForbiddenException('Only the family admin can add members');
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
      throw new BadRequestException('User is already a member of this family group');
    }

    return this.prisma.familyMember.create({
      data: {
        familyGroupId: groupId,
        userId: memberUserId,
        relationship
      }
    });
  }

  async getFamilyPortfolios(groupId: string, userId: string) {
    const membership = await this.prisma.familyMember.findUnique({
      where: {
        familyGroupId_userId: {
          familyGroupId: groupId,
          userId
        }
      }
    });

    if (!membership) {
      throw new ForbiddenException('Not a member of this family group');
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
}
