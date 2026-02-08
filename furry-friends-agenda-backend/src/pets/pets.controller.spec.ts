import { Test, TestingModule } from '@nestjs/testing';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { UserRole } from '@prisma/client';

const mockPetsService = {
  create: jest.fn(),
  findAllByOwner: jest.fn(),
  findOneByOwner: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockUser = {
  userId: 'client-uuid',
  username: 'client@test.com',
  role: UserRole.USER,
};
const mockPet = {
  id: 'pet-uuid',
  name: 'Fido',
  species: 'Dog',
  clientId: 'client-uuid',
};

describe('PetsController', () => {
  let controller: PetsController;
  let service: typeof mockPetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PetsController],
      providers: [{ provide: PetsService, useValue: mockPetsService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PetsController>(PetsController);
    service = module.get(PetsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a pet', async () => {
      const createDto: CreatePetDto = {
        name: 'Fido',
        species: 'Dog',
        clientId: 'client-uuid',
      };
      service.create.mockResolvedValue(mockPet);

      const result = await controller.create(createDto, { user: mockUser });

      expect(service.create).toHaveBeenCalledWith(createDto, mockUser.userId);
      expect(result).toEqual(mockPet);
    });
  });

  describe('findAll', () => {
    it('should find all pets for the logged-in user', async () => {
      service.findAllByOwner.mockResolvedValue([mockPet]);

      const result = await controller.findAll({ user: mockUser });

      expect(service.findAllByOwner).toHaveBeenCalledWith(mockUser.userId);
      expect(result).toEqual([mockPet]);
    });
  });

  describe('findOne', () => {
    it('should find a specific pet for the logged-in user', async () => {
      service.findOneByOwner.mockResolvedValue(mockPet);

      const result = await controller.findOne('pet-uuid', { user: mockUser });

      expect(service.findOneByOwner).toHaveBeenCalledWith(
        'pet-uuid',
        mockUser.userId,
      );
      expect(result).toEqual(mockPet);
    });
  });

  describe('update', () => {
    it('should update a pet', async () => {
      const updateDto: UpdatePetDto = { name: 'Fido II' };
      const updatedPet = { ...mockPet, ...updateDto };
      service.update.mockResolvedValue(updatedPet);

      const result = await controller.update('pet-uuid', updateDto, {
        user: mockUser,
      });

      expect(service.update).toHaveBeenCalledWith(
        'pet-uuid',
        updateDto,
        mockUser.userId,
      );
      expect(result).toEqual(updatedPet);
    });
  });

  describe('remove', () => {
    it('should remove a pet', async () => {
      service.remove.mockResolvedValue(mockPet);

      const result = await controller.remove('pet-uuid', { user: mockUser });

      expect(service.remove).toHaveBeenCalledWith('pet-uuid', mockUser.userId);
      expect(result).toEqual(mockPet);
    });
  });
});
