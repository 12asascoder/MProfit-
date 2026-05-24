import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
export declare class TransactionService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(userId: string, tenantId: string, dto: CreateTransactionDto): Promise<{
        id: string;
        type: import(".prisma/client").$Enums.TransactionType;
        quantity: import("@prisma/client/runtime/library").Decimal;
        price: import("@prisma/client/runtime/library").Decimal;
        amount: import("@prisma/client/runtime/library").Decimal;
        fees: import("@prisma/client/runtime/library").Decimal;
        stampDuty: import("@prisma/client/runtime/library").Decimal;
        stt: import("@prisma/client/runtime/library").Decimal;
        gst: import("@prisma/client/runtime/library").Decimal;
        date: Date;
        settlementDate: Date | null;
        folioNumber: string | null;
        notes: string | null;
        isReversed: boolean;
        createdAt: Date;
        updatedAt: Date;
        portfolioId: string;
        assetId: string;
        importJobId: string | null;
    }>;
    findAllByPortfolio(portfolioId: string, userId: string, tenantId: string): Promise<({
        asset: {
            symbol: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isin: string | null;
            assetType: import(".prisma/client").$Enums.AssetType;
            category: import(".prisma/client").$Enums.AssetCategory;
            exchange: string | null;
            sector: string | null;
            industry: string | null;
            currency: string;
            lotSize: number;
            faceValue: import("@prisma/client/runtime/library").Decimal | null;
            metadata: import("@prisma/client/runtime/library").JsonValue;
            isActive: boolean;
        };
    } & {
        id: string;
        type: import(".prisma/client").$Enums.TransactionType;
        quantity: import("@prisma/client/runtime/library").Decimal;
        price: import("@prisma/client/runtime/library").Decimal;
        amount: import("@prisma/client/runtime/library").Decimal;
        fees: import("@prisma/client/runtime/library").Decimal;
        stampDuty: import("@prisma/client/runtime/library").Decimal;
        stt: import("@prisma/client/runtime/library").Decimal;
        gst: import("@prisma/client/runtime/library").Decimal;
        date: Date;
        settlementDate: Date | null;
        folioNumber: string | null;
        notes: string | null;
        isReversed: boolean;
        createdAt: Date;
        updatedAt: Date;
        portfolioId: string;
        assetId: string;
        importJobId: string | null;
    })[]>;
}
