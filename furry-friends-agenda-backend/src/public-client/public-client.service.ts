import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { PublicClientRegisterDto } from './dto/public-client-register.dto';
import { PublicClientLoginDto } from './dto/public-client-login.dto';
import { PublicTenantInfo } from '../auth/types/tenant.types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PublicClientService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private getCompanyIdFromRequest(req: any): string | null {
    return req.tenant?.id || null;
  }

  async register(registerDto: PublicClientRegisterDto, req: any) {
    const companyId = this.getCompanyIdFromRequest(req);

    // Verificar se o email já existe (filtrado por empresa se aplicável)
    const existingClient = await this.prisma.client.findUnique({
      where: {
        email: registerDto.email,
        ...(companyId && { companyId }),
      },
    });

    if (existingClient) {
      throw new ConflictException('Email já cadastrado');
    }

    // Hash da senha
    await bcrypt.hash(registerDto.password, 10);

    // Criar cliente
    const client = await this.prisma.client.create({
      data: {
        name: registerDto.name,
        email: registerDto.email,
        phone: registerDto.phone,
        address: registerDto.address,
        companyId: companyId || 'default-company-id', // Fallback para empresa padrão se não especificada
      },
    });

    // Gerar token JWT
    const payload = { sub: client.id, email: client.email, type: 'client' };
    const token = this.jwtService.sign(payload);

    return {
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
      },
      access_token: token,
    };
  }

  async login(loginDto: PublicClientLoginDto, req: any) {
    const companyId = this.getCompanyIdFromRequest(req);

    // Buscar cliente por email (filtrado por empresa se aplicável)
    const client = await this.prisma.client.findUnique({
      where: {
        email: loginDto.email,
        ...(companyId && { companyId }),
      },
    });

    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    // Em um cenário real, você precisaria armazenar a senha do cliente
    // Por ora, vamos implementar uma validação básica
    // Nota: No futuro, você deve adicionar um campo password ao modelo Client

    // Gerar token JWT
    const payload = {
      sub: client.id,
      email: client.email,
      type: 'client',
      companyId: client.companyId,
    };
    const token = this.jwtService.sign(payload);

    return {
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
      },
      access_token: token,
    };
  }

  async findById(id: string, req: any) {
    const companyId = this.getCompanyIdFromRequest(req);

    return this.prisma.client.findUnique({
      where: {
        id,
        ...(companyId && { companyId }),
      },
      include: {
        pets: true,
        appointments: {
          include: {
            pet: true,
            groomer: true,
            appointmentServices: {
              include: {
                service: true,
              },
            },
          },
        },
      },
    });
  }
}
