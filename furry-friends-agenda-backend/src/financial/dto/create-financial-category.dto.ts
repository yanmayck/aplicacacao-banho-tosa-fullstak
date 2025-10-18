import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { TransactionType } from './create-transaction.dto';

export class UpdateFinancialCategoryDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateFinancialCategoryDto {
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}