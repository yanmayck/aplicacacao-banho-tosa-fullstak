import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet } from '@prisma/client';

@Injectable()
export class PetsService {
  constructor(private prisma: PrismaService) {}

  async create(createPetDto: CreatePetDto, clientId: string): Promise<Pet> {
    // O parâmetro ownerId foi renomeado para clientId para refletir o schema
    // A variável createPetDto pode ainda ter campos que precisam ser mapeados se ela espera ownerId
    // No entanto, o schema Pet espera clientId.
    return this.prisma.pet.create({
      data: {
        ...createPetDto, // Assume-se que createPetDto já está alinhado ou será alinhado para fornecer os campos corretos para Pet.
        clientId, // Esta é a mudança principal aqui, usando o parâmetro renomeado.
      },
    });
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
      data: updatePetDto,
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
