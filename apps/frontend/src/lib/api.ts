import axios from 'axios';
import {
  Client,
  Pet,
  Groomer,
  Appointment,
  Package,
  Transaction,
  FinancialCategory,
  CashRegister,
  FinancialReport,
  FinancialSummary,
  FinancialFilters
} from '@/context/models/types';

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // If explicitly set in environment, use that
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Use /api prefix which will be proxied by Vite dev server to backend
  // In production, this should be configured to point to the deployed backend
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

// 1. Cria uma instância do Axios com configurações globais
export const api = axios.create({
  baseURL: API_BASE_URL,
});

// 2. Adiciona um interceptor para injetar o token de autenticação em cada requisição
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

// 3. Define tipos para os dados de criação/atualização para maior segurança
type CreateClientData = Omit<Client, 'id'>;
type UpdateClientData = Partial<CreateClientData>;

// API para Clientes com Axios e tipos
export const clientApi = {
  getClients: async (): Promise<Client[]> => {
    const { data } = await api.get('/clients');
    return data;
  },
  getClient: async (id: string): Promise<Client> => {
    const { data } = await api.get(`/clients/${id}`);
    return data;
  },
  createClient: async (clientData: CreateClientData): Promise<Client> => {
    const { data } = await api.post('/clients', clientData);
    return data;
  },
  updateClient: async (id: string, clientData: UpdateClientData): Promise<Client> => {
    const { data } = await api.patch(`/clients/${id}`, clientData);
    return data;
  },
  deleteClient: async (id: string): Promise<void> => {
    await api.delete(`/clients/${id}`);
  },
};

// (Opcional) Você pode seguir o mesmo padrão para as outras APIs (Pet, Groomer, etc.)

// Exemplo para Pet API
type CreatePetData = Omit<Pet, 'id'>;
type UpdatePetData = Partial<CreatePetData>;

export const petApi = {
    getPets: async (): Promise<Pet[]> => {
        const { data } = await api.get('/pets');
        return data;
    },
    deletePet: async (id: string): Promise<void> => {
        await api.delete(`/pets/${id}`);
    },
    createPet: async (petData: CreatePetData): Promise<Pet> => {
        const { data } = await api.post('/pets', petData);
        return data;
    },
    updatePet: async (id: string, petData: UpdatePetData): Promise<Pet> => {
        const { data } = await api.patch(`/pets/${id}`, petData);
        return data;
    }
};

// Exemplo para Appointment API
type CreateAppointmentData = Omit<Appointment, 'id'>;
type UpdateAppointmentData = Partial<CreateAppointmentData>;

export const appointmentApi = {
    getAppointments: async (): Promise<Appointment[]> => {
        const { data } = await api.get('/appointments');
        return data;
    },
    deleteAppointment: async (id: string): Promise<void> => {
        await api.delete(`/appointments/${id}`);
    },
    createAppointment: async (appointmentData: CreateAppointmentData): Promise<Appointment> => {
        const { data } = await api.post('/appointments', appointmentData);
        return data;
    },
    updateAppointment: async (id: string, appointmentData: UpdateAppointmentData): Promise<Appointment> => {
        const { data } = await api.patch(`/appointments/${id}`, appointmentData);
        return data;
    }
};

// Exemplo para Groomer API
type CreateGroomerData = Omit<Groomer, 'id'>;
type UpdateGroomerData = Partial<CreateGroomerData>;

export const groomerApi = {
    getGroomers: async (): Promise<Groomer[]> => {
        const { data } = await api.get('/groomers');
        return data;
    },
    deleteGroomer: async (id: string): Promise<void> => {
        await api.delete(`/groomers/${id}`);
    },
    createGroomer: async (groomerData: CreateGroomerData): Promise<Groomer> => {
        const { data } = await api.post('/groomers', groomerData);
        return data;
    },
    updateGroomer: async (id: string, groomerData: UpdateGroomerData): Promise<Groomer> => {
        const { data } = await api.patch(`/groomers/${id}`, groomerData);
        return data;
    }
};

// Exemplo para Package API
type CreatePackageData = Omit<Package, 'id'>;
type UpdatePackageData = Partial<CreatePackageData>;

export const packageApi = {
    getPackages: async (): Promise<Package[]> => {
        const { data } = await api.get('/packages');
        return data;
    },
    deletePackage: async (id: string): Promise<void> => {
        await api.delete(`/packages/${id}`);
    },
    createPackage: async (packageData: CreatePackageData): Promise<Package> => {
        const { data } = await api.post('/packages', packageData);
        return data;
    },
    updatePackage: async (id: string, packageData: UpdatePackageData): Promise<Package> => {
        const { data } = await api.patch(`/packages/${id}`, packageData);
        return data;
    }
};

// ========== FINANCIAL API ==========

// Tipos para dados financeiros
type CreateTransactionData = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'category' | 'appointment' | 'groomer'>;
type UpdateTransactionData = Partial<CreateTransactionData>;

type CreateCategoryData = Omit<FinancialCategory, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateCategoryData = Partial<CreateCategoryData>;

type CreateCashRegisterData = Omit<CashRegister, 'id' | 'createdAt' | 'updatedAt'>;

export const financialApi = {
  // ========== TRANSAÇÕES ==========
  getTransactions: async (filters?: {
    type?: string;
    startDate?: string;
    endDate?: string;
    categoryId?: string;
    groomerId?: string;
  }): Promise<Transaction[]> => {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.groomerId) params.append('groomerId', filters.groomerId);

    const queryString = params.toString();
    const { data } = await api.get(`/financial/transactions${queryString ? `?${queryString}` : ''}`);
    return data;
  },

  getTransaction: async (id: string): Promise<Transaction> => {
    const { data } = await api.get(`/financial/transactions/${id}`);
    return data;
  },

  createTransaction: async (transactionData: CreateTransactionData): Promise<Transaction> => {
    const { data } = await api.post('/financial/transactions', transactionData);
    return data;
  },

  updateTransaction: async (id: string, transactionData: UpdateTransactionData): Promise<Transaction> => {
    const { data } = await api.patch(`/financial/transactions/${id}`, transactionData);
    return data;
  },

  deleteTransaction: async (id: string): Promise<void> => {
    await api.delete(`/financial/transactions/${id}`);
  },

  // ========== CATEGORIAS ==========
  getCategories: async (activeOnly = true): Promise<FinancialCategory[]> => {
    const { data } = await api.get(`/financial/categories?activeOnly=${activeOnly}`);
    return data;
  },

  getCategoriesByType: async (type: string): Promise<FinancialCategory[]> => {
    const { data } = await api.get(`/financial/categories/type/${type}`);
    return data;
  },

  createCategory: async (categoryData: CreateCategoryData): Promise<FinancialCategory> => {
    const { data } = await api.post('/financial/categories', categoryData);
    return data;
  },

  updateCategory: async (id: string, categoryData: UpdateCategoryData): Promise<FinancialCategory> => {
    const { data } = await api.patch(`/financial/categories/${id}`, categoryData);
    return data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/financial/categories/${id}`);
  },

  // ========== CONTROLE DE CAIXA ==========
  getCashRegister: async (date: string): Promise<CashRegister> => {
    const { data } = await api.get(`/financial/cash-register/${date}`);
    return data;
  },

  createCashRegister: async (cashRegisterData: CreateCashRegisterData): Promise<CashRegister> => {
    const { data } = await api.post('/financial/cash-register', cashRegisterData);
    return data;
  },

  closeCashRegister: async (date: string, notes?: string): Promise<CashRegister> => {
    const { data } = await api.patch(`/financial/cash-register/${date}/close`, { notes });
    return data;
  },

  // ========== RELATÓRIOS ==========
  getReport: async (filters: FinancialFilters): Promise<FinancialReport> => {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.groomerId) params.append('groomerId', filters.groomerId);
    if (filters.groupBy) params.append('groupBy', filters.groupBy);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const queryString = params.toString();
    const { data } = await api.get(`/financial/reports?${queryString}`);
    return data;
  },

  getSummary: async (startDate?: string, endDate?: string): Promise<FinancialSummary> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const queryString = params.toString();
    const { data } = await api.get(`/financial/reports/summary${queryString ? `?${queryString}` : ''}`);
    return data;
  },

  // ========== DASHBOARD ==========
  getDashboardSummary: async (days?: number): Promise<FinancialSummary> => {
    const params = days ? `?days=${days}` : '';
    const { data } = await api.get(`/financial/dashboard/summary${params}`);
    return data;
  },

  getRecentTransactions: async (limit?: number): Promise<Transaction[]> => {
    const params = limit ? `?limit=${limit}` : '';
    const { data } = await api.get(`/financial/dashboard/recent-transactions${params}`);
    return data;
  },

  // ========== RECEITAS AUTOMÁTICAS ==========
  createAutomaticIncome: async (appointmentId: string): Promise<Transaction> => {
    const { data } = await api.post(`/financial/appointments/${appointmentId}/automatic-income`);
    return data;
  },
};
