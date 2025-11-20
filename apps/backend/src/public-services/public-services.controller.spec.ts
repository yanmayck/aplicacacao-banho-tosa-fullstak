import { Test, TestingModule } from '@nestjs/testing';
import { PublicServicesController } from './public-services.controller';

describe('PublicServicesController', () => {
  let controller: PublicServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicServicesController],
    }).compile();

    controller = module.get<PublicServicesController>(PublicServicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
