import { Test, TestingModule } from '@nestjs/testing';
import { ClientPetHealthService } from './client-pet-health.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ClientPetHealthService', () => {
  let service: ClientPetHealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientPetHealthService,
        {
          provide: PrismaService,
          useValue: {
            pet: {
              findFirst: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ClientPetHealthService>(ClientPetHealthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
