import { api } from '../lib/api';
import {
  CreateBackupRequest,
  RestoreBackupRequest,
  BackupMetadata,
  BackupProgress,
  BackupStats,
  BackupListResponse,
  BackupResponse,
  BackupProgressResponse,
  BackupStatsResponse,
  BackupFilters,
} from '../types/backup';
import { ApiErrorType, getErrorMessage } from '../types/api';

export class BackupService {
  private static readonly BASE_URL = '/backup';

  /**
   * Cria um novo backup
   */
  static async createBackup(request: CreateBackupRequest): Promise<BackupResponse> {
    try {
      const response = await api.post<BackupResponse>(`${this.BASE_URL}`, request);
      return response.data;
    } catch (error: unknown) {
      console.error('Erro ao criar backup:', error);
      throw new Error(getErrorMessage(error as ApiErrorType) || 'Erro ao criar backup');
    }
  }

  /**
   * Lista todos os backups com filtros opcionais
   */
  static async getBackups(
    limit: number = 50,
    offset: number = 0,
    filters?: BackupFilters
  ): Promise<BackupListResponse> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });

      if (filters) {
        if (filters.type) params.append('type', filters.type);
        if (filters.status) params.append('status', filters.status);
        if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
        if (filters.dateTo) params.append('dateTo', filters.dateTo);
        if (filters.search) params.append('search', filters.search);
      }

      const response = await api.get<BackupListResponse>(`${this.BASE_URL}?${params}`);
      return response.data;
    } catch (error: unknown) {
      console.error('Erro ao buscar backups:', error);
      throw new Error(getErrorMessage(error as ApiErrorType) || 'Erro ao buscar backups');
    }
  }

  /**
   * Obtém o progresso de um backup específico
   */
  static async getBackupProgress(backupId: string): Promise<BackupProgressResponse> {
    try {
      const response = await api.get<BackupProgressResponse>(`${this.BASE_URL}/${backupId}/progress`);
      return response.data;
    } catch (error: unknown) {
      console.error('Erro ao buscar progresso do backup:', error);
      throw new Error(getErrorMessage(error as ApiErrorType) || 'Erro ao buscar progresso do backup');
    }
  }

  /**
   * Restaura dados de um backup
   */
  static async restoreBackup(request: RestoreBackupRequest): Promise<BackupResponse> {
    try {
      const response = await api.post<BackupResponse>(`${this.BASE_URL}/restore`, request);
      return response.data;
    } catch (error: unknown) {
      console.error('Erro ao restaurar backup:', error);
      throw new Error(getErrorMessage(error as ApiErrorType) || 'Erro ao restaurar backup');
    }
  }

  /**
   * Verifica a integridade de um backup
   */
  static async verifyBackupIntegrity(backupId: string): Promise<BackupResponse> {
    try {
      const response = await api.get<BackupResponse>(`${this.BASE_URL}/${backupId}/verify`);
      return response.data;
    } catch (error: unknown) {
      console.error('Erro ao verificar integridade do backup:', error);
      throw new Error(getErrorMessage(error as ApiErrorType) || 'Erro ao verificar integridade do backup');
    }
  }

  /**
   * Cancela um backup em andamento
   */
  static async cancelBackup(backupId: string): Promise<BackupResponse> {
    try {
      const response = await api.delete<BackupResponse>(`${this.BASE_URL}/${backupId}`);
      return response.data;
    } catch (error: unknown) {
      console.error('Erro ao cancelar backup:', error);
      throw new Error(getErrorMessage(error as ApiErrorType) || 'Erro ao cancelar backup');
    }
  }

  /**
   * Faz download de um arquivo de backup
   */
  static async downloadBackup(backupId: string): Promise<Blob> {
    try {
      const response = await api.get(`${this.BASE_URL}/${backupId}/download`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error: unknown) {
      console.error('Erro ao fazer download do backup:', error);
      throw new Error(getErrorMessage(error as ApiErrorType) || 'Erro ao fazer download do backup');
    }
  }

  /**
   * Obtém estatísticas de backups
   */
  static async getBackupStats(): Promise<BackupStatsResponse> {
    try {
      const response = await api.get<BackupStatsResponse>(`${this.BASE_URL}/stats/summary`);
      return response.data;
    } catch (error: unknown) {
      console.error('Erro ao obter estatísticas de backup:', error);
      throw new Error(getErrorMessage(error as ApiErrorType) || 'Erro ao obter estatísticas de backup');
    }
  }

  /**
   * Polling para obter progresso de backup
   */
  static async pollBackupProgress(
    backupId: string,
    onProgress: (progress: BackupProgress) => void,
    onComplete: (finalProgress: BackupProgress) => void,
    onError: (error: string) => void,
    interval: number = 2000
  ): Promise<() => void> {
    const poll = async () => {
      try {
        const response = await this.getBackupProgress(backupId);

        if (response.success && response.data) {
          const progress = response.data;
          onProgress(progress);

          // Verifica se o backup foi concluído ou falhou
          if (progress.status === 'completed' || progress.status === 'failed' || progress.status === 'cancelled') {
            onComplete(progress);
            return;
          }
        }
      } catch (error: unknown) {
        onError(getErrorMessage(error as ApiErrorType) || 'Erro ao obter progresso do backup');
        return;
      }
    };

    // Executa imediatamente e depois em intervalos
    await poll();
    const intervalId = setInterval(poll, interval);

    // Retorna função para parar o polling
    return () => clearInterval(intervalId);
  }

  /**
   * Formatação de tamanho de arquivo
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Formatação de duração
   */
  static formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  /**
   * Formatação de data
   */
  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  /**
   * Obtém cor baseada no status do backup
   */
  static getStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  /**
   * Obtém texto do status em português
   */
  static getStatusText(status: string): string {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'failed':
        return 'Falhou';
      case 'in_progress':
        return 'Em Andamento';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  }

  /**
   * Obtém ícone baseado no tipo de backup
   */
  static getBackupTypeIcon(type: string): string {
    switch (type) {
      case 'full':
        return '🗄️';
      case 'database':
        return '💾';
      case 'config':
        return '⚙️';
      case 'uploads':
        return '📁';
      case 'incremental':
        return '🔄';
      default:
        return '📦';
    }
  }

  /**
   * Validação de dados de backup
   */
  static validateBackupRequest(request: CreateBackupRequest): string[] {
    const errors: string[] = [];

    if (!request.type) {
      errors.push('Tipo de backup é obrigatório');
    }

    if (request.description && request.description.length > 255) {
      errors.push('Descrição deve ter no máximo 255 caracteres');
    }

    if (request.tables && request.tables.length === 0) {
      errors.push('Selecione pelo menos uma tabela para backup seletivo');
    }

    return errors;
  }
}