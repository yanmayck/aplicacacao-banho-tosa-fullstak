// Interfaces específicas para interceptors
import { Request } from 'express';

export interface AuditMetadata {
  action?: string;
  entityType?: string;
  includeResponse?: boolean;
  severity?: string;
  skipAudit?: boolean;
}

export interface AuditParams {
  request: Request;
  action: string;
  entityType?: string;
  severity: string;
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
  | Record<string, unknown>[];
