import {
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
  IsUUID,
  IsBoolean,
  IsNumber,
  IsObject,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
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
  oldValues?: Record<string, unknown>;

  @IsObject()
  @IsOptional()
  newValues?: Record<string, unknown>;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;

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

export class CreateAuditConfigDto {
  @IsBoolean()
  @IsOptional()
  enabled?: boolean;

  @IsEnum(AuditSeverity)
  @IsOptional()
  logLevel?: AuditSeverity;

  @IsNumber()
  @IsOptional()
  retentionDays?: number;

  @IsNumber()
  @IsOptional()
  archiveAfterDays?: number;

  @IsObject()
  @IsOptional()
  auditModules?: Record<string, boolean>;

  @IsObject()
  @IsOptional()
  auditActions?: Record<string, boolean>;
}

export class CreateAuditFilterDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  filters: Record<string, unknown>; // TODO: Criar DTO mais específico para filtros
}

export class CreateAuditAlertDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsObject()
  @ValidateNested()
  @Type(() => AuditAlertConditionsDto)
  conditions: AuditAlertConditionsDto;

  @IsBoolean()
  isActive: boolean;

  @IsArray()
  @IsString({ each: true })
  notificationChannels: string[] = [];

  @IsArray()
  @IsString({ each: true })
  notifyUsers: string[] = [];
}

export class UpdateAuditAlertDto extends PartialType(CreateAuditAlertDto) { }

export class AuditAlertConditionsDto {
  @IsString()
  @IsOptional()
  action?: string;

  @IsString()
  @IsOptional()
  module?: string;

  @IsEnum(AuditSeverity)
  @IsOptional()
  severity?: AuditSeverity;

  @IsString()
  @IsOptional()
  entityType?: string;

  @IsBoolean()
  @IsOptional()
  success?: boolean;
}
