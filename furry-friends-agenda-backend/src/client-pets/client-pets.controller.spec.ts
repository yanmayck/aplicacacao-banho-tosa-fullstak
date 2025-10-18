import { Test, TestingModule } from '@nestjs/testing';
import { ClientPetsController } from './client-pets.controller';

describe('ClientPetsController', () => {
  let controller: ClientPetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientPetsController],
    }).compile();

    controller = module.get<ClientPetsController>(ClientPetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
