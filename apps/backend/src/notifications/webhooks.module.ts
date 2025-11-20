import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import {
  NotificationWebhooksController,
  AdminNotificationWebhooksController,
} from './webhooks.controller';
import { WebhookService } from './webhook.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    NotificationWebhooksController,
    AdminNotificationWebhooksController,
  ],
  providers: [WebhookService],
  exports: [WebhookService],
})
export class WebhooksModule {}
