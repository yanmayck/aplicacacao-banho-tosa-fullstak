import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Client, Prisma, UserRole } from '@prisma/client';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

const mockPrismaService = {
  client: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const mockClient: Client = {
  id: 'a-uuid',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '1234567890',
  address: '123 Main St',
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: 'user-uuid',
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

describe('ClientsService', () => {
  let service: ClientsService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new client', async () => {
      const createDto = { name: 'John Doe', email: 'john.doe@example.com' };
      const expectedData = { ...createDto, companyId: mockUser.companyId };
      prisma.client.create.mockResolvedValue(mockClient);

      const result = await service.create(createDto, mockUser);

      expect(prisma.client.create).toHaveBeenCalledWith({ data: expectedData });
      expect(result).toEqual(mockClient);
    });

    it('should create a new client for SUPER_ADMIN with explicit companyId', async () => {
      const createDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        companyId: 'other-company',
      };
      prisma.client.create.mockResolvedValue({
        ...mockClient,
        companyId: 'other-company',
      });

      const result = await service.create(createDto, mockSuperAdmin);

      expect(prisma.client.create).toHaveBeenCalledWith({ data: createDto });
      expect(result).toEqual({ ...mockClient, companyId: 'other-company' });
    });
  });

  describe('findAll', () => {
    it('should return an array of clients for company user', async () => {
      prisma.client.findMany.mockResolvedValue([mockClient]);

      const result = await service.findAll(mockUser);

      expect(prisma.client.findMany).toHaveBeenCalledWith({
        where: { companyId: mockUser.companyId },
      });
      expect(result).toEqual([mockClient]);
    });

    it('should return all clients for SUPER_ADMIN', async () => {
      prisma.client.findMany.mockResolvedValue([mockClient]);

      const result = await service.findAll(mockSuperAdmin);

      expect(prisma.client.findMany).toHaveBeenCalledWith({
        where: {},
      });
      expect(result).toEqual([mockClient]);
    });
  });

  describe('findOne', () => {
    it('should return a single client for user in same company', async () => {
      prisma.client.findUnique.mockResolvedValue(mockClient);

      const result = await service.findOne('a-uuid', mockUser);

      expect(prisma.client.findUnique).toHaveBeenCalledWith({
        where: { id: 'a-uuid' },
      });
      expect(result).toEqual(mockClient);
    });

    it('should throw NotFoundException if client is not found', async () => {
      prisma.client.findUnique.mockResolvedValue(null);

      await expect(service.findOne('a-uuid', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if client belongs to different company', async () => {
      const otherCompanyClient = { ...mockClient, companyId: 'other-company' };
      prisma.client.findUnique.mockResolvedValue(otherCompanyClient);

      await expect(service.findOne('a-uuid', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return client for SUPER_ADMIN even from different company', async () => {
      const otherCompanyClient = { ...mockClient, companyId: 'other-company' };
      prisma.client.findUnique.mockResolvedValue(otherCompanyClient);

      const result = await service.findOne('a-uuid', mockSuperAdmin);

      expect(result).toEqual(otherCompanyClient);
    });
  });

  describe('update', () => {
    it('should update a client for user in same company', async () => {
      const updateDto = { name: 'John Doe Updated' };
      const updatedClient = { ...mockClient, ...updateDto };
      prisma.client.findUnique.mockResolvedValue(mockClient);
      prisma.client.update.mockResolvedValue(updatedClient);

      const result = await service.update('a-uuid', updateDto, mockUser);

      expect(prisma.client.update).toHaveBeenCalledWith({
        where: { id: 'a-uuid' },
        data: updateDto,
      });
      expect(result).toEqual(updatedClient);
    });

    it('should throw NotFoundException if client to update is not found', async () => {
      const updateDto = { name: 'John Doe Updated' };
      const error = new Prisma.PrismaClientKnownRequestError(
        'Record to update not found.',
        { code: 'P2025', clientVersion: 'test' },
      );
      prisma.client.findUnique.mockResolvedValue(mockClient);
      prisma.client.update.mockRejectedValue(error);

      await expect(
        service.update('a-uuid', updateDto, mockUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw error if user tries to update client from different company', async () => {
      const otherCompanyClient = { ...mockClient, companyId: 'other-company' };
      prisma.client.findUnique.mockResolvedValue(otherCompanyClient);

      const updateDto = { name: 'John Doe Updated' };

      await expect(
        service.update('a-uuid', updateDto, mockUser),
      ).rejects.toThrow('Acesso negado: Client pertence a outra empresa');
    });

    it('should allow SUPER_ADMIN to update any client', async () => {
      const updateDto = { name: 'John Doe Updated' };
      const updatedClient = { ...mockClient, ...updateDto };
      const otherCompanyClient = { ...mockClient, companyId: 'other-company' };
      prisma.client.findUnique.mockResolvedValue(otherCompanyClient);
      prisma.client.update.mockResolvedValue(updatedClient);

      const result = await service.update('a-uuid', updateDto, mockSuperAdmin);

      expect(result).toEqual(updatedClient);
    });
  });

  describe('remove', () => {
    it('should delete a client for user in same company', async () => {
      prisma.client.findUnique.mockResolvedValue(mockClient);
      prisma.client.delete.mockResolvedValue(mockClient);

      const result = await service.remove('a-uuid', mockUser);

      expect(prisma.client.delete).toHaveBeenCalledWith({
        where: { id: 'a-uuid' },
      });
      expect(result).toEqual(mockClient);
    });

    it('should throw NotFoundException if client to delete is not found', async () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        'Record to delete not found.',
        { code: 'P2025', clientVersion: 'test' },
      );
      prisma.client.findUnique.mockResolvedValue(mockClient);
      prisma.client.delete.mockRejectedValue(error);

      await expect(service.remove('a-uuid', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw error if user tries to delete client from different company', async () => {
      const otherCompanyClient = { ...mockClient, companyId: 'other-company' };
      prisma.client.findUnique.mockResolvedValue(otherCompanyClient);

      await expect(service.remove('a-uuid', mockUser)).rejects.toThrow(
        'Acesso negado: Client pertence a outra empresa',
      );
    });

    it('should allow SUPER_ADMIN to delete any client', async () => {
      const otherCompanyClient = { ...mockClient, companyId: 'other-company' };
      prisma.client.findUnique.mockResolvedValue(otherCompanyClient);
      prisma.client.delete.mockResolvedValue(otherCompanyClient);

      const result = await service.remove('a-uuid', mockSuperAdmin);

      expect(result).toEqual(otherCompanyClient);
    });
  });
});
