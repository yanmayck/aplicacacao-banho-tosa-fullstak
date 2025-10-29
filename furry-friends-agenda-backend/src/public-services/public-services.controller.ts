import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PublicServicesService } from './public-services.service';
import { PublicTenantGuard } from '../auth/guards/public-tenant.guard';
import { PublicFeature } from '../auth/decorators/public-feature.decorator';

@Controller('public')
@UseGuards(PublicTenantGuard)
export class PublicServicesController {
  constructor(private readonly publicServicesService: PublicServicesService) {}

  @Get('services')
  @PublicFeature('services')
  findAll(@Req() req: any) {
    return this.publicServicesService.findAll(req);
  }

  @Get('services/:id')
  @PublicFeature('services')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.publicServicesService.findOne(id, req);
  }

  @Get('groomers')
  @PublicFeature('appointments')
  findAvailableGroomers(@Req() req: any) {
    return this.publicServicesService.findAvailableGroomers(req);
  }

  @Get('time-slots')
  @PublicFeature('appointments')
  findAvailableTimeSlots(@Query('date') date: string, @Req() req: any) {
    const appointmentDate = new Date(date);
    return this.publicServicesService.findAvailableTimeSlots(
      appointmentDate,
      req,
    );
  }
}
