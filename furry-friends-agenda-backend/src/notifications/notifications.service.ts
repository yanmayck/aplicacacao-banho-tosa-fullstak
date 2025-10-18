import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateNotificationDto {
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR' | 'REMINDER' | 'PROMOTION';
  clientId?: string;
  groomerId?: string;
  data?: any;
}

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async createNotification(notificationData: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: {
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type,
        clientId: notificationData.clientId,
        groomerId: notificationData.groomerId,
        data: notificationData.data,
        isRead: false,
      }
    });
  }

  async getClientNotifications(clientId: string, unreadOnly = false) {
    const whereClause: any = { clientId };

    if (unreadOnly) {
      whereClause.isRead = false;
    }

    return this.prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });
  }

  async getGroomerNotifications(groomerId: string, unreadOnly = false) {
    const whereClause: any = { groomerId };

    if (unreadOnly) {
      whereClause.isRead = false;
    }

    return this.prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });
  }

  async markAsRead(notificationId: string, userType: 'client' | 'groomer', userId: string) {
    const whereClause: any = { id: notificationId };

    if (userType === 'client') {
      whereClause.clientId = userId;
    } else {
      whereClause.groomerId = userId;
    }

    return this.prisma.notification.updateMany({
      where: whereClause,
      data: {
        isRead: true,
        readAt: new Date(),
      }
    });
  }

  async markAllAsRead(userType: 'client' | 'groomer', userId: string) {
    const whereClause: any = { isRead: false };

    if (userType === 'client') {
      whereClause.clientId = userId;
    } else {
      whereClause.groomerId = userId;
    }

    return this.prisma.notification.updateMany({
      where: whereClause,
      data: {
        isRead: true,
        readAt: new Date(),
      }
    });
  }

  async sendAppointmentReminder(appointmentId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        client: true,
        pet: true,
        groomer: true,
      }
    });

    if (!appointment || !appointment.client) return;

    const appointmentDate = new Date(appointment.dateTime);
    const now = new Date();
    const hoursUntilAppointment = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Só enviar lembrete se for nas próximas 24 horas
    if (hoursUntilAppointment > 0 && hoursUntilAppointment <= 24) {
      const title = 'Lembrete de Agendamento';
      const message = `Olá ${appointment.client.name}! Lembrete do agendamento para ${appointment.pet.name} amanhã às ${appointmentDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

      await this.createNotification({
        title,
        message,
        type: 'REMINDER',
        clientId: appointment.clientId,
        data: {
          appointmentId: appointment.id,
          appointmentDate: appointment.dateTime,
        }
      });

      // Em uma implementação real, você integraria com serviços de email/SMS/WhatsApp aqui
      console.log(`Lembrete enviado para ${appointment.client.email}: ${message}`);
    }
  }

  async sendAppointmentConfirmation(appointmentId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        client: true,
        pet: true,
        groomer: true,
      }
    });

    if (!appointment || !appointment.client) return;

    const title = 'Agendamento Confirmado';
    const message = `Seu agendamento para ${appointment.pet.name} em ${new Date(appointment.dateTime).toLocaleDateString('pt-BR')} às ${new Date(appointment.dateTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} foi confirmado!`;

    await this.createNotification({
      title,
      message,
      type: 'SUCCESS',
      clientId: appointment.clientId,
      data: {
        appointmentId: appointment.id,
        appointmentDate: appointment.dateTime,
      }
    });

    // Em uma implementação real, você integraria com serviços de email/SMS/WhatsApp aqui
    console.log(`Confirmação enviada para ${appointment.client.email}: ${message}`);
  }

  async sendWhatsAppMessage(phone: string, message: string) {
    // Esta é uma implementação básica - em produção você integraria com a API do WhatsApp Business
    console.log(`WhatsApp para ${phone}: ${message}`);

    // Exemplo de integração futura com WhatsApp Business API:
    // const response = await fetch('https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     messaging_product: 'whatsapp',
    //     to: phone,
    //     type: 'text',
    //     text: { body: message }
    //   })
    // });

    return { success: true, messageId: 'mock-id' };
  }

  async sendSMS(phone: string, message: string) {
    // Esta é uma implementação básica - em produção você integraria com serviços como Twilio
    console.log(`SMS para ${phone}: ${message}`);

    // Exemplo de integração futura com Twilio:
    // const accountSid = process.env.TWILIO_ACCOUNT_SID;
    // const authToken = process.env.TWILIO_AUTH_TOKEN;
    // const client = require('twilio')(accountSid, authToken);
    //
    // const result = await client.messages.create({
    //   body: message,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phone
    // });

    return { success: true, messageId: 'mock-id' };
  }

  async sendEmail(email: string, subject: string, htmlContent: string) {
    // Esta é uma implementação básica - em produção você integraria com serviços como SendGrid, SES, etc.
    console.log(`Email para ${email}: ${subject}`);

    // Exemplo de integração futura com SendGrid:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    //
    // const msg = {
    //   to: email,
    //   from: process.env.FROM_EMAIL,
    //   subject: subject,
    //   html: htmlContent,
    // };
    //
    // await sgMail.send(msg);

    return { success: true, messageId: 'mock-id' };
  }

  async getUnreadCount(userType: 'client' | 'groomer', userId: string) {
    const whereClause: any = {
      isRead: false,
    };

    if (userType === 'client') {
      whereClause.clientId = userId;
    } else {
      whereClause.groomerId = userId;
    }

    return this.prisma.notification.count({
      where: whereClause
    });
  }
}
