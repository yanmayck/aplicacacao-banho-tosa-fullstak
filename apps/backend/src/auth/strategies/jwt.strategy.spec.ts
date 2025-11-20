import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '@prisma/client';

const mockConfigService = {
  get: jest.fn((key: string) => {
    if (key === 'JWT_SECRET') {
      return 'test-secret';
    }
    return null;
  }),
};

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return the user payload', () => {
      const payload = {
        sub: 'a-uuid',
        username: 'test@example.com',
        role: UserRole.USER,
      };
      const result = strategy.validate(payload);
      expect(result).toEqual({
        userId: 'a-uuid',
        username: 'test@example.com',
        role: UserRole.USER,
      });
    });
  });
});
