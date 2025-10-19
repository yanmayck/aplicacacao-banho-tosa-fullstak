import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsAdminController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

const mockNotificationsService = {
  createNotification: jest.fn(),
  sendAppointmentReminder: jest.fn(),
  sendAppointmentConfirmation: jest.fn(),
  sendVaccineReminder: jest.fn(),
  sendServiceStatusUpdate: jest.fn(),
  sendPaymentReminder: jest.fn(),
  sendLoyaltyPointsNotification: jest.fn(),
  sendSpecialOffer: jest.fn(),
  sendPetBirthdayReminder: jest.fn(),
  sendBulkNotifications: jest.fn(),
  getNotificationHistory: jest.fn(),
  getNotificationStats: jest.fn(),
};

describe('NotificationsAdminController', () => {
  let controller: NotificationsAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsAdminController],
      providers: [
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    }).compile();

    controller = module.get<NotificationsAdminController>(NotificationsAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
