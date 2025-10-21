import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { UpdateStockMovementDto } from './dto/update-stock-movement.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class StockMovementsService {
  constructor(private prisma: PrismaService) {}

  async create(createStockMovementDto: CreateStockMovementDto) {
    // Verificar se produto existe
    const product = await this.prisma.product.findUnique({
      where: { id: createStockMovementDto.productId },
    });

    if (!product) {
      throw new BadRequestException(
        `Product with ID "${createStockMovementDto.productId}" not found`,
      );
    }

    return await this.prisma.stockMovement.create({
      data: createStockMovementDto,
      include: {
        product: true,
      },
    });
  }

  async findAll() {
    return this.prisma.stockMovement.findMany({
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const movement = await this.prisma.stockMovement.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });

    if (!movement) {
      throw new NotFoundException(`Stock movement with ID "${id}" not found`);
    }

    return movement;
  }

  async findByProduct(productId: string) {
    return this.prisma.stockMovement.findMany({
      where: { productId },
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByType(type: string) {
    return this.prisma.stockMovement.findMany({
      where: { type: type as any },
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, updateStockMovementDto: UpdateStockMovementDto) {
    try {
      return await this.prisma.stockMovement.update({
        where: { id },
        data: updateStockMovementDto,
        include: {
          product: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        (error as any).code === 'P2025'
      ) {
        throw new NotFoundException(`Stock movement with ID "${id}" not found`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.stockMovement.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        (error as any).code === 'P2025'
      ) {
        throw new NotFoundException(`Stock movement with ID "${id}" not found`);
      }
      throw error;
    }
  }
}
