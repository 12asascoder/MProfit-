import { TransactionType } from '@prisma/client';
export declare class CreateTransactionDto {
    portfolioId: string;
    assetId: string;
    type: TransactionType;
    quantity: number;
    price: number;
    amount: number;
    date: string;
    fees?: number;
    stampDuty?: number;
    stt?: number;
    gst?: number;
    folioNumber?: string;
    notes?: string;
}
