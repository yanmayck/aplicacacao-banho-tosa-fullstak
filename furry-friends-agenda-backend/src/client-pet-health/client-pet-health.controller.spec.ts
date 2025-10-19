import { Test, TestingModule } from '@nestjs/testing';
import { ClientPetHealthController } from './client-pet-health.controller';
import { ClientPetHealthService } from './client-pet-health.service';
import { JwtClientGuard } from '../public-client/guards/jwt-client.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

const mockClientPetHealthService = {
  findPetHealthHistory: jest.fn(),
};

describe('ClientPetHealthController', () => {
  let controller: ClientPetHealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientPetHealthController],
      providers: [
        { provide: ClientPetHealthService, useValue: mockClientPetHealthService },
        { provide: JwtService, useValue: { sign: jest.fn(), verify: jest.fn() } },
        { provide: Reflector, useValue: { getAllAndOverride: jest.fn() } },
      ],
    })
      .overrideGuard(JwtClientGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ClientPetHealthController>(
      ClientPetHealthController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
