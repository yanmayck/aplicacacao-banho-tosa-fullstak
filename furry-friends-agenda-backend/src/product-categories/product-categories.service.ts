import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { BaseService } from '../common/base.service';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class ProductCategoriesService extends BaseService {
  constructor(protected prisma: PrismaService) {
    super(prisma);
  }

  async create(
    createProductCategoryDto: CreateProductCategoryDto,
    user: JwtPayload,
  ) {
    try {
      const data = this.applyCompanyFilterToCreate(
        createProductCategoryDto,
        user,
        'ProductCategory',
      );
      return await this.prisma.productCategory.create({
        data,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `Category with name "${createProductCategoryDto.name}" already exists`,
        );
      }
      throw error;
    }
  }

  async findAll(user: JwtPayload) {
    const where = this.applyCompanyFilter(
      { isActive: true },
      user,
      'ProductCategory',
    );
    return this.prisma.productCategory.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, user: JwtPayload) {
    const category = await this.prisma.productCategory.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    // Verificar se a categoria pertence à empresa do usuário
    const companyFilter = this.getCompanyFilter(user);
    if (
      'companyId' in companyFilter &&
      category.companyId !== companyFilter.companyId
    ) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    return category;
  }

  async update(
    id: string,
    updateProductCategoryDto: UpdateProductCategoryDto,
    user: JwtPayload,
  ) {
    // Verificar se a categoria existe e pertence à empresa
    await this.findOne(id, user);

    try {
      return await this.prisma.productCategory.update({
        where: { id },
        data: updateProductCategoryDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Category with ID "${id}" not found`);
      }
      if (error.code === 'P2002') {
        throw new ConflictException(
          `Category with name "${updateProductCategoryDto.name}" already exists`,
        );
      }
      throw error;
    }
  }

  async remove(id: string, user: JwtPayload) {
    // Verificar se a categoria existe e pertence à empresa
    await this.findOne(id, user);

    try {
      return await this.prisma.productCategory.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Category with ID "${id}" not found`);
      }
      throw error;
    }
  }
}
