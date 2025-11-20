import { Test, TestingModule } from '@nestjs/testing';
import { UsersService, roundsOfHashing } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { User, UserRole, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const mockPrismaService = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

const mockUser: User = {
  id: 'a-uuid',
  email: 'test@example.com',
  password: 'hashedpassword',
  name: 'Test User',
  role: UserRole.USER,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should hash the password and create a new user', async () => {
      const createDto = {
        email: 'new@example.com',
        password: 'password123',
        name: 'New User',
      };
      const hashedPassword = 'hashedpassword';
      const createdUser = {
        ...mockUser,
        ...createDto,
        password: hashedPassword,
      };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(createdUser);

      const result = await service.createUser(createDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', roundsOfHashing);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { ...createDto, password: hashedPassword },
      });
      expect(result).toEqual(createdUser);
    });

    it('should throw ConflictException if user already exists', async () => {
      const createDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };
      prisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.createUser(createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findOneById', () => {
    it('should return a user if found', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      const result = await service.findOneById('a-uuid');
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      const result = await service.findOneById('a-uuid');
      expect(result).toBeNull();
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user if found', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      const result = await service.findOneByEmail('test@example.com');
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      const result = await service.findOneByEmail('test@example.com');
      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updateDto = { name: 'Updated Name' };
      const updatedUser = { ...mockUser, ...updateDto };
      prisma.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateUser('a-uuid', updateDto);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'a-uuid' },
        data: updateDto,
      });
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user to update is not found', async () => {
      const updateDto = { name: 'Updated Name' };
      const error = new Prisma.PrismaClientKnownRequestError(
        'Record to update not found.',
        { code: 'P2025', clientVersion: 'test' },
      );
      prisma.user.update.mockRejectedValue(error);

      await expect(service.updateUser('a-uuid', updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
