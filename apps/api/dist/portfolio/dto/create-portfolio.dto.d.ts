import { PortfolioType } from '@prisma/client';
export declare class CreatePortfolioDto {
    name: string;
    type?: PortfolioType;
    description?: string;
    parentId?: string;
    goalAmount?: number;
    goalDate?: string;
    isDefault?: boolean;
}
