import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ClientPetsController } from './client-pets.controller';
import { ClientPetsService } from './client-pets.service';

@Module({
  imports: [PrismaModule],
  controllers: [ClientPetsController],
  providers: [ClientPetsService],
  exports: [ClientPetsService]
})
export class ClientPetsModule {}