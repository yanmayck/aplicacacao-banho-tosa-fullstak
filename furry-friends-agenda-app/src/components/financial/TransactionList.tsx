import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFinancial } from '@/context/financial/FinancialContext';
import { useFinancialFormatting, useTransactionsByType } from '@/hooks/useFinancial';
import { Transaction, TransactionType } from '@/context/models/types';
import { Search, Filter, Edit, Trash2, Plus, Eye } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface TransactionListProps {
  showFilters?: boolean;
  showActions?: boolean;
  maxHeight?: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  showFilters = true,
  showActions = true,
  maxHeight = '600px'
}) => {
  const {
    transactions,
    isLoadingTransactions,
    deleteTransaction,
    categories
  } = useFinancial();

  const { formatCurrency, formatDate } = useFinancialFormatting();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Filtrar transações
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'ALL' || transaction.type === typeFilter;
    const matchesCategory = categoryFilter === 'ALL' || transaction.categoryId === categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
    } catch (error) {
      toast({
        title: "Erro ao excluir transação",
        description: "Não foi possível excluir a transação.",
        variant: "destructive"
      });
    }
  };

  if (isLoadingTransactions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transações Financeiras</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Transações Financeiras</CardTitle>
            <CardDescription>
              {filteredTransactions.length} de {transactions.length} transações
            </CardDescription>
          </div>
          {showActions && (
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nova Transação
            </Button>
          )}
        </div>

        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por descrição ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as TransactionType | 'ALL')}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos os tipos</SelectItem>
                <SelectItem value="INCOME">Receitas</SelectItem>
                <SelectItem value="EXPENSE">Despesas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todas as categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {transactions.length === 0
                ? "Nenhuma transação encontrada"
                : "Nenhuma transação corresponde aos filtros"
              }
            </p>
          </div>
        ) : (
          <div className={`space-y-2 ${maxHeight ? `max-h-[${maxHeight}] overflow-y-auto` : ''}`}>
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{transaction.description}</p>
                    <Badge
                      variant={transaction.type === 'INCOME' ? 'default' : 'secondary'}
                      className={transaction.type === 'INCOME' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                    >
                      {transaction.type === 'INCOME' ? 'Receita' : 'Despesa'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{transaction.category?.name}</span>
                    <span>{formatDate(transaction.date)}</span>
                    {transaction.paymentMethod && (
                      <span className="flex items-center gap-1">
                        <span>•</span>
                        {transaction.paymentMethod}
                      </span>
                    )}
                    {transaction.groomer && (
                      <span className="flex items-center gap-1">
                        <span>•</span>
                        Tosador: {transaction.groomer.name}
                      </span>
                    )}
                  </div>
                  {transaction.notes && (
                    <p className="text-sm text-gray-400 mt-1">{transaction.notes}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right mr-4">
                    <p className={`font-bold ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'INCOME' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>

                  {showActions && (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};