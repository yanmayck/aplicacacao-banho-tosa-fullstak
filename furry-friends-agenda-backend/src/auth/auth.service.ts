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

    const payload = {
      username: user.email,
      sub: user.id,
      role: user.role,
    };
    console.log('BACKEND: Gerando token com payload:', payload); // Log para depuração
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
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
