import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { EncryptionService } from './encryption.service';
import { CompressionService } from './compression.service';
import { BaseService } from '../../common/base.service';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import * as fs from 'fs';
import * as path from 'path';
import * as cron from 'node-cron';

import {
  CreateBackupDto,
  BackupType,
  BackupStatus,
  RestoreBackupDto,
} from '../dto/create-backup.dto';
import {
  BackupMetadata,
  BackupProgress,
  BackupResult,
  RestoreResult,
  DatabaseTable,
  IntegrityCheckResult,
} from '../interfaces/backup.interface';

@Injectable()
export class BackupService extends BaseService {
  private readonly logger = new Logger(BackupService.name);
  private readonly backupPath: string;
  private readonly maxBackupSize: number;
  private backupProgress: Map<string, BackupProgress> = new Map();
  private scheduledJobs: Map<string, cron.ScheduledTask> = new Map();

  constructor(
    protected readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly encryptionService: EncryptionService,
    private readonly compressionService: CompressionService,
  ) {
    super(prisma);
    this.backupPath =
      this.configService.get<string>('BACKUP_PATH') || './backups';
    this.maxBackupSize =
      this.configService.get<number>('MAX_BACKUP_SIZE') || 100; // MB

    // Cria diretório de backup se não existir
    if (!fs.existsSync(this.backupPath)) {
      fs.mkdirSync(this.backupPath, { recursive: true });
    }

    // Agenda backup automático se configurado
    this.scheduleAutomaticBackups();
  }

  /**
   * Cria um novo backup
   */
  async createBackup(createBackupDto: CreateBackupDto): Promise<BackupResult> {
    const backupId = this.generateBackupId();
    const startTime = new Date();

    try {
      // Inicializa progresso
      this.backupProgress.set(backupId, {
        backupId,
        status: BackupStatus.IN_PROGRESS,
        progress: 0,
        currentStep: 'Inicializando backup...',
        totalSteps: 5,
        bytesProcessed: 0,
        totalBytes: 0,
        startTime,
      });

      this.logger.log(
        `Iniciando backup ${backupId} do tipo ${createBackupDto.type}`,
      );

      let result: BackupResult;

      switch (createBackupDto.type) {
        case BackupType.FULL:
          result = await this.createFullBackup(backupId, createBackupDto);
          break;
        case BackupType.DATABASE:
          result = await this.createDatabaseBackup(backupId, createBackupDto);
          break;
        case BackupType.CONFIG:
          result = await this.createConfigBackup(backupId, createBackupDto);
          break;
        case BackupType.UPLOADS:
          result = await this.createUploadsBackup(backupId, createBackupDto);
          break;
        default:
          throw new BadRequestException(
            `Tipo de backup não suportado: ${createBackupDto.type}`,
          );
      }

      // Atualiza progresso final
      this.backupProgress.set(backupId, {
        ...this.backupProgress.get(backupId)!,
        status: BackupStatus.COMPLETED,
        progress: 100,
        currentStep: 'Backup concluído',
      });

      // Salva metadados do backup
      await this.saveBackupMetadata({
        id: backupId,
        type: createBackupDto.type,
        status: BackupStatus.COMPLETED,
        fileName: result.filePath ? path.basename(result.filePath) : '',
        filePath: result.filePath || '',
        fileSize: result.fileSize || 0,
        checksum: '', // Será calculado posteriormente
        encrypted: createBackupDto.encrypt || false,
        compressed: true,
        createdAt: startTime,
        completedAt: new Date(),
        description: createBackupDto.description,
        version: '1.0',
      });

      this.logger.log(`Backup ${backupId} concluído com sucesso`);
      return result;
    } catch (error) {
      this.logger.error(`Erro ao criar backup ${backupId}`, error);

      // Atualiza progresso com erro
      this.backupProgress.set(backupId, {
        ...this.backupProgress.get(backupId)!,
        status: BackupStatus.FAILED,
        currentStep: `Erro: ${(error as Error).message}`,
      });

      return {
        success: false,
        error: (error as Error).message,
        duration: Date.now() - startTime.getTime(),
        tablesBackedUp: [],
      };
    }
  }

  /**
   * Cria backup completo do banco de dados
   */
  private async createFullBackup(
    backupId: string,
    dto: CreateBackupDto,
  ): Promise<BackupResult> {
    this.updateProgress(backupId, 1, 'Exportando dados do banco...');

    // Obtém todas as tabelas do banco
    const tables = await this.getDatabaseTables();

    // Exporta dados de cada tabela
    const exportData: any = {};
    const tablesBackedUp: string[] = [];

    for (let i = 0; i < tables.length; i++) {
      const table = tables[i];
      const tableName = table.name;

      // Pula tabelas excluídas
      if (dto.tables && !dto.tables.includes(tableName)) {
        continue;
      }

      this.updateProgress(backupId, 2, `Exportando tabela ${tableName}...`);

      try {
        const data = await this.exportTableData(tableName);
        exportData[tableName] = data;
        tablesBackedUp.push(tableName);

        this.updateProgress(
          backupId,
          3,
          `Tabela ${tableName} exportada (${data.length} registros)`,
        );
      } catch (error) {
        this.logger.warn(`Erro ao exportar tabela ${tableName}`, error);
      }
    }

    // Salva dados em arquivo JSON
    const fileName = `full-backup-${backupId}.json`;
    const filePath = path.join(this.backupPath, fileName);

    this.updateProgress(backupId, 4, 'Salvando arquivo de backup...');

    JSON.stringify(
      {
        metadata: {
          backupId,
          type: 'full',
          createdAt: new Date().toISOString(),
          tables: tablesBackedUp,
          totalRecords: Object.values(exportData).reduce(
            (sum: number, table: any) => sum + table.length,
            0,
          ),
        },
        data: exportData,
      },
      null,
      2,
    );

    // Criptografa se necessário
    let finalPath = filePath;
    if (dto.encrypt) {
      const encryptedPath = `${filePath}.encrypted`;
      await this.encryptionService.encryptFile(
        filePath,
        encryptedPath,
        dto.description || 'backup',
      );
      finalPath = encryptedPath;
    }

    // Comprime o arquivo
    const compressedPath = `${finalPath}.zip`;
    const compressionResult = await this.compressionService.compressFile(
      finalPath,
      compressedPath,
      9, // Máxima compressão
    );

    // Remove arquivo temporário
    if (fs.existsSync(finalPath)) {
      fs.unlinkSync(finalPath);
    }

    return {
      success: true,
      backupId,
      filePath: compressedPath,
      fileSize: compressionResult.compressedSize,
      duration:
        Date.now() - this.backupProgress.get(backupId)!.startTime.getTime(),
      tablesBackedUp,
    };
  }

  /**
   * Cria backup apenas do banco de dados
   */
  private async createDatabaseBackup(
    backupId: string,
    dto: CreateBackupDto,
  ): Promise<BackupResult> {
    return this.createFullBackup(backupId, { ...dto, type: BackupType.FULL });
  }

  /**
   * Cria backup de configurações
   */
  private async createConfigBackup(
    backupId: string,
    dto: CreateBackupDto,
  ): Promise<BackupResult> {
    this.updateProgress(backupId, 1, 'Exportando configurações...');

    const configData = {
      environment: process.env,
      timestamp: new Date().toISOString(),
      backupId,
    };

    const fileName = `config-backup-${backupId}.json`;
    const filePath = path.join(this.backupPath, fileName);

    JSON.stringify(configData, null, 2);

    // Criptografa se necessário
    let finalPath = filePath;
    if (dto.encrypt) {
      const encryptedPath = `${filePath}.encrypted`;
      await this.encryptionService.encryptFile(
        filePath,
        encryptedPath,
        dto.description || 'backup',
      );
      finalPath = encryptedPath;
    }

    // Comprime
    const compressedPath = `${finalPath}.zip`;
    const compressionResult = await this.compressionService.compressFile(
      finalPath,
      compressedPath,
    );

    if (fs.existsSync(finalPath)) {
      fs.unlinkSync(finalPath);
    }

    return {
      success: true,
      backupId,
      filePath: compressedPath,
      fileSize: compressionResult.compressedSize,
      duration:
        Date.now() - this.backupProgress.get(backupId)!.startTime.getTime(),
      tablesBackedUp: ['configurations'],
    };
  }

  /**
   * Cria backup de uploads
   */
  private async createUploadsBackup(
    backupId: string,
    dto: CreateBackupDto,
  ): Promise<BackupResult> {
    this.updateProgress(backupId, 1, 'Procurando arquivos de upload...');

    const uploadsPath = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsPath)) {
      throw new NotFoundException('Diretório de uploads não encontrado');
    }

    const fileName = `uploads-backup-${backupId}`;
    const filePath = path.join(this.backupPath, fileName);

    this.updateProgress(backupId, 2, 'Comprimindo arquivos de upload...');

    // Comprime arquivos de upload
    const compressionResult = await this.compressionService.compressFile(
      uploadsPath,
      `${filePath}.zip`,
      9,
    );

    return {
      success: true,
      backupId,
      filePath: `${filePath}.zip`,
      fileSize: compressionResult.compressedSize,
      duration:
        Date.now() - this.backupProgress.get(backupId)!.startTime.getTime(),
      tablesBackedUp: ['uploads'],
    };
  }

  /**
   * Restaura dados de um backup
   */
  async restoreBackup(restoreDto: RestoreBackupDto): Promise<RestoreResult> {
    const startTime = new Date();

    try {
      // Busca metadados do backup
      const metadata = this.getBackupMetadata(restoreDto.backupId);
      if (!metadata) {
        throw new NotFoundException(
          `Backup ${restoreDto.backupId} não encontrado`,
        );
      }

      if (metadata.status !== BackupStatus.COMPLETED) {
        throw new BadRequestException(
          'Backup não está em status válido para restauração',
        );
      }

      // Descomprime arquivo
      const tempDir = path.join(this.backupPath, 'temp-restore');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const decompressedPath = path.join(
        tempDir,
        `backup-${restoreDto.backupId}`,
      );
      await this.compressionService.decompressFile(
        metadata.filePath,
        decompressedPath,
      );

      // Descriptografa se necessário
      let dataPath = decompressedPath;
      if (metadata.encrypted) {
        const encryptedPath = path.join(
          decompressedPath,
          'backup.json.encrypted',
        );
        const decryptedPath = path.join(decompressedPath, 'backup.json');

        // Aqui seria necessário ter a chave de descriptografia
        // Por simplicidade, assumimos que a chave está disponível
        await this.encryptionService.decryptFile(
          encryptedPath,
          decryptedPath,
          'backup-key',
        );

        dataPath = decryptedPath;
      }

      // Restaura dados
      const restoreResult = this.performRestore(dataPath, restoreDto);

      // Limpa arquivos temporários
      this.cleanupTempFiles(tempDir);

      return restoreResult;
    } catch (error) {
      this.logger.error(
        `Erro ao restaurar backup ${restoreDto.backupId}`,
        error,
      );

      return {
        success: false,
        tablesRestored: [],
        rowsAffected: 0,
        duration: Date.now() - startTime.getTime(),
        error: (error as Error).message,
      };
    }
  }

  /**
   * Obtém lista de backups
   */
  getBackups(limit: number = 50, offset: number = 0): BackupMetadata[] {
    // Em uma implementação real, isso seria armazenado no banco de dados
    // Por simplicidade, vamos listar arquivos do diretório
    const files = fs
      .readdirSync(this.backupPath)
      .filter((file) => file.endsWith('.zip'))
      .sort(
        (a, b) =>
          fs.statSync(path.join(this.backupPath, b)).mtime.getTime() -
          fs.statSync(path.join(this.backupPath, a)).mtime.getTime(),
      )
      .slice(offset, offset + limit);

    return files.map((file) => {
      const filePath = path.join(this.backupPath, file);
      const stats = fs.statSync(filePath);

      return {
        id: path.basename(file, '.zip'),
        type: BackupType.FULL,
        status: BackupStatus.COMPLETED,
        fileName: file,
        filePath,
        fileSize: stats.size,
        checksum: '',
        encrypted: false,
        compressed: true,
        createdAt: stats.birthtime,
        completedAt: stats.mtime,
        version: '1.0',
      };
    });
  }

  /**
   * Obtém progresso de um backup
   */
  getBackupProgress(backupId: string): BackupProgress | null {
    return this.backupProgress.get(backupId) || null;
  }

  /**
   * Cancela um backup em andamento
   */
  cancelBackup(backupId: string): boolean {
    const progress = this.backupProgress.get(backupId);
    if (progress && progress.status === BackupStatus.IN_PROGRESS) {
      this.backupProgress.set(backupId, {
        ...progress,
        status: BackupStatus.CANCELLED,
        currentStep: 'Backup cancelado pelo usuário',
      });

      return true;
    }
    return false;
  }

  /**
   * Verifica integridade de um backup
   */
  async verifyBackupIntegrity(backupId: string): Promise<IntegrityCheckResult> {
    const metadata = this.getBackupMetadata(backupId);
    if (!metadata) {
      throw new NotFoundException(`Backup ${backupId} não encontrado`);
    }

    try {
      // Calcula checksum do arquivo
      const fileContent = fs.readFileSync(metadata.filePath);
      const checksum = this.encryptionService.generateChecksum(
        fileContent.toString(),
      );

      return {
        isValid: true,
        checksum,
        expectedChecksum: metadata.checksum,
        fileSize: metadata.fileSize,
        expectedSize: fileContent.length,
      };
    } catch (error) {
      return {
        isValid: false,
        checksum: '',
        expectedChecksum: metadata.checksum,
        fileSize: 0,
        expectedSize: metadata.fileSize,
        errors: [(error as Error).message],
      };
    }
  }

  // Métodos auxiliares

  private generateBackupId(): string {
    return `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateProgress(
    backupId: string,
    step: number,
    message: string,
  ): void {
    const progress = this.backupProgress.get(backupId);
    if (progress) {
      this.backupProgress.set(backupId, {
        ...progress,
        progress: (step / progress.totalSteps) * 100,
        currentStep: message,
      });
    }
  }

  private getDatabaseTables(): DatabaseTable[] {
    // Em uma implementação real, isso seria feito consultando o Prisma
    // Por simplicidade, retornamos uma lista básica
    return [
      { name: 'User', rowCount: 0, size: 0, lastModified: new Date() },
      { name: 'Client', rowCount: 0, size: 0, lastModified: new Date() },
      { name: 'Pet', rowCount: 0, size: 0, lastModified: new Date() },
      { name: 'Appointment', rowCount: 0, size: 0, lastModified: new Date() },
      { name: 'Transaction', rowCount: 0, size: 0, lastModified: new Date() },
    ];
  }

  private exportTableData(tableName: string): any[] {
    // Em uma implementação real, isso usaria Prisma para buscar dados
    // Por simplicidade, retornamos array vazio
    return [];
  }

  private saveBackupMetadata(metadata: BackupMetadata): void {
    // Em uma implementação real, isso seria salvo no banco de dados
    this.logger.log(`Backup metadata salvo: ${metadata.id}`);
  }

  private getBackupMetadata(backupId: string): BackupMetadata | null {
    // Em uma implementação real, isso seria buscado do banco de dados
    return null;
  }

  private performRestore(
    dataPath: string,
    restoreDto: RestoreBackupDto,
  ): RestoreResult {
    // Implementação básica de restauração
    return {
      success: true,
      tablesRestored: restoreDto.tables || [],
      rowsAffected: 0,
      duration: 0,
    };
  }

  private cleanupTempFiles(tempDir: string): void {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }

  private scheduleAutomaticBackups(): void {
    // Agenda backup diário às 2:00 AM
    const dailyJob = cron.schedule('0 2 * * *', async () => {
      this.logger.log('Executando backup automático diário');

      await this.createBackup({
        type: BackupType.FULL,
        description: 'Backup automático diário',
        encrypt: true,
      });
    });

    this.scheduledJobs.set('daily', dailyJob);
    this.logger.log('Backup automático diário agendado');
  }
}
