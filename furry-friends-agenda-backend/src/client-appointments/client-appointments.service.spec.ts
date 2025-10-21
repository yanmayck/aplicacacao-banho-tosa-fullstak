import { Test, TestingModule } from '@nestjs/testing';
import { ClientAppointmentsService } from './client-appointments.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  appointment: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
};

describe('ClientAppointmentsService', () => {
  let service: ClientAppointmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientAppointmentsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ClientAppointmentsService>(ClientAppointmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
