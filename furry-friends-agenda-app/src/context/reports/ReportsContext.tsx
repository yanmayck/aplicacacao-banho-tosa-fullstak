import React, { createContext, useContext, useReducer, useCallback } from 'react';
import axios from 'axios';

// Helper function to get API instance
const getApiInstance = () => {
  const getApiBaseUrl = () => {
    if (import.meta.env.VITE_API_BASE_URL) {
      return import.meta.env.VITE_API_BASE_URL;
    }
    return '/api';
  };

  const api = axios.create({
    baseURL: getApiBaseUrl(),
  });

  // Add auth interceptor
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('petshop-token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return api;
};

export interface ReportFilters {
  type?: 'financial' | 'groomer_performance' | 'client_analysis' | 'service_ranking' | 'occupancy_metrics' | 'appointment_analysis';
  period?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  startDate?: string;
  endDate?: string;
  groomerId?: string;
  clientId?: string;
  serviceId?: string;
  groomerIds?: string[];
  serviceIds?: string[];
  status?: string;
  category?: string;
  categories?: string[];
  groupBy?: 'day' | 'week' | 'month' | 'groomer' | 'service' | 'client';
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
  transactionType?: 'income' | 'expense' | 'both';
  paymentMethod?: string;
  paymentMethods?: string[];
  minAmount?: string;
  maxAmount?: string;
  metric?: 'appointments' | 'revenue' | 'commissions' | 'rating' | 'efficiency';
  aggregation?: 'count' | 'sum' | 'average' | 'percentage';
  analysisType?: 'new' | 'recurring' | 'churn' | 'loyalty' | 'segmentation';
  minVisits?: string;
  maxVisits?: string;
  minSpent?: string;
  maxSpent?: string;
  rankingCriteria?: 'popularity' | 'revenue' | 'frequency' | 'profitability';
  minBookings?: string;
  minRevenue?: string;
  timeGranularity?: 'daily' | 'weekly' | 'monthly';
  operatingHours?: string;
  workingDays?: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  metadata?: Record<string, any>;
}

export interface ReportMetadata {
  generatedAt: string;
  generatedBy?: string;
  totalRecords: number;
  filters: ReportFilters;
  executionTime: number;
}

export interface FinancialReport {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  transactionCount: number;
  averageTicket: number;
  topIncomeCategory: string;
  topExpenseCategory: string;
  incomeByCategory: ChartDataPoint[];
  expensesByCategory: ChartDataPoint[];
  dailyRevenue: ChartDataPoint[];
  monthlyTrends: ChartDataPoint[];
}

export interface GroomerPerformance {
  groomerId: string;
  groomerName: string;
  totalAppointments: number;
  completedAppointments: number;
  totalRevenue: number;
  totalCommissions: number;
  averageRating: number;
  efficiency: number;
  topServices: ChartDataPoint[];
  monthlyPerformance: ChartDataPoint[];
  clientRetention: number;
}

export interface ClientAnalysis {
  totalClients: number;
  newClients: number;
  recurringClients: number;
  churnedClients: number;
  averageVisitsPerClient: number;
  averageSpentPerClient: number;
  retentionRate: number;
  churnRate: number;
  clientSegmentation: ChartDataPoint[];
  acquisitionTrends: ChartDataPoint[];
  loyaltyDistribution: ChartDataPoint[];
}

export interface ServiceRanking {
  serviceId: string;
  serviceName: string;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  popularityScore: number;
  profitabilityIndex: number;
  trend: 'up' | 'down' | 'stable';
  growthRate: number;
}

export interface OccupancyMetrics {
  totalCapacity: number;
  averageOccupancy: number;
  peakHours: ChartDataPoint[];
  dailyOccupancy: ChartDataPoint[];
  weeklyTrends: ChartDataPoint[];
  utilizationRate: number;
  idleTime: number;
  busiestDay: string;
  slowestDay: string;
}

export interface AppointmentAnalysis {
  totalAppointments: number;
  scheduledAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;
  completionRate: number;
  cancellationRate: number;
  noShowRate: number;
  statusDistribution: ChartDataPoint[];
  timeDistribution: ChartDataPoint[];
  groomerWorkload: ChartDataPoint[];
}

export interface ReportResponse {
  success: boolean;
  message: string;
  metadata: ReportMetadata;
  data: FinancialReport | GroomerPerformance[] | ClientAnalysis | ServiceRanking[] | OccupancyMetrics | AppointmentAnalysis;
  exportUrl?: string;
  scheduledFor?: string;
}

interface ReportsState {
  currentReport: ReportResponse | null;
  loading: boolean;
  error: string | null;
  filters: ReportFilters;
  reportHistory: ReportResponse[];
}

type ReportsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_REPORT'; payload: ReportResponse | null }
  | { type: 'SET_FILTERS'; payload: ReportFilters }
  | { type: 'ADD_TO_HISTORY'; payload: ReportResponse }
  | { type: 'CLEAR_HISTORY' };

const initialState: ReportsState = {
  currentReport: null,
  loading: false,
  error: null,
  filters: {},
  reportHistory: []
};

function reportsReducer(state: ReportsState, action: ReportsAction): ReportsState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_CURRENT_REPORT':
      return { ...state, currentReport: action.payload, loading: false, error: null };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    case 'ADD_TO_HISTORY':
      return {
        ...state,
        reportHistory: [action.payload, ...state.reportHistory.slice(0, 9)] // Keep last 10 reports
      };
    case 'CLEAR_HISTORY':
      return { ...state, reportHistory: [] };
    default:
      return state;
  }
}

interface ReportsContextType {
  state: ReportsState;
  generateReport: (filters: ReportFilters) => Promise<void>;
  generateFinancialReport: (filters: ReportFilters) => Promise<void>;
  generateGroomerPerformanceReport: (filters: ReportFilters) => Promise<void>;
  generateClientAnalysisReport: (filters: ReportFilters) => Promise<void>;
  generateServiceRankingReport: (filters: ReportFilters) => Promise<void>;
  generateOccupancyMetricsReport: (filters: ReportFilters) => Promise<void>;
  generateAppointmentAnalysisReport: (filters: ReportFilters) => Promise<void>;
  updateFilters: (filters: Partial<ReportFilters>) => void;
  clearCurrentReport: () => void;
  clearHistory: () => void;
  exportReport: (format: 'pdf' | 'excel') => Promise<void>;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reportsReducer, initialState);

  const generateReport = useCallback(async (filters: ReportFilters) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const api = getApiInstance();
      const response = await api.post<ReportResponse>('/reports/generate', filters);

      if (response.data.success) {
        dispatch({ type: 'SET_CURRENT_REPORT', payload: response.data });
        dispatch({ type: 'ADD_TO_HISTORY', payload: response.data });
        dispatch({ type: 'SET_FILTERS', payload: filters });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.data.message });
      }
    } catch (error: any) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Erro ao gerar relatório'
      });
    }
  }, []);

  const generateFinancialReport = useCallback(async (filters: ReportFilters) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const api = getApiInstance();
      const response = await api.post<ReportResponse>('/reports/financial', filters);

      if (response.data.success) {
        dispatch({ type: 'SET_CURRENT_REPORT', payload: response.data });
        dispatch({ type: 'ADD_TO_HISTORY', payload: response.data });
        dispatch({ type: 'SET_FILTERS', payload: filters });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.data.message });
      }
    } catch (error: any) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Erro ao gerar relatório financeiro'
      });
    }
  }, []);

  const generateGroomerPerformanceReport = useCallback(async (filters: ReportFilters) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const api = getApiInstance();
      const response = await api.post<ReportResponse>('/reports/groomer-performance', filters);

      if (response.data.success) {
        dispatch({ type: 'SET_CURRENT_REPORT', payload: response.data });
        dispatch({ type: 'ADD_TO_HISTORY', payload: response.data });
        dispatch({ type: 'SET_FILTERS', payload: filters });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.data.message });
      }
    } catch (error: any) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Erro ao gerar relatório de performance'
      });
    }
  }, []);

  const generateClientAnalysisReport = useCallback(async (filters: ReportFilters) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const api = getApiInstance();
      const response = await api.post<ReportResponse>('/reports/client-analysis', filters);

      if (response.data.success) {
        dispatch({ type: 'SET_CURRENT_REPORT', payload: response.data });
        dispatch({ type: 'ADD_TO_HISTORY', payload: response.data });
        dispatch({ type: 'SET_FILTERS', payload: filters });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.data.message });
      }
    } catch (error: any) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Erro ao gerar análise de clientes'
      });
    }
  }, []);

  const generateServiceRankingReport = useCallback(async (filters: ReportFilters) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const api = getApiInstance();
      const response = await api.post<ReportResponse>('/reports/service-ranking', filters);

      if (response.data.success) {
        dispatch({ type: 'SET_CURRENT_REPORT', payload: response.data });
        dispatch({ type: 'ADD_TO_HISTORY', payload: response.data });
        dispatch({ type: 'SET_FILTERS', payload: filters });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.data.message });
      }
    } catch (error: any) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Erro ao gerar ranking de serviços'
      });
    }
  }, []);

  const generateOccupancyMetricsReport = useCallback(async (filters: ReportFilters) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const api = getApiInstance();
      const response = await api.post<ReportResponse>('/reports/occupancy-metrics', filters);

      if (response.data.success) {
        dispatch({ type: 'SET_CURRENT_REPORT', payload: response.data });
        dispatch({ type: 'ADD_TO_HISTORY', payload: response.data });
        dispatch({ type: 'SET_FILTERS', payload: filters });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.data.message });
      }
    } catch (error: any) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Erro ao gerar métricas de ocupação'
      });
    }
  }, []);

  const generateAppointmentAnalysisReport = useCallback(async (filters: ReportFilters) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const api = getApiInstance();
      const response = await api.post<ReportResponse>('/reports/appointment-analysis', filters);

      if (response.data.success) {
        dispatch({ type: 'SET_CURRENT_REPORT', payload: response.data });
        dispatch({ type: 'ADD_TO_HISTORY', payload: response.data });
        dispatch({ type: 'SET_FILTERS', payload: filters });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.data.message });
      }
    } catch (error: any) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Erro ao gerar análise de agendamentos'
      });
    }
  }, []);

  const updateFilters = useCallback((newFilters: Partial<ReportFilters>) => {
    dispatch({ type: 'SET_FILTERS', payload: { ...state.filters, ...newFilters } });
  }, [state.filters]);

  const clearCurrentReport = useCallback(() => {
    dispatch({ type: 'SET_CURRENT_REPORT', payload: null });
  }, []);

  const clearHistory = useCallback(() => {
    dispatch({ type: 'CLEAR_HISTORY' });
  }, []);

  const exportReport = useCallback(async (format: 'pdf' | 'excel') => {
    if (!state.currentReport) {
      dispatch({ type: 'SET_ERROR', payload: 'Nenhum relatório para exportar' });
      return;
    }

    try {
      // TODO: Implement export functionality
      console.log(`Exporting report as ${format}`);
    } catch (error: any) {
      dispatch({
        type: 'SET_ERROR',
        payload: `Erro ao exportar relatório: ${error.message}`
      });
    }
  }, [state.currentReport]);

  const value: ReportsContextType = {
    state,
    generateReport,
    generateFinancialReport,
    generateGroomerPerformanceReport,
    generateClientAnalysisReport,
    generateServiceRankingReport,
    generateOccupancyMetricsReport,
    generateAppointmentAnalysisReport,
    updateFilters,
    clearCurrentReport,
    clearHistory,
    exportReport
  };

  return (
    <ReportsContext.Provider value={value}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
}