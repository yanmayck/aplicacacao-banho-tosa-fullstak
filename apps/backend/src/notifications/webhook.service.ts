import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  NotificationType,
  NotificationChannel,
  NotificationStatus,
  Prisma,
} from '@prisma/client';
import {
  TwilioSMSWebhookPayload,
  TwilioWhatsAppWebhookPayload,
  SendGridEmailWebhookPayload,
  WhatsAppBusinessWebhookPayload,
  WebhookLogData,
  TestWebhookData,
} from '../types/webhook.types';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(private prisma: PrismaService) {}

  async processTwilioSMSWebhook(payload: TwilioSMSWebhookPayload) {
    try {
      this.logger.log('Processando webhook SMS do Twilio:', payload);

      // Salvar log do webhook
      await this.saveWebhookLog('twilio-sms', payload);

      const { MessageSid, MessageStatus, ErrorCode, ErrorMessage } = payload;

      // Atualizar status da mensagem na fila
      if (MessageSid) {
        await this.updateQueueItemStatus(MessageSid, MessageStatus, {
          providerResponse: payload as any,
          errorCode: ErrorCode,
          errorMessage: ErrorMessage,
        });
      }

      // Se houver erro, tentar reenviar ou notificar admin
      if (MessageStatus === 'failed' && ErrorCode) {
        await this.handleFailedSMS(MessageSid, ErrorCode, ErrorMessage || '');
      }

      return { success: true, messageId: MessageSid };
    } catch (error) {
      this.logger.error('Erro ao processar webhook SMS do Twilio:', error);
      throw error;
    }
  }

  async processTwilioWhatsAppWebhook(payload: TwilioWhatsAppWebhookPayload) {
    try {
      this.logger.log('Processando webhook WhatsApp do Twilio:', payload);

      await this.saveWebhookLog('twilio-whatsapp', payload);

      const { MessageSid, MessageStatus, ErrorCode, ErrorMessage } = payload;

      if (MessageSid) {
        await this.updateQueueItemStatus(MessageSid, MessageStatus, {
          providerResponse: payload as any,
          errorCode: ErrorCode,
          errorMessage: ErrorMessage,
        });
      }

      return { success: true, messageId: MessageSid };
    } catch (error) {
      this.logger.error('Erro ao processar webhook WhatsApp do Twilio:', error);
      throw error;
    }
  }

  async processSendGridEmailWebhook(payload: SendGridEmailWebhookPayload[]) {
    try {
      this.logger.log('Processando webhook de email do SendGrid:', payload);

      await this.saveWebhookLog('sendgrid-email', payload);

      for (const event of payload) {
        const {
          event: eventType,
          sg_message_id,
          email,
          timestamp,
          reason,
          status,
        } = event;

        // Atualizar status da mensagem na fila
        if (sg_message_id) {
          await this.updateQueueItemStatus(
            sg_message_id,
            this.mapSendGridStatus(status || ''),
            {
              providerResponse: event as any,
              email,
              timestamp: new Date(Number(timestamp) * 1000).toISOString(),
              reason,
            },
          );
        }

        // Se houver bounce ou erro, tomar ações apropriadas
        if (eventType === 'bounce' || eventType === 'deferred') {
          await this.handleFailedEmail(sg_message_id, reason || '');
        }
      }

      return { success: true, processed: payload.length };
    } catch (error) {
      this.logger.error(
        'Erro ao processar webhook de email do SendGrid:',
        error,
      );
      throw error;
    }
  }

  async processWhatsAppBusinessWebhook(
    payload: WhatsAppBusinessWebhookPayload,
  ) {
    try {
      this.logger.log('Processando webhook do WhatsApp Business:', payload);

      await this.saveWebhookLog('whatsapp-business', payload);

      if (payload.entry && payload.entry.length > 0) {
        for (const entry of payload.entry) {
          if (entry.changes && entry.changes.length > 0) {
            for (const change of entry.changes) {
              if (change.value) {
                const { messages, statuses } = change.value;

                if (messages && messages.length > 0) {
                  // Processar mensagem recebida
                  await this.processIncomingWhatsAppMessage(messages[0]);
                }

                if (statuses && statuses.length > 0) {
                  // Atualizar status da mensagem enviada
                  await this.updateQueueItemStatus(
                    statuses[0].id,
                    statuses[0].status,
                    {
                      providerResponse: change.value as any,
                    },
                  );
                }
              }
            }
          }
        }
      }

      return { success: true };
    } catch (error) {
      this.logger.error(
        'Erro ao processar webhook do WhatsApp Business:',
        error,
      );
      throw error;
    }
  }

  private async saveWebhookLog(provider: string, payload: Record<string, any>) {
    try {
      await this.prisma.notificationLog.create({
        data: {
          type: NotificationType.INFO,
          channel: this.mapProviderToChannel(provider),
          recipient: 'webhook',
          recipientType: 'webhook',
          title: `Webhook ${provider}`,
          content: JSON.stringify(payload),
          status: NotificationStatus.DELIVERED,
          webhookData: payload as any,
        },
      });
    } catch (error) {
      this.logger.error('Erro ao salvar log do webhook:', error);
    }
  }

  private async updateQueueItemStatus(
    externalId: string,
    status: string,
    additionalData?: WebhookLogData,
  ) {
    try {
      // Find NotificationLog by externalId
      const log = await this.prisma.notificationLog.findFirst({
        where: {
          providerResponse: {
            path: ['messageId'], // Assuming messageId is stored in providerResponse
            equals: externalId,
          },
        },
      });

      if (log && log.queueId) {
        const mappedStatus = this.mapExternalStatusToInternal(status);

        await this.prisma.notificationQueue.update({
          where: { id: log.queueId },
          data: {
            status: mappedStatus,
            errorMessage: additionalData?.errorMessage,
          },
        });

        this.logger.log(
          `Status da fila atualizado: ${log.queueId} -> ${mappedStatus}`,
        );
      }
    } catch (error) {
      this.logger.error('Erro ao atualizar status da fila:', error);
    }
  }

  private async handleFailedSMS(
    messageSid: string,
    errorCode: string,
    errorMessage: string,
  ) {
    this.logger.warn(
      `SMS falhou: ${messageSid} - ${errorCode}: ${errorMessage}`,
    );

    // Em uma implementação completa, você poderia:
    // 1. Tentar reenviar com outro canal
    // 2. Notificar o admin
    // 3. Atualizar preferências do usuário

    // Por exemplo, tentar reenviar por email
    // await this.attemptAlternativeDelivery(messageSid, 'email');
  }

  private async handleFailedEmail(messageId: string, reason: string) {
    this.logger.warn(`Email falhou: ${messageId} - ${reason}`);

    // Similar ao SMS, tentar canais alternativos
  }

  private async processIncomingWhatsAppMessage(message: Record<string, any>) {
    this.logger.log('Mensagem WhatsApp recebida:', message);

    // Em uma implementação completa, você poderia:
    // 1. Responder automaticamente
    // 2. Criar notificações internas
    // 3. Integrar com sistema de atendimento

    // Por exemplo, criar uma notificação para admin
    await this.prisma.notification.create({
      data: {
        title: 'Mensagem WhatsApp Recebida',
        message: `Nova mensagem de ${message.from as string}: ${(message.text?.body as string) || 'Mídia recebida'}`,
        type: NotificationType.INFO,
        data: message as any,
      },
    });
  }

  private mapProviderToChannel(provider: string): NotificationChannel {
    switch (provider) {
      case 'twilio-sms':
        return NotificationChannel.SMS;
      case 'twilio-whatsapp':
        return NotificationChannel.WHATSAPP;
      case 'sendgrid-email':
        return NotificationChannel.EMAIL;
      case 'whatsapp-business':
        return NotificationChannel.WHATSAPP;
      default:
        return NotificationChannel.IN_APP;
    }
  }

  private mapExternalStatusToInternal(
    externalStatus: string,
  ): NotificationStatus {
    switch (externalStatus.toLowerCase()) {
      case 'sent':
      case 'delivered':
        return NotificationStatus.DELIVERED;
      case 'failed':
      case 'undelivered':
      case 'bounced':
        return NotificationStatus.FAILED;
      case 'pending':
      default:
        return NotificationStatus.PENDING;
    }
  }

  private mapSendGridStatus(sendGridStatus: string): string {
    switch (sendGridStatus) {
      case 'delivered':
        return 'delivered';
      case 'bounce':
        return 'failed';
      case 'deferred':
        return 'pending';
      case 'processed':
        return 'sent';
      default:
        return 'pending';
    }
  }

  async getWebhookLogs(filters?: {
    limit?: number;
    offset?: number;
    provider?: string;
  }) {
    const where: Prisma.NotificationLogWhereInput = {};

    if (filters?.provider) {
      where.channel = this.mapProviderToChannel(filters.provider);
    }

    const limit = filters?.limit || 50;
    const offset = filters?.offset || 0;

    return this.prisma.notificationLog.findMany({
      where: {
        ...where,
        recipientType: 'webhook',
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async getWebhookStats() {
    const stats = await this.prisma.notificationLog.groupBy({
      by: ['channel'],
      where: {
        recipientType: 'webhook',
      },
      _count: {
        id: true,
      },
    });

    const total = await this.prisma.notificationLog.count({
      where: {
        recipientType: 'webhook',
      },
    });

    return {
      total,
      byProvider: stats.reduce(
        (acc, stat) => {
          acc[stat.channel] = stat._count.id;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }

  async testWebhook(provider: string, testData?: TestWebhookData) {
    this.logger.log(`Testando webhook para provider: ${provider}`);

    switch (provider) {
      case 'twilio-sms':
        return this.processTwilioSMSWebhook({
          MessageSid: 'test-sms-sid',
          MessageStatus: 'delivered',
          From: '+5511999999999',
          To: '+5511888888888',
          Body: 'Mensagem de teste',
          ...(testData as any),
        });

      case 'sendgrid-email':
        return this.processSendGridEmailWebhook([
          {
            event: 'delivered',
            sg_message_id: 'test-email-id',
            email: 'test@example.com',
            timestamp: new Date().toISOString(),
            ...(testData as any),
          },
        ]);

      case 'whatsapp-business':
        return this.processWhatsAppBusinessWebhook({
          entry: [
            {
              changes: [
                {
                  value: {
                    messages: [
                      {
                        from: '5511999999999',
                        text: { body: 'Mensagem de teste' },
                      },
                    ],
                    statuses: [
                      {
                        id: 'wamid.HBgLNTU0NzkwNzQ1MjA4FQIAERgSM0QzQTQzQTlCM0E5QzgwNkYwRA==',
                        status: 'delivered',
                        timestamp: '1603059201',
                        recipient_id: '5521969285563',
                      },
                    ],
                    ...(testData as any),
                  },
                },
              ],
            },
          ],
        } as WhatsAppBusinessWebhookPayload);

      default:
        throw new Error(`Provider não suportado: ${provider}`);
    }
  }
}
