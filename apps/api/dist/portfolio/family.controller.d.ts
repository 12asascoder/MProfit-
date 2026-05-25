import { FamilyGroupService } from './family.service';
export declare class FamilyGroupController {
    private readonly familyService;
    constructor(familyService: FamilyGroupService);
    create(req: any, name: string): Promise<{
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
    addMember(id: string, req: any, memberUserId: string, relationship: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        relationship: string;
        familyGroupId: string;
    }>;
    getFamilyPortfolios(id: string, req: any): Promise<({
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
