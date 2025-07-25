import { Module } from '@nestjs/common';
import { GroomersService } from './groomers.service';
import { GroomersController } from './groomers.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GroomersController],
  providers: [GroomersService],
})
export class GroomersModule {}
