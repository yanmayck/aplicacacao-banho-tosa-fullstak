import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroomerDto } from './dto/create-groomer.dto';
import { UpdateGroomerDto } from './dto/update-groomer.dto';
import { Groomer, Prisma } from '@prisma/client';
import { BaseService } from '../common/base.service';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class GroomersService extends BaseService {
  constructor(protected prisma: PrismaService) {
    super(prisma);
  }

  async create(
    createGroomerDto: CreateGroomerDto,
    user: JwtPayload,
  ): Promise<Groomer> {
    const data = this.applyCompanyFilterToCreate(
      createGroomerDto,
      user,
      'Groomer',
    );
    return this.prisma.groomer.create({ data });
  }

  async findAll(user: JwtPayload): Promise<Groomer[]> {
    return this.findManyWithCompanyFilter(
      this.prisma.groomer,
      {},
      user,
      'Groomer',
    );
  }

  async findOne(id: string, user: JwtPayload): Promise<Groomer> {
    const groomer = await this.prisma.groomer.findUnique({ where: { id } });
    if (!groomer) {
      throw new NotFoundException(`Groomer with ID "${id}" not found`);
    }

    // Verificar se o groomer pertence à empresa do usuário
    const companyFilter = this.getCompanyFilter(user);
    if (
      'companyId' in companyFilter &&
      groomer.companyId !== companyFilter.companyId
    ) {
      throw new NotFoundException(`Groomer with ID "${id}" not found`);
    }

    return groomer;
  }

  async update(
    id: string,
    updateGroomerDto: UpdateGroomerDto,
    user: JwtPayload,
  ): Promise<Groomer> {
    await this.validateEntityOwnership(id, user, 'Groomer', async (id) =>
      this.prisma.groomer.findUnique({
        where: { id },
        select: { companyId: true },
      }),
    );

    try {
      return await this.prisma.groomer.update({
        where: { id },
        data: updateGroomerDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Groomer with ID "${id}" not found`);
      }
      throw error;
    }
  }

  async remove(id: string, user: JwtPayload): Promise<Groomer> {
    await this.validateEntityOwnership(id, user, 'Groomer', async (id) =>
      this.prisma.groomer.findUnique({
        where: { id },
        select: { companyId: true },
      }),
    );

    try {
      return await this.prisma.groomer.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Groomer with ID "${id}" not found`);
      }
      throw error;
    }
  }
}
