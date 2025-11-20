export enum BackupType {
  FULL = 'full',
  INCREMENTAL = 'incremental',
  CONFIG = 'config',
  UPLOADS = 'uploads',
  DATABASE = 'database'
}

export enum BackupStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface BackupMetadata {
  id: string;
  type: BackupType;
  status: BackupStatus;
  fileName: string;
  filePath: string;
  fileSize: number;
  checksum: string;
  encrypted: boolean;
  compressed: boolean;
  createdAt: string;
  completedAt?: string;
  description?: string;
  version: string;
  retentionUntil?: string;
  errorMessage?: string;
}

export interface BackupProgress {
  backupId: string;
  status: BackupStatus;
  progress: number;
  currentStep: string;
  totalSteps: number;
  bytesProcessed: number;
  totalBytes: number;
  startTime: string;
  estimatedCompletion?: string;
}

export interface CreateBackupRequest {
  type: BackupType;
  description?: string;
  includeUploads?: boolean;
  includeConfig?: boolean;
  encrypt?: boolean;
  tables?: string[];
}

export interface RestoreBackupRequest {
  backupId: string;
  tables?: string[];
  dryRun?: boolean;
  force?: boolean;
}

export interface BackupConfig {
  autoBackup: boolean;
  schedule: string;
  scheduleTime: string;
  retentionDays: number;
  encryptBackups: boolean;
  encryptionKey?: string;
  compressionLevel: number;
  excludedTables: string[];
  backupPath: string;
  includeUploads: boolean;
  includeConfig: boolean;
  maxBackupSize: number;
}

export interface BackupStats {
  totalBackups: number;
  totalSize: number;
  completedBackups: number;
  failedBackups: number;
  averageSize: number;
  oldestBackup: string | null;
  newestBackup: string | null;
  backupsByType: Record<string, number>;
}

export interface BackupFilters {
  type?: BackupType;
  status?: BackupStatus;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface BackupListResponse {
  success: boolean;
  data: BackupMetadata[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface BackupResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface BackupProgressResponse {
  success: boolean;
  data: BackupProgress;
}

export interface BackupStatsResponse {
  success: boolean;
  data: BackupStats;
}