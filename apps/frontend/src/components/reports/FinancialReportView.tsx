import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { FinancialReport } from '../../context/reports/ReportsContext';

interface FinancialReportViewProps {
  data: FinancialReport;
}

export function FinancialReportView({ data }: FinancialReportViewProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(data.totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              +{formatNumber(data.transactionCount)} transações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas Totais</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(data.totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              Custos operacionais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${data.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(data.netProfit)}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.netProfit >= 0 ? 'Lucro' : 'Prejuízo'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.averageTicket)}
            </div>
            <p className="text-xs text-muted-foreground">
              Por transação
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Receitas por Categoria</CardTitle>
            <CardDescription>
              Principais fontes de receita
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.incomeByCategory.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color || `hsl(${index * 45}, 70%, 50%)` }}
                    />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(item.value)}</div>
                    <div className="text-xs text-muted-foreground">
                      {data.totalIncome > 0 ? ((item.value / data.totalIncome) * 100).toFixed(1) : 0}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Expenses by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Despesas por Categoria</CardTitle>
            <CardDescription>
              Principais custos operacionais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.expensesByCategory.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color || `hsl(${index * 45 + 180}, 70%, 50%)` }}
                    />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(item.value)}</div>
                    <div className="text-xs text-muted-foreground">
                      {data.totalExpenses > 0 ? ((item.value / data.totalExpenses) * 100).toFixed(1) : 0}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Receita Diária</CardTitle>
            <CardDescription>
              Evolução da receita nos últimos dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.dailyRevenue.slice(-7).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${Math.min((item.value / Math.max(...data.dailyRevenue.map(d => d.value))) * 100, 100)}%`
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-16 text-right">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Tendências Mensais</CardTitle>
            <CardDescription>
              Comparação mês a mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.monthlyTrends.slice(-6).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={item.value >= 0 ? "default" : "destructive"}>
                      {item.value >= 0 ? '+' : ''}{formatCurrency(item.value)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Categories Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo das Principais Categorias</CardTitle>
          <CardDescription>
            Performance das categorias mais importantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                Categoria com Maior Receita
              </h4>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="font-medium text-green-800">{data.topIncomeCategory}</div>
                <div className="text-sm text-green-600">
                  {formatCurrency(data.incomeByCategory.find(c => c.label === data.topIncomeCategory)?.value || 0)}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-600" />
                Categoria com Maior Despesa
              </h4>
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="font-medium text-red-800">{data.topExpenseCategory}</div>
                <div className="text-sm text-red-600">
                  {formatCurrency(data.expensesByCategory.find(c => c.label === data.topExpenseCategory)?.value || 0)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}