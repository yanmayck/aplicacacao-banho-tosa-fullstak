import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';

const mockPrismaService = {
  appointment: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  pet: {
    findUnique: jest.fn(),
  },
  groomer: {
    findUnique: jest.fn(),
  },
  servicePackage: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  appointmentService: {
    deleteMany: jest.fn(),
  },
};

const mockPet = { id: 'pet-uuid', clientId: 'client-uuid' };
const mockGroomer = { id: 'groomer-uuid' };
const mockService = { id: 'service-uuid', price: 50 };
const mockAppointment = { id: 'appt-uuid', clientId: 'client-uuid', petId: 'pet-uuid' };

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createDto = { petId: 'pet-uuid', serviceIds: ['service-uuid'], dateTime: new Date().toISOString(), groomerId: 'groomer-uuid' };

    it('should create an appointment successfully', async () => {
      prisma.pet.findUnique.mockResolvedValue(mockPet);
      prisma.groomer.findUnique.mockResolvedValue(mockGroomer);
      prisma.servicePackage.findUnique.mockResolvedValue(mockService);
      prisma.appointment.create.mockResolvedValue(mockAppointment);

      const result = await service.create(createDto, 'client-uuid');
      expect(result).toEqual(mockAppointment);
      expect(prisma.appointment.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException if pet not found', async () => {
      prisma.pet.findUnique.mockResolvedValue(null);
      await expect(service.create(createDto, 'client-uuid')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if pet does not belong to client', async () => {
      prisma.pet.findUnique.mockResolvedValue({ ...mockPet, clientId: 'another-client' });
      await expect(service.create(createDto, 'client-uuid')).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if no serviceIds are provided', async () => {
      const dtoWithNoServices = { ...createDto, serviceIds: [] };
      prisma.pet.findUnique.mockResolvedValue(mockPet);
      await expect(service.create(dtoWithNoServices, 'client-uuid')).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if a service is not found', async () => {
        prisma.pet.findUnique.mockResolvedValue(mockPet);
        prisma.groomer.findUnique.mockResolvedValue(mockGroomer);
        prisma.servicePackage.findUnique.mockResolvedValue(null);
        await expect(service.create(createDto, 'client-uuid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneByClient', () => {
    it('should return an appointment if found and owned by client', async () => {
        prisma.appointment.findUnique.mockResolvedValue(mockAppointment);
        const result = await service.findOneByClient('appt-uuid', 'client-uuid');
        expect(result).toEqual(mockAppointment);
    });

    it('should throw ForbiddenException if appointment not owned by client', async () => {
        prisma.appointment.findUnique.mockResolvedValue({ ...mockAppointment, clientId: 'another-client' });
        await expect(service.findOneByClient('appt-uuid', 'client-uuid')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    const updateDto = { serviceIds: ['service-uuid'] };

    it('should update an appointment services successfully', async () => {
        prisma.appointment.findUnique.mockResolvedValue(mockAppointment); // for findOneByClient
        prisma.servicePackage.findMany.mockResolvedValue([mockService]);
        prisma.appointment.update.mockResolvedValue(mockAppointment);

        const result = await service.update('appt-uuid', updateDto, 'client-uuid');
        expect(result).toEqual(mockAppointment);
        expect(prisma.servicePackage.findMany).toHaveBeenCalledWith({
            where: { id: { in: ['service-uuid'] } }
        });
    });

    it('should throw NotFoundException if a service is not found during update', async () => {
        prisma.appointment.findUnique.mockResolvedValue(mockAppointment);
        prisma.servicePackage.findMany.mockResolvedValue([]); // No service found

        await expect(service.update('appt-uuid', updateDto, 'client-uuid')).rejects.toThrow(NotFoundException);
    });
  });
});
