import { Module, MiddlewareConsumer } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PublicServicesController } from './public-services.controller';
import { PublicServicesService } from './public-services.service';
import { PublicTenantMiddleware } from '../auth/middlewares/public-tenant.middleware';
import { PublicTenantGuard } from '../auth/guards/public-tenant.guard';

@Module({
  imports: [PrismaModule],
  controllers: [PublicServicesController],
  providers: [PublicServicesService, PublicTenantGuard],
  exports: [PublicServicesService],
})
export class PublicServicesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PublicTenantMiddleware).forRoutes(PublicServicesController);
  }
}
