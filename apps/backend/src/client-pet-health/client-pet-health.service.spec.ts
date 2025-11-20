import { Test, TestingModule } from '@nestjs/testing';
import { ClientPetHealthService } from './client-pet-health.service';

describe('ClientPetHealthService', () => {
  let service: ClientPetHealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientPetHealthService],
    }).compile();

    service = module.get<ClientPetHealthService>(ClientPetHealthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
