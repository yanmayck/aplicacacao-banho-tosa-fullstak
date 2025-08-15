import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Client, UserRole } from '@prisma/client';

const mockClientsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockClient: Client = {
  id: 'a-uuid',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '1234567890',
  address: '123 Main St',
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: 'user-uuid',
};

describe('ClientsController', () => {
  let controller: ClientsController;
  let service: typeof mockClientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        {
          provide: ClientsService,
          useValue: mockClientsService,
        },
      ],
    })
    .overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true })
    .overrideGuard(RolesGuard).useValue({ canActivate: () => true })
    .compile();

    controller = module.get<ClientsController>(ClientsController);
    service = module.get(ClientsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a client', async () => {
      const createDto = { name: 'John Doe', email: 'john.doe@example.com' };
      service.create.mockResolvedValue(mockClient);

      const result = await controller.create(createDto);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockClient);
    });
  });

  describe('findAll', () => {
    it('should return an array of clients', async () => {
      service.findAll.mockResolvedValue([mockClient]);

      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockClient]);
    });
  });

  describe('findOne', () => {
    it('should return a single client', async () => {
      service.findOne.mockResolvedValue(mockClient);

      const result = await controller.findOne('a-uuid');
      expect(service.findOne).toHaveBeenCalledWith('a-uuid');
      expect(result).toEqual(mockClient);
    });
  });

  describe('update', () => {
    it('should update a client', async () => {
      const updateDto = { name: 'John Doe Updated' };
      const updatedClient = { ...mockClient, ...updateDto };
      service.update.mockResolvedValue(updatedClient);

      const result = await controller.update('a-uuid', updateDto);
      expect(service.update).toHaveBeenCalledWith('a-uuid', updateDto);
      expect(result).toEqual(updatedClient);
    });
  });

  describe('remove', () => {
    it('should delete a client', async () => {
      service.remove.mockResolvedValue(mockClient);

      const result = await controller.remove('a-uuid');
      expect(service.remove).toHaveBeenCalledWith('a-uuid');
      expect(result).toEqual(mockClient);
    });
  });
});
