import { Test, TestingModule } from '@nestjs/testing';
import { ClientAppointmentsService } from './client-appointments.service';

describe('ClientAppointmentsService', () => {
  let service: ClientAppointmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientAppointmentsService],
    }).compile();

    service = module.get<ClientAppointmentsService>(ClientAppointmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
