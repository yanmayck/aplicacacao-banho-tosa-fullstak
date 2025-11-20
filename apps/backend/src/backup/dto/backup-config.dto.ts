import {
  IsEnum,
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsArray,
  Min,
  Max,
} from 'class-validator';

export enum BackupSchedule {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  HOURLY = 'hourly',
}

export enum CompressionLevel {
  LOW = 1,
  MEDIUM = 5,
  HIGH = 9,
}

export class BackupConfigDto {
  @IsOptional()
  @IsBoolean()
  autoBackup?: boolean;

  @IsOptional()
  @IsEnum(BackupSchedule)
  schedule?: BackupSchedule;

  @IsOptional()
  @IsString()
  scheduleTime?: string; // Formato: "HH:mm" ou "HH:mm:ss"

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(365)
  retentionDays?: number;

  @IsOptional()
  @IsBoolean()
  encryptBackups?: boolean;

  @IsOptional()
  @IsString()
  encryptionKey?: string;

  @IsOptional()
  @IsEnum(CompressionLevel)
  compressionLevel?: CompressionLevel;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludedTables?: string[];

  @IsOptional()
  @IsString()
  backupPath?: string;

  @IsOptional()
  @IsBoolean()
  includeUploads?: boolean;

  @IsOptional()
  @IsBoolean()
  includeConfig?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxBackupSize?: number; // Em MB
}

export class RestoreBackupDto {
  @IsString()
  backupId: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tables?: string[]; // Para restauração seletiva

  @IsOptional()
  @IsBoolean()
  dryRun?: boolean; // Apenas simular a restauração

  @IsOptional()
  @IsBoolean()
  force?: boolean; // Forçar restauração mesmo com conflitos
}
