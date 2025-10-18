import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';
import { PublicClientController } from './public-client.controller';
import { PublicClientService } from './public-client.service';
import { JwtClientGuard } from './guards/jwt-client.guard';

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
  providers: [PublicClientService, JwtClientGuard],
  exports: [PublicClientService, JwtClientGuard],
})
export class PublicClientModule {}
