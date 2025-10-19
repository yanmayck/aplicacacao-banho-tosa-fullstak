import { Test, TestingModule } from '@nestjs/testing';
import { ClientAppointmentsController } from './client-appointments.controller';

describe('ClientAppointmentsController', () => {
  let controller: ClientAppointmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientAppointmentsController],
    }).compile();

    controller = module.get<ClientAppointmentsController>(
      ClientAppointmentsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
