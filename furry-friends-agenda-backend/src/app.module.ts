import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PetsModule } from './pets/pets.module';
import { ServicesModule } from './services/services.module'; // Caminho e nome atualizados
import { AppointmentsModule } from './appointments/appointments.module';
import { ClientsModule } from './clients/clients.module';
import { GroomersModule } from './groomers/groomers.module';
import { PackagesModule } from './packages/packages.module';
import { FinancialModule } from './financial/financial.module';
import { PublicClientModule } from './public-client/public-client.module';
import { PublicServicesController } from './public-services/public-services.controller';
import { PublicServicesService } from './public-services/public-services.service';
import { ClientPetsController } from './client-pets/client-pets.controller';
import { ClientPetsService } from './client-pets/client-pets.service';
import { ClientAppointmentsController } from './client-appointments/client-appointments.controller';
import { ClientAppointmentsService } from './client-appointments/client-appointments.service';
import { ClientPetHealthController } from './client-pet-health/client-pet-health.controller';
import { ClientPetHealthService } from './client-pet-health/client-pet-health.service';
import { ClientReviewsController } from './client-reviews/client-reviews.controller';
import { ClientReviewsService } from './client-reviews/client-reviews.service';
import { NotificationsService } from './notifications/notifications.service';
import {
  ClientNotificationsController,
  NotificationsAdminController,
} from './notifications/notifications.controller';
import { ReportsModule } from './reports/reports.module';
import { ProductsModule } from './products/products.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { StockMovementsModule } from './stock-movements/stock-movements.module';
import { BackupModule } from './backup/backup.module';
import { AuditModule } from './audit/audit.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    PrismaModule,
    PetsModule,
    ServicesModule, // Nome atualizado
    AppointmentsModule,
    ClientsModule,
    GroomersModule,
    PackagesModule,
    FinancialModule,
    PublicClientModule,
    ReportsModule,
    ProductsModule,
    ProductCategoriesModule,
    StockMovementsModule,
    BackupModule,
    AuditModule,
    AdminModule,
  ],
  controllers: [
    AppController,
    PublicServicesController,
    ClientPetsController,
    ClientAppointmentsController,
    ClientPetHealthController,
    ClientReviewsController,
    ClientNotificationsController,
    NotificationsAdminController,
  ],
  providers: [
    AppService,
    PublicServicesService,
    ClientPetsService,
    ClientAppointmentsService,
    ClientPetHealthService,
    ClientReviewsService,
    NotificationsService,
  ],
})
export class AppModule {}
