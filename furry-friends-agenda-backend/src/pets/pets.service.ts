import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet, Prisma } from '@prisma/client';
import { BaseService } from '../common/base.service';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class PetsService extends BaseService {
  constructor(protected prisma: PrismaService) {
    super(prisma);
  }

  async create(createPetDto: CreatePetDto, user: JwtPayload): Promise<Pet> {
    // Verificar se o cliente existe e pertence à empresa do usuário
    const client = await this.prisma.client.findUnique({
      where: { id: createPetDto.clientId },
      select: { id: true, companyId: true }
    });

    if (!client) {
      throw new NotFoundException(
        `Client with ID "${createPetDto.clientId}" not found. Cannot create pet.`,
      );
    }

    // Aplicar filtro de empresa
    const companyFilter = this.getCompanyFilter(user);
    if ('companyId' in companyFilter && client.companyId !== companyFilter.companyId) {
      throw new ForbiddenException('Client belongs to another company');
    }

    const { clientId, ...petData } = createPetDto;

    const data = this.applyCompanyFilterToCreate({
      ...petData,
      client: { connect: { id: clientId } },
      lastTickMedicine: petData.lastTickMedicine
        ? JSON.parse(JSON.stringify(petData.lastTickMedicine))
        : undefined,
      rabiesVaccine: petData.rabiesVaccine
        ? JSON.parse(JSON.stringify(petData.rabiesVaccine))
        : undefined,
      vaccineHistory: petData.vaccineHistory
        ? JSON.parse(JSON.stringify(petData.vaccineHistory))
        : undefined,
    }, user, 'Pet') as any;

    return this.prisma.pet.create({ data });
  }

  async findAllByOwner(clientId: string, user: JwtPayload): Promise<Pet[]> {
    // Verificar se o cliente pertence à empresa do usuário
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true, companyId: true }
    });

    if (!client) {
      throw new NotFoundException(`Client with ID "${clientId}" not found`);
    }

    const companyFilter = this.getCompanyFilter(user);
    if ('companyId' in companyFilter && client.companyId !== companyFilter.companyId) {
      throw new ForbiddenException('Client belongs to another company');
    }

    return this.findManyWithCompanyFilter(
      this.prisma.pet,
      { where: { clientId } },
      user,
      'Pet'
    );
  }

  async findOneByOwner(id: string, clientId: string, user: JwtPayload): Promise<Pet | null> {
    // Primeiro verificar se o cliente pertence à empresa
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true, companyId: true }
    });

    if (!client) {
      throw new NotFoundException(`Client with ID "${clientId}" not found`);
    }

    const companyFilter = this.getCompanyFilter(user);
    if ('companyId' in companyFilter && client.companyId !== companyFilter.companyId) {
      throw new ForbiddenException('Client belongs to another company');
    }

    const pet = await this.prisma.pet.findUnique({
      where: { id },
    });

    if (!pet) {
      throw new NotFoundException(`Pet with ID "${id}" not found`);
    }

    // Verificar se o pet pertence à empresa do usuário
    if ('companyId' in companyFilter && pet.companyId !== companyFilter.companyId) {
      throw new ForbiddenException('Pet belongs to another company');
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
    user: JwtPayload,
  ): Promise<Pet> {
    // Primeiro verificar se o pet existe e pertence à empresa
    const pet = await this.prisma.pet.findUnique({
      where: { id },
      select: { id: true, clientId: true, companyId: true }
    });

    if (!pet) {
      throw new NotFoundException(`Pet with ID "${id}" not found`);
    }

    // Verificar se o pet pertence à empresa do usuário
    const companyFilter = this.getCompanyFilter(user);
    if ('companyId' in companyFilter && pet.companyId !== companyFilter.companyId) {
      throw new ForbiddenException('Pet belongs to another company');
    }

    // Verificar se o cliente do pet pertence ao usuário (se não for SUPER_ADMIN)
    if (user.role !== 'SUPER_ADMIN' && user.userId !== pet.clientId) {
      throw new ForbiddenException('You can only update pets that belong to your client account');
    }

    return this.prisma.pet.update({
      where: { id },
      data: {
        ...updatePetDto,
        lastTickMedicine: updatePetDto.lastTickMedicine
          ? (updatePetDto.lastTickMedicine as unknown as Prisma.JsonObject)
          : undefined,
        rabiesVaccine: updatePetDto.rabiesVaccine
          ? (updatePetDto.rabiesVaccine as unknown as Prisma.JsonObject)
          : undefined,
        vaccineHistory: updatePetDto.vaccineHistory
          ? JSON.parse(JSON.stringify(updatePetDto.vaccineHistory))
          : undefined,
      },
    });
  }

  async remove(id: string, user: JwtPayload): Promise<Pet> {
    // Primeiro verificar se o pet existe e pertence à empresa
    const pet = await this.prisma.pet.findUnique({
      where: { id },
      select: { id: true, clientId: true, companyId: true }
    });

    if (!pet) {
      throw new NotFoundException(`Pet with ID "${id}" not found`);
    }

    // Verificar se o pet pertence à empresa do usuário
    const companyFilter = this.getCompanyFilter(user);
    if ('companyId' in companyFilter && pet.companyId !== companyFilter.companyId) {
      throw new ForbiddenException('Pet belongs to another company');
    }

    // Verificar se o cliente do pet pertence ao usuário (se não for SUPER_ADMIN)
    if (user.role !== 'SUPER_ADMIN' && user.userId !== pet.clientId) {
      throw new ForbiddenException('You can only delete pets that belong to your client account');
    }

    return this.prisma.pet.delete({
      where: { id },
    });
  }
}
