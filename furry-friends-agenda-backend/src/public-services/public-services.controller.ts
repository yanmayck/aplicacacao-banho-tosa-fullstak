import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PublicServicesService } from './public-services.service';

@Controller('public')
export class PublicServicesController {
  constructor(private readonly publicServicesService: PublicServicesService) {}

  @Get('services')
  findAll() {
    return this.publicServicesService.findAll();
  }

  @Get('services/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.publicServicesService.findOne(id);
  }

  @Get('groomers')
  findAvailableGroomers() {
    return this.publicServicesService.findAvailableGroomers();
  }

  @Get('time-slots')
  findAvailableTimeSlots(
    @Query('date') date: string,
    @Query('serviceId') serviceId: string,
  ) {
    const appointmentDate = new Date(date);
    return this.publicServicesService.findAvailableTimeSlots(appointmentDate, serviceId);
  }
}
