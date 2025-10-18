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
  Query,
} from '@nestjs/common';
import { JwtClientGuard } from '../public-client/guards/jwt-client.guard';
import { NotificationsService, CreateNotificationDto } from './notifications.service';

@Controller('client/notifications')
@UseGuards(JwtClientGuard)
export class ClientNotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getClientNotifications(
    @Request() req: { user: { sub: string } },
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    return this.notificationsService.getClientNotifications(
      req.user.sub,
      unreadOnly === 'true'
    );
  }

  @Patch(':id/read')
  markAsRead(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { sub: string } },
  ) {
    return this.notificationsService.markAsRead(id, 'client', req.user.sub);
  }

  @Patch('mark-all-read')
  markAllAsRead(@Request() req: { user: { sub: string } }) {
    return this.notificationsService.markAllAsRead('client', req.user.sub);
  }

  @Get('unread-count')
  getUnreadCount(@Request() req: { user: { sub: string } }) {
    return this.notificationsService.getUnreadCount('client', req.user.sub);
  }
}

@Controller('notifications')
export class NotificationsAdminController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createNotification(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.createNotification(createNotificationDto);
  }

  @Post('appointment-reminder/:appointmentId')
  sendAppointmentReminder(@Param('appointmentId', ParseUUIDPipe) appointmentId: string) {
    return this.notificationsService.sendAppointmentReminder(appointmentId);
  }

  @Post('appointment-confirmation/:appointmentId')
  sendAppointmentConfirmation(@Param('appointmentId', ParseUUIDPipe) appointmentId: string) {
    return this.notificationsService.sendAppointmentConfirmation(appointmentId);
  }
}
