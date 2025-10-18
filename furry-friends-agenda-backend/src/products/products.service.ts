import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      // Verificar se categoria existe
      const category = await this.prisma.productCategory.findUnique({
        where: { id: createProductDto.categoryId }
      });

      if (!category) {
        throw new BadRequestException(`Category with ID "${createProductDto.categoryId}" not found`);
      }

      // Verificar fornecedor se fornecido
      if (createProductDto.supplierId) {
        const supplier = await this.prisma.supplier.findUnique({
          where: { id: createProductDto.supplierId }
        });

        if (!supplier) {
          throw new BadRequestException(`Supplier with ID "${createProductDto.supplierId}" not found`);
        }
      }

      // Verificar SKU único se fornecido
      if (createProductDto.sku) {
        const existingProduct = await this.prisma.product.findUnique({
          where: { sku: createProductDto.sku }
        });

        if (existingProduct) {
          throw new ConflictException(`Product with SKU "${createProductDto.sku}" already exists`);
        }
      }

      return await this.prisma.product.create({
        data: createProductDto,
        include: {
          category: true,
          supplier: true
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[];
          if (target?.includes('sku')) {
            throw new ConflictException(`Product with SKU "${createProductDto.sku}" already exists`);
          }
        }
      }
      throw error;
    }
  }

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany({
      include: {
        category: true,
        supplier: true,
        stockMovements: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        }
      },
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
  }

  async findOne(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        supplier: true,
        stockMovements: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    return product;
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        categoryId,
        isActive: true
      },
      include: {
        category: true,
        supplier: true
      },
      orderBy: { name: 'asc' }
    });
  }

  async findLowStock(): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        currentStock: {
          lte: Prisma.sql`minStock`
        }
      },
      include: {
        category: true,
        supplier: true
      },
      orderBy: { name: 'asc' }
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    try {
      // Verificar se produto existe
      await this.findOne(id);

      // Verificar categoria se fornecida
      if (updateProductDto.categoryId) {
        const category = await this.prisma.productCategory.findUnique({
          where: { id: updateProductDto.categoryId }
        });

        if (!category) {
          throw new BadRequestException(`Category with ID "${updateProductDto.categoryId}" not found`);
        }
      }

      // Verificar fornecedor se fornecido
      if (updateProductDto.supplierId) {
        const supplier = await this.prisma.supplier.findUnique({
          where: { id: updateProductDto.supplierId }
        });

        if (!supplier) {
          throw new BadRequestException(`Supplier with ID "${updateProductDto.supplierId}" not found`);
        }
      }

      // Verificar SKU único se fornecido
      if (updateProductDto.sku) {
        const existingProduct = await this.prisma.product.findFirst({
          where: {
            sku: updateProductDto.sku,
            id: { not: id }
          }
        });

        if (existingProduct) {
          throw new ConflictException(`Product with SKU "${updateProductDto.sku}" already exists`);
        }
      }

      return await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
        include: {
          category: true,
          supplier: true
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Product with ID "${id}" not found`);
        }
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[];
          if (target?.includes('sku')) {
            throw new ConflictException(`Product with SKU "${updateProductDto.sku}" already exists`);
          }
        }
      }
      throw error;
    }
  }

  async remove(id: string): Promise<Product> {
    try {
      // Verificar se produto existe
      await this.findOne(id);

      return await this.prisma.product.delete({
        where: { id }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Product with ID "${id}" not found`);
      }
      throw error;
    }
  }

  async updateStock(productId: string, quantity: number, reason: string, notes?: string): Promise<Product> {
    const product = await this.findOne(productId);

    const newStock = product.currentStock + quantity;

    if (newStock < 0) {
      throw new BadRequestException('Stock cannot be negative');
    }

    // Criar movimentação de estoque
    await this.prisma.stockMovement.create({
      data: {
        type: quantity > 0 ? 'IN' : 'OUT',
        quantity: Math.abs(quantity),
        previousStock: product.currentStock,
        currentStock: newStock,
        reason,
        notes,
        productId
      }
    });

    // Atualizar estoque do produto
    return await this.prisma.product.update({
      where: { id: productId },
      data: { currentStock: newStock },
      include: {
        category: true,
        supplier: true
      }
    });
  }
}