"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const prisma_module_1 = require("./prisma/prisma.module");
const config_1 = require("@nestjs/config");
const pets_module_1 = require("./pets/pets.module");
const services_module_1 = require("./services/services.module");
const appointments_module_1 = require("./appointments/appointments.module");
const clients_module_1 = require("./clients/clients.module");
const groomers_module_1 = require("./groomers/groomers.module");
const packages_module_1 = require("./packages/packages.module");
const financial_module_1 = require("./financial/financial.module");
const public_client_module_1 = require("./public-client/public-client.module");
const public_services_controller_1 = require("./public-services/public-services.controller");
const public_services_service_1 = require("./public-services/public-services.service");
const client_pets_controller_1 = require("./client-pets/client-pets.controller");
const client_pets_service_1 = require("./client-pets/client-pets.service");
const client_appointments_controller_1 = require("./client-appointments/client-appointments.controller");
const client_appointments_service_1 = require("./client-appointments/client-appointments.service");
const client_pet_health_controller_1 = require("./client-pet-health/client-pet-health.controller");
const client_pet_health_service_1 = require("./client-pet-health/client-pet-health.service");
const client_reviews_controller_1 = require("./client-reviews/client-reviews.controller");
const client_reviews_service_1 = require("./client-reviews/client-reviews.service");
const notifications_service_1 = require("./notifications/notifications.service");
const notifications_controller_1 = require("./notifications/notifications.controller");
const reports_module_1 = require("./reports/reports.module");
const products_module_1 = require("./products/products.module");
const product_categories_module_1 = require("./product-categories/product-categories.module");
const stock_movements_module_1 = require("./stock-movements/stock-movements.module");
const backup_module_1 = require("./backup/backup.module");
const audit_module_1 = require("./audit/audit.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            schedule_1.ScheduleModule.forRoot(),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            prisma_module_1.PrismaModule,
            pets_module_1.PetsModule,
            services_module_1.ServicesModule,
            appointments_module_1.AppointmentsModule,
            clients_module_1.ClientsModule,
            groomers_module_1.GroomersModule,
            packages_module_1.PackagesModule,
            financial_module_1.FinancialModule,
            public_client_module_1.PublicClientModule,
            reports_module_1.ReportsModule,
            products_module_1.ProductsModule,
            product_categories_module_1.ProductCategoriesModule,
            stock_movements_module_1.StockMovementsModule,
            backup_module_1.BackupModule,
            audit_module_1.AuditModule,
        ],
        controllers: [
            app_controller_1.AppController,
            public_services_controller_1.PublicServicesController,
            client_pets_controller_1.ClientPetsController,
            client_appointments_controller_1.ClientAppointmentsController,
            client_pet_health_controller_1.ClientPetHealthController,
            client_reviews_controller_1.ClientReviewsController,
            notifications_controller_1.ClientNotificationsController,
            notifications_controller_1.NotificationsAdminController,
        ],
        providers: [
            app_service_1.AppService,
            public_services_service_1.PublicServicesService,
            client_pets_service_1.ClientPetsService,
            client_appointments_service_1.ClientAppointmentsService,
            client_pet_health_service_1.ClientPetHealthService,
            client_reviews_service_1.ClientReviewsService,
            notifications_service_1.NotificationsService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map