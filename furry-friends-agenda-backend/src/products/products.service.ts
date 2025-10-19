import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    return await this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    return product;
  }

  async findByCategory(categoryId: string) {
    return this.prisma.product.findMany({
      where: {
        categoryId,
        isActive: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findLowStock() {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        currentStock: {
          lte: 0,
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.product.delete({
      where: { id },
    });
  }

  async updateStock(productId: string, quantity: number) {
    const product = await this.findOne(productId);

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
