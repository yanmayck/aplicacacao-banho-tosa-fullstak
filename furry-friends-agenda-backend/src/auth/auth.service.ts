import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User, UserRole } from '@prisma/client'; // Import User and UserRole types

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // No schema, User.role é singular e do tipo UserRole.
    // Omit<User, 'password'> não garante que 'role' (singular) esteja presente se o validateUser retornar um tipo mais genérico.
    // Para segurança, vamos buscar o usuário completo novamente ou garantir que 'role' está no tipo retornado por validateUser.
    const fullUser = await this.usersService.findOneById(user.id); // Assumindo que findOneById existe e retorna o usuário completo
    if (!fullUser) {
        // Isso não deveria acontecer se validateUser retornou um usuário
        throw new InternalServerErrorException('User not found after validation.');
    }

    const payload = { username: fullUser.email, sub: fullUser.id, role: fullUser.role }; // Alterado de roles para role
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: fullUser.id,
        email: fullUser.email,
        name: fullUser.name,
        role: fullUser.role, // Alterado de roles para role
      },
    };
  }

  async register(
    registerDto: RegisterDto,
  ): Promise<Omit<User, 'password'> | null> {
    try {
      // Assumindo que RegisterDto será atualizado para ter 'role: UserRole' em vez de 'roles: string[]'
      // e que usersService.createUser também será ajustado.
      const newUser = await this.usersService.createUser({
        email: registerDto.email,
        password: registerDto.password,
        name: registerDto.name,
        role: registerDto.role || UserRole.USER,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = newUser;
      return result;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error; // Re-throw conflict exception
      }
      // Log the error for debugging purposes
      console.error('Error during registration: ', error);
      throw new InternalServerErrorException('Could not register user');
    }
  }
}
