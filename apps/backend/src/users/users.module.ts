import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
// import { UsersController } from './users.controller'; // Se você criar um controller para User CRUD

@Module({
  imports: [PrismaModule],
  // controllers: [UsersController], // Descomentar se tiver controller
  providers: [UsersService],
  exports: [UsersService], // Exportar UsersService para ser usado pelo AuthModule
})
export class UsersModule {}
