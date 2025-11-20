// Interfaces específicas para interceptors
import { Request } from 'express';
import { AuditActionType, AuditSeverity } from '@prisma/client';

export interface AuditMetadata {
  action?: AuditActionType;
  entityType?: string;
  includeResponse?: boolean;
  severity?: AuditSeverity;
  skipAudit?: boolean;
}

export interface AuditParams {
  request: Request;
  action: AuditActionType;
  entityType?: string;
  severity: AuditSeverity;
  success: boolean;
  startTime: number;
  responseData?: unknown;
  errorMessage?: string;
  metadata?: RequestMetadata;
}

export interface RequestMetadata {
  method: string;
  url: string;
  oldBody: Record<string, unknown>;
  responseData?: unknown;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  [key: string]: any;
}

export interface Client {
  id: string;
  name?: string;
  email?: string;
  [key: string]: any;
}

export interface RequestWithUser extends Request {
  user?: User;
  client?: Client;
  sessionID?: string;
}

export type SanitizedResponseData =
  | Record<string, unknown>
  | Record<string, unknown>[]
  | unknown;
