import { Test, TestingModule } from '@nestjs/testing';
import { ClientReviewsController } from './client-reviews.controller';

describe('ClientReviewsController', () => {
  let controller: ClientReviewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientReviewsController],
    }).compile();

    controller = module.get<ClientReviewsController>(ClientReviewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
