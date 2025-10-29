import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicePackage, Prisma } from '@prisma/client';
import { BaseService } from '../common/base.service';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class ServicesService extends BaseService {
  constructor(protected prisma: PrismaService) {
    super(prisma);
  }

  async create(
    createServiceDto: CreateServiceDto,
    user: JwtPayload,
  ): Promise<ServicePackage> {
    try {
      const data = this.applyCompanyFilterToCreate(
        createServiceDto,
        user,
        'ServicePackage',
      ) as any;
      return await this.prisma.servicePackage.create({
        data,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002' // Unique constraint violation
      ) {
        throw new ConflictException(
          `Service with name "${createServiceDto.name}" already exists.`,
        );
      }
      throw error;
    }
  }

  async findAll(user: JwtPayload): Promise<ServicePackage[]> {
    const where = this.applyCompanyFilter({}, user, 'ServicePackage');
    return this.prisma.servicePackage.findMany({
      where,
    });
  }

  async findOne(id: string, user: JwtPayload): Promise<ServicePackage | null> {
    const service = await this.prisma.servicePackage.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID "${id}" not found`);
    }

    // Verificar se o serviço pertence à empresa do usuário
    const companyFilter = this.getCompanyFilter(user);
    if (
      'companyId' in companyFilter &&
      service.companyId !== companyFilter.companyId
    ) {
      throw new NotFoundException(`Service with ID "${id}" not found`);
    }

    return service;
  }

  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
    user: JwtPayload,
  ): Promise<ServicePackage> {
    // Verificar se o serviço existe e pertence à empresa
    await this.findOne(id, user);

    try {
      return await this.prisma.servicePackage.update({
        where: { id },
        data: updateServiceDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          // Record to update not found.
          throw new NotFoundException(`Service with ID "${id}" not found`);
        }
        if (error.code === 'P2002') {
          // Unique constraint violation
          throw new ConflictException(
            `Service with name "${updateServiceDto.name}" already exists.`,
          );
        }
      }
      throw error;
    }
  }

  async remove(id: string, user: JwtPayload): Promise<ServicePackage> {
    // Verificar se o serviço existe e pertence à empresa
    await this.findOne(id, user);

    try {
      return await this.prisma.servicePackage.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025' // Record to delete not found.
      ) {
        throw new NotFoundException(`Service with ID "${id}" not found`);
      }
      throw error;
    }
  }
}
