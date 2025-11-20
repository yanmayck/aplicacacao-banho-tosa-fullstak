// Enums para auditoria
export enum AuditActionType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  VIEW = 'VIEW',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  BACKUP = 'BACKUP',
  RESTORE = 'RESTORE',
  SYSTEM_CONFIG = 'SYSTEM_CONFIG',
  USER_MANAGEMENT = 'USER_MANAGEMENT',
  PERMISSION_CHANGE = 'PERMISSION_CHANGE',
  DATA_ACCESS = 'DATA_ACCESS',
  FAILED_LOGIN = 'FAILED_LOGIN',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  OTHER = 'OTHER',
}

export enum AuditSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

// Interfaces para logs de auditoria
export interface AuditLog {
  id: string;
  timestamp: string;
  action: AuditActionType;
  actionDescription: string;
  severity: AuditSeverity;
  module?: string;
  entityType?: string;
  entityId?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  requestId?: string;
  success: boolean;
  errorMessage?: string;
  executionTime?: number;
  isArchived: boolean;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;

  // Relacionamentos
  user?: {
    id: string;
    name?: string;
    email: string;
  };
  client?: {
    id: string;
    name?: string;
    email?: string;
  };
}

// Interface para filtros de consulta
export interface AuditLogFilters {
  startDate?: string;
  endDate?: string;
  action?: AuditActionType;
  severity?: AuditSeverity;
  module?: string;
  entityType?: string;
  entityId?: string;
  userId?: string;
  clientId?: string;
  success?: boolean;
  search?: string;
}

// Interface para paginação e ordenação
export interface AuditLogQuery extends AuditLogFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  groupBy?: string;
}

// Interface para resposta paginada
export interface AuditLogResponse {
  logs: AuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Interface para estatísticas de auditoria
export interface AuditStatistics {
  totalLogs: number;
  logsByAction: Array<{
    action: AuditActionType;
    count: number;
  }>;
  logsBySeverity: Array<{
    severity: AuditSeverity;
    count: number;
  }>;
  logsByModule: Array<{
    module: string;
    count: number;
  }>;
  recentActivity: number;
  failedOperations: number;
}

// Interface para relatório de auditoria
export interface AuditReport {
  filters: AuditLogFilters;
  generatedAt: string;
  statistics: AuditStatistics;
  logsByDate: Record<string, AuditLog[]>;
  totalLogs: number;
  logs: AuditLog[];
}

// Interface para configurações de auditoria
export interface AuditConfig {
  id: string;
  enabled: boolean;
  logLevel: AuditSeverity;
  auditModules?: Record<string, boolean>;
  auditActions?: Record<string, boolean>;
  sensitiveEntities?: Record<string, AuditSeverity>;
  retentionDays: number;
  archiveAfterDays: number;
  alertConfig?: Record<string, unknown>;
  exportConfig?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// Interface para filtros salvos
export interface AuditFilter {
  id: string;
  name: string;
  description?: string;
  filters: AuditLogFilters;
  columns?: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  userId?: string;
  isPublic: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// Interface para alertas de auditoria
export interface AuditAlert {
  id: string;
  name: string;
  description?: string;
  conditions: Record<string, unknown>;
  isActive: boolean;
  alertFrequency: 'IMMEDIATE' | 'DAILY' | 'WEEKLY';
  notificationChannels: string[];
  notifyUsers?: string[];
  notifyRoles?: string[];
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    triggeredLogs: number;
  };
}

// Interface para contexto de auditoria
export interface AuditContextType {
  // Estado dos logs
  logs: AuditLog[];
  loading: boolean;
  error: string | null;

  // Filtros e paginação
  filters: AuditLogFilters;
  query: AuditLogQuery;
  totalLogs: number;
  currentPage: number;
  totalPages: number;

  // Estatísticas
  statistics: AuditStatistics | null;

  // Configurações
  config: AuditConfig | null;

  // Filtros salvos
  savedFilters: AuditFilter[];

  // Alertas
  alerts: AuditAlert[];

  // Ações
  setFilters: (filters: AuditLogFilters) => void;
  setQuery: (query: AuditLogQuery) => void;
  fetchLogs: () => Promise<void>;
  fetchStatistics: () => Promise<void>;
  fetchConfig: () => Promise<void>;
  fetchSavedFilters: () => Promise<void>;
  fetchAlerts: () => Promise<void>;
  saveFilter: (name: string, description?: string) => Promise<void>;
  deleteSavedFilter: (id: string) => Promise<void>;
  createAlert: (alertData: Omit<AuditAlert, 'id' | 'createdAt' | 'updatedAt' | '_count'>) => Promise<void>;
  updateAlert: (id: string, alertData: Partial<AuditAlert>) => Promise<void>;
  deleteAlert: (id: string) => Promise<void>;
  exportLogs: (format: 'csv' | 'excel' | 'pdf') => Promise<void>;
  clearFilters: () => void;
}