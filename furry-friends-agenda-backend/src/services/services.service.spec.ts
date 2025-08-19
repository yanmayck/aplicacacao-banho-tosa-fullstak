import { Test, TestingModule } from '@nestjs/testing';
import { ServicesService } from './services.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { ServicePackage, Prisma } from '@prisma/client';

const mockPrismaService = {
  servicePackage: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const mockService: ServicePackage = {
  id: 'a-uuid',
  name: 'Test Service',
  description: 'Test Description',
  price: 50,
  durationMin: 30,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ServicesService', () => {
  let service: ServicesService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new service', async () => {
      const createDto = {
        name: 'Test Service',
        description: 'Test Description',
        price: 50,
        durationMin: 30,
      };
      prisma.servicePackage.create.mockResolvedValue(mockService);

      const result = await service.create(createDto);

      expect(prisma.servicePackage.create).toHaveBeenCalledWith({ data: createDto });
      expect(result).toEqual(mockService);
    });

    it('should throw ConflictException if service name already exists', async () => {
        const createDto = { name: 'Test Service', description: '... ', price: 50, durationMin: 30 };
        const error = new Prisma.PrismaClientKnownRequestError('...', { code: 'P2002', clientVersion: 'test' });
        prisma.servicePackage.create.mockRejectedValue(error);

        await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an array of services', async () => {
      prisma.servicePackage.findMany.mockResolvedValue([mockService]);

      const result = await service.findAll();

      expect(prisma.servicePackage.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockService]);
    });
  });

  describe('findOne', () => {
    it('should return a single service', async () => {
      prisma.servicePackage.findUnique.mockResolvedValue(mockService);

      const result = await service.findOne('a-uuid');

      expect(prisma.servicePackage.findUnique).toHaveBeenCalledWith({ where: { id: 'a-uuid' } });
      expect(result).toEqual(mockService);
    });

    it('should throw NotFoundException if service is not found', async () => {
      prisma.servicePackage.findUnique.mockResolvedValue(null);

      await expect(service.findOne('a-uuid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a service', async () => {
      const updateDto = { name: 'Service Updated' };
      const updatedService = { ...mockService, ...updateDto };
      prisma.servicePackage.update.mockResolvedValue(updatedService);

      const result = await service.update('a-uuid', updateDto);

      expect(prisma.servicePackage.update).toHaveBeenCalledWith({ where: { id: 'a-uuid' }, data: updateDto });
      expect(result).toEqual(updatedService);
    });

    it('should throw NotFoundException if service to update is not found', async () => {
      const updateDto = { name: 'Service Updated' };
      const error = new Prisma.PrismaClientKnownRequestError('Record to update not found.', { code: 'P2025', clientVersion: 'test' });
      prisma.servicePackage.update.mockRejectedValue(error);

      await expect(service.update('a-uuid', updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a service', async () => {
      prisma.servicePackage.delete.mockResolvedValue(mockService);

      const result = await service.remove('a-uuid');

      expect(prisma.servicePackage.delete).toHaveBeenCalledWith({ where: { id: 'a-uuid' } });
      expect(result).toEqual(mockService);
    });

    it('should throw NotFoundException if service to delete is not found', async () => {
      const error = new Prisma.PrismaClientKnownRequestError('Record to delete not found.', { code: 'P2025', clientVersion: 'test' });
      prisma.servicePackage.delete.mockRejectedValue(error);

      await expect(service.remove('a-uuid')).rejects.toThrow(NotFoundException);
    });
  });
});
