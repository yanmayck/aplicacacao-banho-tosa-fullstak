import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Importar PrismaModule para injetar PrismaService
  controllers: [PetsController],
  providers: [PetsService],
})
export class PetsModule {}
