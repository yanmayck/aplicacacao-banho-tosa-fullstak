import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserRole } from '@prisma/client';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtAuthGuard],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('handleRequest', () => {
    it('should return the user if there is no error and user is found', () => {
      const user: JwtPayload = {
        userId: 'a-uuid',
        username: 'test',
        role: UserRole.USER,
      };
      const mockContext = {} as ExecutionContext;
      const result = guard.handleRequest(null, user, null, mockContext);
      expect(result).toEqual(user);
    });

    it('should throw an error if there is an error', () => {
      const err = new Error('Test Error');
      const mockContext = {} as ExecutionContext;
      expect(() => guard.handleRequest(err, null, null, mockContext)).toThrow(
        err,
      );
    });

    it('should throw UnauthorizedException if there is no user', () => {
      const mockContext = {} as ExecutionContext;
      expect(() => guard.handleRequest(null, null, null, mockContext)).toThrow(
        UnauthorizedException,
      );
    });
  });
});
