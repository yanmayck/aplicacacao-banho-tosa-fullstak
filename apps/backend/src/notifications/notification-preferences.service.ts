import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType, NotificationChannel } from '@prisma/client';

@Injectable()
export class NotificationPreferencesService {
  private readonly logger = new Logger(NotificationPreferencesService.name);

  constructor(private prisma: PrismaService) {}

  async getUserPreferences(userType: 'client' | 'groomer', userId: string) {
    const whereClause: any = {};

    if (userType === 'client') {
      whereClause.clientId = userId;
    } else {
      whereClause.groomerId = userId;
    }

    let preferences = await this.prisma.notificationPreference.findUnique({
      where: whereClause,
    });

    if (!preferences) {
      // Criar preferências padrão se não existirem
      preferences = await this.createDefaultPreferences(userType, userId);
    }

    return preferences;
  }

  async updateUserPreferences(
    userType: 'client' | 'groomer',
    userId: string,
    preferences: Record<string, Record<string, boolean>>,
  ) {
    const whereClause: any = {};

    if (userType === 'client') {
      whereClause.clientId = userId;
    } else {
      whereClause.groomerId = userId;
    }

    return this.prisma.notificationPreference.upsert({
      where: whereClause,
      update: {
        preferences,
      },
      create: {
        ...(userType === 'client'
          ? { clientId: userId }
          : { groomerId: userId }),
        preferences,
      },
    });
  }

  async createDefaultPreferences(
    userType: 'client' | 'groomer',
    userId: string,
  ) {
    const defaultPreferences = this.getDefaultPreferences();

    return this.prisma.notificationPreference.create({
      data: {
        ...(userType === 'client'
          ? { clientId: userId }
          : { groomerId: userId }),
        preferences: defaultPreferences,
      },
    });
  }

  private getDefaultPreferences() {
    return {
      // Notificações de agendamento
      [NotificationType.APPOINTMENT_CONFIRMATION]: {
        [NotificationChannel.EMAIL]: true,
        [NotificationChannel.SMS]: false,
        [NotificationChannel.WHATSAPP]: true,
        [NotificationChannel.PUSH]: true,
        [NotificationChannel.IN_APP]: true,
      },
      [NotificationType.APPOINTMENT_REMINDER]: {
        [NotificationChannel.EMAIL]: false,
        [NotificationChannel.SMS]: false,
        [NotificationChannel.WHATSAPP]: true,
        [NotificationChannel.PUSH]: true,
        [NotificationChannel.IN_APP]: true,
      },
      [NotificationType.APPOINTMENT_CANCELLED]: {
        [NotificationChannel.EMAIL]: true,
        [NotificationChannel.SMS]: false,
        [NotificationChannel.WHATSAPP]: true,
        [NotificationChannel.PUSH]: true,
        [NotificationChannel.IN_APP]: true,
      },

      // Notificações de serviços
      [NotificationType.SERVICE_STATUS_UPDATE]: {
        [NotificationChannel.EMAIL]: false,
        [NotificationChannel.SMS]: true,
        [NotificationChannel.WHATSAPP]: true,
        [NotificationChannel.PUSH]: true,
        [NotificationChannel.IN_APP]: true,
      },

      // Notificações de vacinas
      [NotificationType.VACCINE_REMINDER]: {
        [NotificationChannel.EMAIL]: true,
        [NotificationChannel.SMS]: false,
        [NotificationChannel.WHATSAPP]: false,
        [NotificationChannel.PUSH]: true,
        [NotificationChannel.IN_APP]: true,
      },

      // Notificações financeiras
      [NotificationType.PAYMENT_REMINDER]: {
        [NotificationChannel.EMAIL]: true,
        [NotificationChannel.SMS]: false,
        [NotificationChannel.WHATSAPP]: false,
        [NotificationChannel.PUSH]: true,
        [NotificationChannel.IN_APP]: true,
      },

      // Notificações de fidelidade
      [NotificationType.LOYALTY_POINTS]: {
        [NotificationChannel.EMAIL]: false,
        [NotificationChannel.SMS]: false,
        [NotificationChannel.WHATSAPP]: false,
        [NotificationChannel.PUSH]: true,
        [NotificationChannel.IN_APP]: true,
      },

      // Notificações promocionais
      [NotificationType.PROMOTION]: {
        [NotificationChannel.EMAIL]: true,
        [NotificationChannel.SMS]: false,
        [NotificationChannel.WHATSAPP]: false,
        [NotificationChannel.PUSH]: false,
        [NotificationChannel.IN_APP]: true,
      },
      [NotificationType.SPECIAL_OFFER]: {
        [NotificationChannel.EMAIL]: true,
        [NotificationChannel.SMS]: false,
        [NotificationChannel.WHATSAPP]: false,
        [NotificationChannel.PUSH]: false,
        [NotificationChannel.IN_APP]: true,
      },

      // Outras notificações
      [NotificationType.INFO]: {
        [NotificationChannel.EMAIL]: false,
        [NotificationChannel.SMS]: false,
        [NotificationChannel.WHATSAPP]: false,
        [NotificationChannel.PUSH]: true,
        [NotificationChannel.IN_APP]: true,
      },
      [NotificationType.WARNING]: {
        [NotificationChannel.EMAIL]: true,
        [NotificationChannel.SMS]: true,
        [NotificationChannel.WHATSAPP]: true,
        [NotificationChannel.PUSH]: true,
        [NotificationChannel.IN_APP]: true,
      },
      [NotificationType.SUCCESS]: {
        [NotificationChannel.EMAIL]: false,
        [NotificationChannel.SMS]: false,
        [NotificationChannel.WHATSAPP]: false,
        [NotificationChannel.PUSH]: true,
        [NotificationChannel.IN_APP]: true,
      },
      [NotificationType.ERROR]: {
        [NotificationChannel.EMAIL]: true,
        [NotificationChannel.SMS]: true,
        [NotificationChannel.WHATSAPP]: true,
        [NotificationChannel.PUSH]: true,
        [NotificationChannel.IN_APP]: true,
      },
    };
  }

  async getUserPreferenceForNotification(
    userType: 'client' | 'groomer',
    userId: string,
    notificationType: NotificationType,
    channel: NotificationChannel,
  ) {
    const preferences = await this.getUserPreferences(userType, userId);

    const prefs = preferences.preferences as Record<
      string,
      Record<string, boolean>
    >;
    return prefs?.[notificationType]?.[channel] ?? false;
  }

  async shouldSendNotification(
    userType: 'client' | 'groomer',
    userId: string,
    notificationType: NotificationType,
    channel: NotificationChannel,
  ): Promise<boolean> {
    try {
      return await this.getUserPreferenceForNotification(
        userType,
        userId,
        notificationType,
        channel,
      );
    } catch (error) {
      // Se houver erro ao buscar preferências, usar padrão conservador
      this.logger.warn(
        `Erro ao buscar preferências para ${userType} ${userId}: ${(error as Error).message}`,
      );
      return this.getDefaultPreferenceForNotification(
        notificationType,
        channel,
      );
    }
  }

  private getDefaultPreferenceForNotification(
    notificationType: string,
    channel: string,
  ): boolean {
    const defaults = this.getDefaultPreferences();
    return (defaults as any)[notificationType]?.[channel] ?? false;
  }

  async getNotificationChannelsForUser(
    userType: 'client' | 'groomer',
    userId: string,
    notificationType: NotificationType,
  ) {
    const preferences = await this.getUserPreferences(userType, userId);
    const prefs = preferences.preferences as Record<
      string,
      Record<string, boolean>
    >;
    const notificationPrefs = prefs?.[notificationType];

    if (!notificationPrefs) {
      return [];
    }

    return Object.entries(notificationPrefs)
      .filter(([_, enabled]) => enabled)
      .map(([channel]) => channel as NotificationChannel);
  }

  async bulkUpdatePreferences(
    userType: 'client' | 'groomer',
    userId: string,
    updates: Array<{
      notificationType: NotificationType;
      channel: NotificationChannel;
      enabled: boolean;
    }>,
  ) {
    const currentPrefs = await this.getUserPreferences(userType, userId);
    const preferences = {
      ...(currentPrefs.preferences as Record<string, Record<string, boolean>>),
    };

    updates.forEach(({ notificationType, channel, enabled }) => {
      if (!preferences[notificationType]) {
        preferences[notificationType] = {};
      }
      preferences[notificationType][channel] = enabled;
    });

    return this.updateUserPreferences(userType, userId, preferences);
  }

  async resetToDefaults(userType: 'client' | 'groomer', userId: string) {
    const defaultPreferences = this.getDefaultPreferences();
    return this.updateUserPreferences(userType, userId, defaultPreferences);
  }

  async getPreferenceStats() {
    const preferences = await this.prisma.notificationPreference.findMany({
      include: {
        client: {
          select: { name: true, email: true },
        },
        groomer: {
          select: { name: true, email: true },
        },
      },
    });

    const stats = {
      total: preferences.length,
      byType: {} as Record<string, number>,
      mostUsedChannels: {} as Record<string, number>,
      leastUsedChannels: {} as Record<string, number>,
    };

    preferences.forEach((pref) => {
      Object.values(
        pref.preferences as Record<string, Record<string, boolean>>,
      ).forEach((channels) => {
        Object.entries(channels).forEach(([channel, enabled]) => {
          if (enabled) {
            stats.mostUsedChannels[channel] =
              (stats.mostUsedChannels[channel] || 0) + 1;
          } else {
            stats.leastUsedChannels[channel] =
              (stats.leastUsedChannels[channel] || 0) + 1;
          }
        });
      });
    });

    return stats;
  }
}
