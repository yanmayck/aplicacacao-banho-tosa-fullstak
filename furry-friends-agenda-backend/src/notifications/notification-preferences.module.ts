import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import {
  ClientNotificationPreferencesController,
  GroomerNotificationPreferencesController,
  AdminNotificationPreferencesController,
} from './notification-preferences.controller';
import { NotificationPreferencesService } from './notification-preferences.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    ClientNotificationPreferencesController,
    GroomerNotificationPreferencesController,
    AdminNotificationPreferencesController,
  ],
  providers: [NotificationPreferencesService],
  exports: [NotificationPreferencesService],
})
export class NotificationPreferencesModule {}
