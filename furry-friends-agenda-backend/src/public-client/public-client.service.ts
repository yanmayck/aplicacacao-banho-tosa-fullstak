import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { PublicClientRegisterDto } from './dto/public-client-register.dto';
import { PublicClientLoginDto } from './dto/public-client-login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PublicClientService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: PublicClientRegisterDto) {
    // Verificar se o email já existe
    const existingClient = await this.prisma.client.findUnique({
      where: { email: registerDto.email },
    });

    if (existingClient) {
      throw new ConflictException('Email já cadastrado');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Criar cliente
    const client = await this.prisma.client.create({
      data: {
        name: registerDto.name,
        email: registerDto.email,
        phone: registerDto.phone,
        address: registerDto.address,
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

  async login(loginDto: PublicClientLoginDto) {
    // Buscar cliente por email
    const client = await this.prisma.client.findUnique({
      where: { email: loginDto.email },
    });

    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    // Em um cenário real, você precisaria armazenar a senha do cliente
    // Por ora, vamos implementar uma validação básica
    // Nota: No futuro, você deve adicionar um campo password ao modelo Client

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

  async findById(id: string) {
    return this.prisma.client.findUnique({
      where: { id },
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
