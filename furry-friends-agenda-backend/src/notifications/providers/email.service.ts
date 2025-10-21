import { Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/mail';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    content: string;
    filename: string;
    type?: string;
    disposition?: string;
  }>;
  templateId?: string;
  dynamicTemplateData?: Record<string, any>;
  categories?: string[];
  customArgs?: Record<string, any>;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly defaultFrom =
    process.env.FROM_EMAIL || 'noreply@furryfriends.com';

  constructor() {
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      this.logger.log('SendGrid configurado com sucesso');
    } else {
      this.logger.warn(
        'SENDGRID_API_KEY não configurada - emails serão apenas logados',
      );
    }
  }

  async sendEmail(
    options: EmailOptions,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Se SendGrid não estiver configurado, apenas logar
      if (!process.env.SENDGRID_API_KEY) {
        this.logger.log(
          `[EMAIL SIMULADO] Para: ${options.to.toString()}, Assunto: ${options.subject}`,
        );
        this.logger.log(
          `[EMAIL SIMULADO] HTML: ${options.html.substring(0, 200)}...`,
        );
        return { success: true, messageId: 'mock-id' };
      }

      const msg: MailDataRequired = {
        to: options.to,
        from: options.from || this.defaultFrom,
        subject: options.subject,
        html: options.html,
        text: options.text,
        cc: options.cc,
        bcc: options.bcc,
        attachments: options.attachments,
        templateId: options.templateId,
        dynamicTemplateData: options.dynamicTemplateData,
        categories: options.categories,
        customArgs: options.customArgs,
      };

      const response = await sgMail.send(msg as any);

      this.logger.log(
        `Email enviado com sucesso para ${options.to.toString()}. MessageId: ${response[0]?.headers?.['x-message-id']}`,
      );

      return {
        success: true,
        messageId: response[0]?.headers?.['x-message-id'],
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Erro ao enviar email para ${options.to.toString()}:`,
        err.message,
      );

      return {
        success: false,
        error: err.message,
      };
    }
  }

  async sendBulkEmails(
    emails: EmailOptions[],
  ): Promise<Array<{ success: boolean; messageId?: string; error?: string }>> {
    const results: { success: boolean; messageId?: string; error?: string }[] =
      [];

    for (const email of emails) {
      try {
        const result = await this.sendEmail(email);
        results.push(result);
      } catch (error) {
        const err = error as Error;
        results.push({
          success: false,
          error: err.message,
        });
      }
    }

    return results;
  }

  // Método para criar templates de email profissionais
  createProfessionalEmailTemplate(
    title: string,
    content: string,
    clientName?: string,
    petName?: string,
    actionButton?: {
      text: string;
      url: string;
    },
  ): string {
    const currentYear = new Date().getFullYear();

    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            background-color: #f8f9fa;
          }
          .container {
            background-color: #ffffff;
            margin: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 300;
          }
          .content {
            padding: 30px;
          }
          .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #667eea;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 25px;
            font-weight: 500;
            margin: 20px 0;
            transition: transform 0.2s;
          }
          .button:hover {
            transform: translateY(-2px);
          }
          .footer {
            background-color: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #e9ecef;
          }
          .pet-friendly-tip {
            background-color: #e8f4f8;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
          }
          .highlight {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🐕 Furry Friends</h1>
            <p>Seu pet center de confiança</p>
          </div>

          <div class="content">
            ${clientName ? `<p class="greeting">Olá ${clientName}!</p>` : ''}

            ${content}

            ${
              actionButton
                ? `
              <div style="text-align: center;">
                <a href="${actionButton.url}" class="button">
                  ${actionButton.text}
                </a>
              </div>
            `
                : ''
            }

            ${
              petName
                ? `
              <div class="pet-friendly-tip">
                <strong>Dica Pet Friendly:</strong> Mantenha sempre as vacinas de ${petName} em dia para garantir sua saúde e bem-estar! 🐾
              </div>
            `
                : ''
            }
          </div>

          <div class="footer">
            <p>
              <strong>Furry Friends Pet Center</strong><br>
              Cuidando do seu melhor amigo com amor e dedicação
            </p>
            <p>
              Este email foi enviado automaticamente.<br>
              © ${currentYear} Furry Friends. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Método para criar templates específicos por tipo de notificação
  createNotificationEmailTemplate(
    type: string,
    data: Record<string, any>,
  ): { subject: string; html: string } {
    switch (type) {
      case 'APPOINTMENT_CONFIRMATION':
        return {
          subject: `Agendamento Confirmado - ${data.petName as string}`,
          html: this.createProfessionalEmailTemplate(
            'Agendamento Confirmado',
            `
              <p>Seu agendamento foi confirmado com sucesso!</p>
              <div class="highlight">
                <strong>Detalhes do Agendamento:</strong><br>
                🐕 <strong>Pet:</strong> ${data.petName as string}<br>
                📅 <strong>Data:</strong> ${new Date(data.appointmentDate as string).toLocaleDateString('pt-BR')}<br>
                ⏰ <strong>Horário:</strong> ${new Date(data.appointmentDate as string).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}<br>
                ${data.groomerName ? `👨‍💼 <strong>Tosador:</strong> ${data.groomerName as string}<br>` : ''}
              </div>
              <p>Estamos ansiosos para receber você e seu pet!</p>
            `,
            data.clientName as string,
            data.petName as string,
            {
              text: 'Ver Agendamento',
              url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/appointments/${data.appointmentId as string}`,
            },
          ),
        };

      case 'APPOINTMENT_REMINDER':
        return {
          subject: `Lembrete: Agendamento amanhã - ${data.petName as string}`,
          html: this.createProfessionalEmailTemplate(
            'Lembrete de Agendamento',
            `
              <p>Este é um lembrete amigável do seu agendamento marcado para amanhã.</p>
              <div class="highlight">
                <strong>Não se esqueça:</strong><br>
                🐕 <strong>Pet:</strong> ${data.petName as string}<br>
                📅 <strong>Data:</strong> ${new Date(data.appointmentDate as string).toLocaleDateString('pt-BR')}<br>
                ⏰ <strong>Horário:</strong> ${new Date(data.appointmentDate as string).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}<br>
                <br>
                <strong>Preparação:</strong> Traga seu pet com ${(data.hoursUntil as string) || 8} horas de jejum.
              </div>
            `,
            data.clientName as string,
            data.petName as string,
            {
              text: 'Confirmar Presença',
              url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/appointments/${data.appointmentId as string}`,
            },
          ),
        };

      case 'VACCINE_REMINDER':
        return {
          subject: `Lembrete de Vacina - ${data.petName as string}`,
          html: this.createProfessionalEmailTemplate(
            'Lembrete de Vacina',
            `
              <p>É hora de cuidar da saúde do seu pet!</p>
              <div class="highlight">
                <strong>Vacina necessária:</strong><br>
                🐕 <strong>Pet:</strong> ${data.petName as string}<br>
                💉 <strong>Vacina:</strong> ${data.vaccineName as string}<br>
                📅 <strong>Vencimento:</strong> ${data.vaccineDate ? new Date(data.vaccineDate as string).toLocaleDateString('pt-BR') : 'Vencida'}
              </div>
              <p>Entre em contato conosco para agendar a vacinação.</p>
            `,
            data.clientName as string,
            data.petName as string,
            {
              text: 'Agendar Vacinação',
              url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/contact`,
            },
          ),
        };

      case 'SERVICE_STATUS_UPDATE':
        return {
          subject: `Atualização do Serviço - ${data.petName as string}`,
          html: this.createProfessionalEmailTemplate(
            'Atualização do Serviço',
            `
              <p>Informamos sobre o status do serviço do seu pet:</p>
              <div class="highlight">
                <strong>Status:</strong> ${data.status as string}<br>
                🐕 <strong>Pet:</strong> ${data.petName as string}<br>
                ${data.estimatedTime ? `⏱️ <strong>Tempo estimado:</strong> ${data.estimatedTime as string}` : ''}
              </div>
              ${data.status === 'COMPLETED' ? '<p>Seu pet está prontinho e cheiroso! 🐾</p>' : ''}
            `,
            data.clientName as string,
            data.petName as string,
          ),
        };

      default:
        return {
          subject: 'Notificação - Furry Friends',
          html: this.createProfessionalEmailTemplate(
            'Nova Notificação',
            `<p>${(data.message as string) || 'Você recebeu uma nova notificação.'}</p>`,
            data.clientName as string,
          ),
        };
    }
  }

  // Método para validar configurações do SendGrid
  async validateConfiguration(): Promise<boolean> {
    try {
      if (!process.env.SENDGRID_API_KEY) {
        this.logger.warn('SENDGRID_API_KEY não configurada');
        return false;
      }

      // Teste simples de validação
      await sgMail.send({
        to: 'test@example.com',
        from: this.defaultFrom,
        subject: 'Teste de configuração',
        html: '<p>Teste de configuração SendGrid</p>',
      });

      return true;
    } catch (error) {
      const err = error as Error;
      this.logger.error('Erro na validação do SendGrid:', err.message);
      return false;
    }
  }
}
