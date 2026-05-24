import { FamilyGroupService } from './family.service';
export declare class FamilyGroupController {
    private readonly familyService;
    constructor(familyService: FamilyGroupService);
    create(req: any, name: string): Promise<{
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
    addMember(id: string, req: any, memberUserId: string, relationship: string): Promise<{
        id: string;
        createdAt: Date;
        relationship: string;
        userId: string;
        familyGroupId: string;
    }>;
    getFamilyPortfolios(id: string, req: any): Promise<({
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
