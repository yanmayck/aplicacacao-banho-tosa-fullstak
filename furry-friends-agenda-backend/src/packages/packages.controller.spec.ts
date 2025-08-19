import { Test, TestingModule } from '@nestjs/testing';
import { PackagesController } from './packages.controller';
import { PackagesService } from './packages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

const mockPackagesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockPackage = {
  id: 'a-uuid',
  name: 'Test Package',
  description: 'Test Description',
  includesBaths: 4,
  includesGrooming: true,
  includesHydration: true,
  basePrice: 100,
  pickupPrice: 120,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('PackagesController', () => {
  let controller: PackagesController;
  let service: typeof mockPackagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PackagesController],
      providers: [
        {
          provide: PackagesService,
          useValue: mockPackagesService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PackagesController>(PackagesController);
    service = module.get(PackagesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a package', async () => {
      const createDto = {
        name: 'Test Package',
        description: 'Test Description',
        includesBaths: 4,
        includesGrooming: true,
        includesHydration: true,
        basePrice: 100,
        pickupPrice: 120,
      };
      service.create.mockResolvedValue(mockPackage);

      const result = await controller.create(createDto);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockPackage);
    });
  });

  describe('findAll', () => {
    it('should return an array of packages', async () => {
      service.findAll.mockResolvedValue([mockPackage]);

      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockPackage]);
    });
  });

  describe('findOne', () => {
    it('should return a single package', async () => {
      service.findOne.mockResolvedValue(mockPackage);

      const result = await controller.findOne('a-uuid');
      expect(service.findOne).toHaveBeenCalledWith('a-uuid');
      expect(result).toEqual(mockPackage);
    });
  });

  describe('update', () => {
    it('should update a package', async () => {
      const updateDto = { name: 'Package Updated' };
      const updatedPackage = { ...mockPackage, ...updateDto };
      service.update.mockResolvedValue(updatedPackage);

      const result = await controller.update('a-uuid', updateDto);
      expect(service.update).toHaveBeenCalledWith('a-uuid', updateDto);
      expect(result).toEqual(updatedPackage);
    });
  });

  describe('remove', () => {
    it('should delete a package', async () => {
      service.remove.mockResolvedValue(mockPackage);

      const result = await controller.remove('a-uuid');
      expect(service.remove).toHaveBeenCalledWith('a-uuid');
      expect(result).toEqual(mockPackage);
    });
  });
});
