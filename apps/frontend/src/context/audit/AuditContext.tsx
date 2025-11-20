import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { auditService } from '../../services/auditService';
import {
  AuditContextType,
  AuditLog,
  AuditLogFilters,
  AuditLogQuery,
  AuditStatistics,
  AuditConfig,
  AuditFilter,
  AuditAlert,
} from '../../types/audit';

// Estado inicial
interface AuditState {
  logs: AuditLog[];
  loading: boolean;
  error: string | null;
  filters: AuditLogFilters;
  query: AuditLogQuery;
  totalLogs: number;
  currentPage: number;
  totalPages: number;
  statistics: AuditStatistics | null;
  config: AuditConfig | null;
  savedFilters: AuditFilter[];
  alerts: AuditAlert[];
}

// Ações do reducer
type AuditAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LOGS'; payload: { logs: AuditLog[]; total: number; page: number; limit: number; totalPages: number } }
  | { type: 'SET_FILTERS'; payload: AuditLogFilters }
  | { type: 'SET_QUERY'; payload: AuditLogQuery }
  | { type: 'SET_STATISTICS'; payload: AuditStatistics }
  | { type: 'SET_CONFIG'; payload: AuditConfig }
  | { type: 'SET_SAVED_FILTERS'; payload: AuditFilter[] }
  | { type: 'SET_ALERTS'; payload: AuditAlert[] }
  | { type: 'ADD_LOG'; payload: AuditLog }
  | { type: 'UPDATE_LOG'; payload: AuditLog }
  | { type: 'DELETE_LOG'; payload: string }
  | { type: 'CLEAR_FILTERS' };

// Estado inicial
const initialState: AuditState = {
  logs: [],
  loading: false,
  error: null,
  filters: {},
  query: {
    page: 1,
    limit: 50,
    sortBy: 'timestamp',
    sortOrder: 'desc',
  },
  totalLogs: 0,
  currentPage: 1,
  totalPages: 0,
  statistics: null,
  config: null,
  savedFilters: [],
  alerts: [],
};

// Reducer
function auditReducer(state: AuditState, action: AuditAction): AuditState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'SET_LOGS':
      return {
        ...state,
        logs: action.payload.logs,
        totalLogs: action.payload.total,
        currentPage: action.payload.page,
        totalPages: action.payload.totalPages,
        loading: false,
        error: null,
      };

    case 'SET_FILTERS':
      return { ...state, filters: action.payload };

    case 'SET_QUERY':
      return { ...state, query: action.payload };

    case 'SET_STATISTICS':
      return { ...state, statistics: action.payload };

    case 'SET_CONFIG':
      return { ...state, config: action.payload };

    case 'SET_SAVED_FILTERS':
      return { ...state, savedFilters: action.payload };

    case 'SET_ALERTS':
      return { ...state, alerts: action.payload };

    case 'ADD_LOG':
      return { ...state, logs: [action.payload, ...state.logs] };

    case 'UPDATE_LOG':
      return {
        ...state,
        logs: state.logs.map(log =>
          log.id === action.payload.id ? action.payload : log
        ),
      };

    case 'DELETE_LOG':
      return {
        ...state,
        logs: state.logs.filter(log => log.id !== action.payload),
      };

    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: {},
        query: {
          page: 1,
          limit: 50,
          sortBy: 'timestamp',
          sortOrder: 'desc',
        },
      };

    default:
      return state;
  }
}

// Contexto
const AuditContext = createContext<AuditContextType | undefined>(undefined);

// Provider
export function AuditProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(auditReducer, initialState);

  // Buscar logs
  const fetchLogs = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await auditService.getLogs(state.query);
      dispatch({ type: 'SET_LOGS', payload: response });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Erro desconhecido' });
    }
  }, [state.query]);

  // Buscar estatísticas
  const fetchStatistics = useCallback(async () => {
    try {
      const statistics = await auditService.getStatistics(state.filters);
      dispatch({ type: 'SET_STATISTICS', payload: statistics });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  }, [state.filters]);

  // Buscar configurações
  const fetchConfig = useCallback(async () => {
    try {
      const config = await auditService.getConfig();
      dispatch({ type: 'SET_CONFIG', payload: config });
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
    }
  }, []);

  // Buscar filtros salvos
  const fetchSavedFilters = useCallback(async () => {
    try {
      const filters = await auditService.getSavedFilters();
      dispatch({ type: 'SET_SAVED_FILTERS', payload: filters });
    } catch (error) {
      console.error('Erro ao buscar filtros salvos:', error);
    }
  }, []);

  // Buscar alertas
  const fetchAlerts = useCallback(async () => {
    try {
      const alerts = await auditService.getAlerts();
      dispatch({ type: 'SET_ALERTS', payload: alerts });
    } catch (error) {
      console.error('Erro ao buscar alertas:', error);
    }
  }, []);

  // Definir filtros
  const setFilters = useCallback((filters: AuditLogFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
    dispatch({ type: 'SET_QUERY', payload: { ...state.query, ...filters, page: 1 } });
  }, [state.query]);

  // Definir query
  const setQuery = useCallback((query: AuditLogQuery) => {
    dispatch({ type: 'SET_QUERY', payload: query });
  }, []);

  // Salvar filtro
  const saveFilter = useCallback(async (name: string, description?: string) => {
    try {
      await auditService.saveFilter(name, description, state.filters);
      await fetchSavedFilters();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Erro ao salvar filtro' });
    }
  }, [state.filters, fetchSavedFilters]);

  // Excluir filtro salvo
  const deleteSavedFilter = useCallback(async (id: string) => {
    try {
      await auditService.deleteSavedFilter(id);
      await fetchSavedFilters();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Erro ao excluir filtro' });
    }
  }, [fetchSavedFilters]);

  // Criar alerta
  const createAlert = useCallback(async (alertData: Omit<AuditAlert, 'id' | 'createdAt' | 'updatedAt' | '_count'>) => {
    try {
      await auditService.createAlert(alertData);
      await fetchAlerts();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Erro ao criar alerta' });
    }
  }, [fetchAlerts]);

  // Atualizar alerta
  const updateAlert = useCallback(async (id: string, alertData: Partial<AuditAlert>) => {
    try {
      await auditService.updateAlert(id, alertData);
      await fetchAlerts();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Erro ao atualizar alerta' });
    }
  }, [fetchAlerts]);

  // Excluir alerta
  const deleteAlert = useCallback(async (id: string) => {
    try {
      await auditService.deleteAlert(id);
      await fetchAlerts();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Erro ao excluir alerta' });
    }
  }, [fetchAlerts]);

  // Exportar logs
  const exportLogs = useCallback(async (format: 'csv' | 'excel' | 'pdf') => {
    try {
      const blob = await auditService.exportLogs(format, state.filters);

      // Criar link para download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Erro ao exportar logs' });
    }
  }, [state.filters]);

  // Limpar filtros
  const clearFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTERS' });
  }, []);

  // Carregar dados iniciais
  useEffect(() => {
    fetchConfig();
    fetchSavedFilters();
    fetchAlerts();
  }, [fetchConfig, fetchSavedFilters, fetchAlerts]);

  // Recarregar logs quando query mudar
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Recarregar estatísticas quando filtros mudarem
  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  const contextValue: AuditContextType = {
    // Estado
    logs: state.logs,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    query: state.query,
    totalLogs: state.totalLogs,
    currentPage: state.currentPage,
    totalPages: state.totalPages,
    statistics: state.statistics,
    config: state.config,
    savedFilters: state.savedFilters,
    alerts: state.alerts,

    // Ações
    setFilters,
    setQuery,
    fetchLogs,
    fetchStatistics,
    fetchConfig,
    fetchSavedFilters,
    fetchAlerts,
    saveFilter,
    deleteSavedFilter,
    createAlert,
    updateAlert,
    deleteAlert,
    exportLogs,
    clearFilters,
  };

  return (
    <AuditContext.Provider value={contextValue}>
      {children}
    </AuditContext.Provider>
  );
}

// Hook personalizado
export function useAudit(): AuditContextType {
  const context = useContext(AuditContext);
  if (context === undefined) {
    throw new Error('useAudit deve ser usado dentro de um AuditProvider');
  }
  return context;
}