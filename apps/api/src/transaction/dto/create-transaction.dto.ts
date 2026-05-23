import { IsString, IsNotEmpty, IsEnum, IsNumber, IsDateString, IsOptional } from 'class-validator';
import { TransactionType } from '@prisma/client';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  portfolioId: string;

  @IsString()
  @IsNotEmpty()
  assetId: string;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsNumber()
  @IsOptional()
  fees?: number;

  @IsNumber()
  @IsOptional()
  stampDuty?: number;

  @IsNumber()
  @IsOptional()
  stt?: number;

  @IsNumber()
  @IsOptional()
  gst?: number;

  @IsString()
  @IsOptional()
  folioNumber?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
