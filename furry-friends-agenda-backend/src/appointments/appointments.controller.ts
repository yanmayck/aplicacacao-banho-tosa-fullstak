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
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Request() req: { user: JwtPayload },
  ) {
    // req.user.sub é o ID do cliente logado
    return this.appointmentsService.create(
      createAppointmentDto,
      req.user.userId,
    );
  }

  @Get()
  findAll(
    @Request() req: { user: JwtPayload },
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    // Lista apenas os agendamentos do cliente logado
    const validPage = page && page > 0 ? page : undefined;
    const validLimit = limit && limit > 0 ? limit : undefined;

    return this.appointmentsService.findAllByClient(
      req.user.userId,
      validPage,
      validLimit,
    );
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: JwtPayload },
  ) {
    return this.appointmentsService.findOneByClient(id, req.user.userId);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @Request() req: { user: JwtPayload },
  ) {
    return this.appointmentsService.update(
      id,
      updateAppointmentDto,
      req.user.userId,
    );
  }

  @Delete(':id') // Ou talvez um PATCH para mudar status para CANCELLED
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: JwtPayload },
  ) {
    return this.appointmentsService.remove(id, req.user.userId);
  }
}
