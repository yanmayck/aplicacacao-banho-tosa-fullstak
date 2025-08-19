import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

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
      const user = { id: 'a-uuid', username: 'test' };
      const result = guard.handleRequest(null, user);
      expect(result).toEqual(user);
    });

    it('should throw an error if there is an error', () => {
      const err = new Error('Test Error');
      expect(() => guard.handleRequest(err, null)).toThrow(err);
    });

    it('should throw UnauthorizedException if there is no user', () => {
      expect(() => guard.handleRequest(null, null)).toThrow(UnauthorizedException);
    });
  });
});
