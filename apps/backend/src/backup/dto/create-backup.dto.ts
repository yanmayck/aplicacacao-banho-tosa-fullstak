import {
  IsEnum,
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
} from 'class-validator';

export enum BackupType {
  FULL = 'full',
  INCREMENTAL = 'incremental',
  CONFIG = 'config',
  UPLOADS = 'uploads',
  DATABASE = 'database',
}

export enum BackupStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export class CreateBackupDto {
  @IsEnum(BackupType)
  type: BackupType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  includeUploads?: boolean;

  @IsOptional()
  @IsBoolean()
  includeConfig?: boolean;

  @IsOptional()
  @IsBoolean()
  encrypt?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tables?: string[]; // Para backups seletivos de tabelas específicas
}

export class RestoreBackupDto {
  @IsString()
  backupId: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tables?: string[]; // Para restauração seletiva de tabelas

  @IsOptional()
  @IsBoolean()
  dryRun?: boolean; // Apenas simular a restauração

  @IsOptional()
  @IsBoolean()
  force?: boolean; // Forçar restauração mesmo com conflitos
}
