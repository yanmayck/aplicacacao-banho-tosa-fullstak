// ========== TIPOS E INTERFACES PARA SISTEMA DE PLUGINS ==========

import { LogLevel } from '@prisma/client';

// === ENUMS ===
export { LogLevel };

// === HOOKS DO SISTEMA ===
export enum SystemHooks {
  // === CICLO DE VIDA DA APLICAÇÃO ===
  SYSTEM_STARTUP = 'system.startup',
  SYSTEM_SHUTDOWN = 'system.shutdown',
  SYSTEM_MAINTENANCE = 'system.maintenance',

  // === AGENDAMENTOS ===
  APPOINTMENT_CREATED = 'appointment.created',
  APPOINTMENT_UPDATED = 'appointment.updated',
  APPOINTMENT_COMPLETED = 'appointment.completed',
  APPOINTMENT_CANCELLED = 'appointment.cancelled',
  APPOINTMENT_RESCHEDULED = 'appointment.rescheduled',

  // === CLIENTES ===
  CLIENT_REGISTERED = 'client.registered',
  CLIENT_UPDATED = 'client.updated',
  CLIENT_DELETED = 'client.deleted',

  // === PETS ===
  PET_REGISTERED = 'pet.registered',
  PET_UPDATED = 'pet.updated',
  PET_DELETED = 'pet.deleted',

  // === PAGAMENTOS ===
  PAYMENT_INTENT_CREATED = 'payment.intent.created',
  PAYMENT_COMPLETED = 'payment.completed',
  PAYMENT_FAILED = 'payment.failed',
  PAYMENT_REFUNDED = 'payment.refunded',

  // === FINANCEIRO ===
  FINANCIAL_TRANSACTION_CREATED = 'financial.transaction.created',
  FINANCIAL_REPORT_GENERATED = 'financial.report.generated',

  // === NOTIFICAÇÕES ===
  NOTIFICATION_SENT = 'notification.sent',
  NOTIFICATION_FAILED = 'notification.failed',

  // === RELATÓRIOS ===
  REPORT_GENERATED = 'report.generated',
  REPORT_EXPORTED = 'report.exported',

  // === AUTENTICAÇÃO ===
  USER_LOGIN = 'user.login',
  USER_LOGOUT = 'user.logout',
  USER_PERMISSION_CHANGED = 'user.permission.changed',

  // === AUDITORIA ===
  AUDIT_LOG_CREATED = 'audit.log.created',
}

// === INTERFACES BASE ===

// Interface base para plugins
export interface PluginInterface {
  // === METADADOS ===
  name: string;
  version: string;
  description?: string;
  author: string;
  homepage?: string;
  repository?: string;

  // === DEPENDÊNCIAS ===
  dependencies?: PluginDependency[];
  peerDependencies?: PluginDependency[];

  // === CICLO DE VIDA ===
  onInstall(config: PluginConfig): Promise<void>;
  onUninstall(): Promise<void>;
  onEnable(): Promise<void>;
  onDisable(): Promise<void>;
  onUpdate(fromVersion: string, toVersion: string): Promise<void>;

  // === HOOKS ===
  getHooks(): PluginHookDefinition[];

  // === CONFIGURAÇÃO ===
  getConfigSchema(): JsonSchema;
  validateConfig(config: any): ValidationResult;
  getDefaultConfig(): PluginConfig;

  // === PERMISSÕES ===
  getRequiredPermissions(): PluginPermission[];

  // === INTERFACE ADMINISTRATIVA (OPCIONAL) ===
  getAdminRoutes?(): RouteDefinition[];
  getAdminMenuItems?(): MenuItem[];
  getSettingsComponent?(): any; // React.ComponentType;

  // === API PÚBLICA (OPCIONAL) ===
  getPublicApi?(): PluginApiDefinition;
}

// Definição de hook de plugin
export interface PluginHookDefinition {
  name: SystemHooks;
  handler: HookHandler;
  priority?: number;
  config?: any;
  description?: string;
}

// Handler de hook
export type HookHandler = (
  data: any,
  context: HookContext
) => Promise<any> | any;

// Contexto do hook
export interface HookContext {
  plugin: PluginInterface;
  user?: any; // User entity
  requestId: string;
  timestamp: Date;
  cancellable?: boolean;
}

// Dependência de plugin
export interface PluginDependency {
  name: string;
  version: string;
  required: boolean;
}

// Permissão de plugin
export interface PluginPermission {
  resource: string;
  actions: string[];
  description?: string;
}

// Configuração de plugin
export interface PluginConfig {
  [key: string]: any;
}

// Resultado de validação
export interface ValidationResult {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}

// Schema JSON para configuração
export interface JsonSchema {
  type: string;
  properties?: Record<string, any>;
  required?: string[];
  [key: string]: any;
}

// Definição de rota
export interface RouteDefinition {
  path: string;
  component: string | any; // React.ComponentType;
  title?: string;
  icon?: string;
  permissions?: string[];
}

// Item de menu
export interface MenuItem {
  label: string;
  path?: string;
  icon?: string;
  children?: MenuItem[];
  permissions?: string[];
}

// API pública do plugin
export interface PluginApiDefinition {
  endpoints: ApiEndpoint[];
  types: TypeDefinition[];
}

// Endpoint da API
export interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  handler: string; // Nome do método no plugin
  description?: string;
  permissions?: string[];
}

// Definição de tipo
export interface TypeDefinition {
  name: string;
  schema: any;
}

// === TIPOS PARA REGISTRY ===

// Instância de plugin carregada
export interface PluginInstance {
  plugin: PluginInterface;
  config: PluginConfig;
  isActive: boolean;
  loadedAt: Date;
  hooks: PluginHookDefinition[];
}

// Configuração do registry
export interface PluginRegistryConfig {
  pluginPath: string;
  maxPlugins: number;
  enableSandbox: boolean;
  logLevel: LogLevel;
}

// === TIPOS PARA SEGURANÇA ===

// Contexto de segurança
export interface SecurityContext {
  plugin: PluginInterface;
  permissions: PluginPermission[];
  user?: any;
  sessionId?: string;
}

// Resultado de verificação de segurança
export interface SecurityCheckResult {
  allowed: boolean;
  reason?: string;
  requiredPermissions?: PluginPermission[];
}

// === TIPOS PARA HOOKS ===

// Dados do hook
export interface HookData {
  [key: string]: any;
}

// Resultado da execução do hook
export interface HookResult {
  success: boolean;
  data?: any;
  error?: string;
  executionTime: number;
}

// Estatísticas do hook
export interface HookStats {
  hookName: SystemHooks;
  totalExecutions: number;
  averageExecutionTime: number;
  lastExecutedAt: Date;
  errorCount: number;
  successRate: number;
}

// === TIPOS PARA LOGGING ===

// Entrada de log do plugin
export interface PluginLogEntry {
  pluginId: string;
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: Date;
  context?: HookContext;
}

// === TIPOS PARA ADMINISTRAÇÃO ===

// Status do plugin
export interface PluginStatus {
  id: string;
  name: string;
  version: string;
  isActive: boolean;
  isInstalled: boolean;
  hasErrors: boolean;
  lastError?: string;
  stats: any[]; // PluginStats[];
}

// Configuração de upload
export interface PluginUploadConfig {
  maxSize: number; // em bytes
  allowedExtensions: string[];
  tempPath: string;
}

// === UTILITÁRIOS ===

// Resultado de operação
export interface OperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  warnings?: string[];
}

// Filtro para listagem
export interface PluginFilter {
  isActive?: boolean;
  isInstalled?: boolean;
  author?: string;
  category?: string;
  search?: string;
}

// Ordenação
export interface PluginSort {
  field: 'name' | 'author' | 'version' | 'installedAt' | 'updatedAt';
  order: 'asc' | 'desc';
}

// Paginação
export interface PluginPagination {
  page: number;
  limit: number;
  total: number;
}

// Resposta paginada
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PluginPagination;
  filters?: PluginFilter;
  sort?: PluginSort;
}

// === DECLARAÇÕES DE MÓDULO (para extensibilidade) ===
declare global {
  // Permite que plugins estendam os tipos globais
  interface PluginExtensions {
    [key: string]: any;
  }

  // Namespace para tipos de plugin
  namespace PluginTypes {
    export type Config = PluginConfig;
    export type Interface = PluginInterface;
    export type Hook = PluginHookDefinition;
    export type Permission = PluginPermission;
  }
}