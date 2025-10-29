import { Module, MiddlewareConsumer } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';
import { PublicClientController } from './public-client.controller';
import { PublicClientService } from './public-client.service';
import { JwtClientGuard } from './guards/jwt-client.guard';
import { PublicTenantMiddleware } from '../auth/middlewares/public-tenant.middleware';
import { PublicTenantGuard } from '../auth/guards/public-tenant.guard';
import { PublicFeature } from '../auth/decorators/public-feature.decorator';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback-secret',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [PublicClientController],
  providers: [PublicClientService, JwtClientGuard, PublicTenantGuard],
  exports: [PublicClientService, JwtClientGuard],
})
export class PublicClientModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PublicTenantMiddleware).forRoutes(PublicClientController);
  }
}
