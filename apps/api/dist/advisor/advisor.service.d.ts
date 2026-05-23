import { PrismaService } from '../prisma/prisma.service';
export declare class AdvisorService {
    private prisma;
    constructor(prisma: PrismaService);
    inviteClient(advisorId: string, tenantId: string, email: string, name: string): Promise<{
        invitationId: string;
        status: string;
        message: string;
    }>;
    getClients(advisorId: string, tenantId: string): Promise<{
        clientId: string;
        name: string;
        email: string;
        kycStatus: import(".prisma/client").$Enums.KYCStatus;
        status: string;
        permissions: import("@prisma/client/runtime/library").JsonValue;
        since: Date;
    }[]>;
    getClientPortfolioSummary(advisorId: string, clientId: string): Promise<{
        clientId: string;
        totalAUM: number;
        activePortfolios: number;
        lastSync: Date;
    }>;
}
