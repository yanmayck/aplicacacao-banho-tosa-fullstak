import { Injectable, Logger } from '@nestjs/common';
import * as Twilio from 'twilio';

export interface SMSOptions {
  to: string | string[];
  body: string;
  from?: string;
  mediaUrl?: string | string[];
  statusCallback?: string;
  maxPrice?: number;
  provideFeedback?: boolean;
  validityPeriod?: number;
}

interface TwilioMessageOptions {
  to: string;
  body: string;
  from?: string;
  mediaUrl?: string | string[];
  statusCallback?: string;
  maxPrice?: number;
  provideFeedback?: boolean;
  validityPeriod?: number;
}

@Injectable()
export class SMSService {
  private readonly logger = new Logger(SMSService.name);
  private twilioClient: Twilio.Twilio | null = null;
  private readonly defaultFrom = process.env.TWILIO_PHONE_NUMBER || '';

  constructor() {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.twilioClient = new Twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN,
      );
      this.logger.log('Twilio configurado com sucesso');
    } else {
      this.logger.warn(
        'Credenciais do Twilio não configuradas - SMS serão apenas logados',
      );
    }
  }

  async sendSMS(
    options: SMSOptions,
  ): Promise<{ success: boolean; messageSid?: string; error?: string }> {
    try {
      // Se Twilio não estiver configurado, apenas logar
      if (!this.twilioClient) {
        this.logger.log(
          `[SMS SIMULADO] Para: ${options.to}, Mensagem: ${options.body}`,
        );
        return { success: true, messageSid: 'mock-sid' };
      }

      // Validar número de telefone
      const phoneNumber = this.formatPhoneNumber(options.to);
      if (!phoneNumber) {
        throw new Error(`Número de telefone inválido: ${options.to}`);
      }

      const messageOptions = {
        to: phoneNumber,
        body: options.body,
        ...(options.from && { from: options.from }),
        ...(options.mediaUrl && { mediaUrl: options.mediaUrl }),
        ...(options.statusCallback && {
          statusCallback: options.statusCallback,
        }),
        ...(options.maxPrice && { maxPrice: options.maxPrice }),
        ...(options.provideFeedback !== undefined && {
          provideFeedback: options.provideFeedback,
        }),
        ...(options.validityPeriod && {
          validityPeriod: options.validityPeriod,
        }),
      };

      const message = await this.twilioClient.messages.create(
        messageOptions as any,
      );

      this.logger.log(
        `SMS enviado com sucesso para ${phoneNumber}. SID: ${message.sid}`,
      );

      return {
        success: true,
        messageSid: message.sid,
      };
    } catch (error) {
      this.logger.error(
        `Erro ao enviar SMS para ${options.to}:`,
        error.message,
      );

      return {
        success: false,
        error: error.message,
      };
    }
  }

  async sendBulkSMS(
    messages: SMSOptions[],
  ): Promise<Array<{ success: boolean; messageSid?: string; error?: string }>> {
    const results = [];

    for (const message of messages) {
      try {
        const result = await this.sendSMS(message);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          error: error.message,
        });
      }
    }

    return results;
  }

  // Método para criar mensagens SMS profissionais e concisas
  createSMSMessage(type: string, data: Record<string, any>): string {
    switch (type) {
      case 'APPOINTMENT_CONFIRMATION':
        return `✅ Furry Friends: Agendamento confirmado para ${data.petName} em ${new Date(data.appointmentDate).toLocaleDateString('pt-BR')} às ${new Date(data.appointmentDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}. Estamos te esperando!`;

      case 'APPOINTMENT_REMINDER':
        return `⏰ Furry Friends: Lembrete! ${data.petName} tem agendamento amanhã às ${new Date(data.appointmentDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}. Não esqueça!`;

      case 'APPOINTMENT_CANCELLED':
        return `❌ Furry Friends: Agendamento de ${data.petName} foi cancelado. Entre em contato para reagendar.`;

      case 'SERVICE_STATUS_UPDATE':
        if (data.status === 'COMPLETED') {
          return `✅ Furry Friends: ${data.petName} está prontinho! Serviço concluído com sucesso. Obrigado! 🐾`;
        } else if (data.status === 'IN_PROGRESS') {
          return `🔄 Furry Friends: Serviço de ${data.petName} iniciado. Em breve estará cheiroso!`;
        }
        return `📢 Furry Friends: Atualização do serviço de ${data.petName}: ${data.status}`;

      case 'VACCINE_REMINDER':
        return `💉 Furry Friends: ${data.petName} precisa de vacina! ${data.vaccineName} está vencida. Agende já!`;

      case 'PAYMENT_REMINDER':
        return `💳 Furry Friends: Lembrete de pagamento pendente de R$ ${data.amount?.toFixed(2)}. Vencimento: ${new Date(data.dueDate).toLocaleDateString('pt-BR')}`;

      case 'LOYALTY_POINTS':
        return `⭐ Furry Friends: Parabéns! Você ganhou ${data.points} pontos de fidelidade por ${data.reason}. Continue nos visitando!`;

      case 'PROMOTION':
        return `🎁 Furry Friends: ${data.offerTitle} - ${data.offerDescription}. Válido até ${new Date(data.validUntil).toLocaleDateString('pt-BR')}. Não perca!`;

      default:
        return data.message || 'Nova notificação da Furry Friends';
    }
  }

  // Método para validar configurações do Twilio
  async validateConfiguration(): Promise<boolean> {
    try {
      if (!this.twilioClient) {
        this.logger.warn('Credenciais do Twilio não configuradas');
        return false;
      }

      // Teste simples de validação
      const account = await this.twilioClient.api
        .accounts(process.env.TWILIO_ACCOUNT_SID!)
        .fetch();

      this.logger.log(
        `Configuração Twilio válida. Account: ${account.friendlyName}`,
      );
      return true;
    } catch (error) {
      this.logger.error('Erro na validação do Twilio:', error.message);
      return false;
    }
  }

  // Método para obter estatísticas de uso
  async getUsageStats(): Promise<
    { count: number; records: unknown[] } | { error: string }
  > {
    try {
      if (!this.twilioClient) {
        return { error: 'Twilio não configurado' };
      }

      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      const usage = await this.twilioClient.usage.records.list({
        category: 'sms',
        startDate: startOfMonth,
        endDate: today,
      });

      return {
        count: usage.length,
        records: usage.map((record) => ({
          count: record.count,
          countUnit: record.countUnit,
          price: record.price,
          priceUnit: record.priceUnit,
          description: record.description,
          startDate: record.startDate,
          endDate: record.endDate,
        })),
      };
    } catch (error) {
      this.logger.error('Erro ao obter estatísticas de uso:', error.message);
      return { error: error.message };
    }
  }

  // Método utilitário para formatar números de telefone
  private formatPhoneNumber(phone: string | string[]): string | null {
    if (Array.isArray(phone)) {
      phone = phone[0];
    }

    // Remover caracteres não numéricos
    const cleaned = phone.replace(/\D/g, '');

    // Verificar se é um número brasileiro válido
    if (cleaned.length === 11 && cleaned.startsWith('55')) {
      // Já está no formato internacional
      return `+${cleaned}`;
    } else if (cleaned.length === 10 || cleaned.length === 11) {
      // Adicionar código do país
      return `+55${cleaned}`;
    }

    return null;
  }

  // Método para verificar status de uma mensagem
  async getMessageStatus(messageSid: string): Promise<
    | {
        sid: string;
        status: string;
        to: string;
        from: string;
        body: string;
        dateSent?: Date;
        dateCreated?: Date;
        errorCode?: string | number;
        errorMessage?: string;
        price?: string;
        priceUnit?: string;
      }
    | { error: string }
  > {
    try {
      if (!this.twilioClient) {
        return { error: 'Twilio não configurado' };
      }

      const message = await this.twilioClient.messages(messageSid).fetch();

      return {
        sid: message.sid,
        status: message.status,
        to: message.to,
        from: message.from,
        body: message.body,
        dateSent: message.dateSent,
        dateCreated: message.dateCreated,
        errorCode: message.errorCode,
        errorMessage: message.errorMessage,
        price: message.price,
        priceUnit: message.priceUnit,
      };
    } catch (error) {
      this.logger.error(
        `Erro ao obter status da mensagem ${messageSid}:`,
        error.message,
      );
      return { error: error.message };
    }
  }
}
