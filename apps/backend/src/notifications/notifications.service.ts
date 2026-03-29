import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType, Prisma } from '@prisma/client';

export interface CreateNotificationDto {
  title: string;
  message: string;
  type: NotificationType;
  clientId?: string;
  groomerId?: string;
  data?: Prisma.InputJsonValue;
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
        data: notificationData.data as Prisma.InputJsonValue,
        isRead: false,
      },
    });
  }

  async getClientNotifications(clientId: string, unreadOnly = false) {
    const whereClause: Prisma.NotificationWhereInput = { clientId };

    if (unreadOnly) {
      whereClause.isRead = false;
    }

    return this.prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getGroomerNotifications(groomerId: string, unreadOnly = false) {
    const whereClause: Prisma.NotificationWhereInput = { groomerId };

    if (unreadOnly) {
      whereClause.isRead = false;
    }

    return this.prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(
    notificationId: string,
    userType: 'client' | 'groomer',
    userId: string,
  ) {
    const whereClause: Prisma.NotificationWhereInput = { id: notificationId };

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
      },
    });
  }

  async markAllAsRead(userType: 'client' | 'groomer', userId: string) {
    const whereClause: Prisma.NotificationWhereInput = { isRead: false };

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
      },
    });
  }

  async sendAppointmentReminder(appointmentId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        client: true,
        pet: true,
        groomer: true,
      },
    });

    if (!appointment || !appointment.client) return;

    const appointmentDate = new Date(appointment.dateTime);
    const now = new Date();
    const hoursUntilAppointment =
      (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

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
          appointmentDate: appointment.dateTime.toISOString(),
        },
      });

      // Em uma implementação real, você integraria com serviços de email/SMS/WhatsApp aqui
      console.log(
        `Lembrete enviado para ${appointment.client.email}: ${message}`,
      );
    }
  }

  async sendAppointmentConfirmation(appointmentId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        client: true,
        pet: true,
        groomer: true,
      },
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
        appointmentDate: appointment.dateTime.toISOString(),
      },
    });

    // Em uma implementação real, você integraria com serviços de email/SMS/WhatsApp aqui
    console.log(
      `Confirmação enviada para ${appointment.client.email}: ${message}`,
    );
  }

  async getUnreadCount(userType: 'client' | 'groomer', userId: string) {
    const whereClause: Prisma.NotificationWhereInput = { isRead: false };

    if (userType === 'client') {
      whereClause.clientId = userId;
    } else {
      whereClause.groomerId = userId;
    }

    return this.prisma.notification.count({
      where: whereClause,
    });
  }

  // ========== NOVOS MÉTODOS PARA TIPOS EXPANDIDOS DE NOTIFICAÇÃO ==========

  async sendVaccineReminder(petId: string) {
    const pet = await this.prisma.pet.findUnique({
      where: { id: petId },
      include: {
        client: true,
      },
    });

    if (!pet || !pet.client) return;

    // Verificar se há vacinas vencidas ou próximas de vencer
    const vaccineHistory = (pet.vaccineHistory as Prisma.JsonArray) || [];
    const rabiesVaccine = pet.rabiesVaccine as Prisma.JsonObject;

    const now = new Date();
    const notifications = [];

    // Verificar vacina de raiva
    if (rabiesVaccine && !rabiesVaccine.isUpToDate) {
      const title = 'Vacina de Raiva Vencida';
      const message = `Olá ${pet.client.name}! A vacina de raiva de ${pet.name} está vencida. Entre em contato conosco para agendar a vacinação.`;

      const notification = await this.createNotification({
        title,
        message,
        type: 'WARNING',
        clientId: pet.clientId,
        data: {
          petId: pet.id,
          vaccineType: 'rabies',
          petName: pet.name,
        },
      });

      notifications.push(notification);
    }

    // Verificar outras vacinas
    vaccineHistory.forEach((vaccine: { name: string; date: string }) => {
      if (vaccine.date) {
        const vaccineDate = new Date(vaccine.date);
        const daysSinceVaccine =
          (now.getTime() - vaccineDate.getTime()) / (1000 * 60 * 60 * 24);

        // Se passou de 1 ano (365 dias), considerar vencida
        if (daysSinceVaccine > 365) {
          const title = 'Vacina Vencida';
          const message = `Olá ${pet.client.name}! A vacina ${vaccine.name} de ${pet.name} está vencida há ${Math.floor(daysSinceVaccine - 365)} dias.`;

          this.createNotification({
            title,
            message,
            type: 'WARNING',
            clientId: pet.clientId,
            data: {
              petId: pet.id,
              vaccineName: vaccine.name,
              vaccineDate: vaccine.date,
              daysOverdue: Math.floor(daysSinceVaccine - 365),
            },
          });
        }
      }
    });

    return notifications;
  }

  async sendServiceStatusUpdate(
    appointmentId: string,
    status: string,
    additionalInfo?: Record<string, unknown>,
  ) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        client: true,
        pet: true,
        groomer: true,
      },
    });

    if (!appointment || !appointment.client) return;

    let title: string;
    let message: string;
    let type: NotificationType;

    switch (status.toUpperCase()) {
      case 'IN_PROGRESS':
        title = 'Serviço Iniciado';
        message = `Olá ${appointment.client.name}! O serviço para ${appointment.pet.name} foi iniciado. Em breve estará prontinho!`;
        type = 'INFO';
        break;

      case 'COMPLETED':
        title = 'Serviço Concluído';
        message = `Olá ${appointment.client.name}! O serviço para ${appointment.pet.name} foi concluído com sucesso! Seu pet está cheiroso e pronto para ir para casa.`;
        type = 'SUCCESS';
        break;

      case 'CANCELLED':
        title = 'Serviço Cancelado';
        message = `Olá ${appointment.client.name}! O serviço para ${appointment.pet.name} foi cancelado. Entre em contato conosco para reagendar.`;
        type = 'WARNING';
        break;

      default:
        title = 'Atualização de Serviço';
        message = `Olá ${appointment.client.name}! Há uma atualização no serviço de ${appointment.pet.name}: ${status}`;
        type = 'INFO';
    }

    const notification = await this.createNotification({
      title,
      message,
      type: type,
      clientId: appointment.clientId,
      data: {
        appointmentId: appointment.id,
        status,
        petName: appointment.pet.name,
        ...additionalInfo,
      },
    });

    // Também notificar o tosador se houver
    if (appointment.groomer) {
      const groomerMessage = `Serviço para ${appointment.pet.name} - Cliente: ${appointment.client.name} - Status: ${status}`;

      await this.createNotification({
        title: 'Atualização de Serviço',
        message: groomerMessage,
        type: 'INFO',
        groomerId: appointment.groomerId || undefined,
        data: {
          appointmentId: appointment.id,
          status,
          clientName: appointment.client.name,
          petName: appointment.pet.name,
        },
      });
    }

    return notification;
  }

  async sendPaymentReminder(clientId: string, amount: number, dueDate: Date) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) return;

    const title = 'Lembrete de Pagamento';
    const message = `Olá ${client.name}! Você tem um pagamento pendente de R$ ${amount.toFixed(2)} com vencimento em ${dueDate.toLocaleDateString('pt-BR')}.`;

    return this.createNotification({
      title,
      message,
      type: 'WARNING',
      clientId,
      data: {
        amount,
        dueDate: dueDate.toISOString(),
        paymentType: 'pending',
      },
    });
  }

  async sendLoyaltyPointsNotification(
    clientId: string,
    points: number,
    reason: string,
  ) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) return;

    const title = 'Pontos de Fidelidade';
    const message = `Parabéns ${client.name}! Você ganhou ${points} pontos de fidelidade por ${reason}. Continue nos visitando para acumular mais pontos!`;

    return this.createNotification({
      title,
      message,
      type: 'SUCCESS',
      clientId,
      data: {
        points,
        reason,
        totalPoints: points, // Em uma implementação completa, você buscaria o total
      },
    });
  }

  async sendSpecialOffer(
    clientId: string,
    offerTitle: string,
    offerDescription: string,
    validUntil: Date,
  ) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) return;

    const title = 'Oferta Especial';
    const message = `Olá ${client.name}! ${offerTitle} - ${offerDescription} Válido até ${validUntil.toLocaleDateString('pt-BR')}. Não perca!`;

    return this.createNotification({
      title,
      message,
      type: 'PROMOTION',
      clientId,
      data: {
        offerTitle,
        offerDescription,
        validUntil: validUntil.toISOString(),
      },
    });
  }

  async sendPetBirthdayReminder(petId: string) {
    const pet = await this.prisma.pet.findUnique({
      where: { id: petId },
      include: {
        client: true,
      },
    });

    if (!pet || !pet.client || !pet.birthDate) return;

    const birthDate = new Date(pet.birthDate);
    const today = new Date();

    // Verificar se é aniversário hoje ou nos próximos 7 dias
    const isBirthdayToday =
      birthDate.getDate() === today.getDate() &&
      birthDate.getMonth() === today.getMonth();

    const nextBirthday = new Date(
      today.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate(),
    );
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    const daysUntilBirthday = Math.ceil(
      (nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (isBirthdayToday || daysUntilBirthday <= 7) {
      const title = isBirthdayToday
        ? 'Feliz Aniversário!'
        : 'Aniversário se aproximando';
      const message = isBirthdayToday
        ? `Hoje é aniversário de ${pet.name}! Parabéns para este membro especial da família! 🎉`
        : `${pet.name} faz aniversário em ${daysUntilBirthday} dias! Que tal agendar um dia especial para ele?`;

      return this.createNotification({
        title,
        message,
        type: 'SUCCESS',
        clientId: pet.clientId,
        data: {
          petId: pet.id,
          petName: pet.name,
          birthDate: pet.birthDate,
          isBirthdayToday,
          daysUntilBirthday,
        } as Prisma.JsonObject,
      });
    }
  }

  async sendBulkNotifications(
    clientIds: string[],
    notificationData: {
      title: string;
      message: string;
      type: NotificationType;
      data?: Prisma.InputJsonValue;
    },
  ) {
    const notifications = [];

    for (const clientId of clientIds) {
      try {
        const notification = await this.createNotification({
          ...notificationData,
          clientId,
        });
        notifications.push(notification);
      } catch (error) {
        console.error(
          `Erro ao enviar notificação para cliente ${clientId}:`,
          error,
        );
      }
    }

    return notifications;
  }

  async getNotificationHistory(
    userType: 'client' | 'groomer',
    userId: string,
    filters?: {
      type?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    },
  ) {
    const whereClause: Prisma.NotificationWhereInput = {};

    if (userType === 'client') {
      whereClause.clientId = userId;
    } else {
      whereClause.groomerId = userId;
    }

    if (filters?.type) {
      whereClause.type = filters.type as NotificationType;
    }

    if (filters?.startDate || filters?.endDate) {
      whereClause.createdAt = {};
      if (filters.startDate) {
        whereClause.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        whereClause.createdAt.lte = filters.endDate;
      }
    }

    const limit = filters?.limit || 50;
    const offset = filters?.offset || 0;

    return this.prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async getNotificationStats(userType: 'client' | 'groomer', userId: string) {
    const whereClause: Prisma.NotificationWhereInput = {};

    if (userType === 'client') {
      whereClause.clientId = userId;
    } else {
      whereClause.groomerId = userId;
    }

    const total = await this.prisma.notification.count({
      where: whereClause,
    });

    const unread = await this.prisma.notification.count({
      where: {
        ...whereClause,
        isRead: false,
      },
    });

    const byType = await this.prisma.notification.groupBy({
      by: ['type'],
      where: whereClause,
      _count: {
        id: true,
      },
    });

    const recent = await this.prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return {
      total,
      unread,
      read: total - unread,
      byType: byType.reduce(
        (acc, stat) => {
          acc[stat.type] = stat._count.id;
          return acc;
        },
        {} as Record<string, number>,
      ),
      recent,
    };
  }
}
