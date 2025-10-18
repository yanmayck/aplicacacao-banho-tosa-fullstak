import { Test, TestingModule } from '@nestjs/testing';
import { ClientPetHealthController } from './client-pet-health.controller';

describe('ClientPetHealthController', () => {
  let controller: ClientPetHealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientPetHealthController],
    }).compile();

    controller = module.get<ClientPetHealthController>(ClientPetHealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
