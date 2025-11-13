import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client'; // Para tipagem do retorno
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface'; // Importar JwtPayload

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProfile(
    @Request() req: { user: JwtPayload },
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findOneById(req.user.userId); // Usar req.user.userId
    if (!user) {
      return null; // Ou lançar NotFoundException, dependendo da preferência
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateMyProfile(
    @Request() req: { user: JwtPayload }, // Tipar req
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'> | null> {
    const updatedUser = await this.usersService.updateUser(
      req.user.userId, // Usar req.user.userId
      updateUserDto,
    );
    if (updatedUser) {
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    }
    return null;
  }

  // Futuramente, adicionar endpoints para admin:
  // @Roles('ADMIN') // Supondo um decorator @Roles e um RolesGuard
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Get()
  // findAll() { ... }

  // @Roles('ADMIN')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Get(':id')
  // findOne(@Param('id') id: string) { ... }

  // etc.
}
