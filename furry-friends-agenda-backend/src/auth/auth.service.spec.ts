import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';

// Mock services
const mockUsersService = {
  findOneByEmail: jest.fn(),
  findOneById: jest.fn(),
  createUser: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

// Mock data
const mockUser: User = {
  id: 'a-uuid',
  email: 'test@example.com',
  password: 'hashedpassword',
  name: 'Test User',
  role: UserRole.USER,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: typeof mockUsersService;
  let jwtService: typeof mockJwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        // PrismaService is a dependency but not directly used in AuthService methods being tested
        // It's used via UsersService, which is mocked.
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data without password if validation is successful', async () => {
      usersService.findOneByEmail.mockResolvedValue(mockUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));

      const { password, ...expectedResult } = mockUser;
      const result = await service.validateUser(
        'test@example.com',
        'password123',
      );

      expect(result).toEqual(expectedResult);
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
    });

    it('should return null if user is not found', async () => {
      usersService.findOneByEmail.mockResolvedValue(null);
      const result = await service.validateUser(
        'wrong@example.com',
        'password123',
      );
      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      usersService.findOneByEmail.mockResolvedValue(mockUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));
      const result = await service.validateUser(
        'test@example.com',
        'wrongpassword',
      );
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token and user info on successful login', async () => {
      const { password, ...validateUserResult } = mockUser; // Full user data minus password
      jest.spyOn(service, 'validateUser').mockResolvedValue(validateUserResult);
      usersService.findOneById.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue('test-token');

      const result = await service.login({
        email: 'test@example.com',
        password: 'password123',
      });

      const expectedUserPayload = {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
      };

      expect(result.access_token).toBe('test-token');
      expect(result.user).toEqual(expectedUserPayload);
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: mockUser.email,
        sub: mockUser.id,
        role: mockUser.role,
      });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);
      await expect(
        service.login({ email: 'test@example.com', password: 'wrongpassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should create a new user and return user data without password', async () => {
      const registerDto = {
        email: 'new@example.com',
        password: 'newpassword',
        name: 'New User',
      };
      const createdUser = { ...mockUser, ...registerDto, id: 'new-uuid' };
      usersService.createUser.mockResolvedValue(createdUser);

      const { password, ...expectedResult } = createdUser;
      const result = await service.register(registerDto);

      expect(usersService.createUser).toHaveBeenCalledWith(
        expect.objectContaining({ email: registerDto.email }),
      );
      expect(result).toEqual(expectedResult);
    });

    it('should throw ConflictException if user already exists', async () => {
      usersService.createUser.mockRejectedValue(new ConflictException());
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
