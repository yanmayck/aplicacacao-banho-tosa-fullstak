import { Test, TestingModule } from '@nestjs/testing';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

const mockServicesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockService = {
  id: 'a-uuid',
  name: 'Test Service',
  description: 'Test Description',
  price: 50,
  durationMin: 30,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ServicesController', () => {
  let controller: ServicesController;
  let service: typeof mockServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesController],
      providers: [
        {
          provide: ServicesService,
          useValue: mockServicesService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ServicesController>(ServicesController);
    service = module.get(ServicesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a service', async () => {
      const createDto = {
        name: 'Test Service',
        description: 'Test Description',
        price: 50,
        durationMin: 30,
      };
      service.create.mockResolvedValue(mockService);

      const result = await controller.create(createDto);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockService);
    });
  });

  describe('findAll', () => {
    it('should return an array of services', async () => {
      service.findAll.mockResolvedValue([mockService]);

      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockService]);
    });
  });

  describe('findOne', () => {
    it('should return a single service', async () => {
      service.findOne.mockResolvedValue(mockService);

      const result = await controller.findOne('a-uuid');
      expect(service.findOne).toHaveBeenCalledWith('a-uuid');
      expect(result).toEqual(mockService);
    });
  });

  describe('update', () => {
    it('should update a service', async () => {
      const updateDto = { name: 'Service Updated' };
      const updatedService = { ...mockService, ...updateDto };
      service.update.mockResolvedValue(updatedService);

      const result = await controller.update('a-uuid', updateDto);
      expect(service.update).toHaveBeenCalledWith('a-uuid', updateDto);
      expect(result).toEqual(updatedService);
    });
  });

  describe('remove', () => {
    it('should delete a service', async () => {
      service.remove.mockResolvedValue(mockService);

      const result = await controller.remove('a-uuid');
      expect(service.remove).toHaveBeenCalledWith('a-uuid');
      expect(result).toEqual(mockService);
    });
  });
});
