import { Test, TestingModule } from '@nestjs/testing';
import { PublicClientController } from './public-client.controller';

describe('PublicClientController', () => {
  let controller: PublicClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicClientController],
    }).compile();

    controller = module.get<PublicClientController>(PublicClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
