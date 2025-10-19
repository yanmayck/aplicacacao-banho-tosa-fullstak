import {
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
  IsUUID,
  IsBoolean,
  IsNumber,
  IsObject,
} from 'class-validator';
import { AuditActionType, AuditSeverity } from '@prisma/client';

export class CreateAuditLogDto {
  @IsEnum(AuditActionType)
  action: AuditActionType;

  @IsString()
  actionDescription: string;

  @IsEnum(AuditSeverity)
  @IsOptional()
  severity?: AuditSeverity;

  @IsString()
  @IsOptional()
  module?: string;

  @IsString()
  @IsOptional()
  entityType?: string;

  @IsString()
  @IsOptional()
  entityId?: string;

  @IsObject()
  @IsOptional()
  oldValues?: Record<string, any>;

  @IsObject()
  @IsOptional()
  newValues?: Record<string, any>;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsString()
  @IsOptional()
  ipAddress?: string;

  @IsString()
  @IsOptional()
  userAgent?: string;

  @IsString()
  @IsOptional()
  sessionId?: string;

  @IsString()
  @IsOptional()
  requestId?: string;

  @IsBoolean()
  @IsOptional()
  success?: boolean;

  @IsString()
  @IsOptional()
  errorMessage?: string;

  @IsNumber()
  @IsOptional()
  executionTime?: number;
}

export class AuditLogFiltersDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsEnum(AuditActionType)
  @IsOptional()
  action?: AuditActionType;

  @IsEnum(AuditSeverity)
  @IsOptional()
  severity?: AuditSeverity;

  @IsString()
  @IsOptional()
  module?: string;

  @IsString()
  @IsOptional()
  entityType?: string;

  @IsString()
  @IsOptional()
  entityId?: string;

  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsUUID()
  @IsOptional()
  clientId?: string;

  @IsBoolean()
  @IsOptional()
  success?: boolean;

  @IsString()
  @IsOptional()
  search?: string; // Para busca geral em descrições e metadados
}

export class AuditLogQueryDto extends AuditLogFiltersDto {
  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  limit?: number = 50;

  @IsString()
  @IsOptional()
  sortBy?: string = 'timestamp';

  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';

  @IsString()
  @IsOptional()
  groupBy?: string; // Para agrupar resultados
}
