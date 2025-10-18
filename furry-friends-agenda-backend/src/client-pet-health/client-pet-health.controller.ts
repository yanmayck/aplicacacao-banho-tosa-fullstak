import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  ValidationPipe,
  UsePipes,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtClientGuard } from '../public-client/guards/jwt-client.guard';
import { ClientPetHealthService } from './client-pet-health.service';

@Controller('client/pets')
@UseGuards(JwtClientGuard)
export class ClientPetHealthController {
  constructor(private readonly clientPetHealthService: ClientPetHealthService) {}

  @Get(':petId/health')
  getPetHealth(
    @Param('petId', ParseUUIDPipe) petId: string,
    @Request() req: { user: { sub: string } },
  ) {
    return this.clientPetHealthService.getPetHealth(petId, req.user.sub);
  }

  @Post(':petId/vaccines')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  addVaccineRecord(
    @Param('petId', ParseUUIDPipe) petId: string,
    @Body() vaccineData: any,
    @Request() req: { user: { sub: string } },
  ) {
    return this.clientPetHealthService.addVaccineRecord(petId, vaccineData, req.user.sub);
  }

  @Patch(':petId/rabies-vaccine')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  updateRabiesVaccine(
    @Param('petId', ParseUUIDPipe) petId: string,
    @Body() rabiesData: any,
    @Request() req: { user: { sub: string } },
  ) {
    return this.clientPetHealthService.updateRabiesVaccine(petId, rabiesData, req.user.sub);
  }

  @Patch(':petId/tick-medicine')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  updateTickMedicine(
    @Param('petId', ParseUUIDPipe) petId: string,
    @Body() medicineData: any,
    @Request() req: { user: { sub: string } },
  ) {
    return this.clientPetHealthService.updateTickMedicine(petId, medicineData, req.user.sub);
  }

  @Get('vaccines/due-soon')
  getVaccinesDueSoon(@Request() req: { user: { sub: string } }) {
    return this.clientPetHealthService.getVaccinesDueSoon(req.user.sub);
  }
}
