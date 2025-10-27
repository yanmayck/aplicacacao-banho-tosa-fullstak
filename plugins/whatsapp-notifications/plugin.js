const axios = require('axios');

class WhatsAppNotificationsPlugin {
  constructor() {
    this.name = 'WhatsApp Notifications';
    this.version = '1.0.0';
    this.description = 'Envio de notificações via WhatsApp';
    this.author = 'Furry Friends Team';
  }

  // === CICLO DE VIDA ===

  async onInstall(config) {
    console.log('Plugin WhatsApp Notifications instalado');
    // Validar configuração
    if (!config.apiUrl) {
      throw new Error('URL da API WhatsApp é obrigatória');
    }
  }

  async onUninstall() {
    console.log('Plugin WhatsApp Notifications desinstalado');
  }

  async onEnable() {
    console.log('Plugin WhatsApp Notifications ativado');
  }

  async onDisable() {
    console.log('Plugin WhatsApp Notifications desativado');
  }

  // === HOOKS ===

  getHooks() {
    return [
      {
        name: 'appointment.created',
        handler: this.handleAppointmentCreated.bind(this),
        priority: 10
      },
      {
        name: 'appointment.completed',
        handler: this.handleAppointmentCompleted.bind(this)
      },
      {
        name: 'payment.completed',
        handler: this.handlePaymentCompleted.bind(this)
      }
    ];
  }

  // === CONFIGURAÇÃO ===

  getConfigSchema() {
    return {
      type: 'object',
      properties: {
        apiUrl: {
          type: 'string',
          title: 'URL da API WhatsApp',
          description: 'URL do serviço de envio de WhatsApp'
        },
        apiKey: {
          type: 'string',
          title: 'Chave da API',
          description: 'Chave de autenticação da API WhatsApp'
        },
        fromNumber: {
          type: 'string',
          title: 'Número de origem',
          description: 'Número WhatsApp de origem das mensagens'
        },
        enableReminders: {
          type: 'boolean',
          title: 'Lembretes automáticos',
          description: 'Enviar lembretes automáticos de agendamento',
          default: true
        }
      },
      required: ['apiUrl', 'apiKey', 'fromNumber']
    };
  }

  validateConfig(config) {
    const errors = [];

    if (!config.apiUrl) {
      errors.push('URL da API é obrigatória');
    }

    if (!config.apiKey) {
      errors.push('Chave da API é obrigatória');
    }

    if (!config.fromNumber) {
      errors.push('Número de origem é obrigatório');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  getDefaultConfig() {
    return {
      apiUrl: '',
      apiKey: '',
      fromNumber: '',
      enableReminders: true
    };
  }

  // === PERMISSÕES ===

  getRequiredPermissions() {
    return [
      {
        resource: 'notifications',
        actions: ['send']
      },
      {
        resource: 'clients',
        actions: ['read']
      },
      {
        resource: 'appointments',
        actions: ['read']
      }
    ];
  }

  // === HANDLERS DE HOOK ===

  async handleAppointmentCreated(data, context) {
    const { appointment } = data;

    if (!context.config.enableReminders) {
      return;
    }

    try {
      const message = this.formatAppointmentMessage(appointment, 'created');
      await this.sendWhatsAppMessage(appointment.client.phone, message, context.config);
      console.log(`Notificação WhatsApp enviada para agendamento criado: ${appointment.id}`);
    } catch (error) {
      console.error('Erro ao enviar notificação WhatsApp:', error);
      throw error;
    }
  }

  async handleAppointmentCompleted(data, context) {
    const { appointment } = data;

    try {
      const message = this.formatAppointmentMessage(appointment, 'completed');
      await this.sendWhatsAppMessage(appointment.client.phone, message, context.config);
      console.log(`Notificação WhatsApp enviada para agendamento concluído: ${appointment.id}`);
    } catch (error) {
      console.error('Erro ao enviar notificação WhatsApp:', error);
      throw error;
    }
  }

  async handlePaymentCompleted(data, context) {
    const { payment } = data;

    try {
      const message = this.formatPaymentMessage(payment);
      await this.sendWhatsAppMessage(payment.appointment.client.phone, message, context.config);
      console.log(`Notificação WhatsApp enviada para pagamento: ${payment.id}`);
    } catch (error) {
      console.error('Erro ao enviar notificação WhatsApp:', error);
      throw error;
    }
  }

  // === MÉTODOS AUXILIARES ===

  async sendWhatsAppMessage(to, message, config) {
    const response = await axios.post(config.apiUrl, {
      to: to,
      from: config.fromNumber,
      message: message,
      apiKey: config.apiKey
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      }
    });

    if (response.status !== 200) {
      throw new Error(`Erro na API WhatsApp: ${response.statusText}`);
    }

    return response.data;
  }

  formatAppointmentMessage(appointment, type) {
    const date = new Date(appointment.dateTime).toLocaleDateString('pt-BR');
    const time = new Date(appointment.dateTime).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const services = appointment.appointmentServices?.map(s => s.service.name).join(', ') || 'serviços';

    switch (type) {
      case 'created':
        return `Olá ${appointment.client.name}! 🎾

Seu agendamento foi confirmado:
📅 Data: ${date}
🕐 Horário: ${time}
🐾 Pet: ${appointment.pet.name}
💇‍♀️ Serviços: ${services}

Obrigado por escolher nossos serviços!
Furry Friends Agenda`;

      case 'completed':
        return `Olá ${appointment.client.name}! ✨

O atendimento do seu pet ${appointment.pet.name} foi concluído com sucesso!

Serviços realizados: ${services}

Esperamos vê-los novamente em breve!
Furry Friends Agenda`;

      default:
        return `Olá ${appointment.client.name}! Temos uma atualização sobre seu agendamento.`;
    }
  }

  formatPaymentMessage(payment) {
    const amount = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(payment.amount);

    return `Olá! 💳

Seu pagamento de ${amount} foi confirmado com sucesso.

Obrigado pela confiança!
Furry Friends Agenda`;
  }
}

module.exports = WhatsAppNotificationsPlugin;