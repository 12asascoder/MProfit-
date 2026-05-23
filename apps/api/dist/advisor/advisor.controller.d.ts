import { AdvisorService } from './advisor.service';
export declare class AdvisorController {
    private readonly advisorService;
    constructor(advisorService: AdvisorService);
    inviteClient(req: any, body: {
        email: string;
        name: string;
    }): Promise<{
        invitationId: string;
        status: string;
        message: string;
    }>;
    getClients(req: any): Promise<{
        clientId: string;
        name: string;
        email: string;
        kycStatus: import(".prisma/client").$Enums.KYCStatus;
        status: string;
        permissions: import("@prisma/client/runtime/library").JsonValue;
        since: Date;
    }[]>;
    getClientSummary(clientId: string, req: any): Promise<{
        clientId: string;
        totalAUM: number;
        activePortfolios: number;
        lastSync: Date;
    }>;
}
