import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ClientPetHealthController } from './client-pet-health.controller';
import { ClientPetHealthService } from './client-pet-health.service';

@Module({
  imports: [PrismaModule],
  controllers: [ClientPetHealthController],
  providers: [ClientPetHealthService],
  exports: [ClientPetHealthService],
})
export class ClientPetHealthModule {}
