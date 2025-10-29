import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BaseService } from '../common/base.service';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class ProductsService extends BaseService {
  constructor(protected prisma: PrismaService) {
    super(prisma);
  }

  async create(createProductDto: CreateProductDto, user: JwtPayload) {
    const data = this.applyCompanyFilterToCreate(
      createProductDto,
      user,
      'Product',
    );
    return await this.prisma.product.create({
      data,
    });
  }

  async findAll(user: JwtPayload) {
    const where = this.applyCompanyFilter({ isActive: true }, user, 'Product');
    return this.prisma.product.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, user: JwtPayload) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    // Verificar se o produto pertence à empresa do usuário
    const companyFilter = this.getCompanyFilter(user);
    if (
      'companyId' in companyFilter &&
      product.companyId !== companyFilter.companyId
    ) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    return product;
  }

  async findByCategory(categoryId: string, user: JwtPayload) {
    const where = this.applyCompanyFilter(
      {
        categoryId,
        isActive: true,
      },
      user,
      'Product',
    );
    return this.prisma.product.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async findLowStock(user: JwtPayload) {
    const where = this.applyCompanyFilter(
      {
        isActive: true,
        currentStock: {
          lte: 0,
        },
      },
      user,
      'Product',
    );
    return this.prisma.product.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    user: JwtPayload,
  ) {
    // Verificar se o produto existe e pertence à empresa
    await this.findOne(id, user);

    return await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string, user: JwtPayload) {
    // Verificar se o produto existe e pertence à empresa
    await this.findOne(id, user);

    return await this.prisma.product.delete({
      where: { id },
    });
  }

  async updateStock(productId: string, quantity: number, user: JwtPayload) {
    const product = await this.findOne(productId, user);

    const newStock = product.currentStock + quantity;

    if (newStock < 0) {
      throw new BadRequestException('Stock cannot be negative');
    }

    return await this.prisma.product.update({
      where: { id: productId },
      data: { currentStock: newStock },
    });
  }
}
