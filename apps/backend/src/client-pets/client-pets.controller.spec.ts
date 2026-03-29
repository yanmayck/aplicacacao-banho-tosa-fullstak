import { Test, TestingModule } from '@nestjs/testing';
import { ClientPetsController } from './client-pets.controller';
import { ClientPetsService } from './client-pets.service';
import { JwtClientGuard } from '../public-client/guards/jwt-client.guard';

describe('ClientPetsController', () => {
  let controller: ClientPetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientPetsController],
      providers: [
        {
          provide: ClientPetsService,
          useValue: {
            create: jest.fn(),
            findAllByClient: jest.fn(),
            findOneByClient: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtClientGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ClientPetsController>(ClientPetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
