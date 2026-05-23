import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
export declare class TransactionService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, tenantId: string, dto: CreateTransactionDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.TransactionType;
        portfolioId: string;
        assetId: string;
        quantity: import("@prisma/client/runtime/library").Decimal;
        folioNumber: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        amount: import("@prisma/client/runtime/library").Decimal;
        date: Date;
        fees: import("@prisma/client/runtime/library").Decimal;
        stampDuty: import("@prisma/client/runtime/library").Decimal;
        stt: import("@prisma/client/runtime/library").Decimal;
        gst: import("@prisma/client/runtime/library").Decimal;
        notes: string | null;
        settlementDate: Date | null;
        isReversed: boolean;
        importJobId: string | null;
    }>;
    findAllByPortfolio(portfolioId: string, userId: string, tenantId: string): Promise<({
        asset: {
            symbol: string | null;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.TransactionType;
        portfolioId: string;
        assetId: string;
        quantity: import("@prisma/client/runtime/library").Decimal;
        folioNumber: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        amount: import("@prisma/client/runtime/library").Decimal;
        date: Date;
        fees: import("@prisma/client/runtime/library").Decimal;
        stampDuty: import("@prisma/client/runtime/library").Decimal;
        stt: import("@prisma/client/runtime/library").Decimal;
        gst: import("@prisma/client/runtime/library").Decimal;
        notes: string | null;
        settlementDate: Date | null;
        isReversed: boolean;
        importJobId: string | null;
    })[]>;
}
