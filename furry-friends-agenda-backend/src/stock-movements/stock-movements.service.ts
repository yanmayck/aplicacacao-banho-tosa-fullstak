import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { UpdateStockMovementDto } from './dto/update-stock-movement.dto';
import { Prisma } from '@prisma/client';
import { BaseService } from '../common/base.service';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class StockMovementsService extends BaseService {
  constructor(protected prisma: PrismaService) {
    super(prisma);
  }

  async create(
    createStockMovementDto: CreateStockMovementDto,
    user: JwtPayload,
  ) {
    // Verificar se produto existe e pertence à empresa
    const product = await this.prisma.product.findUnique({
      where: { id: createStockMovementDto.productId },
    });

    if (!product) {
      throw new BadRequestException(
        `Product with ID "${createStockMovementDto.productId}" not found`,
      );
    }

    // Verificar se o produto pertence à empresa do usuário
    const companyFilter = this.getCompanyFilter(user);
    if (
      'companyId' in companyFilter &&
      product.companyId !== companyFilter.companyId
    ) {
      throw new BadRequestException(
        `Product with ID "${createStockMovementDto.productId}" not found`,
      );
    }

    const data = this.applyCompanyFilterToCreate(
      createStockMovementDto,
      user,
      'StockMovement',
    );
    return await this.prisma.stockMovement.create({
      data,
      include: {
        product: true,
      },
    });
  }

  async findAll(user: JwtPayload) {
    const where = this.applyCompanyFilter({}, user, 'StockMovement');
    return this.prisma.stockMovement.findMany({
      where,
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, user: JwtPayload) {
    const movement = await this.prisma.stockMovement.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });

    if (!movement) {
      throw new NotFoundException(`Stock movement with ID "${id}" not found`);
    }

    // Verificar se o movimento pertence à empresa do usuário
    const companyFilter = this.getCompanyFilter(user);
    if (
      'companyId' in companyFilter &&
      movement.companyId !== companyFilter.companyId
    ) {
      throw new NotFoundException(`Stock movement with ID "${id}" not found`);
    }

    return movement;
  }

  async findByProduct(productId: string, user: JwtPayload) {
    // Verificar se o produto pertence à empresa
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new BadRequestException(`Product with ID "${productId}" not found`);
    }

    const companyFilter = this.getCompanyFilter(user);
    if (
      'companyId' in companyFilter &&
      product.companyId !== companyFilter.companyId
    ) {
      throw new BadRequestException(`Product with ID "${productId}" not found`);
    }

    const where = this.applyCompanyFilter({ productId }, user, 'StockMovement');
    return this.prisma.stockMovement.findMany({
      where,
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByType(type: string, user: JwtPayload) {
    const where = this.applyCompanyFilter(
      { type: type as any },
      user,
      'StockMovement',
    );
    return this.prisma.stockMovement.findMany({
      where,
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(
    id: string,
    updateStockMovementDto: UpdateStockMovementDto,
    user: JwtPayload,
  ) {
    // Verificar se o movimento existe e pertence à empresa
    await this.findOne(id, user);

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

  async remove(id: string, user: JwtPayload) {
    // Verificar se o movimento existe e pertence à empresa
    await this.findOne(id, user);

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
