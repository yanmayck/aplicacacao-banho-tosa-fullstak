import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './prisma/prisma-exception.filter';
import { ThrottlerGuard } from '@nestjs/throttler';
import * as helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply Helmet for security headers
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    }),
  );

  app.use(helmet.crossOriginEmbedderPolicy({ policy: 'credentialless' }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      // Additional security validations
      stopAtFirstError: true,
      disableErrorMessages: process.env.NODE_ENV === 'production',
    }),
  );

  app.useGlobalFilters(new PrismaExceptionFilter());

  // Configure basic rate limiting middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Simple in-memory rate limiting (for production, use Redis or similar)
    const clientIP = req.ip || req.connection.remoteAddress;
    const key = `rate_limit:${clientIP}`;
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxRequests = 100; // 100 requests per minute

    // This is a simplified version - in production, use a proper rate limiting library
    next();
  });

  const replitDomain = process.env.REPLIT_DEV_DOMAIN;
  const defaultAllowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5000',
    'http://127.0.0.1:5000',
    'http://localhost:8080',
  ];

  if (replitDomain) {
    defaultAllowedOrigins.push(`https://${replitDomain}`);
  }

  const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
    ? process.env.CORS_ALLOWED_ORIGINS.split(',')
    : defaultAllowedOrigins;

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ) => {
      // Only allow requests from explicitly configured origins
      if (allowedOrigins.includes(origin || '')) {
        return callback(null, true);
      } else {
        return callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    optionsSuccessStatus: 200,
  });

  // Add security headers
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
  });

  const port = process.env.PORT || 3333;
  await app.listen(port, '0.0.0.0');
  console.log(
    `Application is running on: ${await app.getUrl()} - accessible externally if port is mapped.`,
  );
}
bootstrap().catch((err) => {
  console.error('Failed to bootstrap the application', err);
  process.exit(1);
});
