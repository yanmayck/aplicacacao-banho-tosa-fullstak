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
import { User, UserRole } from '@prisma/client';
import { AuthPayload, LoginResponse } from './types/auth.types';

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
      const { password: _password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const fullUser = await this.usersService.findOneById(user.id);
    if (!fullUser) {
      throw new InternalServerErrorException(
        'User not found after validation.',
      );
    }

    const payload: AuthPayload = {
      username: fullUser.email,
      sub: fullUser.id,
      role: fullUser.role,
    };
    console.log('BACKEND: Gerando token com payload:', payload);
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: fullUser.id,
        email: fullUser.email,
        name: fullUser.name,
        role: fullUser.role,
      },
    };
  }

  async register(
    registerDto: RegisterDto,
  ): Promise<Omit<User, 'password'> | null> {
    try {
      const newUser = await this.usersService.createUser({
        email: registerDto.email,
        password: registerDto.password,
        name: registerDto.name,
        role: registerDto.role || UserRole.USER,
      });
      const { password: _password, ...result } = newUser;
      return result;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error('Error during registration: ', error);
      throw new InternalServerErrorException('Could not register user');
    }
  }
}
