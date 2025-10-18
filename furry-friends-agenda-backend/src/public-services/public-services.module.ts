import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PublicServicesController } from './public-services.controller';
import { PublicServicesService } from './public-services.service';

@Module({
  imports: [PrismaModule],
  controllers: [PublicServicesController],
  providers: [PublicServicesService],
  exports: [PublicServicesService]
})
export class PublicServicesModule {}