import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ClientAppointmentsController } from './client-appointments.controller';
import { ClientAppointmentsService } from './client-appointments.service';

@Module({
  imports: [PrismaModule],
  controllers: [ClientAppointmentsController],
  providers: [ClientAppointmentsService],
  exports: [ClientAppointmentsService],
})
export class ClientAppointmentsModule {}
