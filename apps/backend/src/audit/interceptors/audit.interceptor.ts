import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap, catchError } from 'rxjs';
import { Request } from 'express';
import { AuditService } from '../audit.service';
import { AuditActionType, AuditSeverity } from '@prisma/client';
import { CreateAuditLogDto } from '../dto/audit-log.dto';
import {
  AuditMetadata,
  AuditParams,
  RequestMetadata,
  RequestWithUser,
  SanitizedResponseData,
} from '../../types/interceptor.types';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    @Inject(AuditService) private auditService: AuditService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method;
    const url = request.url;

    // Obter metadados de auditoria do controlador/método
    const auditMetadata: AuditMetadata =
      this.reflector.get<AuditMetadata>('audit', context.getHandler()) || {};

    // Pular auditoria se especificado
    if (auditMetadata.skipAudit) {
      return next.handle();
    }

    // Determinar ação baseada no método HTTP
    const action: AuditActionType =
      (auditMetadata.action as AuditActionType) ||
      this.getActionFromMethod(method);
    const entityType: string =
      (auditMetadata.entityType as string) || this.getEntityTypeFromUrl(url);
    const severity: AuditSeverity =
      (auditMetadata.severity as AuditSeverity) || AuditSeverity.MEDIUM;

    // Capturar dados antes da execução
    const oldBody: Record<string, unknown> = JSON.parse(
      JSON.stringify(request.body || {}),
    );
    const startTime = Date.now();

    return next.handle().pipe(
      tap((data: unknown) => {
        // Executar auditoria após sucesso
        void this.performAudit({
          request,
          action,
          entityType,
          severity,
          success: true,
          startTime,
          responseData: auditMetadata.includeResponse ? data : undefined,
          metadata: {
            method,
            url,
            oldBody,
          },
        });
      }),
      catchError((error: Error) => {
        // Executar auditoria mesmo em caso de erro
        void this.performAudit({
          request,
          action,
          entityType,
          severity,
          success: false,
          startTime,
          errorMessage: error.message,
          metadata: {
            method,
            url,
            oldBody,
          },
        });

        throw error;
      }),
    );
  }

  private async performAudit(params: AuditParams) {
    try {
      const {
        request,
        action,
        entityType,
        severity,
        success,
        startTime,
        responseData,
        errorMessage,
        metadata,
      } = params;

      // Extrair informações do usuário
      const user = (request as RequestWithUser).user;
      const client = (request as RequestWithUser).client;

      // Extrair ID da entidade da URL (se aplicável)
      const entityId = this.extractEntityId(request.url);

      // Preparar dados para auditoria
      const auditData: CreateAuditLogDto = {
        action: action,
        actionDescription: this.generateActionDescription(
          action,
          entityType,
          metadata,
        ),
        severity: severity,
        module: this.getModuleFromUrl(request.url),
        entityType,
        entityId,
        success,
        executionTime: Date.now() - startTime,
        errorMessage,
        ipAddress: this.getClientIP(request),
        userAgent: request.get('User-Agent'),
        sessionId: (request as RequestWithUser).sessionID || 'unknown',
        metadata: {
          ...metadata,
          responseData: responseData
            ? this.sanitizeResponseData(responseData)
            : undefined,
        },
      };

      // Criar log de auditoria
      await this.auditService.createLog(auditData, user?.id, client?.id);
    } catch (error) {
      // Não deixar erros de auditoria quebrar a aplicação
      console.error('Erro ao criar log de auditoria:', error);
    }
  }

  private getActionFromMethod(method: string): AuditActionType {
    switch (method.toUpperCase()) {
      case 'POST':
        return AuditActionType.CREATE;
      case 'PUT':
      case 'PATCH':
        return AuditActionType.UPDATE;
      case 'DELETE':
        return AuditActionType.DELETE;
      case 'GET':
        return AuditActionType.VIEW;
      default:
        return AuditActionType.OTHER;
    }
  }

  private getEntityTypeFromUrl(url: string): string {
    // Padrões comuns
    if (url.includes('/transactions/')) return 'Transaction';
    if (url.includes('/appointments/')) return 'Appointment';
    if (url.includes('/clients/')) return 'Client';
    if (url.includes('/pets/')) return 'Pet';
    if (url.includes('/users/')) return 'User';
    if (url.includes('/groomers/')) return 'Groomer';
    if (url.includes('/services/')) return 'ServicePackage';
    if (url.includes('/products/')) return 'Product';
    if (url.includes('/categories/')) return 'FinancialCategory';

    return 'Unknown';
  }

  private getModuleFromUrl(url: string): string {
    if (
      url.includes('/financial/') ||
      url.includes('/transactions/') ||
      url.includes('/cash-register/')
    ) {
      return 'financial';
    }
    if (url.includes('/appointments/')) return 'appointments';
    if (url.includes('/clients/')) return 'clients';
    if (url.includes('/pets/')) return 'pets';
    if (url.includes('/users/')) return 'users';
    if (url.includes('/groomers/')) return 'groomers';
    if (url.includes('/services/')) return 'services';
    if (url.includes('/products/')) return 'products';
    if (url.includes('/notifications/')) return 'notifications';
    if (url.includes('/reports/')) return 'reports';
    if (url.includes('/audit/')) return 'audit';

    return 'system';
  }

  private extractEntityId(url: string): string | undefined {
    // Extrair ID da URL usando regex
    const matches = url.match(/\/([a-f0-9-]{36})(?:\/|$)/);
    return matches ? matches[1] : undefined;
  }

  private generateActionDescription(
    action: AuditActionType,
    entityType?: string,
    metadata?: RequestMetadata,
  ): string {
    const entity = entityType || 'recurso';
    const method = metadata?.method || 'UNKNOWN';

    switch (action) {
      case AuditActionType.CREATE:
        return `Criou novo ${entity} via ${method}`;
      case AuditActionType.UPDATE:
        return `Atualizou ${entity} via ${method}`;
      case AuditActionType.DELETE:
        return `Excluiu ${entity} via ${method}`;
      case AuditActionType.VIEW:
        return `Visualizou ${entity} via ${method}`;
      case AuditActionType.LOGIN:
        return 'Realizou login no sistema';
      case AuditActionType.LOGOUT:
        return 'Realizou logout do sistema';
      case AuditActionType.FAILED_LOGIN:
        return 'Tentativa de login falhada';
      default:
        return `${action} em ${entity} via ${method}`;
    }
  }

  private getClientIP(request: Request): string {
    return (
      request.headers['x-forwarded-for']?.toString().split(',')[0] ||
      request.headers['x-real-ip']?.toString() ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      'unknown'
    );
  }

  private sanitizeResponseData(data: unknown): SanitizedResponseData {
    if (!data || typeof data !== 'object') {
      return data;
    }

    // Remover dados sensíveis da resposta
    const sensitiveFields = ['password', 'token', 'secret', 'key'];

    if (Array.isArray(data)) {
      return data.map((item) =>
        this.sanitizeResponseData(item),
      ) as SanitizedResponseData;
    }

    const sanitized: Record<string, unknown> = { ...data } as Record<
      string,
      unknown
    >;
    for (const field of sensitiveFields) {
      if (Object.prototype.hasOwnProperty.call(sanitized, field)) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}
