import {
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { TransactionType } from './create-transaction.dto';

export enum ReportType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  CUSTOM = 'CUSTOM'
}

export class FinancialReportFiltersDto {
  @IsOptional()
  @IsEnum(ReportType)
  type?: ReportType;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(TransactionType)
  transactionType?: TransactionType;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsUUID()
  groomerId?: string;

  @IsOptional()
  @IsString()
  groupBy?: 'day' | 'week' | 'month' | 'category' | 'groomer';

  @IsOptional()
  @IsString()
  sortBy?: 'date' | 'amount' | 'description';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}