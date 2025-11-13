import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  UsePipes,
  ParseUUIDPipe,
  Put, // Adicionar Put para o update
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.findOne(id);
  }

  @Put(':id') // Alterado de Patch para Put para atualização completa
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.remove(id);
  }

  // Novos endpoints para banhos avulsos
  @Post(':id/purchase-online')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER) // ou outra role apropriada
  async purchaseServiceOnline(
    @Param('id', ParseUUIDPipe) serviceId: string,
    @Body('clientId') clientId: string,
  ) {
    return this.servicesService.purchaseOnline(clientId, serviceId);
  }

  @Post(':id/register-offline')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Apenas administradores podem registrar pagamentos offline
  async registerOfflinePayment(
    @Param('id', ParseUUIDPipe) serviceId: string,
    @Body('clientId') clientId: string,
  ) {
    return this.servicesService.registerOfflinePayment(clientId, serviceId);
  }
}
