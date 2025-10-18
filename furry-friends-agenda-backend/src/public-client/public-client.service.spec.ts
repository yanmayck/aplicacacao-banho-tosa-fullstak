import { Test, TestingModule } from '@nestjs/testing';
import { PublicClientService } from './public-client.service';

describe('PublicClientService', () => {
  let service: PublicClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicClientService],
    }).compile();

    service = module.get<PublicClientService>(PublicClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
