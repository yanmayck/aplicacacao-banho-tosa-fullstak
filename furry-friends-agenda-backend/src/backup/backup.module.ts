import { Module } from '@nestjs/common';
import { BackupController } from './controllers/backup.controller';
import { BackupService } from './services/backup.service';
import { EncryptionService } from './services/encryption.service';
import { CompressionService } from './services/compression.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BackupController],
  providers: [BackupService, EncryptionService, CompressionService],
  exports: [BackupService, EncryptionService, CompressionService],
})
export class BackupModule {}
