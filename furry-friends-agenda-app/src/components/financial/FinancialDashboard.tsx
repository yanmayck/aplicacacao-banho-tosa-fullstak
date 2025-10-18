import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFinancial } from '@/context/financial/FinancialContext';
import { useFinancialMetrics, useRecentTransactions, useFinancialFormatting } from '@/hooks/useFinancial';
import { TrendingUp, TrendingDown, DollarSign, Activity, Plus, Eye } from 'lucide-react';

export const FinancialDashboard: React.FC = () => {
  const { isLoadingTransactions, isLoadingCategories } = useFinancial();
  const metrics = useFinancialMetrics();
  const recentTransactions = useRecentTransactions(5);
  const { formatCurrency, formatDate } = useFinancialFormatting();

  const isLoading = isLoadingTransactions || isLoadingCategories;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Financeiro</h1>
          <p className="text-gray-600">Visão geral das finanças do pet shop</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Ver Relatório
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Receitas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas Totais</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(metrics.totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.incomeCount} transações
            </p>
          </CardContent>
        </Card>

        {/* Despesas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas Totais</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(metrics.totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.expenseCount} transações
            </p>
          </CardContent>
        </Card>

        {/* Lucro Líquido */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metrics.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(metrics.netProfit)}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.netProfit >= 0 ? 'Lucro' : 'Prejuízo'}
            </p>
          </CardContent>
        </Card>

        {/* Ticket Médio */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(metrics.averageTicket)}
            </div>
            <p className="text-xs text-muted-foreground">
              Por transação de receita
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transações Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
          <CardDescription>
            Últimas 5 transações registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Nenhuma transação encontrada
            </p>
          ) : (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
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
                        <span>{transaction.paymentMethod}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'INCOME' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Operações financeiras comuns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Plus className="h-6 w-6" />
              <span>Nova Receita</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <TrendingDown className="h-6 w-6" />
              <span>Nova Despesa</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Eye className="h-6 w-6" />
              <span>Ver Relatório</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <DollarSign className="h-6 w-6" />
              <span>Controle de Caixa</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};