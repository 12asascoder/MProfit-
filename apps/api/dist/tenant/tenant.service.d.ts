import { PrismaService } from '../prisma/prisma.service';
import { Tenant } from '@prisma/client';
export declare class TenantService {
    private prisma;
    constructor(prisma: PrismaService);
    getTenantBySlug(slug: string): Promise<Tenant>;
    getTenantByDomain(domain: string): Promise<Tenant | null>;
}
