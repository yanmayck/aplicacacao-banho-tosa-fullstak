import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { NotificationQueueService } from './notification-queue.service';
import { CreateNotificationQueueDto } from './dto/create-notification-queue.dto';

@Controller('admin/notification-queue')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class NotificationQueueController {
  constructor(private readonly queueService: NotificationQueueService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createQueueDto: CreateNotificationQueueDto) {
    return this.queueService.create(createQueueDto);
  }

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('channel') channel?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.queueService.findAll({
      status: status as any,
      channel: channel as any,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });
  }

  @Get('stats')
  getStats() {
    return this.queueService.getQueueStats();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.queueService.findOne(id);
  }

  @Post('process')
  processQueue() {
    return this.queueService.processNotificationQueue();
  }

  @Post('from-template/:templateName')
  queueFromTemplate(
    @Param('templateName') templateName: string,
    @Body()
    body: {
      recipient: string;
      recipientType: 'email' | 'phone' | 'user_id';
      variables?: Record<string, any>;
      clientId?: string;
      groomerId?: string;
      appointmentId?: string;
      scheduledFor?: string;
      channel?: string;
    },
  ) {
    return this.queueService.queueNotificationFromTemplate(
      templateName,
      body.recipient,
      body.recipientType,
      body.variables,
      {
        clientId: body.clientId,
        groomerId: body.groomerId,
        appointmentId: body.appointmentId,
        scheduledFor: body.scheduledFor
          ? new Date(body.scheduledFor)
          : undefined,
        channel: body.channel as any,
      },
    );
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { status: string; errorMessage?: string },
  ) {
    return this.queueService.updateStatus(
      id,
      body.status as any,
      body.errorMessage,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    // Implementar método de remoção no serviço se necessário
    return { message: 'Funcionalidade de remoção será implementada em breve' };
  }
}
