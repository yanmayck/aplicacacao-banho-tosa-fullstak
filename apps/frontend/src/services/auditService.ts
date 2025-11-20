import { api } from './api';
import {
  AuditLog,
  AuditLogFilters,
  AuditLogQuery,
  AuditLogResponse,
  AuditStatistics,
  AuditReport,
  AuditConfig,
  AuditFilter,
  AuditAlert,
  AuditActionType,
  AuditSeverity,
} from '../types/audit';

class AuditService {
  private readonly baseUrl = '/audit';

  // ========== LOGS DE AUDITORIA ==========

  async getLogs(query: AuditLogQuery = {}): Promise<AuditLogResponse> {
    try {
      const response = await api.get(`${this.baseUrl}/logs`, { params: query });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar logs de auditoria:', error);
      throw new Error('Não foi possível carregar os logs de auditoria');
    }
  }

  async getLogById(id: string): Promise<AuditLog> {
    try {
      const response = await api.get(`${this.baseUrl}/logs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar log de auditoria:', error);
      throw new Error('Não foi possível carregar o log de auditoria');
    }
  }

  async getLogsByEntity(entityType: string, entityId: string): Promise<AuditLog[]> {
    try {
      const response = await api.get(`${this.baseUrl}/logs/entity/${entityType}/${entityId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar logs por entidade:', error);
      throw new Error('Não foi possível carregar os logs da entidade');
    }
  }

  async getLogsByUser(userId: string): Promise<AuditLog[]> {
    try {
      const response = await api.get(`${this.baseUrl}/logs/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar logs por usuário:', error);
      throw new Error('Não foi possível carregar os logs do usuário');
    }
  }

  async getLogsByModule(module: string, filters?: AuditLogFilters): Promise<AuditLog[]> {
    try {
      const response = await api.get(`${this.baseUrl}/logs/module/${module}`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar logs por módulo:', error);
      throw new Error('Não foi possível carregar os logs do módulo');
    }
  }

  // ========== ESTATÍSTICAS E RELATÓRIOS ==========

  async getStatistics(filters?: AuditLogFilters): Promise<AuditStatistics> {
    try {
      const response = await api.get(`${this.baseUrl}/statistics`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas de auditoria:', error);
      throw new Error('Não foi possível carregar as estatísticas');
    }
  }

  async generateReport(filters?: AuditLogFilters): Promise<AuditReport> {
    try {
      const response = await api.get(`${this.baseUrl}/reports`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar relatório de auditoria:', error);
      throw new Error('Não foi possível gerar o relatório');
    }
  }

  // ========== CONFIGURAÇÕES ==========

  async getConfig(): Promise<AuditConfig> {
    try {
      const response = await api.get(`${this.baseUrl}/config`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar configurações de auditoria:', error);
      throw new Error('Não foi possível carregar as configurações');
    }
  }

  async updateConfig(configData: Partial<AuditConfig>): Promise<AuditConfig> {
    try {
      const response = await api.patch(`${this.baseUrl}/config`, configData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar configurações de auditoria:', error);
      throw new Error('Não foi possível atualizar as configurações');
    }
  }

  // ========== FILTROS SALVOS ==========

  async saveFilter(name: string, description: string | undefined, filters: AuditLogFilters): Promise<AuditFilter> {
    try {
      const response = await api.post(`${this.baseUrl}/filters`, {
        name,
        description,
        filters,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao salvar filtro:', error);
      throw new Error('Não foi possível salvar o filtro');
    }
  }

  async getSavedFilters(): Promise<AuditFilter[]> {
    try {
      const response = await api.get(`${this.baseUrl}/filters`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar filtros salvos:', error);
      throw new Error('Não foi possível carregar os filtros salvos');
    }
  }

  async getPublicFilters(): Promise<AuditFilter[]> {
    try {
      const response = await api.get(`${this.baseUrl}/filters/public`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar filtros públicos:', error);
      throw new Error('Não foi possível carregar os filtros públicos');
    }
  }

  async deleteSavedFilter(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/filters/${id}`);
    } catch (error) {
      console.error('Erro ao excluir filtro salvo:', error);
      throw new Error('Não foi possível excluir o filtro');
    }
  }

  // ========== ALERTAS ==========

  async createAlert(alertData: Omit<AuditAlert, 'id' | 'createdAt' | 'updatedAt' | '_count'>): Promise<AuditAlert> {
    try {
      const response = await api.post(`${this.baseUrl}/alerts`, alertData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar alerta:', error);
      throw new Error('Não foi possível criar o alerta');
    }
  }

  async getAlerts(): Promise<AuditAlert[]> {
    try {
      const response = await api.get(`${this.baseUrl}/alerts`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar alertas:', error);
      throw new Error('Não foi possível carregar os alertas');
    }
  }

  async updateAlert(id: string, alertData: Partial<AuditAlert>): Promise<AuditAlert> {
    try {
      const response = await api.patch(`${this.baseUrl}/alerts/${id}`, alertData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar alerta:', error);
      throw new Error('Não foi possível atualizar o alerta');
    }
  }

  async deleteAlert(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/alerts/${id}`);
    } catch (error) {
      console.error('Erro ao excluir alerta:', error);
      throw new Error('Não foi possível excluir o alerta');
    }
  }

  // ========== MANUTENÇÃO ==========

  async archiveOldLogs(): Promise<{ archivedCount: number }> {
    try {
      const response = await api.post(`${this.baseUrl}/maintenance/archive`);
      return response.data;
    } catch (error) {
      console.error('Erro ao arquivar logs antigos:', error);
      throw new Error('Não foi possível arquivar os logs antigos');
    }
  }

  async cleanupOldLogs(): Promise<{ deletedCount: number }> {
    try {
      const response = await api.post(`${this.baseUrl}/maintenance/cleanup`);
      return response.data;
    } catch (error) {
      console.error('Erro ao limpar logs antigos:', error);
      throw new Error('Não foi possível limpar os logs antigos');
    }
  }

  // ========== EXPORTAÇÃO ==========

  async exportLogs(format: 'csv' | 'excel' | 'pdf', filters?: AuditLogFilters): Promise<Blob> {
    try {
      const response = await api.get(`${this.baseUrl}/export`, {
        params: { format, ...filters },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao exportar logs:', error);
      throw new Error('Não foi possível exportar os logs');
    }
  }

  // ========== UTILITÁRIOS ==========

  /**
   * Formatar timestamp para exibição
   */
  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  /**
   * Obter cor baseada na severidade
   */
  getSeverityColor(severity: AuditSeverity): string {
    switch (severity) {
      case AuditSeverity.LOW:
        return 'text-green-600 bg-green-100';
      case AuditSeverity.MEDIUM:
        return 'text-yellow-600 bg-yellow-100';
      case AuditSeverity.HIGH:
        return 'text-orange-600 bg-orange-100';
      case AuditSeverity.CRITICAL:
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  /**
   * Obter ícone baseado na ação
   */
  getActionIcon(action: AuditActionType): string {
    switch (action) {
      case AuditActionType.CREATE:
        return 'plus-circle';
      case AuditActionType.UPDATE:
        return 'pencil-square';
      case AuditActionType.DELETE:
        return 'trash';
      case AuditActionType.LOGIN:
        return 'arrow-right-on-rectangle';
      case AuditActionType.LOGOUT:
        return 'arrow-left-on-rectangle';
      case AuditActionType.VIEW:
        return 'eye';
      case AuditActionType.EXPORT:
        return 'arrow-down-tray';
      case AuditActionType.IMPORT:
        return 'arrow-up-tray';
      case AuditActionType.BACKUP:
        return 'server-stack';
      case AuditActionType.RESTORE:
        return 'arrow-path';
      case AuditActionType.FAILED_LOGIN:
        return 'x-circle';
      case AuditActionType.SUSPICIOUS_ACTIVITY:
        return 'exclamation-triangle';
      default:
        return 'question-mark-circle';
    }
  }

  /**
   * Obter descrição amigável da ação
   */
  getActionDescription(action: AuditActionType): string {
    switch (action) {
      case AuditActionType.CREATE:
        return 'Criação';
      case AuditActionType.UPDATE:
        return 'Atualização';
      case AuditActionType.DELETE:
        return 'Exclusão';
      case AuditActionType.LOGIN:
        return 'Login';
      case AuditActionType.LOGOUT:
        return 'Logout';
      case AuditActionType.VIEW:
        return 'Visualização';
      case AuditActionType.EXPORT:
        return 'Exportação';
      case AuditActionType.IMPORT:
        return 'Importação';
      case AuditActionType.BACKUP:
        return 'Backup';
      case AuditActionType.RESTORE:
        return 'Restauração';
      case AuditActionType.SYSTEM_CONFIG:
        return 'Configuração do Sistema';
      case AuditActionType.USER_MANAGEMENT:
        return 'Gerenciamento de Usuários';
      case AuditActionType.PERMISSION_CHANGE:
        return 'Alteração de Permissões';
      case AuditActionType.DATA_ACCESS:
        return 'Acesso a Dados';
      case AuditActionType.FAILED_LOGIN:
        return 'Tentativa de Login Falhada';
      case AuditActionType.SUSPICIOUS_ACTIVITY:
        return 'Atividade Suspeita';
      default:
        return 'Outra';
    }
  }

  /**
   * Obter descrição amigável da severidade
   */
  getSeverityDescription(severity: AuditSeverity): string {
    switch (severity) {
      case AuditSeverity.LOW:
        return 'Baixa';
      case AuditSeverity.MEDIUM:
        return 'Média';
      case AuditSeverity.HIGH:
        return 'Alta';
      case AuditSeverity.CRITICAL:
        return 'Crítica';
      default:
        return 'Desconhecida';
    }
  }
}

// Exportar instância singleton
export const auditService = new AuditService();