import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsBoolean, IsDateString } from 'class-validator';
import { PortfolioType } from '@prisma/client';

export class CreatePortfolioDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(PortfolioType)
  @IsOptional()
  type?: PortfolioType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  parentId?: string;

  @IsNumber()
  @IsOptional()
  goalAmount?: number;

  @IsDateString()
  @IsOptional()
  goalDate?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
