import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePetDto } from '../pets/dto/create-pet.dto';
import { UpdatePetDto } from '../pets/dto/update-pet.dto';

@Injectable()
export class ClientPetsService {
  constructor(private prisma: PrismaService) {}

  async create(createPetDto: CreatePetDto, clientId: string) {
    // Verificar se o cliente existe
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return this.prisma.pet.create({
      data: {
        name: createPetDto.name,
        species: createPetDto.species,
        breed: createPetDto.breed,
        birthDate: createPetDto.birthDate,
        observations: createPetDto.observations,
        foodType: createPetDto.foodType,
        clientId,
      },
    });
  }

  async findAllByClient(clientId: string) {
    return this.prisma.pet.findMany({
      where: { clientId },
      orderBy: { name: 'asc' },
    });
  }

  async findOneByClient(id: string, clientId: string) {
    const pet = await this.prisma.pet.findFirst({
      where: {
        id,
        clientId,
      },
    });

    if (!pet) {
      throw new NotFoundException(
        'Pet não encontrado ou não pertence ao cliente',
      );
    }

    return pet;
  }

  async update(id: string, updatePetDto: UpdatePetDto, clientId: string) {
    // Verificar se o pet pertence ao cliente
    const existingPet = await this.prisma.pet.findFirst({
      where: { id, clientId },
    });

    if (!existingPet) {
      throw new NotFoundException(
        'Pet não encontrado ou não pertence ao cliente',
      );
    }

    return this.prisma.pet.update({
      where: { id },
      data: {
        name: updatePetDto.name,
        species: updatePetDto.species,
        breed: updatePetDto.breed,
        birthDate: updatePetDto.birthDate,
        observations: updatePetDto.observations,
        foodType: updatePetDto.foodType,
      },
    });
  }

  async remove(id: string, clientId: string) {
    // Verificar se o pet pertence ao cliente
    const existingPet = await this.prisma.pet.findFirst({
      where: { id, clientId },
    });

    if (!existingPet) {
      throw new NotFoundException(
        'Pet não encontrado ou não pertence ao cliente',
      );
    }

    return this.prisma.pet.delete({
      where: { id },
    });
  }

  async updateVaccineHistory(
    petId: string,
    vaccineData: any,
    clientId: string,
  ) {
    // Verificar se o pet pertence ao cliente
    const pet = await this.prisma.pet.findFirst({
      where: { id: petId, clientId },
    });

    if (!pet) {
      throw new NotFoundException(
        'Pet não encontrado ou não pertence ao cliente',
      );
    }

    return this.prisma.pet.update({
      where: { id: petId },
      data: {
        vaccineHistory: vaccineData,
      },
    });
  }

  async updateRabiesVaccine(petId: string, rabiesData: any, clientId: string) {
    // Verificar se o pet pertence ao cliente
    const pet = await this.prisma.pet.findFirst({
      where: { id: petId, clientId },
    });

    if (!pet) {
      throw new NotFoundException(
        'Pet não encontrado ou não pertence ao cliente',
      );
    }

    return this.prisma.pet.update({
      where: { id: petId },
      data: {
        rabiesVaccine: rabiesData,
      },
    });
  }

  async updateTickMedicine(petId: string, medicineData: any, clientId: string) {
    // Verificar se o pet pertence ao cliente
    const pet = await this.prisma.pet.findFirst({
      where: { id: petId, clientId },
    });

    if (!pet) {
      throw new NotFoundException(
        'Pet não encontrado ou não pertence ao cliente',
      );
    }

    return this.prisma.pet.update({
      where: { id: petId },
      data: {
        lastTickMedicine: medicineData,
      },
    });
  }
}
