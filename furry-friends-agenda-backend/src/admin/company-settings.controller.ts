import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { UpdateCompanySettingsDto } from './dto/update-company-settings.dto';

@Controller('admin/company-settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.COMPANY_ADMIN)
export class CompanySettingsController {
  @Get()
  findSettings() {
    // TODO: Implementar lógica de busca de configurações da empresa
    return { message: 'Company settings retrieval not implemented yet' };
  }

  @Patch()
  update(@Body() updateCompanySettingsDto: UpdateCompanySettingsDto) {
    // TODO: Implementar lógica de atualização de configurações da empresa
    return { message: 'Company settings update not implemented yet' };
  }
}
