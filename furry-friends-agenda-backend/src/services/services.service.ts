import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicePackage, Prisma } from '@prisma/client';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async create(
    createServiceDto: CreateServiceDto,
  ): Promise<ServicePackage> {
    try {
      return await this.prisma.servicePackage.create({
        data: createServiceDto,
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

  async findAll(): Promise<ServicePackage[]> {
    return this.prisma.servicePackage.findMany();
  }

  async findOne(id: string): Promise<ServicePackage | null> {
    const service = await this.prisma.servicePackage.findUnique({
      where: { id },
    });
    if (!service) {
      throw new NotFoundException(`Service with ID "${id}" not found`);
    }
    return service;
  }

  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<ServicePackage> {
    try {
      return await this.prisma.servicePackage.update({
        where: { id },
        data: updateServiceDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') { // Record to update not found.
          throw new NotFoundException(`Service with ID "${id}" not found`);
        }
        if (error.code === 'P2002') { // Unique constraint violation
          throw new ConflictException(
            `Service with name "${updateServiceDto.name}" already exists.`,
          );
        }
      }
      throw error;
    }
  }

  async remove(id: string): Promise<ServicePackage> {
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
