import { Test, TestingModule } from '@nestjs/testing';
import { ClientPetsService } from './client-pets.service';

describe('ClientPetsService', () => {
  let service: ClientPetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientPetsService],
    }).compile();

    service = module.get<ClientPetsService>(ClientPetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
