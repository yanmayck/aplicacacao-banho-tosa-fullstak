import { SetMetadata } from '@nestjs/common';
import { AuditActionType, AuditSeverity } from '@prisma/client';

export interface AuditMetadata {
  action?: AuditActionType;
  entityType?: string;
  includeResponse?: boolean;
  severity?: AuditSeverity;
  skipAudit?: boolean;
}

export const AUDIT_METADATA = 'audit';

/**
 * Decorador para configurar auditoria em métodos
 */
export const Audit = (metadata: AuditMetadata) =>
  SetMetadata(AUDIT_METADATA, metadata);

/**
 * Decorador para pular auditoria
 */
export const SkipAudit = () => SetMetadata(AUDIT_METADATA, { skipAudit: true });

/**
 * Decorador para ações de criação
 */
export const AuditCreate = (
  entityType: string,
  severity: AuditSeverity = AuditSeverity.MEDIUM,
) =>
  SetMetadata(AUDIT_METADATA, {
    action: AuditActionType.CREATE,
    entityType,
    severity,
  });

/**
 * Decorador para ações de atualização
 */
export const AuditUpdate = (
  entityType: string,
  severity: AuditSeverity = AuditSeverity.MEDIUM,
) =>
  SetMetadata(AUDIT_METADATA, {
    action: AuditActionType.UPDATE,
    entityType,
    severity,
  });

/**
 * Decorador para ações de exclusão
 */
export const AuditDelete = (
  entityType: string,
  severity: AuditSeverity = AuditSeverity.HIGH,
) =>
  SetMetadata(AUDIT_METADATA, {
    action: AuditActionType.DELETE,
    entityType,
    severity,
  });

/**
 * Decorador para ações de visualização
 */
export const AuditView = (
  entityType: string,
  severity: AuditSeverity = AuditSeverity.LOW,
) =>
  SetMetadata(AUDIT_METADATA, {
    action: AuditActionType.VIEW,
    entityType,
    severity,
  });

/**
 * Decorador para ações críticas
 */
export const AuditCritical = (action: AuditActionType, entityType?: string) =>
  SetMetadata(AUDIT_METADATA, {
    action,
    entityType,
    severity: AuditSeverity.CRITICAL,
  });

/**
 * Decorador para ações de segurança
 */
export const AuditSecurity = (action: AuditActionType, entityType?: string) =>
  SetMetadata(AUDIT_METADATA, {
    action,
    entityType,
    severity: AuditSeverity.HIGH,
  });
