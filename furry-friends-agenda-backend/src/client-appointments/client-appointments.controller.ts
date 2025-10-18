import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ValidationPipe,
  UsePipes,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtClientGuard } from '../public-client/guards/jwt-client.guard';
import { ClientAppointmentsService } from './client-appointments.service';
import { CreateAppointmentDto } from '../appointments/dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../appointments/dto/update-appointment.dto';

@Controller('client/appointments')
@UseGuards(JwtClientGuard)
export class ClientAppointmentsController {
  constructor(private readonly clientAppointmentsService: ClientAppointmentsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Request() req: { user: { sub: string } },
  ) {
    return this.clientAppointmentsService.create(createAppointmentDto, req.user.sub);
  }

  @Get()
  findAll(@Request() req: { user: { sub: string } }) {
    return this.clientAppointmentsService.findAllByClient(req.user.sub);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { sub: string } },
  ) {
    return this.clientAppointmentsService.findOneByClient(id, req.user.sub);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @Request() req: { user: { sub: string } },
  ) {
    return this.clientAppointmentsService.update(id, updateAppointmentDto, req.user.sub);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { sub: string } },
  ) {
    return this.clientAppointmentsService.cancel(id, req.user.sub);
  }
}
