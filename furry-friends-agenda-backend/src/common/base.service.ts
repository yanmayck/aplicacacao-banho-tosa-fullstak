import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { UserRole } from '@prisma/client';

@Injectable()
export abstract class BaseService {
  constructor(protected prisma: PrismaService) {}

  /**
   * Obtém o companyId do usuário atual, considerando exceções para SUPER_ADMIN
   */
  protected getCompanyFilter(user: JwtPayload, entityName?: string): { companyId: string } | {} {
    // SUPER_ADMIN pode acessar dados de todas as empresas
    if (user.role === UserRole.SUPER_ADMIN) {
      return {};
    }

    // Usuários normais só acessam dados da própria empresa
    return { companyId: user.companyId };
  }

  /**
   * Aplica filtro de empresa automaticamente nas queries de busca
   */
  protected applyCompanyFilter<T extends Record<string, any>>(
    where: T,
    user: JwtPayload,
    entityName?: string
  ): T & { companyId?: string } {
    const companyFilter = this.getCompanyFilter(user, entityName);

    if ('companyId' in companyFilter) {
      return {
        ...where,
        companyId: companyFilter.companyId,
      };
    }

    return where;
  }

  /**
   * Aplica filtro de empresa automaticamente nas queries de criação
   */
  protected applyCompanyFilterToCreate<T extends Record<string, any>>(
    data: T,
    user: JwtPayload,
    entityName?: string
  ): T & { companyId: string } {
    const companyFilter = this.getCompanyFilter(user, entityName);

    if ('companyId' in companyFilter) {
      return {
        ...data,
        companyId: companyFilter.companyId,
      } as T & { companyId: string };
    }

    // Para SUPER_ADMIN, companyId deve ser fornecido explicitamente
    if (!('companyId' in data)) {
      throw new Error(`companyId é obrigatório para ${entityName || 'esta entidade'} quando criado por SUPER_ADMIN`);
    }

    return data as T & { companyId: string };
  }

  /**
   * Verifica se o usuário tem permissão para acessar uma entidade específica
   */
  protected async validateEntityOwnership(
    entityId: string,
    user: JwtPayload,
    entityName: string,
    findByIdFn: (id: string) => Promise<{ companyId: string } | null>
  ): Promise<void> {
    // SUPER_ADMIN pode acessar qualquer entidade
    if (user.role === UserRole.SUPER_ADMIN) {
      return;
    }

    const entity = await findByIdFn(entityId);
    if (!entity) {
      throw new Error(`${entityName} não encontrado`);
    }

    if (entity.companyId !== user.companyId) {
      throw new Error(`Acesso negado: ${entityName} pertence a outra empresa`);
    }
  }

  /**
   * Método helper para queries com paginação e filtro de empresa
   */
  protected async findManyWithCompanyFilter<T>(
    model: any,
    options: {
      where?: Record<string, any>;
      orderBy?: Record<string, any>;
      skip?: number;
      take?: number;
      include?: Record<string, any>;
    },
    user: JwtPayload,
    entityName?: string
  ): Promise<T[]> {
    const where = this.applyCompanyFilter(options.where || {}, user, entityName);

    return model.findMany({
      ...options,
      where,
    });
  }

  /**
   * Método helper para query única com filtro de empresa
   */
  protected async findUniqueWithCompanyFilter<T>(
    model: any,
    where: Record<string, any>,
    user: JwtPayload,
    entityName?: string,
    include?: Record<string, any>
  ): Promise<T | null> {
    const companyFilter = this.getCompanyFilter(user, entityName);

    if ('companyId' in companyFilter) {
      where = { ...where, companyId: companyFilter.companyId };
    }

    return model.findUnique({
      where,
      include,
    });
  }

  /**
   * Método helper para criação com filtro de empresa
   */
  protected async createWithCompanyFilter<T>(
    model: any,
    data: Record<string, any>,
    user: JwtPayload,
    entityName?: string
  ): Promise<T> {
    const dataWithCompany = this.applyCompanyFilterToCreate(data, user, entityName);

    return model.create({
      data: dataWithCompany,
    });
  }

  /**
   * Método helper para atualização com validação de propriedade
   */
  protected async updateWithCompanyFilter<T>(
    model: any,
    where: Record<string, any>,
    data: Record<string, any>,
    user: JwtPayload,
    entityName?: string,
    include?: Record<string, any>
  ): Promise<T> {
    // Primeiro valida se o usuário tem acesso à entidade
    await this.validateEntityOwnership(
      where.id,
      user,
      entityName || 'Entidade',
      async (id) => await model.findUnique({ where: { id }, select: { companyId: true } })
    );

    return model.update({
      where,
      data,
      include,
    });
  }

  /**
   * Método helper para exclusão com validação de propriedade
   */
  protected async deleteWithCompanyFilter(
    model: any,
    where: Record<string, any>,
    user: JwtPayload,
    entityName?: string
  ): Promise<void> {
    // Primeiro valida se o usuário tem acesso à entidade
    await this.validateEntityOwnership(
      where.id,
      user,
      entityName || 'Entidade',
      async (id) => await model.findUnique({ where: { id }, select: { companyId: true } })
    );

    await model.delete({
      where,
    });
  }
}