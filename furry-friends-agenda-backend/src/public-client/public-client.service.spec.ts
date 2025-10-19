import { Test, TestingModule } from '@nestjs/testing';
import { PublicClientService } from './public-client.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';

const mockPrismaService = {
  publicClient: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

describe('PublicClientService', () => {
  let service: PublicClientService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        PublicClientService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: { sign: jest.fn(), verify: jest.fn() } },
      ],
    }).compile();

    service = module.get<PublicClientService>(PublicClientService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
