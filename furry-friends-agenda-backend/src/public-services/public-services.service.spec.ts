import { Test, TestingModule } from '@nestjs/testing';
import { PublicServicesService } from './public-services.service';

describe('PublicServicesService', () => {
  let service: PublicServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicServicesService],
    }).compile();

    service = module.get<PublicServicesService>(PublicServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
