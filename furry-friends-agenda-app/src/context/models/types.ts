
// Types and interfaces for the store
import { ServiceType, TransportType, AppointmentStatus } from "../StoreContext";

// Utility types for better type safety
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Service types enum for better type safety
export type ServiceTypes = 'bath' | 'grooming' | 'both';
export type TransportTypes = 'pickup' | 'delivery' | 'none';
export type AppointmentStatuses = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

// Client model
export interface Client {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
}

// Pet model
export interface Pet {
  id: string;
  clientId: string;
  name: string;
  species: string;
  breed?: string | null;
  birthDate?: string | null;
  observations?: string | null;
  foodType?: string | null;
  lastTickMedicine?: {
    name: string;
    date: string;
  } | null;
  rabiesVaccine?: {
    isUpToDate: boolean;
    lastDate: string;
  } | null;
  vaccineHistory: Array<{
    name: string;
    date: string;
  }>;
}

// Groomer model
export interface Groomer {
  id: string;
  name: string;
  status: "available" | "busy";
  commissionPercentage: number;
}

// Appointment model
export interface Appointment {
  id: string;
  clientId: string;
  petName: string;
  date: string;
  time: string;
  serviceType: ServiceType;
  groomerId: string | null;
  status: AppointmentStatus;
  packageId?: string | null;
  transportType?: TransportType;
  price: number;
  points?: number;
}

// Commission model
export interface Commission {
  id: string;
  groomerId: string;
  appointmentId: string;
  value: number;
  date: string;
}

// Package model
export interface Package {
  id: string;
  name: string;
  description: string;
  includesBaths: number;
  includesGrooming: boolean;
  includesHydration: boolean;
  basePrice: number;
  pickupPrice: number;
}

// Groomer Points model
export interface GroomerPoint {
  id: string;
  groomerId: string;
  appointmentId: string;
  points: number;
  date: string;
}

// Utility function for generating secure IDs
export const generateSecureId = (): string => {
  // Use crypto.randomUUID() if available (modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for older browsers or environments without crypto.randomUUID
  // Use crypto.getRandomValues for better security than Math.random()
  if (typeof crypto !== 'undefined' && crypto.getRandomValues && typeof Uint8Array !== 'undefined') {
    const array = new Uint8Array(16);
    if (crypto.getRandomValues && array) {
      crypto.getRandomValues(array);
    }

    // Set version (4) and variant bits for RFC 4122 UUID v4
    if (array && array.length > 8) {
      array[6] = (array[6] & 0x0f) | 0x40; // Version 4
      array[8] = (array[8] & 0x3f) | 0x80; // Variant 10
    }

    const hex = Array.from(array || [], (byte: number) => byte.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
  }

  // Last resort fallback (should be avoided in production)
  console.warn('Using insecure random ID generation. Consider updating to a modern browser with crypto.randomUUID support.');
  return Math.random().toString(36).slice(2, 11);
};

// ========== TIPOS FINANCEIROS ==========

// Enum para tipos de transação
export type TransactionType = 'INCOME' | 'EXPENSE';

// Enum para categorias de receita
export type IncomeCategory = 'SERVICE_PAYMENT' | 'PACKAGE_PAYMENT' | 'OTHER_INCOME';

// Enum para categorias de despesa
export type ExpenseCategory = 'OPERATIONAL_COSTS' | 'STAFF_SALARY' | 'PRODUCTS' | 'MAINTENANCE' | 'MARKETING' | 'UTILITIES' | 'RENT' | 'OTHER_EXPENSE';

// Modelo de categoria financeira
export interface FinancialCategory {
  id: string;
  name: string;
  description?: string | null;
  type: TransactionType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Modelo de transação financeira
export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  categoryId: string;
  category?: FinancialCategory;
  appointmentId?: string | null;
  appointment?: Appointment | null;
  groomerId?: string | null;
  groomer?: Groomer | null;
  cashRegisterId?: string | null;
  paymentMethod?: string | null;
  notes?: string | null;
  receiptUrl?: string | null;
  isCashRegisterClosed: boolean;
  createdAt: string;
  updatedAt: string;
}

// Modelo de controle de caixa diário
export interface CashRegister {
  id: string;
  date: string;
  openingBalance: number;
  closingBalance?: number | null;
  totalIncome: number;
  totalExpenses: number;
  isClosed: boolean;
  closedAt?: string | null;
  notes?: string | null;
  transactions?: Transaction[];
  createdAt: string;
  updatedAt: string;
}

// Modelo de relatório financeiro
export interface FinancialReport {
  period: {
    startDate: string;
    endDate: string;
    type: string;
  };
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
    transactionCount: number;
    averageTicket: number;
  };
  byCategory: Record<string, { total: number; count: number }>;
  byGroomer: Record<string, { total: number; count: number; commission: number }>;
  transactions: Array<{
    id: string;
    type: TransactionType;
    amount: number;
    description: string;
    date: string;
    category: string;
    groomer?: string;
    paymentMethod?: string;
  }>;
}

// Modelo de resumo financeiro
export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  transactionCount: number;
}

// Modelo de dashboard financeiro
export interface FinancialDashboard {
  summary: FinancialSummary;
  recentTransactions: Transaction[];
  monthlyTrend: Array<{
    month: string;
    income: number;
    expenses: number;
    profit: number;
  }>;
  topCategories: Array<{
    category: string;
    total: number;
    percentage: number;
  }>;
}

// Filtros para relatórios financeiros
export interface FinancialFilters {
  type?: TransactionType;
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  groomerId?: string;
  groupBy?: 'day' | 'week' | 'month' | 'category' | 'groomer';
  sortBy?: 'date' | 'amount' | 'description';
  sortOrder?: 'asc' | 'desc';
}

// Legacy function for backward compatibility (deprecated)
export const generateId = generateSecureId;
