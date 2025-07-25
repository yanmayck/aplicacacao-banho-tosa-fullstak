import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { Package, Prisma } from '@prisma/client';

@Injectable()
export class PackagesService {
  constructor(private prisma: PrismaService) {}

  async create(createPackageDto: CreatePackageDto): Promise<Package> {
    return this.prisma.package.create({ data: createPackageDto });
  }

  async findAll(): Promise<Package[]> {
    return this.prisma.package.findMany();
  }

  async findOne(id: string): Promise<Package> {
    const pkg = await this.prisma.package.findUnique({ where: { id } });
    if (!pkg) {
      throw new NotFoundException(`Package with ID "${id}" not found`);
    }
    return pkg;
  }

  async update(id: string, updatePackageDto: UpdatePackageDto): Promise<Package> {
    try {
      return await this.prisma.package.update({
        where: { id },
        data: updatePackageDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Package with ID "${id}" not found`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<Package> {
    try {
      return await this.prisma.package.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Package with ID "${id}" not found`);
      }
      throw error;
    }
  }
}
