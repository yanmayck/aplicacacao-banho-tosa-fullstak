import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User, UserRole } from '@prisma/client';

const mockUsersService = {
  findOneById: jest.fn(),
  updateUser: jest.fn(),
};

const mockUser: Omit<User, 'password'> = {
  id: 'a-uuid',
  email: 'test@example.com',
  name: 'Test User',
  role: UserRole.USER,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: typeof mockUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMyProfile', () => {
    it('should return the user profile', async () => {
      service.findOneById.mockResolvedValue(mockUser);
      const req = { user: { userId: 'a-uuid' } };

      const result = await controller.getMyProfile(req as any);

      expect(service.findOneById).toHaveBeenCalledWith('a-uuid');
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      service.findOneById.mockResolvedValue(null);
      const req = { user: { userId: 'a-uuid' } };

      const result = await controller.getMyProfile(req as any);

      expect(service.findOneById).toHaveBeenCalledWith('a-uuid');
      expect(result).toBeNull();
    });
  });

  describe('updateMyProfile', () => {
    it('should update the user profile', async () => {
      const updateUserDto = { name: 'Updated Name' };
      const updatedUser = { ...mockUser, ...updateUserDto };
      service.updateUser.mockResolvedValue(updatedUser);
      const req = { user: { userId: 'a-uuid' } };

      const result = await controller.updateMyProfile(
        req as any,
        updateUserDto,
      );

      expect(service.updateUser).toHaveBeenCalledWith('a-uuid', updateUserDto);
      expect(result).toEqual(updatedUser);
    });
  });
});
