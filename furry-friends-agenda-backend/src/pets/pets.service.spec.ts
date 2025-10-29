import { Test, TestingModule } from '@nestjs/testing';
import { PetsService } from './pets.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { Pet, Client, UserRole } from '@prisma/client';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

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
  companyId: 'company-uuid',
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
  companyId: 'company-uuid',
};

const mockUser: JwtPayload = {
  userId: 'user-uuid',
  username: 'testuser',
  role: UserRole.COMPANY_ADMIN,
  companyId: 'company-uuid',
};

const mockSuperAdmin: JwtPayload = {
  userId: 'super-uuid',
  username: 'superadmin',
  role: UserRole.SUPER_ADMIN,
  companyId: 'super-company-uuid',
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
    it('should create a pet for a valid client in same company', async () => {
      prisma.client.findUnique.mockResolvedValue(mockClient);
      prisma.pet.create.mockResolvedValue(mockPet);
      const createDto = {
        name: 'Fido',
        species: 'Dog',
        clientId: 'client-uuid',
      };

      const result = await service.create(createDto, mockUser);

      expect(prisma.client.findUnique).toHaveBeenCalledWith({
        where: { id: 'client-uuid' },
        select: { id: true, companyId: true },
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

      await expect(service.create(createDto, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if client belongs to different company', async () => {
      const otherCompanyClient = { ...mockClient, companyId: 'other-company' };
      prisma.client.findUnique.mockResolvedValue(otherCompanyClient);
      const createDto = {
        name: 'Fido',
        species: 'Dog',
        clientId: 'client-uuid',
      };

      await expect(service.create(createDto, mockUser)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should allow SUPER_ADMIN to create pet for any client', async () => {
      const otherCompanyClient = { ...mockClient, companyId: 'other-company' };
      prisma.client.findUnique.mockResolvedValue(otherCompanyClient);
      prisma.pet.create.mockResolvedValue({
        ...mockPet,
        companyId: 'other-company',
      });
      const createDto = {
        name: 'Fido',
        species: 'Dog',
        clientId: 'client-uuid',
        companyId: 'other-company',
      };

      const result = await service.create(createDto, mockSuperAdmin);

      expect(result).toEqual({ ...mockPet, companyId: 'other-company' });
    });
  });

  describe('findOneByOwner', () => {
    it('should return a pet if found and owned by the client in same company', async () => {
      prisma.client.findUnique.mockResolvedValue(mockClient);
      prisma.pet.findUnique.mockResolvedValue(mockPet);
      const result = await service.findOneByOwner(
        'pet-uuid',
        'client-uuid',
        mockUser,
      );
      expect(result).toEqual(mockPet);
    });

    it('should throw NotFoundException if pet not found', async () => {
      prisma.client.findUnique.mockResolvedValue(mockClient);
      prisma.pet.findUnique.mockResolvedValue(null);
      await expect(
        service.findOneByOwner('wrong-pet-uuid', 'client-uuid', mockUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if pet is not owned by the client', async () => {
      prisma.client.findUnique.mockResolvedValue(mockClient);
      prisma.pet.findUnique.mockResolvedValue(mockPet);
      await expect(
        service.findOneByOwner('pet-uuid', 'wrong-client-uuid', mockUser),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if client belongs to different company', async () => {
      const otherCompanyClient = { ...mockClient, companyId: 'other-company' };
      prisma.client.findUnique.mockResolvedValue(otherCompanyClient);
      await expect(
        service.findOneByOwner('pet-uuid', 'client-uuid', mockUser),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow SUPER_ADMIN to access any pet', async () => {
      const otherCompanyClient = { ...mockClient, companyId: 'other-company' };
      const otherCompanyPet = { ...mockPet, companyId: 'other-company' };
      prisma.client.findUnique.mockResolvedValue(otherCompanyClient);
      prisma.pet.findUnique.mockResolvedValue(otherCompanyPet);
      const result = await service.findOneByOwner(
        'pet-uuid',
        'client-uuid',
        mockSuperAdmin,
      );
      expect(result).toEqual(otherCompanyPet);
    });
  });

  // Similar tests for findAllByOwner, update, and remove can be added here
});
