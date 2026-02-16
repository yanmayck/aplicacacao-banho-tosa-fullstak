import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet, Prisma } from '@prisma/client';

@Injectable()
export class PetsService {
  constructor(private prisma: PrismaService) {}

  async create(createPetDto: CreatePetDto, userId: string): Promise<Pet> {
    const client = await this.prisma.client.findUnique({
      where: { userId },
    });

    if (!client) {
      throw new NotFoundException(
        `Client for user ID "${userId}" not found. Cannot create pet.`,
      );
    }

    const { clientId, ...petData } = createPetDto;

    const data: Prisma.PetCreateInput = {
      ...petData,
      client: { connect: { id: client.id } }, // Use the found client.id
      lastTickMedicine: petData.lastTickMedicine ? (petData.lastTickMedicine as any) : undefined,
      rabiesVaccine: petData.rabiesVaccine ? (petData.rabiesVaccine as any) : undefined,
      vaccineHistory: petData.vaccineHistory ? (petData.vaccineHistory as any) : undefined,
    };

    return this.prisma.pet.create({ data });
  }

  async findAllByOwner(clientId: string): Promise<Pet[]> {
    // Renomeado ownerId para clientId
    return this.prisma.pet.findMany({
      where: { clientId },
    });
  }

  async findOneByOwner(id: string, clientId: string): Promise<Pet | null> {
    // Renomeado ownerId para clientId
    const pet = await this.prisma.pet.findUnique({
      where: { id },
    });

    if (!pet) {
      throw new NotFoundException(`Pet with ID "${id}" not found`);
    }

    // A comparação agora usa pet.clientId
    if (pet.clientId !== clientId) {
      throw new ForbiddenException('You are not allowed to access this pet');
    }
    return pet;
  }

  async update(
    id: string,
    updatePetDto: UpdatePetDto,
    clientId: string,
  ): Promise<Pet> {
    // Renomeado ownerId para clientId
    const pet = await this.findOneByOwner(id, clientId); // Garante que o pet existe e pertence ao usuário
    if (!pet) {
      // findOneByOwner já lança exceção, mas por segurança:
      throw new NotFoundException(
        `Pet with ID "${id}" not found or not owned by client.`, // Mensagem atualizada
      );
    }

    return this.prisma.pet.update({
      where: { id },
      data: {
        ...updatePetDto,
        lastTickMedicine: updatePetDto.lastTickMedicine ? (updatePetDto.lastTickMedicine as any) : undefined,
        rabiesVaccine: updatePetDto.rabiesVaccine ? (updatePetDto.rabiesVaccine as any) : undefined,
        vaccineHistory: updatePetDto.vaccineHistory ? (updatePetDto.vaccineHistory as any) : undefined,
      },
    });
  }

  async remove(id: string, clientId: string): Promise<Pet> {
    // Renomeado ownerId para clientId
    const pet = await this.findOneByOwner(id, clientId); // Garante que o pet existe e pertence ao usuário
    if (!pet) {
      // findOneByOwner já lança exceção
      throw new NotFoundException(
        `Pet with ID "${id}" not found or not owned by client.`, // Mensagem atualizada
      );
    }
    return this.prisma.pet.delete({
      where: { id },
    });
  }
}
