import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Client, Prisma } from '@prisma/client';

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
      prisma.client.create.mockResolvedValue(mockClient);

      const result = await service.create(createDto);

      expect(prisma.client.create).toHaveBeenCalledWith({ data: createDto });
      expect(result).toEqual(mockClient);
    });
  });

  describe('findAll', () => {
    it('should return an array of clients', async () => {
      prisma.client.findMany.mockResolvedValue([mockClient]);

      const result = await service.findAll();

      expect(prisma.client.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockClient]);
    });
  });

  describe('findOne', () => {
    it('should return a single client', async () => {
      prisma.client.findUnique.mockResolvedValue(mockClient);

      const result = await service.findOne('a-uuid');

      expect(prisma.client.findUnique).toHaveBeenCalledWith({ where: { id: 'a-uuid' } });
      expect(result).toEqual(mockClient);
    });

    it('should throw NotFoundException if client is not found', async () => {
      prisma.client.findUnique.mockResolvedValue(null);

      await expect(service.findOne('a-uuid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a client', async () => {
      const updateDto = { name: 'John Doe Updated' };
      const updatedClient = { ...mockClient, ...updateDto };
      prisma.client.update.mockResolvedValue(updatedClient);

      const result = await service.update('a-uuid', updateDto);

      expect(prisma.client.update).toHaveBeenCalledWith({ where: { id: 'a-uuid' }, data: updateDto });
      expect(result).toEqual(updatedClient);
    });

    it('should throw NotFoundException if client to update is not found', async () => {
      const updateDto = { name: 'John Doe Updated' };
      const error = new Prisma.PrismaClientKnownRequestError('Record to update not found.', { code: 'P2025', clientVersion: 'test' });
      prisma.client.update.mockRejectedValue(error);

      await expect(service.update('a-uuid', updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a client', async () => {
      prisma.client.delete.mockResolvedValue(mockClient);

      const result = await service.remove('a-uuid');

      expect(prisma.client.delete).toHaveBeenCalledWith({ where: { id: 'a-uuid' } });
      expect(result).toEqual(mockClient);
    });

    it('should throw NotFoundException if client to delete is not found', async () => {
      const error = new Prisma.PrismaClientKnownRequestError('Record to delete not found.', { code: 'P2025', clientVersion: 'test' });
      prisma.client.delete.mockRejectedValue(error);

      await expect(service.remove('a-uuid')).rejects.toThrow(NotFoundException);
    });
  });
});
