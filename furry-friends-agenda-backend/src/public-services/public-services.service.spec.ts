import { Test, TestingModule } from '@nestjs/testing';
import { PublicServicesService } from './public-services.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';

const mockPrismaService = {
  servicePackage: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
};

describe('PublicServicesService', () => {
  let service: PublicServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        PublicServicesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PublicServicesService>(PublicServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
