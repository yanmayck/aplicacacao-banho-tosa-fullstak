import { Module } from '@nestjs/common';
import { ServicesService } from './services.service'; // Atualizado
import { ServicesController } from './services.controller'; // Atualizado
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ServicesController], // Atualizado
  providers: [ServicesService], // Atualizado
  exports: [ServicesService], // Adicionado exports para o service caso seja usado em outros módulos (ex: Appointments)
})
export class ServicesModule {} // Classe renomeada
