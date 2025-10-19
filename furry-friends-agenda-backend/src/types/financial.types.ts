// Interfaces específicas para o sistema financeiro
import { TransactionType } from '../financial/dto/create-transaction.dto';

export interface TransactionUpdateData {
  type?: TransactionType;
  amount?: number;
  description?: string;
  date?: Date;
  paymentMethod?: string;
  notes?: string;
  receiptUrl?: string;
  category?: {
    connect: { id: string };
  };
  appointment?: {
    connect: { id: string };
  };
  groomer?: {
    connect: { id: string };
  };
}

export interface FinancialReportData {
  period: {
    startDate: Date;
    endDate: Date;
    type: string;
  };
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
    transactionCount: number;
    averageTicket: number;
  };
  byCategory: Record<
    string,
    {
      total: number;
      count: number;
    }
  >;
  byGroomer: Record<
    string,
    {
      total: number;
      count: number;
      commission: number;
    }
  >;
  transactions: Array<{
    id: string;
    type: TransactionType;
    amount: number;
    description: string;
    date: Date;
    category: string;
    groomer?: string;
    paymentMethod: string;
  }>;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  transactionCount: number;
}

export interface CategoryMetrics {
  total: number;
  count: number;
}

export interface GroomerMetrics {
  total: number;
  count: number;
  commission: number;
}
