import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    ConfigModule, // Import ConfigModule to use ConfigService
    UsersModule, // Adicionar UsersModule aos imports
    JwtModule.registerAsync({
      imports: [ConfigModule], // Ensure ConfigModule is imported here too
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error(
            'JWT_SECRET is not set in the environment variables. Application cannot start.',
          );
        }
        return {
          secret,
          signOptions: {
            expiresIn: parseInt(
              configService.get<string>('JWT_EXPIRES_IN') || '3600',
              10,
            ),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
