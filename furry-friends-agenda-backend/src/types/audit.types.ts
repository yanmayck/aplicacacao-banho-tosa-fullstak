import { AuditSeverity } from '@prisma/client';

// Interfaces específicas para o sistema de auditoria
export interface AuditStatistics {
  totalLogs: number;
  logsByAction: Array<{
    action: string;
    count: number;
  }>;
  logsBySeverity: Array<{
    severity: string;
    count: number;
  }>;
  logsByModule: Array<{
    module: string;
    count: number;
  }>;
  recentActivity: number;
  failedOperations: number;
}

export interface AuditReport {
  filters: any;
  generatedAt: Date;
  statistics: AuditStatistics | null;
  logsByDate: Record<string, any[]>;
  totalLogs: number;
  logs: any[];
}

export interface AuditConfigData {
  enabled?: boolean;
  logLevel?: AuditSeverity;
  retentionDays?: number;
  archiveAfterDays?: number;
  auditModules?: Record<string, boolean>;
  auditActions?: Record<string, boolean>;
}

export interface AuditFilterData {
  name: string;
  description: string;
  filters: any;
  userId: string;
}

export interface AuditAlertData {
  name: string;
  description: string;
  conditions: {
    action?: string;
    module?: string;
    severity?: string;
    entityType?: string;
    success?: boolean;
  };
  isActive: boolean;
  notificationChannels: string[];
  notifyUsers: string[];
  createdBy: string;
}

export interface AlertTriggerData {
  matchedConditions: any;
  logData: {
    action: string;
    module: string;
    severity: string;
  };
}
