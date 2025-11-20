import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import {
  ClientNotificationsController,
  NotificationsAdminController,
} from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [PrismaModule],
  controllers: [ClientNotificationsController, NotificationsAdminController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
