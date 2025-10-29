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
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('admin/companies')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
export class CompaniesController {
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    // TODO: Implementar lógica de criação de empresa
    return { message: 'Company creation not implemented yet' };
  }

  @Get()
  findAll() {
    // TODO: Implementar lógica de listagem de empresas
    return { message: 'Company listing not implemented yet' };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // TODO: Implementar lógica de busca de empresa por ID
    return { message: `Company ${id} retrieval not implemented yet` };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    // TODO: Implementar lógica de atualização de empresa
    return { message: `Company ${id} update not implemented yet` };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // TODO: Implementar lógica de remoção de empresa
    return { message: `Company ${id} deletion not implemented yet` };
  }
}
