import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CreateCompanyUserDto } from './dto/create-company-user.dto';
import { UpdateCompanyUserDto } from './dto/update-company-user.dto';

@Controller('admin/company-users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.COMPANY_ADMIN)
export class CompanyUsersController {
  @Post()
  create(@Body() createCompanyUserDto: CreateCompanyUserDto) {
    // TODO: Implementar lógica de criação de usuário da empresa
    return { message: 'Company user creation not implemented yet' };
  }

  @Get()
  findAll() {
    // TODO: Implementar lógica de listagem de usuários da empresa
    return { message: 'Company users listing not implemented yet' };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // TODO: Implementar lógica de busca de usuário da empresa por ID
    return { message: `Company user ${id} retrieval not implemented yet` };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyUserDto: UpdateCompanyUserDto) {
    // TODO: Implementar lógica de atualização de usuário da empresa
    return { message: `Company user ${id} update not implemented yet` };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // TODO: Implementar lógica de remoção de usuário da empresa
    return { message: `Company user ${id} deletion not implemented yet` };
  }
}