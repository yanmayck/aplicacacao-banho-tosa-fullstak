import { NotificationType } from '@prisma/client';
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
import {
  NotificationsService,
  CreateNotificationDto,
} from './notifications.service';

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
      unreadOnly === 'true',
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
  sendAppointmentReminder(
    @Param('appointmentId', ParseUUIDPipe) appointmentId: string,
  ) {
    return this.notificationsService.sendAppointmentReminder(appointmentId);
  }

  @Post('appointment-confirmation/:appointmentId')
  sendAppointmentConfirmation(
    @Param('appointmentId', ParseUUIDPipe) appointmentId: string,
  ) {
    return this.notificationsService.sendAppointmentConfirmation(appointmentId);
  }

  // ========== NOVOS ENDPOINTS PARA TIPOS EXPANDIDOS ==========

  @Post('vaccine-reminder/:petId')
  sendVaccineReminder(@Param('petId', ParseUUIDPipe) petId: string) {
    return this.notificationsService.sendVaccineReminder(petId);
  }

  @Post('service-status/:appointmentId')
  sendServiceStatusUpdate(
    @Param('appointmentId', ParseUUIDPipe) appointmentId: string,
    @Body() body: { status: string; additionalInfo?: any },
  ) {
    return this.notificationsService.sendServiceStatusUpdate(
      appointmentId,
      body.status,
      body.additionalInfo,
    );
  }

  @Post('payment-reminder/:clientId')
  sendPaymentReminder(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Body() body: { amount: number; dueDate: string },
  ) {
    return this.notificationsService.sendPaymentReminder(
      clientId,
      body.amount,
      new Date(body.dueDate),
    );
  }

  @Post('loyalty-points/:clientId')
  sendLoyaltyPointsNotification(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Body() body: { points: number; reason: string },
  ) {
    return this.notificationsService.sendLoyaltyPointsNotification(
      clientId,
      body.points,
      body.reason,
    );
  }

  @Post('special-offer/:clientId')
  sendSpecialOffer(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Body()
    body: { offerTitle: string; offerDescription: string; validUntil: string },
  ) {
    return this.notificationsService.sendSpecialOffer(
      clientId,
      body.offerTitle,
      body.offerDescription,
      new Date(body.validUntil),
    );
  }

  @Post('pet-birthday-reminder/:petId')
  sendPetBirthdayReminder(@Param('petId', ParseUUIDPipe) petId: string) {
    return this.notificationsService.sendPetBirthdayReminder(petId);
  }

  @Post('bulk')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  sendBulkNotifications(
    @Body()
    body: {
      clientIds: string[];
      title: string;
      message: string;
      type: NotificationType;
      data?: any;
    },
  ) {
    return this.notificationsService.sendBulkNotifications(body.clientIds, {
      title: body.title,
      message: body.message,
      type: body.type,
      data: body.data,
    });
  }

  @Get('history')
  getNotificationHistory(
    @Request() req: { user: { sub: string } },
    @Query('type') type?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.notificationsService.getNotificationHistory(
      'client',
      req.user.sub,
      {
        type,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        limit: limit ? parseInt(limit) : undefined,
        offset: offset ? parseInt(offset) : undefined,
      },
    );
  }

  @Get('stats')
  getNotificationStats(@Request() req: { user: { sub: string } }) {
    return this.notificationsService.getNotificationStats(
      'client',
      req.user.sub,
    );
  }
}
