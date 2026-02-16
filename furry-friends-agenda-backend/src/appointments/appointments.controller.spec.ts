import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';

const mockAppointmentsService = {
  create: jest.fn(),
  findAllByClient: jest.fn(),
  findOneByClient: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockUser = {
  userId: 'user-uuid',
  username: 'test@test.com',
  role: UserRole.USER,
};
const mockAppointment = {
  id: 'appt-uuid',
  clientId: 'user-uuid',
  petId: 'pet-uuid',
  totalPrice: 50,
};

describe('AppointmentsController', () => {
  let controller: AppointmentsController;
  let service: typeof mockAppointmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        { provide: AppointmentsService, useValue: mockAppointmentsService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
    service = module.get(AppointmentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an appointment', async () => {
      const createDto = {
        petId: 'pet-uuid',
        serviceIds: ['service-uuid'],
        dateTime: new Date().toISOString(),
        groomerId: 'groomer-uuid',
      };
      service.create.mockResolvedValue(mockAppointment);
      await controller.create(createDto, { user: mockUser });
      expect(service.create).toHaveBeenCalledWith(createDto, mockUser.userId);
    });
  });

  describe('findAll', () => {
    it('should find all appointments for a user with pagination', async () => {
      service.findAllByClient.mockResolvedValue([mockAppointment]);
      await controller.findAll({ user: mockUser }, 1, 10);
      expect(service.findAllByClient).toHaveBeenCalledWith(
        mockUser.userId,
        1,
        10,
      );
    });

    it('should find all appointments for a user without pagination', async () => {
      service.findAllByClient.mockResolvedValue([mockAppointment]);
      await controller.findAll({ user: mockUser }, undefined, undefined);
      expect(service.findAllByClient).toHaveBeenCalledWith(
        mockUser.userId,
        undefined,
        undefined,
      );
    });
  });

  describe('findOne', () => {
    it('should find a single appointment', async () => {
      service.findOneByClient.mockResolvedValue(mockAppointment);
      await controller.findOne('appt-uuid', { user: mockUser });
      expect(service.findOneByClient).toHaveBeenCalledWith(
        'appt-uuid',
        mockUser.userId,
      );
    });
  });

  describe('update', () => {
    it('should update an appointment', async () => {
      const updateDto = { notes: 'Updated notes' };
      service.update.mockResolvedValue({ ...mockAppointment, ...updateDto });
      await controller.update('appt-uuid', updateDto, { user: mockUser });
      expect(service.update).toHaveBeenCalledWith(
        'appt-uuid',
        updateDto,
        mockUser.userId,
      );
    });
  });

  describe('remove', () => {
    it('should remove an appointment', async () => {
      service.remove.mockResolvedValue(mockAppointment);
      await controller.remove('appt-uuid', { user: mockUser });
      expect(service.remove).toHaveBeenCalledWith('appt-uuid', mockUser.userId);
    });
  });
});
