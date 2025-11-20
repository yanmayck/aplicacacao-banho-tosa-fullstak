import { Test, TestingModule } from '@nestjs/testing';
import { GroomersService } from './groomers.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Groomer, Prisma } from '@prisma/client';

const mockPrismaService = {
  groomer: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const mockGroomer: Groomer = {
  id: 'a-uuid',
  name: 'Test Groomer',
  phone: '123456789',
  email: 'groomer@test.com',
  specialties: ['Tosa'],
  status: 'available',
  commissionPercentage: 20,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('GroomersService', () => {
  let service: GroomersService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroomersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<GroomersService>(GroomersService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new groomer', async () => {
      const createDto = { name: 'Test Groomer', email: 'groomer@test.com' };
      prisma.groomer.create.mockResolvedValue(mockGroomer);

      const result = await service.create(createDto);

      expect(prisma.groomer.create).toHaveBeenCalledWith({ data: createDto });
      expect(result).toEqual(mockGroomer);
    });
  });

  describe('findAll', () => {
    it('should return an array of groomers', async () => {
      prisma.groomer.findMany.mockResolvedValue([mockGroomer]);

      const result = await service.findAll();

      expect(prisma.groomer.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockGroomer]);
    });
  });

  describe('findOne', () => {
    it('should return a single groomer', async () => {
      prisma.groomer.findUnique.mockResolvedValue(mockGroomer);

      const result = await service.findOne('a-uuid');

      expect(prisma.groomer.findUnique).toHaveBeenCalledWith({
        where: { id: 'a-uuid' },
      });
      expect(result).toEqual(mockGroomer);
    });

    it('should throw NotFoundException if groomer is not found', async () => {
      prisma.groomer.findUnique.mockResolvedValue(null);

      await expect(service.findOne('a-uuid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a groomer', async () => {
      const updateDto = { name: 'Groomer Updated' };
      const updatedGroomer = { ...mockGroomer, ...updateDto };
      prisma.groomer.update.mockResolvedValue(updatedGroomer);

      const result = await service.update('a-uuid', updateDto);

      expect(prisma.groomer.update).toHaveBeenCalledWith({
        where: { id: 'a-uuid' },
        data: updateDto,
      });
      expect(result).toEqual(updatedGroomer);
    });

    it('should throw NotFoundException if groomer to update is not found', async () => {
      const updateDto = { name: 'Groomer Updated' };
      const error = new Prisma.PrismaClientKnownRequestError(
        'Record to update not found.',
        { code: 'P2025', clientVersion: 'test' },
      );
      prisma.groomer.update.mockRejectedValue(error);

      await expect(service.update('a-uuid', updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a groomer', async () => {
      prisma.groomer.delete.mockResolvedValue(mockGroomer);

      const result = await service.remove('a-uuid');

      expect(prisma.groomer.delete).toHaveBeenCalledWith({
        where: { id: 'a-uuid' },
      });
      expect(result).toEqual(mockGroomer);
    });

    it('should throw NotFoundException if groomer to delete is not found', async () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        'Record to delete not found.',
        { code: 'P2025', clientVersion: 'test' },
      );
      prisma.groomer.delete.mockRejectedValue(error);

      await expect(service.remove('a-uuid')).rejects.toThrow(NotFoundException);
    });
  });
});
