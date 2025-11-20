import { Test, TestingModule } from '@nestjs/testing';
import { ClientReviewsService } from './client-reviews.service';

describe('ClientReviewsService', () => {
  let service: ClientReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientReviewsService],
    }).compile();

    service = module.get<ClientReviewsService>(ClientReviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
