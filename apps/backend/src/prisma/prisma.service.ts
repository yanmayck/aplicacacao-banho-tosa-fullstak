import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      // Optionally, you can pass PrismaClient options here,
      // such as logging configuration.
      // log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    // Connect to the database when the module is initialized.
    await this.$connect();
  }

  async onModuleDestroy() {
    // Disconnect from the database when the application is shutting down.
    await this.$disconnect();
  }
}
