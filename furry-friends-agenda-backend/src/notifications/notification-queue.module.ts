import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationQueueController } from './notification-queue.controller';
import { NotificationQueueService } from './notification-queue.service';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationQueueController],
  providers: [NotificationQueueService],
  exports: [NotificationQueueService],
})
export class NotificationQueueModule {}
