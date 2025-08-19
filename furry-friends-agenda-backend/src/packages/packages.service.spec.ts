import { Test, TestingModule } from '@nestjs/testing';
import { PackagesService } from './packages.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Package, Prisma } from '@prisma/client';

const mockPrismaService = {
  package: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const mockPackage: Package = {
  id: 'a-uuid',
  name: 'Test Package',
  description: 'Test Description',
  includesBaths: 4,
  includesGrooming: true,
  includesHydration: true,
  basePrice: 100,
  pickupPrice: 120,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('PackagesService', () => {
  let service: PackagesService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PackagesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PackagesService>(PackagesService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new package', async () => {
      const createDto = {
        name: 'Test Package',
        description: 'Test Description',
        includesBaths: 4,
        includesGrooming: true,
        includesHydration: true,
        basePrice: 100,
        pickupPrice: 120,
      };
      prisma.package.create.mockResolvedValue(mockPackage);

      const result = await service.create(createDto);

      expect(prisma.package.create).toHaveBeenCalledWith({ data: createDto });
      expect(result).toEqual(mockPackage);
    });
  });

  describe('findAll', () => {
    it('should return an array of packages', async () => {
      prisma.package.findMany.mockResolvedValue([mockPackage]);

      const result = await service.findAll();

      expect(prisma.package.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockPackage]);
    });
  });

  describe('findOne', () => {
    it('should return a single package', async () => {
      prisma.package.findUnique.mockResolvedValue(mockPackage);

      const result = await service.findOne('a-uuid');

      expect(prisma.package.findUnique).toHaveBeenCalledWith({ where: { id: 'a-uuid' } });
      expect(result).toEqual(mockPackage);
    });

    it('should throw NotFoundException if package is not found', async () => {
      prisma.package.findUnique.mockResolvedValue(null);

      await expect(service.findOne('a-uuid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a package', async () => {
      const updateDto = { name: 'Package Updated' };
      const updatedPackage = { ...mockPackage, ...updateDto };
      prisma.package.update.mockResolvedValue(updatedPackage);

      const result = await service.update('a-uuid', updateDto);

      expect(prisma.package.update).toHaveBeenCalledWith({ where: { id: 'a-uuid' }, data: updateDto });
      expect(result).toEqual(updatedPackage);
    });

    it('should throw NotFoundException if package to update is not found', async () => {
      const updateDto = { name: 'Package Updated' };
      const error = new Prisma.PrismaClientKnownRequestError('Record to update not found.', { code: 'P2025', clientVersion: 'test' });
      prisma.package.update.mockRejectedValue(error);

      await expect(service.update('a-uuid', updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a package', async () => {
      prisma.package.delete.mockResolvedValue(mockPackage);

      const result = await service.remove('a-uuid');

      expect(prisma.package.delete).toHaveBeenCalledWith({ where: { id: 'a-uuid' } });
      expect(result).toEqual(mockPackage);
    });

    it('should throw NotFoundException if package to delete is not found', async () => {
      const error = new Prisma.PrismaClientKnownRequestError('Record to delete not found.', { code: 'P2025', clientVersion: 'test' });
      prisma.package.delete.mockRejectedValue(error);

      await expect(service.remove('a-uuid')).rejects.toThrow(NotFoundException);
    });
  });
});
