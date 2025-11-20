import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: PrismaService,
          useValue: {
            notification: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              updateMany: jest.fn(),
              count: jest.fn(),
            },
            client: {
              findUnique: jest.fn(),
            },
            appointment: {
              findUnique: jest.fn(),
            },
            pet: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createNotification', () => {
    it('should create a notification successfully', async () => {
      const mockNotification = {
        id: '1',
        title: 'Test Notification',
        message: 'Test message',
        type: 'INFO' as any,
        clientId: 'client-1',
        groomerId: null,
        appointmentId: null,
        templateId: null,
        isRead: false,
        readAt: null,
        data: null,
        actionLabel: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prismaService.notification, 'create')
        .mockResolvedValue(mockNotification);

      const result = await service.createNotification({
        title: 'Test Notification',
        message: 'Test message',
        type: 'INFO',
        clientId: 'client-1',
      });

      expect(result).toEqual(mockNotification);
      expect(prismaService.notification.create).toHaveBeenCalledWith({
        data: {
          title: 'Test Notification',
          message: 'Test message',
          type: 'INFO',
          clientId: 'client-1',
          isRead: false,
        },
      });
    });
  });

  describe('getClientNotifications', () => {
    it('should return client notifications', async () => {
      const mockNotifications = [
        {
          id: '1',
          title: 'Test Notification',
          message: 'Test message',
          type: 'INFO',
          isRead: false,
          createdAt: new Date(),
        },
      ];

      jest
        .spyOn(prismaService.notification, 'findMany')
        .mockResolvedValue(mockNotifications);

      const result = await service.getClientNotifications('client-1');

      expect(result).toEqual(mockNotifications);
      expect(prismaService.notification.findMany).toHaveBeenCalledWith({
        where: { clientId: 'client-1' },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return only unread notifications when specified', async () => {
      const mockNotifications = [
        {
          id: '1',
          title: 'Test Notification',
          message: 'Test message',
          type: 'INFO',
          isRead: false,
          createdAt: new Date(),
        },
      ];

      jest
        .spyOn(prismaService.notification, 'findMany')
        .mockResolvedValue(mockNotifications);

      await service.getClientNotifications('client-1', true);

      expect(prismaService.notification.findMany).toHaveBeenCalledWith({
        where: {
          clientId: 'client-1',
          isRead: false,
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read for client', async () => {
      const mockUpdateResult = { count: 1 };

      jest
        .spyOn(prismaService.notification, 'updateMany')
        .mockResolvedValue(mockUpdateResult);

      const result = await service.markAsRead(
        'notification-1',
        'client',
        'client-1',
      );

      expect(result).toEqual(mockUpdateResult);
      expect(prismaService.notification.updateMany).toHaveBeenCalledWith({
        where: {
          id: 'notification-1',
          clientId: 'client-1',
        },
        data: {
          isRead: true,
          readAt: expect.any(Date),
        },
      });
    });

    it('should mark notification as read for groomer', async () => {
      const mockUpdateResult = { count: 1 };

      jest
        .spyOn(prismaService.notification, 'updateMany')
        .mockResolvedValue(mockUpdateResult);

      await service.markAsRead('notification-1', 'groomer', 'groomer-1');

      expect(prismaService.notification.updateMany).toHaveBeenCalledWith({
        where: {
          id: 'notification-1',
          groomerId: 'groomer-1',
        },
        data: {
          isRead: true,
          readAt: expect.any(Date),
        },
      });
    });
  });

  describe('getUnreadCount', () => {
    it('should return unread count for client', async () => {
      const mockCount = 5;

      jest
        .spyOn(prismaService.notification, 'count')
        .mockResolvedValue(mockCount);

      const result = await service.getUnreadCount('client', 'client-1');

      expect(result).toBe(mockCount);
      expect(prismaService.notification.count).toHaveBeenCalledWith({
        where: {
          isRead: false,
          clientId: 'client-1',
        },
      });
    });
  });

  describe('sendAppointmentReminder', () => {
    it('should send appointment reminder when within 24 hours', async () => {
      const mockAppointment = {
        id: 'appointment-1',
        dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 horas no futuro
        client: {
          id: 'client-1',
          name: 'João Silva',
          email: 'joao@example.com',
        },
        pet: {
          id: 'pet-1',
          name: 'Rex',
        },
        groomer: {
          id: 'groomer-1',
          name: 'Maria',
        },
      };

      const mockNotification = {
        id: 'notification-1',
        title: 'Lembrete de Agendamento',
        message: 'Test message',
        type: 'REMINDER',
      };

      jest
        .spyOn(prismaService.appointment, 'findUnique')
        .mockResolvedValue(mockAppointment);
      jest
        .spyOn(service, 'createNotification')
        .mockResolvedValue(mockNotification);

      await service.sendAppointmentReminder('appointment-1');

      expect(service.createNotification).toHaveBeenCalledWith({
        title: 'Lembrete de Agendamento',
        message: expect.stringContaining('João Silva'),
        type: 'REMINDER',
        clientId: 'client-1',
        data: {
          appointmentId: 'appointment-1',
          appointmentDate: mockAppointment.dateTime,
        },
      });
    });

    it('should not send reminder when appointment is more than 24 hours away', async () => {
      const mockAppointment = {
        id: 'appointment-1',
        dateTime: new Date(Date.now() + 25 * 60 * 60 * 1000), // 25 horas no futuro
        client: {
          id: 'client-1',
          name: 'João Silva',
          email: 'joao@example.com',
        },
        pet: {
          id: 'pet-1',
          name: 'Rex',
        },
      };

      jest
        .spyOn(prismaService.appointment, 'findUnique')
        .mockResolvedValue(mockAppointment);
      jest.spyOn(service, 'createNotification').mockResolvedValue({} as any);

      await service.sendAppointmentReminder('appointment-1');

      expect(service.createNotification).not.toHaveBeenCalled();
    });
  });

  describe('sendVaccineReminder', () => {
    it('should send vaccine reminder for overdue vaccine', async () => {
      const mockPet = {
        id: 'pet-1',
        name: 'Rex',
        vaccineHistory: [
          {
            name: 'Vacina V8',
            date: new Date(
              Date.now() - 400 * 24 * 60 * 60 * 1000,
            ).toISOString(), // 400 dias atrás
          },
        ],
        client: {
          id: 'client-1',
          name: 'João Silva',
        },
      };

      const mockNotification = {
        id: 'notification-1',
        title: 'Vacina Vencida',
        message: 'Test message',
        type: 'WARNING',
      };

      jest.spyOn(prismaService.pet, 'findUnique').mockResolvedValue(mockPet);
      jest
        .spyOn(service, 'createNotification')
        .mockResolvedValue(mockNotification);

      await service.sendVaccineReminder('pet-1');

      expect(service.createNotification).toHaveBeenCalledWith({
        title: 'Vacina Vencida',
        message: expect.stringContaining('Vacina V8'),
        type: 'WARNING',
        clientId: 'client-1',
        data: {
          petId: 'pet-1',
          vaccineName: 'Vacina V8',
          vaccineDate: expect.any(String),
          daysOverdue: expect.any(Number),
        },
      });
    });
  });

  describe('sendServiceStatusUpdate', () => {
    it('should send service status update for completed service', async () => {
      const mockAppointment = {
        id: 'appointment-1',
        client: {
          id: 'client-1',
          name: 'João Silva',
        },
        pet: {
          id: 'pet-1',
          name: 'Rex',
        },
        groomer: {
          id: 'groomer-1',
          name: 'Maria',
        },
      };

      const mockNotification = {
        id: 'notification-1',
        title: 'Serviço Concluído',
        message: 'Test message',
        type: 'SUCCESS',
      };

      jest
        .spyOn(prismaService.appointment, 'findUnique')
        .mockResolvedValue(mockAppointment);
      jest
        .spyOn(service, 'createNotification')
        .mockResolvedValue(mockNotification);

      await service.sendServiceStatusUpdate('appointment-1', 'COMPLETED');

      expect(service.createNotification).toHaveBeenCalledWith({
        title: 'Serviço Concluído',
        message: expect.stringContaining('Rex'),
        type: 'SUCCESS',
        clientId: 'client-1',
        data: {
          appointmentId: 'appointment-1',
          status: 'COMPLETED',
          petName: 'Rex',
        },
      });
    });
  });
});
