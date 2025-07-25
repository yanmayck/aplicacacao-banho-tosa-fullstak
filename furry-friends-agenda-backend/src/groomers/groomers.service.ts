import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroomerDto } from './dto/create-groomer.dto';
import { UpdateGroomerDto } from './dto/update-groomer.dto';
import { Groomer, Prisma } from '@prisma/client';

@Injectable()
export class GroomersService {
  constructor(private prisma: PrismaService) {}

  async create(createGroomerDto: CreateGroomerDto): Promise<Groomer> {
    return this.prisma.groomer.create({ data: createGroomerDto });
  }

  async findAll(): Promise<Groomer[]> {
    return this.prisma.groomer.findMany();
  }

  async findOne(id: string): Promise<Groomer> {
    const groomer = await this.prisma.groomer.findUnique({ where: { id } });
    if (!groomer) {
      throw new NotFoundException(`Groomer with ID "${id}" not found`);
    }
    return groomer;
  }

  async update(id: string, updateGroomerDto: UpdateGroomerDto): Promise<Groomer> {
    try {
      return await this.prisma.groomer.update({
        where: { id },
        data: updateGroomerDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Groomer with ID "${id}" not found`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<Groomer> {
    try {
      return await this.prisma.groomer.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Groomer with ID "${id}" not found`);
      }
      throw error;
    }
  }
}
