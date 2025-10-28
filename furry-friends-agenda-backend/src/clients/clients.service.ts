import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client, Prisma } from '@prisma/client';
import { BaseService } from '../common/base.service';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class ClientsService extends BaseService {
  constructor(protected prisma: PrismaService) {
    super(prisma);
  }

  async create(createClientDto: CreateClientDto, user: JwtPayload): Promise<Client> {
    const data = this.applyCompanyFilterToCreate(createClientDto, user, 'Client');
    return this.prisma.client.create({
      data,
    });
  }

  async findAll(user: JwtPayload): Promise<Client[]> {
    return this.findManyWithCompanyFilter(
      this.prisma.client,
      {},
      user,
      'Client'
    );
  }

  async findOne(id: string, user: JwtPayload): Promise<Client> {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client with ID "${id}" not found`);
    }

    // Verificar se o cliente pertence à empresa do usuário
    const companyFilter = this.getCompanyFilter(user);
    if ('companyId' in companyFilter && client.companyId !== companyFilter.companyId) {
      throw new NotFoundException(`Client with ID "${id}" not found`);
    }

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto, user: JwtPayload): Promise<Client> {
    await this.validateEntityOwnership(id, user, 'Client', async (id) =>
      this.prisma.client.findUnique({ where: { id }, select: { companyId: true } })
    );

    try {
      return await this.prisma.client.update({
        where: { id },
        data: updateClientDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Client with ID "${id}" not found`);
      }
      throw error;
    }
  }

  async remove(id: string, user: JwtPayload): Promise<Client> {
    await this.validateEntityOwnership(id, user, 'Client', async (id) =>
      this.prisma.client.findUnique({ where: { id }, select: { companyId: true } })
    );

    try {
      return await this.prisma.client.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Client with ID "${id}" not found`);
      }
      throw error;
    }
  }
}
