import { PrismaService } from '../prisma/prisma.service';
export declare class FamilyGroupService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, tenantId: string, name: string): Promise<{
        members: {
            id: string;
            createdAt: Date;
            relationship: string;
            userId: string;
            familyGroupId: string;
        }[];
    } & {
        id: string;
        name: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        adminUserId: string;
    }>;
    addMember(groupId: string, adminUserId: string, memberUserId: string, relationship: string): Promise<{
        id: string;
        createdAt: Date;
        relationship: string;
        userId: string;
        familyGroupId: string;
    }>;
    getFamilyPortfolios(groupId: string, userId: string): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        name: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: import(".prisma/client").$Enums.PortfolioType;
        parentId: string | null;
        description: string | null;
        goalAmount: import("@prisma/client/runtime/library").Decimal | null;
        goalDate: Date | null;
        isDefault: boolean;
        isActive: boolean;
    })[]>;
}
