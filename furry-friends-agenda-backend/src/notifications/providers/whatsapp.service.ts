import { Injectable, Logger } from '@nestjs/common';

export interface WhatsAppOptions {
  to: string | string[];
  message: string;
  templateName?: string;
  templateVariables?: Record<string, any>;
  mediaUrl?: string;
  replyTo?: string;
  previewUrl?: boolean;
}

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private readonly baseUrl = 'https://graph.facebook.com/v17.0';

  constructor() {
    if (
      process.env.WHATSAPP_ACCESS_TOKEN &&
      process.env.WHATSAPP_PHONE_NUMBER_ID
    ) {
      this.logger.log('WhatsApp Business API configurado com sucesso');
    } else {
      this.logger.warn(
        'Credenciais do WhatsApp não configuradas - mensagens serão apenas logadas',
      );
    }
  }

  async sendWhatsAppMessage(
    options: WhatsAppOptions,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Se WhatsApp não estiver configurado, apenas logar
      if (
        !process.env.WHATSAPP_ACCESS_TOKEN ||
        !process.env.WHATSAPP_PHONE_NUMBER_ID
      ) {
        this.logger.log(
          `[WHATSAPP SIMULADO] Para: ${options.to}, Mensagem: ${options.message}`,
        );
        return { success: true, messageId: 'mock-whatsapp-id' };
      }

      const phoneNumber = this.formatWhatsAppNumber(options.to);
      if (!phoneNumber) {
        throw new Error(`Número do WhatsApp inválido: ${options.to}`);
      }

      let requestBody: any;

      if (options.templateName) {
        // Usar template aprovado
        requestBody = {
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'template',
          template: {
            name: options.templateName,
            language: {
              code: 'pt_BR',
            },
            ...(options.templateVariables && {
              components: this.buildTemplateComponents(
                options.templateVariables,
              ),
            }),
          },
        };
      } else {
        // Mensagem de texto simples
        requestBody = {
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'text',
          text: {
            body: options.message,
            ...(options.previewUrl && { preview_url: true }),
          },
        };
      }

      const response = await fetch(
        `${this.baseUrl}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Erro na API do WhatsApp: ${errorData.error?.message || response.statusText}`,
        );
      }

      const data = await response.json();

      this.logger.log(
        `Mensagem WhatsApp enviada com sucesso para ${phoneNumber}. ID: ${data.messages?.[0]?.id}`,
      );

      return {
        success: true,
        messageId: data.messages?.[0]?.id,
      };
    } catch (error) {
      this.logger.error(
        `Erro ao enviar WhatsApp para ${options.to}:`,
        error.message,
      );

      return {
        success: false,
        error: error.message,
      };
    }
  }

  async sendBulkWhatsAppMessages(
    messages: WhatsAppOptions[],
  ): Promise<Array<{ success: boolean; messageId?: string; error?: string }>> {
    const results = [];

    for (const message of messages) {
      try {
        const result = await this.sendWhatsAppMessage(message);
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

  // Método para criar mensagens WhatsApp profissionais
  createWhatsAppMessage(type: string, data: Record<string, any>): string {
    switch (type) {
      case 'APPOINTMENT_CONFIRMATION':
        return `✅ *Furry Friends* - Agendamento Confirmado!

Olá ${data.clientName}! Seu agendamento foi confirmado com sucesso.

🐕 *Pet:* ${data.petName}
📅 *Data:* ${new Date(data.appointmentDate).toLocaleDateString('pt-BR')}
⏰ *Horário:* ${new Date(data.appointmentDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
${data.groomerName ? `👨‍💼 *Tosador:* ${data.groomerName}` : ''}

Estamos ansiosos para receber você e seu pet! 🐾

Caso precise reagendar, entre em contato conosco.`;

      case 'APPOINTMENT_REMINDER':
        return `⏰ *Furry Friends* - Lembrete de Agendamento

Olá ${data.clientName}! Não esqueça do agendamento de ${data.petName} amanhã!

📅 *Amanhã,* ${new Date(data.appointmentDate).toLocaleDateString('pt-BR')}
⏰ *Horário:* ${new Date(data.appointmentDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}

⚠️ *Lembrete:* Traga seu pet com ${data.hoursUntil || 8} horas de jejum.

Estamos te esperando! 🐕`;

      case 'SERVICE_STATUS_UPDATE':
        if (data.status === 'COMPLETED') {
          return `✅ *Furry Friends* - Serviço Concluído!

Olá ${data.clientName}! O serviço de ${data.petName} foi concluído com sucesso!

🐕 Seu pet está cheiroso e pronto para ir para casa!
💝 Obrigado pela preferência!

Agende já o próximo banho e tosa! 🛁`;
        } else if (data.status === 'IN_PROGRESS') {
          return `🔄 *Furry Friends* - Serviço Iniciado

Olá ${data.clientName}! O serviço de ${data.petName} foi iniciado.

🐕 Em breve estará prontinho e cheiroso!
⏱️ Tempo estimado: ${data.estimatedTime || 'em breve'}

Agradecemos a paciência! 🐾`;
        }
        return `📢 *Furry Friends* - Atualização

Olá ${data.clientName}! Há uma atualização no serviço de ${data.petName}:

🔄 *Status:* ${data.status}

Agradecemos a preferência!`;

      case 'VACCINE_REMINDER':
        return `💉 *Furry Friends* - Lembrete de Vacina

Olá ${data.clientName}! É hora de cuidar da saúde de ${data.petName}.

⚠️ *Vacina necessária:* ${data.vaccineName}
📅 *Status:* ${data.vaccineDate ? 'Vencida' : 'Próxima do vencimento'}

Entre em contato conosco para agendar a vacinação! 🩺

🐾 Mantenha seu pet sempre protegido!`;

      case 'LOYALTY_POINTS':
        return `⭐ *Furry Friends* - Parabéns!

Olá ${data.clientName}! Você ganhou *${data.points} pontos* de fidelidade!

🎉 *Motivo:* ${data.reason}

Continue nos visitando para acumular mais pontos e ganhar descontos especiais! 🏆

🐕 Seu pet agradece!`;

      case 'PROMOTION':
        return `🎁 *Furry Friends* - Oferta Especial!

Olá ${data.clientName}!

${data.offerTitle}
${data.offerDescription}

⏰ *Válido até:* ${new Date(data.validUntil).toLocaleDateString('pt-BR')}

Não perca esta oportunidade! 🐾

Entre em contato conosco para aproveitar!`;

      default:
        return `📢 *Furry Friends*

Olá ${data.clientName}! ${data.message || 'Você recebeu uma nova notificação.'}

Agradecemos a preferência! 🐕`;
    }
  }

  // Método para validar configurações do WhatsApp
  async validateConfiguration(): Promise<boolean> {
    try {
      if (
        !process.env.WHATSAPP_ACCESS_TOKEN ||
        !process.env.WHATSAPP_PHONE_NUMBER_ID
      ) {
        this.logger.warn('Credenciais do WhatsApp não configuradas');
        return false;
      }

      // Verificar se o token é válido
      const response = await fetch(
        `${this.baseUrl}/${process.env.WHATSAPP_PHONE_NUMBER_ID}?fields=id,name`,
        {
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          `Erro na validação do WhatsApp: ${response.statusText}`,
        );
      }

      const data = await response.json();
      this.logger.log(
        `Configuração WhatsApp válida. Phone Number ID: ${data.id}, Name: ${data.name}`,
      );

      return true;
    } catch (error) {
      this.logger.error('Erro na validação do WhatsApp:', error.message);
      return false;
    }
  }

  // Método para obter estatísticas de mensagens
  async getMessageStats(): Promise<
    { total: number; messages: unknown[] } | { error: string }
  > {
    try {
      if (
        !process.env.WHATSAPP_ACCESS_TOKEN ||
        !process.env.WHATSAPP_PHONE_NUMBER_ID
      ) {
        return { error: 'WhatsApp não configurado' };
      }

      // Buscar mensagens recentes (últimas 24h)
      const response = await fetch(
        `${this.baseUrl}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages?fields=id,from,to,timestamp,status,type&date_after=${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Erro ao obter estatísticas: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        total: data.data?.length || 0,
        messages:
          data.data?.map((msg: any) => ({
            id: msg.id,
            from: msg.from,
            to: msg.to,
            timestamp: msg.timestamp,
            status: msg.status,
            type: msg.type,
          })) || [],
      };
    } catch (error) {
      this.logger.error(
        'Erro ao obter estatísticas do WhatsApp:',
        error.message,
      );
      return { error: error.message };
    }
  }

  // Método utilitário para formatar números do WhatsApp
  private formatWhatsAppNumber(phone: string | string[]): string | null {
    if (Array.isArray(phone)) {
      phone = phone[0];
    }

    // Remover caracteres não numéricos
    const cleaned = phone.replace(/\D/g, '');

    // Para WhatsApp, precisamos do formato internacional sem o símbolo +
    if (cleaned.length === 13 && cleaned.startsWith('55')) {
      // Já está no formato correto (55 + DDD + número)
      return cleaned;
    } else if (cleaned.length === 11 && cleaned.startsWith('55')) {
      // Número brasileiro com 55
      return cleaned;
    } else if (cleaned.length === 10 || cleaned.length === 11) {
      // Adicionar código do país (55 para Brasil)
      return `55${cleaned}`;
    }

    return null;
  }

  // Método para construir componentes de template
  private buildTemplateComponents(variables: Record<string, any>): Array<any> {
    const components: any[] = [];

    // Adicionar parâmetros do template
    if (Object.keys(variables).length > 0) {
      components.push({
        type: 'body',
        sub_type: 'text',
        index: '0',
        parameters: Object.entries(variables).map(([key, value]) => ({
          type: 'text',
          text: String(value),
        })),
      });
    }

    return components;
  }

  // Método para verificar status de uma mensagem
  async getMessageStatus(messageId: string): Promise<
    | {
        id?: string;
        status?: string;
        timestamp?: string;
        recipient_id?: string;
        conversation?: unknown;
        pricing?: unknown;
        errors?: unknown[];
      }
    | { error: string }
  > {
    try {
      if (
        !process.env.WHATSAPP_ACCESS_TOKEN ||
        !process.env.WHATSAPP_PHONE_NUMBER_ID
      ) {
        return { error: 'WhatsApp não configurado' };
      }

      const response = await fetch(`${this.baseUrl}/${messageId}`, {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao obter status: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        id: data.id,
        status: data.status,
        timestamp: data.timestamp,
        recipient_id: data.recipient_id,
        conversation: data.conversation,
        pricing: data.pricing,
        errors: data.errors,
      };
    } catch (error) {
      this.logger.error(
        `Erro ao obter status da mensagem ${messageId}:`,
        error.message,
      );
      return { error: error.message };
    }
  }
}
