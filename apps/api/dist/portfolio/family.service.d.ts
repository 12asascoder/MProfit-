import { PrismaService } from '../prisma/prisma.service';
export declare class FamilyGroupService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, tenantId: string, name: string): Promise<{
        members: {
            id: string;
            createdAt: Date;
            userId: string;
            relationship: string;
            familyGroupId: string;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        adminUserId: string;
    }>;
    addMember(groupId: string, adminUserId: string, memberUserId: string, relationship: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        relationship: string;
        familyGroupId: string;
    }>;
    getFamilyPortfolios(groupId: string, userId: string): Promise<({
        user: {
            name: string;
            id: string;
            email: string;
        };
    } & {
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        type: import(".prisma/client").$Enums.PortfolioType;
        userId: string;
        parentId: string | null;
        description: string | null;
        goalAmount: import("@prisma/client/runtime/library").Decimal | null;
        goalDate: Date | null;
        isDefault: boolean;
    })[]>;
}
