import { Test, TestingModule } from '@nestjs/testing';
import { GroomersController } from './groomers.controller';
import { GroomersService } from './groomers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

const mockGroomersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockGroomer = {
  id: 'a-uuid',
  name: 'Test Groomer',
  email: 'groomer@test.com',
  phone: '123456789',
  specialties: ['Tosa'],
  status: 'available',
  commissionPercentage: 20,
  createdAt: new Date(),
  updatedAt: new Date(),
  appointments: [],
};

describe('GroomersController', () => {
  let controller: GroomersController;
  let service: typeof mockGroomersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroomersController],
      providers: [
        {
          provide: GroomersService,
          useValue: mockGroomersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<GroomersController>(GroomersController);
    service = module.get(GroomersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a groomer', async () => {
      const createDto = { name: 'Test Groomer', email: 'groomer@test.com' };
      service.create.mockResolvedValue(mockGroomer);

      const result = await controller.create(createDto);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockGroomer);
    });
  });

  describe('findAll', () => {
    it('should return an array of groomers', async () => {
      service.findAll.mockResolvedValue([mockGroomer]);

      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockGroomer]);
    });
  });

  describe('findOne', () => {
    it('should return a single groomer', async () => {
      service.findOne.mockResolvedValue(mockGroomer);

      const result = await controller.findOne('a-uuid');
      expect(service.findOne).toHaveBeenCalledWith('a-uuid');
      expect(result).toEqual(mockGroomer);
    });
  });

  describe('update', () => {
    it('should update a groomer', async () => {
      const updateDto = { name: 'Groomer Updated' };
      const updatedGroomer = { ...mockGroomer, ...updateDto };
      service.update.mockResolvedValue(updatedGroomer);

      const result = await controller.update('a-uuid', updateDto);
      expect(service.update).toHaveBeenCalledWith('a-uuid', updateDto);
      expect(result).toEqual(updatedGroomer);
    });
  });

  describe('remove', () => {
    it('should delete a groomer', async () => {
      service.remove.mockResolvedValue(mockGroomer);

      const result = await controller.remove('a-uuid');
      expect(service.remove).toHaveBeenCalledWith('a-uuid');
      expect(result).toEqual(mockGroomer);
    });
  });
});
