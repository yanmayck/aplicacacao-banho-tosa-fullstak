import { Test, TestingModule } from '@nestjs/testing';
import { PetsService } from './pets.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { Pet, Client } from '@prisma/client';

const mockPrismaService = {
  pet: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  client: {
    findUnique: jest.fn(),
  },
};

const mockClient: Client = {
  id: 'client-uuid',
  userId: 'user-uuid',
  name: 'Test Client',
  email: 'client@test.com',
  phone: null,
  address: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPet: Pet = {
  id: 'pet-uuid',
  name: 'Fido',
  species: 'Dog',
  clientId: 'client-uuid',
  breed: null,
  birthDate: null,
  observations: null,
  foodType: null,
  lastTickMedicine: null,
  rabiesVaccine: null,
  vaccineHistory: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('PetsService', () => {
  let service: PetsService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PetsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PetsService>(PetsService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a pet for a valid client', async () => {
      prisma.client.findUnique.mockResolvedValue(mockClient);
      prisma.pet.create.mockResolvedValue(mockPet);
      const createDto = {
        name: 'Fido',
        species: 'Dog',
        clientId: 'client-uuid',
      };

      const result = await service.create(createDto, 'user-uuid');

      expect(prisma.client.findUnique).toHaveBeenCalledWith({
        where: { userId: 'user-uuid' },
      });
      expect(prisma.pet.create).toHaveBeenCalled();
      expect(result).toEqual(mockPet);
    });

    it('should throw NotFoundException if client does not exist', async () => {
      prisma.client.findUnique.mockResolvedValue(null);
      const createDto = {
        name: 'Fido',
        species: 'Dog',
        clientId: 'client-uuid',
      };

      await expect(
        service.create(createDto, 'non-existent-user-uuid'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should create a pet with nested objects correctly', async () => {
      prisma.client.findUnique.mockResolvedValue(mockClient);
      const nestedDto = {
        name: 'Fido',
        species: 'Dog',
        clientId: 'client-uuid',
        lastTickMedicine: { name: 'M1', date: '2023-01-01' },
        rabiesVaccine: { isUpToDate: true, lastDate: '2023-01-01' },
        vaccineHistory: [{ name: 'V1', date: '2023-01-01' }],
      };

      const createdPet = { ...mockPet, ...nestedDto };
      prisma.pet.create.mockResolvedValue(createdPet as any);

      const result = await service.create(nestedDto, 'user-uuid');

      expect(prisma.pet.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Fido',
          lastTickMedicine: nestedDto.lastTickMedicine,
          rabiesVaccine: nestedDto.rabiesVaccine,
          vaccineHistory: nestedDto.vaccineHistory,
          client: { connect: { id: mockClient.id } },
        }),
      });
      expect(result).toEqual(createdPet);
    });
  });

  describe('findOneByOwner', () => {
    it('should return a pet if found and owned by the client', async () => {
      prisma.pet.findUnique.mockResolvedValue(mockPet);
      const result = await service.findOneByOwner('pet-uuid', 'client-uuid');
      expect(result).toEqual(mockPet);
    });

    it('should throw NotFoundException if pet not found', async () => {
      prisma.pet.findUnique.mockResolvedValue(null);
      await expect(
        service.findOneByOwner('wrong-pet-uuid', 'client-uuid'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if pet is not owned by the client', async () => {
      prisma.pet.findUnique.mockResolvedValue(mockPet);
      await expect(
        service.findOneByOwner('pet-uuid', 'wrong-client-uuid'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // Similar tests for findAllByOwner, update, and remove can be added here
});
