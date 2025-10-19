import { BackupType, BackupStatus } from '../dto/create-backup.dto';

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
  createdAt: Date;
  completedAt?: Date;
  description?: string;
  version: string;
  retentionUntil?: Date;
  errorMessage?: string;
}

export interface BackupProgress {
  backupId: string;
  status: BackupStatus;
  progress: number; // 0-100
  currentStep: string;
  totalSteps: number;
  bytesProcessed: number;
  totalBytes: number;
  startTime: Date;
  estimatedCompletion?: Date;
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

export interface DatabaseTable {
  name: string;
  rowCount: number;
  size: number;
  lastModified: Date;
}

export interface BackupResult {
  success: boolean;
  backupId?: string;
  filePath?: string;
  fileSize?: number;
  error?: string;
  duration: number;
  tablesBackedUp: string[];
  warnings?: string[];
}

export interface RestoreResult {
  success: boolean;
  tablesRestored: string[];
  rowsAffected: number;
  duration: number;
  warnings?: string[];
  error?: string;
}

export interface IntegrityCheckResult {
  isValid: boolean;
  checksum: string;
  expectedChecksum: string;
  fileSize: number;
  expectedSize: number;
  errors?: string[];
}
