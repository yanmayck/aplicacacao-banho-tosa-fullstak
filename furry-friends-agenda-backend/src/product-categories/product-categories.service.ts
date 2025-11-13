import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductCategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createProductCategoryDto: CreateProductCategoryDto) {
    try {
      return await this.prisma.productCategory.create({
        data: createProductCategoryDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `Category with name "${createProductCategoryDto.name}" already exists`,
        );
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.productCategory.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.productCategory.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    return category;
  }

  async update(id: string, updateProductCategoryDto: UpdateProductCategoryDto) {
    try {
      return await this.prisma.productCategory.update({
        where: { id },
        data: updateProductCategoryDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Category with ID "${id}" not found`);
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `Category with name "${updateProductCategoryDto.name}" already exists`,
        );
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.productCategory.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Category with ID "${id}" not found`);
      }
      throw error;
    }
  }
}
