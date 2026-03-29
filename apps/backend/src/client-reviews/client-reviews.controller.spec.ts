import { Test, TestingModule } from '@nestjs/testing';
import { ClientReviewsController } from './client-reviews.controller';
import { ClientReviewsService } from './client-reviews.service';
import { JwtClientGuard } from '../public-client/guards/jwt-client.guard';

describe('ClientReviewsController', () => {
  let controller: ClientReviewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientReviewsController],
      providers: [
        {
          provide: ClientReviewsService,
          useValue: {
            createReview: jest.fn(),
            getClientReviews: jest.fn(),
            getReviewById: jest.fn(),
            updateReview: jest.fn(),
            deleteReview: jest.fn(),
            getPublicReviews: jest.fn(),
            getAverageRating: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtClientGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ClientReviewsController>(ClientReviewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
