import React, { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Transaction,
  FinancialCategory,
  CashRegister,
  FinancialReport,
  FinancialSummary,
  FinancialFilters,
  TransactionType
} from "../models/types";
import { financialApi } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

interface FinancialContextType {
  // Transações
  transactions: Transaction[];
  isLoadingTransactions: boolean;
  errorTransactions: Error | null;

  // Categorias
  categories: FinancialCategory[];
  isLoadingCategories: boolean;
  errorCategories: Error | null;

  // Caixa
  cashRegister: CashRegister | null;
  isLoadingCashRegister: boolean;
  errorCashRegister: Error | null;

  // Relatórios
  report: FinancialReport | null;
  isLoadingReport: boolean;
  errorReport: Error | null;

  // Resumo financeiro
  summary: FinancialSummary | null;
  isLoadingSummary: boolean;
  errorSummary: Error | null;

  // Mutations para transações
  addTransaction: (transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;

  // Mutations para categorias
  addCategory: (category: Omit<FinancialCategory, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateCategory: (category: FinancialCategory) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Mutations para caixa
  createCashRegister: (cashRegister: Omit<CashRegister, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  closeCashRegister: (date: string, notes?: string) => Promise<void>;

  // Relatórios
  generateReport: (filters: FinancialFilters) => Promise<void>;
  getSummary: (startDate?: string, endDate?: string) => Promise<void>;

  // Funções auxiliares
  getTransactionsByDateRange: (startDate: string, endDate: string) => Transaction[];
  getTransactionsByType: (type: TransactionType) => Transaction[];
  getCategoriesByType: (type: TransactionType) => FinancialCategory[];
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getNetProfit: () => number;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error("useFinancial must be used within a FinancialProvider");
  }
  return context;
};

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  // ========== QUERIES ==========

  // Buscar todas as transações
  const {
    data: transactions = [],
    isLoading: isLoadingTransactions,
    error: errorTransactions
  } = useQuery<Transaction[], Error>({
    queryKey: ["financial", "transactions"],
    queryFn: () => financialApi.getTransactions(),
  });

  // Buscar todas as categorias
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    error: errorCategories
  } = useQuery<FinancialCategory[], Error>({
    queryKey: ["financial", "categories"],
    queryFn: () => financialApi.getCategories(),
  });

  // Buscar relatório financeiro (últimos 30 dias por padrão)
  const {
    data: report,
    isLoading: isLoadingReport,
    error: errorReport
  } = useQuery<FinancialReport | null, Error>({
    queryKey: ["financial", "report"],
    queryFn: () => financialApi.getReport({}),
  });

  // Buscar resumo financeiro
  const {
    data: summary,
    isLoading: isLoadingSummary,
    error: errorSummary
  } = useQuery<FinancialSummary | null, Error>({
    queryKey: ["financial", "summary"],
    queryFn: () => financialApi.getSummary(),
  });

  // ========== MUTATIONS PARA TRANSAÇÕES ==========

  const addTransactionMutation = useMutation({
    mutationFn: financialApi.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial'] });
      toast({ title: "Transação criada com sucesso!" });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar transação",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Transaction> }) =>
      financialApi.updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial'] });
      toast({ title: "Transação atualizada com sucesso!" });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar transação",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: financialApi.deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial'] });
      toast({ title: "Transação excluída com sucesso!" });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao excluir transação",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  // ========== MUTATIONS PARA CATEGORIAS ==========

  const addCategoryMutation = useMutation({
    mutationFn: financialApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial', 'categories'] });
      toast({ title: "Categoria criada com sucesso!" });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar categoria",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FinancialCategory> }) =>
      financialApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial', 'categories'] });
      toast({ title: "Categoria atualizada com sucesso!" });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar categoria",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: financialApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial', 'categories'] });
      toast({ title: "Categoria excluída com sucesso!" });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao excluir categoria",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  // ========== MUTATIONS PARA CAIXA ==========

  const createCashRegisterMutation = useMutation({
    mutationFn: financialApi.createCashRegister,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial'] });
      toast({ title: "Caixa criado com sucesso!" });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar caixa",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const closeCashRegisterMutation = useMutation({
    mutationFn: ({ date, notes }: { date: string; notes?: string }) =>
      financialApi.closeCashRegister(date, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial'] });
      toast({ title: "Caixa fechado com sucesso!" });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao fechar caixa",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  // ========== FUNÇÕES AUXILIARES ==========

  const getTransactionsByDateRange = (startDate: string, endDate: string): Transaction[] => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return transactionDate >= start && transactionDate <= end;
    });
  };

  const getTransactionsByType = (type: TransactionType): Transaction[] => {
    return transactions.filter(transaction => transaction.type === type);
  };

  const getCategoriesByType = (type: TransactionType): FinancialCategory[] => {
    return categories.filter(category => category.type === type && category.isActive);
  };

  const getTotalIncome = (): number => {
    return transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpenses = (): number => {
    return transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getNetProfit = (): number => {
    return getTotalIncome() - getTotalExpenses();
  };

  return (
    <FinancialContext.Provider
      value={{
        // Dados
        transactions,
        isLoadingTransactions,
        errorTransactions,
        categories,
        isLoadingCategories,
        errorCategories,
        cashRegister: null, // Será implementado quando necessário
        isLoadingCashRegister: false,
        errorCashRegister: null,
        report,
        isLoadingReport,
        errorReport,
        summary: summary || null,
        isLoadingSummary,
        errorSummary,

        // Mutations para transações
        addTransaction: async (transaction) => await addTransactionMutation.mutateAsync(transaction),
        updateTransaction: async (transaction) =>
          await updateTransactionMutation.mutateAsync({ id: transaction.id, data: transaction }),
        deleteTransaction: async (id) => await deleteTransactionMutation.mutateAsync(id),

        // Mutations para categorias
        addCategory: async (category) => await addCategoryMutation.mutateAsync(category),
        updateCategory: async (category) =>
          await updateCategoryMutation.mutateAsync({ id: category.id, data: category }),
        deleteCategory: async (id) => await deleteCategoryMutation.mutateAsync(id),

        // Mutations para caixa
        createCashRegister: async (cashRegister) => await createCashRegisterMutation.mutateAsync(cashRegister),
        closeCashRegister: async (date, notes) =>
          await closeCashRegisterMutation.mutateAsync({ date, notes }),

        // Relatórios
        generateReport: async (filters) => {
          const reportData = await financialApi.getReport(filters);
          queryClient.setQueryData(['financial', 'report'], reportData);
        },
        getSummary: async (startDate, endDate) => {
          const summaryData = await financialApi.getSummary(startDate, endDate);
          queryClient.setQueryData(['financial', 'summary'], summaryData);
        },

        // Funções auxiliares
        getTransactionsByDateRange,
        getTransactionsByType,
        getCategoriesByType,
        getTotalIncome,
        getTotalExpenses,
        getNetProfit,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};