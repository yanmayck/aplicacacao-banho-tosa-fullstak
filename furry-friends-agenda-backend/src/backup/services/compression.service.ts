import { Injectable, Logger } from '@nestjs/common';
import * as archiver from 'archiver';
import * as fs from 'fs';
import * as path from 'path';

export enum CompressionLevel {
  LOW = 1,
  MEDIUM = 5,
  HIGH = 9,
}

@Injectable()
export class CompressionService {
  private readonly logger = new Logger(CompressionService.name);

  /**
   * Comprime um arquivo ou diretório
   */
  async compressFile(
    inputPath: string,
    outputPath: string,
    level: CompressionLevel = CompressionLevel.MEDIUM,
  ): Promise<{ size: number; compressedSize: number; ratio: number }> {
    return new Promise((resolve, reject) => {
      try {
        // Verifica se o arquivo de entrada existe
        if (!fs.existsSync(inputPath)) {
          throw new Error(`Arquivo de entrada não encontrado: ${inputPath}`);
        }

        // Cria diretório de saída se não existir
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        const output = fs.createWriteStream(outputPath);
        const archive = archiver('zip', {
          zlib: { level },
        });

        let originalSize = 0;
        let compressedSize = 0;

        // Calcula tamanho original
        originalSize = this.getDirectorySize(inputPath);

        output.on('close', () => {
          compressedSize = archive.pointer();
          const ratio =
            originalSize > 0 ? (1 - compressedSize / originalSize) * 100 : 0;

          this.logger.log(
            `Arquivo comprimido: ${outputPath} (${Math.round(ratio)}% de compressão)`,
          );
          resolve({
            size: originalSize,
            compressedSize,
            ratio: Math.round(ratio * 100) / 100,
          });
        });

        output.on('error', (error) => {
          this.logger.error('Erro durante compressão', error);
          reject(error);
        });

        archive.on('error', (error) => {
          this.logger.error('Erro no archiver', error);
          reject(error);
        });

        archive.on('warning', (error) => {
          if (error.code === 'ENOENT') {
            this.logger.warn(
              'Arquivo não encontrado durante compressão',
              error,
            );
          } else {
            this.logger.warn('Aviso durante compressão', error);
          }
        });

        // Verifica se é um arquivo ou diretório
        const stats = fs.statSync(inputPath);
        if (stats.isDirectory()) {
          archive.directory(inputPath, path.basename(inputPath));
        } else {
          archive.file(inputPath, { name: path.basename(inputPath) });
        }

        archive.pipe(output);
        archive.finalize();
      } catch (error) {
        this.logger.error(`Erro ao comprimir ${inputPath}`, error);
        reject(error);
      }
    });
  }

  /**
   * Descomprime um arquivo zip
   */
  async decompressFile(
    inputPath: string,
    outputPath: string,
  ): Promise<{ files: string[]; totalSize: number }> {
    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(inputPath)) {
          throw new Error(`Arquivo de entrada não encontrado: ${inputPath}`);
        }

        // Cria diretório de saída se não existir
        if (!fs.existsSync(outputPath)) {
          fs.mkdirSync(outputPath, { recursive: true });
        }

        const unzipper = require('unzipper');
        const files: string[] = [];
        let totalSize = 0;

        fs.createReadStream(inputPath)
          .pipe(unzipper.Parse())
          .on('entry', (entry: any) => {
            const fileName = entry.path;
            const type = entry.type; // 'Directory' or 'File'

            if (type === 'File') {
              files.push(fileName);
              const fullPath = path.join(outputPath, fileName);

              // Cria diretórios necessários
              const dir = path.dirname(fullPath);
              if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
              }

              entry.pipe(fs.createWriteStream(fullPath)).on('finish', () => {
                const stats = fs.statSync(fullPath);
                totalSize += stats.size;
              });
            } else {
              // É um diretório
              const dir = path.join(outputPath, fileName);
              if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
              }
              entry.autodrain();
            }
          })
          .on('close', () => {
            this.logger.log(
              `Arquivo descomprimido: ${inputPath} -> ${outputPath}`,
            );
            resolve({ files, totalSize });
          })
          .on('error', (error: any) => {
            this.logger.error('Erro durante descompressão', error);
            reject(error);
          });
      } catch (error) {
        this.logger.error(`Erro ao descomprimir ${inputPath}`, error);
        reject(error);
      }
    });
  }

  /**
   * Calcula o tamanho de um arquivo ou diretório
   */
  private getDirectorySize(dirPath: string): number {
    let totalSize = 0;

    try {
      const stats = fs.statSync(dirPath);

      if (stats.isDirectory()) {
        const files = fs.readdirSync(dirPath);

        for (const file of files) {
          const filePath = path.join(dirPath, file);
          const fileStats = fs.statSync(filePath);

          if (fileStats.isDirectory()) {
            totalSize += this.getDirectorySize(filePath);
          } else {
            totalSize += fileStats.size;
          }
        }
      } else {
        totalSize = stats.size;
      }
    } catch (error) {
      this.logger.error(`Erro ao calcular tamanho de ${dirPath}`, error);
    }

    return totalSize;
  }

  /**
   * Comprime múltiplos arquivos em um único arquivo
   */
  async compressMultipleFiles(
    files: Array<{ path: string; name?: string }>,
    outputPath: string,
    level: CompressionLevel = CompressionLevel.MEDIUM,
  ): Promise<{ size: number; compressedSize: number; ratio: number }> {
    return new Promise((resolve, reject) => {
      try {
        const output = fs.createWriteStream(outputPath);
        const archive = archiver('zip', {
          zlib: { level },
        });

        let totalSize = 0;

        output.on('close', () => {
          const compressedSize = archive.pointer();
          const ratio =
            totalSize > 0 ? (1 - compressedSize / totalSize) * 100 : 0;

          this.logger.log(
            `Arquivos comprimidos: ${outputPath} (${Math.round(ratio)}% de compressão)`,
          );
          resolve({
            size: totalSize,
            compressedSize,
            ratio: Math.round(ratio * 100) / 100,
          });
        });

        output.on('error', (error) => {
          this.logger.error('Erro durante compressão múltipla', error);
          reject(error);
        });

        archive.on('error', (error) => {
          this.logger.error('Erro no archiver múltiplo', error);
          reject(error);
        });

        // Adiciona cada arquivo ao archive
        for (const file of files) {
          if (fs.existsSync(file.path)) {
            const fileStats = fs.statSync(file.path);
            totalSize += fileStats.size;

            if (fileStats.isDirectory()) {
              archive.directory(
                file.path,
                file.name || path.basename(file.path),
              );
            } else {
              archive.file(file.path, {
                name: file.name || path.basename(file.path),
              });
            }
          }
        }

        archive.pipe(output);
        archive.finalize();
      } catch (error) {
        this.logger.error('Erro ao comprimir múltiplos arquivos', error);
        reject(error);
      }
    });
  }

  /**
   * Verifica se um arquivo é um arquivo comprimido válido
   */
  isCompressedFile(filePath: string): boolean {
    const ext = path.extname(filePath).toLowerCase();
    return ext === '.zip' || ext === '.tar' || ext === '.gz' || ext === '.rar';
  }

  /**
   * Obtém informações sobre um arquivo comprimido
   */
  async getCompressedFileInfo(
    filePath: string,
  ): Promise<{ format: string; size: number; isValid: boolean }> {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error('Arquivo não encontrado');
      }

      const stats = fs.statSync(filePath);
      const ext = path.extname(filePath).toLowerCase();

      let format = 'unknown';
      switch (ext) {
        case '.zip':
          format = 'ZIP';
          break;
        case '.tar':
          format = 'TAR';
          break;
        case '.gz':
          format = 'GZIP';
          break;
        case '.rar':
          format = 'RAR';
          break;
      }

      return {
        format,
        size: stats.size,
        isValid: true,
      };
    } catch (error) {
      this.logger.error(
        `Erro ao obter informações do arquivo ${filePath}`,
        error,
      );
      return {
        format: 'unknown',
        size: 0,
        isValid: false,
      };
    }
  }
}
