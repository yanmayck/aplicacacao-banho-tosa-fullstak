import { Injectable, Logger } from '@nestjs/common';
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  createHash,
} from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly logger = new Logger(EncryptionService.name);
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32; // 256 bits
  private readonly ivLength = 16; // 128 bits
  private readonly tagLength = 16; // 128 bits

  /**
   * Gera uma chave de criptografia AES-256
   */
  generateKey(): string {
    return randomBytes(this.keyLength).toString('hex');
  }

  /**
   * Deriva uma chave a partir de uma senha usando PBKDF2
   */
  deriveKeyFromPassword(
    password: string,
    salt?: string,
  ): { key: string; salt: string } {
    const actualSalt = salt || randomBytes(16).toString('hex');

    const key = createHash('sha256')
      .update(password + actualSalt)
      .digest('hex')
      .substring(0, this.keyLength * 2);

    return { key, salt: actualSalt };
  }

  /**
   * Criptografa dados usando AES-256-GCM
   */
  encrypt(
    data: string,
    key: string,
  ): { encrypted: string; iv: string; tag: string } {
    try {
      // Normaliza a chave para 32 bytes
      const normalizedKey =
        key.length > this.keyLength * 2
          ? createHash('sha256').update(key).digest('hex')
          : key.padEnd(this.keyLength * 2, '0');

      const iv = randomBytes(this.ivLength);
      const cipher = createCipheriv(this.algorithm, normalizedKey, iv);

      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const tag = cipher.getAuthTag();

      return {
        encrypted,
        iv: iv.toString('hex'),
        tag: tag.toString('hex'),
      };
    } catch (error) {
      this.logger.error('Erro ao criptografar dados', error);
      throw new Error('Falha na criptografia dos dados');
    }
  }

  /**
   * Descriptografa dados usando AES-256-GCM
   */
  decrypt(encrypted: string, iv: string, tag: string, key: string): string {
    try {
      // Normaliza a chave para 32 bytes
      const normalizedKey =
        key.length > this.keyLength * 2
          ? createHash('sha256').update(key).digest('hex')
          : key.padEnd(this.keyLength * 2, '0');

      const decipher = createDecipheriv(
        this.algorithm,
        normalizedKey,
        Buffer.from(iv, 'hex'),
      );
      decipher.setAuthTag(Buffer.from(tag, 'hex'));

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      this.logger.error('Erro ao descriptografar dados', error);
      throw new Error(
        'Falha na descriptografia dos dados. Chave ou dados inválidos.',
      );
    }
  }

  /**
   * Criptografa um arquivo
   */
  async encryptFile(
    filePath: string,
    outputPath: string,
    key: string,
  ): Promise<void> {
    try {
      const fs = await import('fs/promises');
      const { createReadStream, createWriteStream } = await import('fs');

      const fileData = await fs.readFile(filePath, 'utf8');
      const { encrypted, iv, tag } = this.encrypt(fileData, key);

      // Adiciona metadados de criptografia ao arquivo
      const encryptedData = JSON.stringify({
        encrypted,
        iv,
        tag,
        algorithm: this.algorithm,
        version: '1.0',
      });

      await fs.writeFile(outputPath, encryptedData, 'utf8');
      this.logger.log(`Arquivo criptografado: ${outputPath}`);
    } catch (error) {
      this.logger.error(`Erro ao criptografar arquivo ${filePath}`, error);
      throw error;
    }
  }

  /**
   * Descriptografa um arquivo
   */
  async decryptFile(
    filePath: string,
    outputPath: string,
    key: string,
  ): Promise<void> {
    try {
      const fs = await import('fs/promises');

      const encryptedData = await fs.readFile(filePath, 'utf8');
      const { encrypted, iv, tag } = JSON.parse(encryptedData);

      const decrypted = this.decrypt(encrypted, iv, tag, key);
      await fs.writeFile(outputPath, decrypted, 'utf8');

      this.logger.log(`Arquivo descriptografado: ${outputPath}`);
    } catch (error) {
      this.logger.error(`Erro ao descriptografar arquivo ${filePath}`, error);
      throw error;
    }
  }

  /**
   * Gera hash SHA-256 para verificação de integridade
   */
  generateChecksum(data: string): string {
    return createHash('sha256').update(data).digest('hex');
  }

  /**
   * Verifica se uma chave é válida
   */
  isValidKey(key: string): boolean {
    return Boolean(key && key.length >= 16); // Mínimo 128 bits
  }

  /**
   * Gera uma chave segura aleatória
   */
  generateSecureKey(): string {
    return randomBytes(32).toString('hex');
  }
}
