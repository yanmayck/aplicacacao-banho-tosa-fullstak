import { useMemo } from 'react';
import { useFinancial } from '@/context/financial/FinancialContext';
import { Transaction, FinancialCategory, TransactionType } from '@/context/models/types';

// Hook para filtrar transações por período
export const useTransactionsByDateRange = (startDate: string, endDate: string) => {
  const { transactions } = useFinancial();

  return useMemo(() => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return transactionDate >= start && transactionDate <= end;
    });
  }, [transactions, startDate, endDate]);
};

// Hook para filtrar transações por tipo
export const useTransactionsByType = (type: TransactionType) => {
  const { transactions } = useFinancial();

  return useMemo(() => {
    return transactions.filter(transaction => transaction.type === type);
  }, [transactions, type]);
};

// Hook para obter categorias por tipo
export const useCategoriesByType = (type: TransactionType) => {
  const { categories } = useFinancial();

  return useMemo(() => {
    return categories.filter(category => category.type === type && category.isActive);
  }, [categories, type]);
};

// Hook para calcular métricas financeiras básicas
export const useFinancialMetrics = () => {
  const { transactions } = useFinancial();

  return useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const netProfit = totalIncome - totalExpenses;

    const incomeCount = transactions.filter(t => t.type === 'INCOME').length;
    const expenseCount = transactions.filter(t => t.type === 'EXPENSE').length;

    const averageTicket = incomeCount > 0 ? totalIncome / incomeCount : 0;

    return {
      totalIncome,
      totalExpenses,
      netProfit,
      transactionCount: transactions.length,
      incomeCount,
      expenseCount,
      averageTicket,
    };
  }, [transactions]);
};

// Hook para métricas por categoria
export const useCategoryMetrics = () => {
  const { transactions } = useFinancial();

  return useMemo(() => {
    const categoryMetrics = transactions.reduce((acc, transaction) => {
      const categoryName = transaction.category?.name || 'Sem categoria';
      if (!acc[categoryName]) {
        acc[categoryName] = { total: 0, count: 0 };
      }
      acc[categoryName].total += transaction.amount;
      acc[categoryName].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    return Object.entries(categoryMetrics).map(([category, metrics]) => ({
      category,
      ...metrics,
    }));
  }, [transactions]);
};

// Hook para transações recentes
export const useRecentTransactions = (limit: number = 5) => {
  const { transactions } = useFinancial();

  return useMemo(() => {
    return transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }, [transactions, limit]);
};

// Hook para saldo do caixa diário
export const useCashBalance = (date?: string) => {
  const { transactions } = useFinancial();

  return useMemo(() => {
    let filteredTransactions = transactions;

    if (date) {
      filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date).toDateString();
        const targetDate = new Date(date).toDateString();
        return transactionDate === targetDate;
      });
    }

    const totalIncome = filteredTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = filteredTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income: totalIncome,
      expenses: totalExpenses,
      balance: totalIncome - totalExpenses,
    };
  }, [transactions, date]);
};

// Hook para validação de formulário financeiro
export const useFinancialFormValidation = () => {
  const validateTransaction = (data: Partial<Transaction>) => {
    const errors: Record<string, string> = {};

    if (!data.amount || data.amount <= 0) {
      errors.amount = 'Valor deve ser maior que zero';
    }

    if (!data.description || data.description.trim().length === 0) {
      errors.description = 'Descrição é obrigatória';
    }

    if (!data.date) {
      errors.date = 'Data é obrigatória';
    }

    if (!data.categoryId) {
      errors.categoryId = 'Categoria é obrigatória';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const validateCategory = (data: Partial<FinancialCategory>) => {
    const errors: Record<string, string> = {};

    if (!data.name || data.name.trim().length === 0) {
      errors.name = 'Nome é obrigatório';
    }

    if (!data.type) {
      errors.type = 'Tipo é obrigatório';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  return {
    validateTransaction,
    validateCategory,
  };
};

// Hook para formatação de valores financeiros
export const useFinancialFormatting = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
  };

  const formatDateTime = (date: string | Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(date));
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return {
    formatCurrency,
    formatDate,
    formatDateTime,
    formatPercentage,
  };
};