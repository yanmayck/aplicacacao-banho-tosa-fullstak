import { Test, TestingModule } from '@nestjs/testing';
import { ClientReviewsService } from './client-reviews.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ClientReviewsService', () => {
  let service: ClientReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientReviewsService,
        {
          provide: PrismaService,
          useValue: {
            review: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              aggregate: jest.fn(),
            },
            client: {
              findUnique: jest.fn(),
            },
            appointment: {
              findFirst: jest.fn(),
            },
            groomer: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ClientReviewsService>(ClientReviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
