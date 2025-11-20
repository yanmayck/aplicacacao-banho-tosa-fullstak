import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AuditLog,
  AuditSeverity,
  Prisma,
  AuditConfig,
  AuditFilter,
  AuditAlert,
} from '@prisma/client';
import {
  CreateAuditLogDto,
  AuditLogFiltersDto,
  AuditLogQueryDto,
} from './dto/audit-log.dto';
import {
  AuditStatistics,
  AuditReport,
  AuditConfigData,
  AuditFilterData,
  AuditAlertData,
} from '../types/audit.types';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) { }

  // ========== GESTÃO DE LOGS DE AUDITORIA ==========

  async createLog(
    createLogDto: CreateAuditLogDto,
    userId?: string,
    clientId?: string,
  ): Promise<AuditLog> {
    const startTime = Date.now();

    try {
      const log = await this.prisma.auditLog.create({
        data: {
          ...createLogDto,
          userId,
          clientId,
          executionTime: Date.now() - startTime,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          client: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Verificar se há alertas que devem ser acionados
      await this.checkAuditAlerts(log);

      return log;
    } catch (error) {
      console.error('Erro ao criar log de auditoria:', error);
      throw new BadRequestException(
        'Não foi possível criar o log de auditoria',
      );
    }
  }

  async findLogs(query: AuditLogQueryDto): Promise<{
    logs: AuditLog[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 50,
      sortBy = 'timestamp',
      sortOrder = 'desc',
      ...filters
    } = query;

    const skip = (page - 1) * limit;

    // Construir filtros WHERE
    const where = this.buildWhereClause(filters);

    // Buscar logs com paginação
    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          client: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      logs,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findLogById(id: string): Promise<AuditLog> {
    const log = await this.prisma.auditLog.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        parentRelations: {
          include: {
            relatedLog: {
              select: {
                id: true,
                action: true,
                actionDescription: true,
                timestamp: true,
              },
            },
          },
        },
        relatedRelations: {
          include: {
            parentLog: {
              select: {
                id: true,
                action: true,
                actionDescription: true,
                timestamp: true,
              },
            },
          },
        },
        alertTriggers: {
          include: {
            alert: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!log) {
      throw new NotFoundException(
        `Log de auditoria com ID "${id}" não encontrado`,
      );
    }

    return log;
  }

  async getLogsByEntity(
    entityType: string,
    entityId: string,
  ): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({
      where: {
        entityType,
        entityId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
  }

  async getLogsByUser(userId: string): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({
      where: {
        userId,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
  }

  async getLogsByModule(
    module: string,
    filters?: AuditLogFiltersDto,
  ): Promise<AuditLog[]> {
    const where = this.buildWhereClause({ ...filters, module });

    return this.prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
  }

  // ========== ESTATÍSTICAS E RELATÓRIOS ==========

  async getAuditStatistics(
    filters: AuditLogFiltersDto,
  ): Promise<AuditStatistics | null> {
    const where = this.buildWhereClause(filters);

    const [
      totalLogs,
      logsByAction,
      logsBySeverity,
      logsByModule,
      recentActivity,
      failedOperations,
    ] = await Promise.all([
      // Total de logs
      this.prisma.auditLog.count({ where }),

      // Logs por ação
      this.prisma.auditLog.groupBy({
        by: ['action'],
        where,
        _count: {
          id: true,
        },
      }),

      // Logs por severidade
      this.prisma.auditLog.groupBy({
        by: ['severity'],
        where,
        _count: {
          id: true,
        },
      }),

      // Logs por módulo
      this.prisma.auditLog.groupBy({
        by: ['module'],
        where,
        _count: {
          id: true,
        },
      }),

      // Atividade recente (últimas 24h)
      this.prisma.auditLog.count({
        where: {
          ...where,
          timestamp: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),

      // Operações falharam
      this.prisma.auditLog.count({
        where: {
          ...where,
          success: false,
        },
      }),
    ]);

    return {
      totalLogs,
      logsByAction: logsByAction.map((item) => ({
        action: item.action,
        count: item._count.id,
      })),
      logsBySeverity: logsBySeverity.map((item) => ({
        severity: item.severity,
        count: item._count.id,
      })),
      logsByModule: logsByModule
        .filter((item) => item.module) // Filtrar valores nulos
        .map((item) => ({
          module: item.module!,
          count: item._count.id,
        })),
      recentActivity,
      failedOperations,
    };
  }

  async generateAuditReport(filters: AuditLogFiltersDto): Promise<AuditReport> {
    const where = this.buildWhereClause(filters || {});

    const logs = await this.prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    // Gerar estatísticas do relatório
    const statistics = await this.getAuditStatistics(filters);

    // Agrupar por período (se necessário)
    const logsByDate = logs.reduce(
      (acc, log) => {
        const date = log.timestamp.toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(log);
        return acc;
      },
      {} as Record<string, AuditLog[]>,
    );

    return {
      filters,
      generatedAt: new Date(),
      statistics,
      logsByDate,
      totalLogs: logs.length,
      logs,
    };
  }

  // ========== GESTÃO DE CONFIGURAÇÕES ==========

  async getAuditConfig(): Promise<AuditConfig | null> {
    const config = await this.prisma.auditConfig.findFirst();
    if (config) {
      return config;
    }
    return this.createDefaultAuditConfig();
  }

  async updateAuditConfig(configData: AuditConfigData): Promise<AuditConfig> {
    const existingConfig = await this.prisma.auditConfig.findFirst();

    if (existingConfig) {
      return this.prisma.auditConfig.update({
        where: { id: existingConfig.id },
        data: configData,
      });
    } else {
      return this.prisma.auditConfig.create({
        data: {
          ...configData,
          enabled: true,
          logLevel: AuditSeverity.MEDIUM,
        },
      });
    }
  }

  // ========== GESTÃO DE FILTROS SALVOS ==========

  async saveFilter(
    name: string,
    description: string,
    filters: AuditFilterData['filters'],
    userId: string,
  ): Promise<AuditFilter> {
    return this.prisma.auditFilter.create({
      data: {
        name,
        description,
        filters: filters as Prisma.InputJsonValue,
        userId,
      },
    });
  }

  async getSavedFilters(userId?: string): Promise<AuditFilter[]> {
    const where: Prisma.AuditFilterWhereInput = {};

    if (userId) {
      where.OR = [{ userId }, { isPublic: true }];
    } else {
      where.isPublic = true;
    }

    return this.prisma.auditFilter.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async deleteSavedFilter(id: string, userId: string): Promise<AuditFilter> {
    const filter = await this.prisma.auditFilter.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!filter) {
      throw new NotFoundException('Filtro salvo não encontrado');
    }

    return this.prisma.auditFilter.delete({
      where: { id },
    });
  }

  // ========== GESTÃO DE ALERTAS ==========

  async createAlert(
    alertData: AuditAlertData,
    userId: string,
  ): Promise<AuditAlert> {
    return this.prisma.auditAlert.create({
      data: {
        ...alertData,
        notificationChannels: (alertData.notificationChannels ||
          []) as Prisma.JsonArray,
        notifyUsers: (alertData.notifyUsers || []) as Prisma.JsonArray,
        createdBy: userId,
      },
    });
  }

  async getAlerts(userId?: string): Promise<AuditAlert[]> {
    const where: Prisma.AuditAlertWhereInput = {};

    if (userId) {
      where.OR = [
        { createdBy: userId },
        { notifyUsers: { path: [''], array_contains: [userId] } },
      ];
    }

    return this.prisma.auditAlert.findMany({
      where,
      include: {
        _count: {
          select: {
            triggeredLogs: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateAlert(
    id: string,
    alertData: Partial<AuditAlertData>,
    userId: string,
  ): Promise<AuditAlert> {
    const alert = await this.prisma.auditAlert.findFirst({
      where: {
        id,
        createdBy: userId,
      },
    });

    if (!alert) {
      throw new NotFoundException('Alerta não encontrado');
    }

    return this.prisma.auditAlert.update({
      where: { id },
      data: {
        ...alertData,
        notificationChannels: (alertData.notificationChannels ||
          []) as Prisma.JsonArray,
        notifyUsers: (alertData.notifyUsers || []) as Prisma.JsonArray,
      },
    });
  }

  async deleteAlert(id: string, userId: string): Promise<AuditAlert> {
    const alert = await this.prisma.auditAlert.findFirst({
      where: {
        id,
        createdBy: userId,
      },
    });

    if (!alert) {
      throw new NotFoundException('Alerta não encontrado');
    }

    return this.prisma.auditAlert.delete({
      where: { id },
    });
  }

  // ========== MÉTODOS AUXILIARES ==========

  private buildWhereClause(
    filters: AuditLogFiltersDto,
  ): Prisma.AuditLogWhereInput {
    const where: Prisma.AuditLogWhereInput = {};

    if (filters.startDate || filters.endDate) {
      where.timestamp = {};
      if (filters.startDate) {
        (where.timestamp as Prisma.DateTimeFilter).gte = new Date(
          filters.startDate,
        );
      }
      if (filters.endDate) {
        (where.timestamp as Prisma.DateTimeFilter).lte = new Date(
          filters.endDate,
        );
      }
    }

    if (filters.action) {
      where.action = filters.action;
    }

    if (filters.severity) {
      where.severity = filters.severity;
    }

    if (filters.module) {
      where.module = filters.module;
    }

    if (filters.entityType) {
      where.entityType = filters.entityType;
    }

    if (filters.entityId) {
      where.entityId = filters.entityId;
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.clientId) {
      where.clientId = filters.clientId;
    }

    if (filters.success !== undefined) {
      where.success = filters.success;
    }

    if (filters.search) {
      where.OR = [
        {
          actionDescription: { contains: filters.search, mode: 'insensitive' },
        },
        {
          metadata: { path: ['description'], string_contains: filters.search },
        },
        { errorMessage: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  private async createDefaultAuditConfig(): Promise<AuditConfig> {
    return this.prisma.auditConfig.create({
      data: {
        enabled: true,
        logLevel: AuditSeverity.MEDIUM,
        retentionDays: 90,
        archiveAfterDays: 365,
        auditModules: {
          financial: true,
          appointments: true,
          users: true,
          clients: true,
          pets: true,
          services: true,
        },
        auditActions: {
          CREATE: true,
          UPDATE: true,
          DELETE: true,
          LOGIN: true,
          LOGOUT: true,
          FAILED_LOGIN: true,
        },
      },
    });
  }

  private async checkAuditAlerts(log: AuditLog): Promise<void> {
    try {
      const alerts = await this.prisma.auditAlert.findMany({
        where: {
          isActive: true,
        },
      });

      for (const alert of alerts) {
        const conditions = alert.conditions as AuditAlertData['conditions'];

        // Verificar se o log atende às condições do alerta
        let shouldTrigger = true;

        if (conditions.action && log.action !== conditions.action) {
          shouldTrigger = false;
        }

        if (conditions.module && log.module !== conditions.module) {
          shouldTrigger = false;
        }

        if (conditions.severity && log.severity !== conditions.severity) {
          shouldTrigger = false;
        }

        if (conditions.entityType && log.entityType !== conditions.entityType) {
          shouldTrigger = false;
        }

        if (
          conditions.success !== undefined &&
          log.success !== conditions.success
        ) {
          shouldTrigger = false;
        }

        if (shouldTrigger) {
          // Criar trigger do alerta
          await this.prisma.auditAlertTrigger.create({
            data: {
              alertId: alert.id,
              auditLogId: log.id,
              triggerData: {
                matchedConditions: conditions,
                logData: {
                  action: log.action,
                  module: log.module,
                  severity: log.severity,
                },
              },
            },
          });

          // TODO: Implementar envio de notificações baseado no alert.notificationChannels
        }
      }
    } catch (error) {
      console.error('Erro ao verificar alertas de auditoria:', error);
    }
  }

  // ========== LIMPEZA E MANUTENÇÃO ==========

  async archiveOldLogs(): Promise<number> {
    const config = await this.getAuditConfig();
    if (!config) return 0;
    const archiveAfterDays = config.archiveAfterDays || 365;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - archiveAfterDays);

    const result = await this.prisma.auditLog.updateMany({
      where: {
        timestamp: {
          lt: cutoffDate,
        },
        isArchived: false,
      },
      data: {
        isArchived: true,
        archivedAt: new Date(),
      },
    });

    return result.count;
  }

  async deleteOldLogs(): Promise<number> {
    const config = await this.getAuditConfig();
    if (!config) return 0;
    const retentionDays = config.retentionDays || 90;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const result = await this.prisma.auditLog.deleteMany({
      where: {
        timestamp: {
          lt: cutoffDate,
        },
        isArchived: true,
      },
    });

    return result.count;
  }
}
