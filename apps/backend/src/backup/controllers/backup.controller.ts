import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Query,
  HttpStatus,
  HttpException,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { BackupService } from '../services/backup.service';
import {
  CreateBackupDto,
  RestoreBackupDto,
  BackupStatus,
} from '../dto/create-backup.dto'; // Importar BackupStatus
import { BackupMetadata } from '../interfaces/backup.interface'; // Importar BackupMetadata
import { Response } from 'express';
import * as fs from 'fs';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  /**
   * Cria um novo backup
   */
  @Post()
  async createBackup(@Body() createBackupDto: CreateBackupDto) {
    try {
      const result = await this.backupService.createBackup(createBackupDto);

      if (!result.success) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Erro ao criar backup',
            details: result.error,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        success: true,
        message: 'Backup iniciado com sucesso',
        data: {
          backupId: result.backupId,
          filePath: result.filePath,
          fileSize: result.fileSize,
          duration: result.duration,
          tablesBackedUp: result.tablesBackedUp,
        },
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Erro interno do servidor',
          details: error instanceof Error ? error.message : 'Erro desconhecido',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Lista todos os backups
   */
  @Get()
  async getBackups(
    @Query('limit', ParseIntPipe) limit?: number,
    @Query('offset', ParseIntPipe) offset?: number,
  ) {
    try {
      const backups: BackupMetadata[] = this.backupService.getBackups(
        limit,
        offset,
      );

      return {
        success: true,
        data: backups,
        meta: {
          total: backups.length,
          limit: limit || 50,
          offset: offset || 0,
        },
      };
    } catch (error: unknown) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Erro ao buscar backups',
          details: error instanceof Error ? error.message : 'Erro desconhecido',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtém progresso de um backup específico
   */
  @Get(':backupId/progress')
  getBackupProgress(@Param('backupId') backupId: string) {
    try {
      const progress = this.backupService.getBackupProgress(backupId);

      if (!progress) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Backup não encontrado ou já concluído',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: progress,
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Erro ao buscar progresso do backup',
          details: error instanceof Error ? error.message : 'Erro desconhecido',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Restaura dados de um backup
   */
  @Post('restore')
  async restoreBackup(@Body() restoreDto: RestoreBackupDto) {
    try {
      const result = await this.backupService.restoreBackup(restoreDto);

      if (!result.success) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Erro ao restaurar backup',
            details: result.error,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        success: true,
        message: 'Restauração iniciada com sucesso',
        data: {
          tablesRestored: result.tablesRestored,
          rowsAffected: result.rowsAffected,
          duration: result.duration,
          warnings: result.warnings,
        },
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Erro interno durante restauração',
          details: error instanceof Error ? error.message : 'Erro desconhecido',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Verifica integridade de um backup
   */
  @Get(':backupId/verify')
  async verifyBackupIntegrity(@Param('backupId') backupId: string) {
    try {
      const result = await this.backupService.verifyBackupIntegrity(backupId);

      return {
        success: true,
        data: result,
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Erro ao verificar integridade do backup',
          details: error instanceof Error ? error.message : 'Erro desconhecido',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Cancela um backup em andamento
   */
  @Delete(':backupId')
  async cancelBackup(@Param('backupId') backupId: string) {
    try {
      const cancelled: boolean = this.backupService.cancelBackup(backupId);

      if (!cancelled) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Backup não pode ser cancelado (não está em andamento)',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        success: true,
        message: 'Backup cancelado com sucesso',
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Erro ao cancelar backup',
          details: error instanceof Error ? error.message : 'Erro desconhecido',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Download de arquivo de backup
   */
  @Get(':backupId/download')
  async downloadBackup(
    @Param('backupId') backupId: string,
    @Res() res: Response,
  ) {
    try {
      // Busca metadados do backup
      const backups: BackupMetadata[] = this.backupService.getBackups(1000, 0);
      const backup: BackupMetadata | undefined = backups.find(
        (b) => b.id === backupId,
      );

      if (!backup) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Backup não encontrado',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // Verifica se arquivo existe
      if (!fs.existsSync(backup.filePath)) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Arquivo de backup não encontrado',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // Configura headers para download
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${backup.fileName}"`,
      );
      res.setHeader('Content-Length', backup.fileSize);

      // Stream do arquivo
      const fileStream = fs.createReadStream(backup.filePath);
      fileStream.pipe(res);
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Erro ao fazer download do backup',
          details: error instanceof Error ? error.message : 'Erro desconhecido',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtém estatísticas de backups
   */
  @Get('stats/summary')
  async getBackupStats() {
    try {
      const backups: BackupMetadata[] = this.backupService.getBackups(1000, 0);

      const stats = {
        totalBackups: backups.length,
        totalSize: backups.reduce(
          (sum: number, b: BackupMetadata) => sum + b.fileSize,
          0,
        ),
        completedBackups: backups.filter(
          (b: BackupMetadata) => b.status === BackupStatus.COMPLETED,
        ).length,
        failedBackups: backups.filter(
          (b: BackupMetadata) => b.status === BackupStatus.FAILED,
        ).length,
        averageSize:
          backups.length > 0
            ? backups.reduce(
                (sum: number, b: BackupMetadata) => sum + b.fileSize,
                0,
              ) / backups.length
            : 0,
        oldestBackup:
          backups.length > 0 ? backups[backups.length - 1]?.createdAt : null,
        newestBackup: backups.length > 0 ? backups[0]?.createdAt : null,
        backupsByType: backups.reduce(
          (acc: Record<string, number>, b: BackupMetadata) => {
            acc[b.type] = (acc[b.type] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        ),
      };

      return {
        success: true,
        data: stats,
      };
    } catch (error: unknown) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Erro ao obter estatísticas de backup',
          details: error instanceof Error ? error.message : 'Erro desconhecido',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
