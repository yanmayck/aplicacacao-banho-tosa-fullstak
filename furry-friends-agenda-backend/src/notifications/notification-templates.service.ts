import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType, NotificationChannel } from '@prisma/client';
import { CreateNotificationTemplateDto } from './dto/create-notification-template.dto';

@Injectable()
export class NotificationTemplatesService {
  constructor(private prisma: PrismaService) {}

  async create(createTemplateDto: CreateNotificationTemplateDto) {
    // Verificar se já existe um template com o mesmo nome
    const existingTemplate = await this.prisma.notificationTemplate.findUnique({
      where: { name: createTemplateDto.name },
    });

    if (existingTemplate) {
      throw new BadRequestException('Já existe um template com este nome');
    }

    return this.prisma.notificationTemplate.create({
      data: {
        name: createTemplateDto.name,
        title: createTemplateDto.title,
        content: createTemplateDto.content,
        type: createTemplateDto.type,
        channel: createTemplateDto.channel || NotificationChannel.IN_APP,
        isActive: createTemplateDto.isActive ?? true,
        variables: createTemplateDto.variables || [],
        // metadata: createTemplateDto.metadata || {},
      },
    });
  }

  async findAll(filters?: {
    type?: NotificationType;
    channel?: NotificationChannel;
  }) {
    const where: any = {};

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.channel) {
      where.channel = filters.channel;
    }

    return this.prisma.notificationTemplate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const template = await this.prisma.notificationTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Template de notificação não encontrado');
    }

    return template;
  }

  async update(
    id: string,
    updateTemplateDto: Partial<CreateNotificationTemplateDto>,
  ) {
    const template = await this.findOne(id);

    // Verificar se o novo nome já existe (se estiver sendo alterado)
    if (updateTemplateDto.name && updateTemplateDto.name !== template.name) {
      const existingTemplate =
        await this.prisma.notificationTemplate.findUnique({
          where: { name: updateTemplateDto.name },
        });

      if (existingTemplate) {
        throw new BadRequestException('Já existe um template com este nome');
      }
    }

    return this.prisma.notificationTemplate.update({
      where: { id },
      data: {
        ...(updateTemplateDto.name && { name: updateTemplateDto.name }),
        ...(updateTemplateDto.title && { title: updateTemplateDto.title }),
        ...(updateTemplateDto.content && {
          content: updateTemplateDto.content,
        }),
        ...(updateTemplateDto.type && { type: updateTemplateDto.type }),
        ...(updateTemplateDto.channel && {
          channel: updateTemplateDto.channel,
        }),
        ...(updateTemplateDto.isActive !== undefined && {
          isActive: updateTemplateDto.isActive,
        }),
        ...(updateTemplateDto.variables && {
          variables: updateTemplateDto.variables,
        }),
        ...(updateTemplateDto.metadata &&
          {
            // metadata: updateTemplateDto.metadata,
          }),
      },
    });
  }

  async remove(id: string) {
    const template = await this.findOne(id);

    // Verificar se o template está sendo usado
    const usageCount = await this.prisma.notification.count({
      where: { templateId: id },
    });

    if (usageCount > 0) {
      throw new BadRequestException(
        'Não é possível excluir o template pois está sendo utilizado por notificações existentes',
      );
    }

    return this.prisma.notificationTemplate.delete({
      where: { id },
    });
  }

  async duplicate(id: string) {
    const template = await this.findOne(id);

    // Criar novo nome baseado no original
    const baseName = template.name;
    let newName = `${baseName}_copia`;
    let counter = 1;

    // Garantir que o nome não exista
    while (
      await this.prisma.notificationTemplate.findUnique({
        where: { name: newName },
      })
    ) {
      counter++;
      newName = `${baseName}_copia_${counter}`;
    }

    return this.prisma.notificationTemplate.create({
      data: {
        name: newName,
        title: `${template.title} (Cópia)`,
        content: template.content,
        type: template.type,
        channel: template.channel,
        isActive: false, // Manter inativo por padrão
        variables: template.variables as any,
        // metadata: template.metadata,
      },
    });
  }

  async preview(id: string, variables?: Record<string, any>) {
    const template = await this.findOne(id);

    if (
      !template.variables ||
      !Array.isArray(template.variables) ||
      template.variables.length === 0
    ) {
      return {
        title: template.title,
        content: template.content,
      };
    }

    // Substituir variáveis no conteúdo
    let processedContent = template.content;
    let processedTitle = template.title;

    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        processedContent = processedContent.replace(regex, String(value));
        processedTitle = processedTitle.replace(regex, String(value));
      });
    }

    return {
      title: processedTitle,
      content: processedContent,
      variables: template.variables,
      originalTemplate: {
        title: template.title,
        content: template.content,
      },
    };
  }

  async getDefaultTemplates() {
    const templates = [
      {
        name: 'appointment_confirmation',
        title: 'Agendamento Confirmado - {{clientName}}',
        content:
          'Olá {{clientName}}! Seu agendamento para {{petName}} em {{appointmentDate}} às {{appointmentTime}} foi confirmado. Estamos ansiosos para receber você e seu pet!',
        type: NotificationType.APPOINTMENT_CONFIRMATION,
        channel: NotificationChannel.EMAIL,
        variables: [
          'clientName',
          'petName',
          'appointmentDate',
          'appointmentTime',
        ],
      },
      {
        name: 'appointment_reminder',
        title: 'Lembrete: Agendamento amanhã - {{clientName}}',
        content:
          'Olá {{clientName}}! Lembrete amigável: você tem um agendamento marcado para {{petName}} amanhã ({{appointmentDate}}) às {{appointmentTime}}. Não se esqueça de trazer seu pet com {{hoursUntil}} horas de jejum.',
        type: NotificationType.APPOINTMENT_REMINDER,
        channel: NotificationChannel.WHATSAPP,
        variables: [
          'clientName',
          'petName',
          'appointmentDate',
          'appointmentTime',
          'hoursUntil',
        ],
      },
      {
        name: 'vaccine_reminder',
        title: 'Lembrete de Vacina - {{petName}}',
        content:
          'Olá {{clientName}}! {{petName}} precisa tomar a vacina {{vaccineName}}. A próxima dose está programada para {{vaccineDate}}. Entre em contato conosco para agendar.',
        type: NotificationType.VACCINE_REMINDER,
        channel: NotificationChannel.IN_APP,
        variables: ['clientName', 'petName', 'vaccineName', 'vaccineDate'],
      },
      {
        name: 'service_completed',
        title: 'Serviço Concluído - {{petName}}',
        content:
          '{{petName}} está prontinho e cheiroso! O serviço foi concluído com sucesso. Obrigado pela preferência, {{clientName}}! ❤️',
        type: NotificationType.SERVICE_STATUS_UPDATE,
        channel: NotificationChannel.SMS,
        variables: ['clientName', 'petName'],
      },
    ];

    return templates;
  }

  async seedDefaultTemplates() {
    const defaultTemplates = await this.getDefaultTemplates();

    for (const templateData of defaultTemplates) {
      const existing = await this.prisma.notificationTemplate.findUnique({
        where: { name: templateData.name },
      });

      if (!existing) {
        await this.prisma.notificationTemplate.create({
          data: templateData as any,
        });
      }
    }

    return { message: 'Templates padrão criados com sucesso' };
  }
}
