import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { BaseService } from '../common/base.service';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService extends BaseService {
  constructor(protected prisma: PrismaService) {
    super(prisma);
  }

  async createUser(
    data: Prisma.UserCreateInput,
    user: JwtPayload,
  ): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, roundsOfHashing);

    const dataWithCompany = this.applyCompanyFilterToCreate(
      {
        ...data,
        password: hashedPassword,
      },
      user,
      'User',
    ) as any;

    return this.prisma.user.create({
      data: dataWithCompany,
    });
  }

  async findOneById(id: string, user: JwtPayload): Promise<User | null> {
    const foundUser = await this.prisma.user.findUnique({ where: { id } });
    if (!foundUser) {
      return null;
    }

    // SUPER_ADMIN pode ver usuários de todas as empresas
    if (user.role !== 'SUPER_ADMIN') {
      const companyFilter = this.getCompanyFilter(user);
      if (
        'companyId' in companyFilter &&
        foundUser.companyId !== companyFilter.companyId
      ) {
        return null; // Usuário não tem acesso a este usuário
      }
    }

    return foundUser;
  }

  async findOneByEmail(email: string, user?: JwtPayload): Promise<User | null> {
    const foundUser = await this.prisma.user.findUnique({ where: { email } });
    if (!foundUser) {
      return null;
    }

    // Se user for fornecido, aplicar filtro de empresa (exceto SUPER_ADMIN)
    if (user && user.role !== 'SUPER_ADMIN') {
      const companyFilter = this.getCompanyFilter(user);
      if (
        'companyId' in companyFilter &&
        foundUser.companyId !== companyFilter.companyId
      ) {
        return null; // Usuário não tem acesso a este usuário
      }
    }

    return foundUser;
  }

  async updateUser(
    id: string,
    data: Prisma.UserUpdateInput,
    user: JwtPayload,
  ): Promise<User | null> {
    // Verificar se o usuário tem acesso ao usuário que está sendo atualizado
    const existingUser = await this.findOneById(id, user);
    if (!existingUser) {
      return null;
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
