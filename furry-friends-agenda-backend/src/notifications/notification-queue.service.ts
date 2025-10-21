import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationQueueDto } from './dto/create-notification-queue.dto';
import {
  NotificationType,
  NotificationChannel,
  NotificationStatus,
} from '@prisma/client';

@Injectable()
export class NotificationQueueService {
  private readonly logger = new Logger(NotificationQueueService.name);

  constructor(private prisma: PrismaService) {}

  async create(createQueueDto: CreateNotificationQueueDto) {
    const scheduledFor = createQueueDto.scheduledFor
      ? new Date(createQueueDto.scheduledFor)
      : new Date();

    return this.prisma.notificationQueue.create({
      data: {
        type: createQueueDto.type,
        channel: createQueueDto.channel,
        recipient: createQueueDto.recipient,
        recipientType: createQueueDto.recipientType,
        title: createQueueDto.title || '',
        content: createQueueDto.content,
        templateId: createQueueDto.templateId,
        data: createQueueDto.data,
        clientId: createQueueDto.clientId,
        groomerId: createQueueDto.groomerId,
        appointmentId: createQueueDto.appointmentId,
        status: createQueueDto.status || NotificationStatus.PENDING,
        scheduledFor,
        // metadata: createQueueDto.metadata,
      },
    });
  }

  async findAll(filters?: {
    status?: NotificationStatus;
    channel?: NotificationChannel;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.channel) {
      where.channel = filters.channel;
    }

    const limit = filters?.limit || 50;
    const offset = filters?.offset || 0;

    return this.prisma.notificationQueue.findMany({
      where,
      include: {
        client: true,
        groomer: true,
        appointment: true,
        template: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: string) {
    return this.prisma.notificationQueue.findUnique({
      where: { id },
      include: {
        client: true,
        groomer: true,
        appointment: true,
        template: true,
        logs: true,
      },
    });
  }

  async updateStatus(
    id: string,
    status: NotificationStatus,
    errorMessage?: string,
  ) {
    return this.prisma.notificationQueue.update({
      where: { id },
      data: {
        status,
        ...(status === NotificationStatus.SENT && { sentAt: new Date() }),
        ...(errorMessage && { errorMessage }),
        attempts: {
          increment: 1,
        },
      },
    });
  }

  async markAsFailed(id: string, errorMessage: string) {
    const queueItem = await this.prisma.notificationQueue.findUnique({
      where: { id },
    });

    if (!queueItem) {
      throw new Error('Item da fila não encontrado');
    }

    const newAttempts = queueItem.attempts + 1;

    if (newAttempts >= queueItem.maxAttempts) {
      // Marcar como falhado permanentemente
      return this.prisma.notificationQueue.update({
        where: { id },
        data: {
          status: NotificationStatus.FAILED,
          errorMessage,
          attempts: newAttempts,
        },
      });
    } else {
      // Incrementar tentativas e manter como pending
      return this.prisma.notificationQueue.update({
        where: { id },
        data: {
          status: NotificationStatus.PENDING,
          errorMessage,
          attempts: newAttempts,
        },
      });
    }
  }

  async getPendingNotifications() {
    const now = new Date();

    return this.prisma.notificationQueue.findMany({
      where: {
        status: NotificationStatus.PENDING,
        scheduledFor: {
          lte: now,
        },
        attempts: {
          lt: 3, // Máximo de 3 tentativas
        },
      },
      include: {
        client: true,
        groomer: true,
        appointment: true,
        template: true,
      },
      orderBy: [{ scheduledFor: 'asc' }, { createdAt: 'asc' }],
      take: 100, // Processar em lotes de 100
    });
  }

  async processNotificationQueue() {
    this.logger.log('Iniciando processamento da fila de notificações...');

    try {
      const pendingNotifications = await this.getPendingNotifications();

      this.logger.log(
        `Encontradas ${pendingNotifications.length} notificações pendentes`,
      );

      for (const notification of pendingNotifications) {
        try {
          await this.processSingleNotification(notification);
        } catch (error) {
          this.logger.error(
            `Erro ao processar notificação ${notification.id}:`,
            error.message,
          );

          await this.markAsFailed(
            notification.id,
            `Erro no processamento: ${error.message}`,
          );
        }
      }

      this.logger.log('Processamento da fila concluído');
    } catch (error) {
      this.logger.error('Erro geral no processamento da fila:', error.message);
    }
  }

  private async processSingleNotification(notification: any) {
    this.logger.log(
      `Processando notificação ${notification.id} via ${notification.channel}`,
    );

    // Atualizar status para SENT
    await this.updateStatus(notification.id, NotificationStatus.SENT);

    // Criar log da notificação
    await this.prisma.notificationLog.create({
      data: {
        type: notification.type,
        channel: notification.channel,
        recipient: notification.recipient,
        recipientType: notification.recipientType,
        title: notification.title,
        content: notification.content,
        templateId: notification.templateId,
        clientId: notification.clientId,
        groomerId: notification.groomerId,
        appointmentId: notification.appointmentId,
        queueId: notification.id,
        status: NotificationStatus.SENT,
        providerResponse: { processed: true },
      },
    });

    // Processar baseado no canal
    switch (notification.channel) {
      case NotificationChannel.EMAIL:
        await this.sendEmail(notification);
        break;
      case NotificationChannel.SMS:
        await this.sendSMS(notification);
        break;
      case NotificationChannel.WHATSAPP:
        await this.sendWhatsApp(notification);
        break;
      case NotificationChannel.PUSH:
        await this.sendPushNotification(notification);
        break;
      case NotificationChannel.IN_APP:
        await this.createInAppNotification(notification);
        break;
      default:
        throw new Error(`Canal não suportado: ${notification.channel}`);
    }

    // Marcar como DELIVERED se chegou até aqui
    await this.updateStatus(notification.id, NotificationStatus.DELIVERED);

    this.logger.log(`Notificação ${notification.id} processada com sucesso`);
  }

  private async sendEmail(notification: any) {
    // Implementação específica para envio de email
    this.logger.log(
      `Enviando email para ${notification.recipient}: ${notification.title}`,
    );

    // Aqui você integraria com SendGrid, SES, etc.
    // Exemplo:
    // await this.emailService.send({
    //   to: notification.recipient,
    //   subject: notification.title,
    //   html: notification.content,
    // });
  }

  private async sendSMS(notification: any) {
    // Implementação específica para envio de SMS
    this.logger.log(`Enviando SMS para ${notification.recipient}`);

    // Aqui você integraria com Twilio, etc.
    // Exemplo:
    // await this.smsService.send({
    //   to: notification.recipient,
    //   message: notification.content,
    // });
  }

  private async sendWhatsApp(notification: any) {
    // Implementação específica para WhatsApp
    this.logger.log(`Enviando WhatsApp para ${notification.recipient}`);

    // Aqui você integraria com WhatsApp Business API
    // Exemplo:
    // await this.whatsappService.send({
    //   to: notification.recipient,
    //   message: notification.content,
    // });
  }

  private async sendPushNotification(notification: any) {
    // Implementação específica para push notifications
    this.logger.log(
      `Enviando push notification para ${notification.recipient}`,
    );

    // Aqui você integraria com Firebase Cloud Messaging, etc.
    // Exemplo:
    // await this.pushService.send({
    //   to: notification.recipient,
    //   title: notification.title,
    //   body: notification.content,
    // });
  }

  private async createInAppNotification(notification: any) {
    // Criar notificação in-app
    this.logger.log(
      `Criando notificação in-app para usuário ${notification.recipient}`,
    );

    await this.prisma.notification.create({
      data: {
        title: notification.title,
        message: notification.content,
        type: notification.type,
        clientId: notification.clientId,
        groomerId: notification.groomerId,
        appointmentId: notification.appointmentId,
        templateId: notification.templateId,
        data: notification.data,
        isRead: false,
      },
    });
  }

  // Método para adicionar notificações à fila baseado em eventos
  async queueNotificationFromTemplate(
    templateName: string,
    recipient: string,
    recipientType: 'email' | 'phone' | 'user_id',
    variables?: Record<string, any>,
    options?: {
      clientId?: string;
      groomerId?: string;
      appointmentId?: string;
      scheduledFor?: Date;
      channel?: NotificationChannel;
    },
  ) {
    const template = await this.prisma.notificationTemplate.findUnique({
      where: { name: templateName },
    });

    if (!template) {
      throw new Error(`Template ${templateName} não encontrado`);
    }

    // Processar template com variáveis
    let title = template.title;
    let content = template.content;

    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        title = title.replace(regex, String(value));
        content = content.replace(regex, String(value));
      });
    }

    return this.create({
      type: template.type,
      channel: options?.channel || template.channel,
      recipient,
      recipientType,
      title,
      content,
      templateId: template.id,
      data: variables,
      clientId: options?.clientId,
      groomerId: options?.groomerId,
      appointmentId: options?.appointmentId,
      scheduledFor: options?.scheduledFor?.toISOString(),
    });
  }

  // Método para limpeza de logs antigos
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupOldLogs() {
    this.logger.log('Executando limpeza de logs antigos...');

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Remover logs de sucesso com mais de 30 dias
    const deletedLogs = await this.prisma.notificationLog.deleteMany({
      where: {
        status: NotificationStatus.DELIVERED,
        createdAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    // Remover itens da fila com falha permanente com mais de 7 dias
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const deletedQueueItems = await this.prisma.notificationQueue.deleteMany({
      where: {
        status: NotificationStatus.FAILED,
        createdAt: {
          lt: sevenDaysAgo,
        },
      },
    });

    this.logger.log(
      `Limpeza concluída: ${deletedLogs.count} logs e ${deletedQueueItems.count} itens da fila removidos`,
    );
  }

  // Método para obter estatísticas da fila
  async getQueueStats() {
    const stats = await this.prisma.notificationQueue.groupBy({
      by: ['status', 'channel'],
      _count: {
        id: true,
      },
    });

    const total = await this.prisma.notificationQueue.count();

    return {
      total,
      byStatus: stats.reduce(
        (acc, stat) => {
          acc[stat.status] = (acc[stat.status] || 0) + stat._count.id;
          return acc;
        },
        {} as Record<string, number>,
      ),
      byChannel: stats.reduce(
        (acc, stat) => {
          acc[stat.channel] = (acc[stat.channel] || 0) + stat._count.id;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }
}
