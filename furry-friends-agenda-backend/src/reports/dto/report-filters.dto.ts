import { IsOptional, IsDateString, IsString, IsEnum, IsArray, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export enum ReportType {
  FINANCIAL = 'financial',
  GROOMER_PERFORMANCE = 'groomer_performance',
  CLIENT_ANALYSIS = 'client_analysis',
  SERVICE_RANKING = 'service_ranking',
  OCCUPANCY_METRICS = 'occupancy_metrics',
  CLIENT_RETENTION = 'client_retention',
  REVENUE_BY_PERIOD = 'revenue_by_period',
  APPOINTMENT_ANALYSIS = 'appointment_analysis'
}

export enum ReportPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  CUSTOM = 'custom'
}

export class ReportFiltersDto {
  @IsOptional()
  @IsEnum(ReportType)
  type?: ReportType;

  @IsOptional()
  @IsEnum(ReportPeriod)
  period?: ReportPeriod;

  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsUUID()
  groomerId?: string;

  @IsOptional()
  @IsUUID()
  clientId?: string;

  @IsOptional()
  @IsUUID()
  serviceId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  groomerIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  serviceIds?: string[];

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @IsOptional()
  @IsString()
  groupBy?: 'day' | 'week' | 'month' | 'groomer' | 'service' | 'client';

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';

  @IsOptional()
  limit?: number;

  @IsOptional()
  offset?: number;
}

export class FinancialReportFiltersDto extends ReportFiltersDto {
  @IsOptional()
  @IsEnum(['income', 'expense', 'both'])
  transactionType?: 'income' | 'expense' | 'both';

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  paymentMethods?: string[];

  @IsOptional()
  @IsString()
  minAmount?: string;

  @IsOptional()
  @IsString()
  maxAmount?: string;
}

export class GroomerPerformanceFiltersDto extends ReportFiltersDto {
  @IsOptional()
  @IsEnum(['appointments', 'revenue', 'commissions', 'rating', 'efficiency'])
  metric?: 'appointments' | 'revenue' | 'commissions' | 'rating' | 'efficiency';

  @IsOptional()
  @IsEnum(['count', 'sum', 'average', 'percentage'])
  aggregation?: 'count' | 'sum' | 'average' | 'percentage';
}

export class ClientAnalysisFiltersDto extends ReportFiltersDto {
  @IsOptional()
  @IsEnum(['new', 'recurring', 'churn', 'loyalty', 'segmentation'])
  analysisType?: 'new' | 'recurring' | 'churn' | 'loyalty' | 'segmentation';

  @IsOptional()
  @IsString()
  minVisits?: string;

  @IsOptional()
  @IsString()
  maxVisits?: string;

  @IsOptional()
  @IsString()
  minSpent?: string;

  @IsOptional()
  @IsString()
  maxSpent?: string;
}

export class ServiceRankingFiltersDto extends ReportFiltersDto {
  @IsOptional()
  @IsEnum(['popularity', 'revenue', 'frequency', 'profitability'])
  rankingCriteria?: 'popularity' | 'revenue' | 'frequency' | 'profitability';

  @IsOptional()
  @IsString()
  minBookings?: string;

  @IsOptional()
  @IsString()
  minRevenue?: string;
}

export class OccupancyMetricsFiltersDto extends ReportFiltersDto {
  @IsOptional()
  @IsEnum(['daily', 'weekly', 'monthly'])
  timeGranularity?: 'daily' | 'weekly' | 'monthly';

  @IsOptional()
  @IsString()
  operatingHours?: string; // JSON string with hours data

  @IsOptional()
  @IsString()
  workingDays?: string; // Array of working days
}