import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFinancial } from '@/context/financial/FinancialContext';
import { useCashBalance, useFinancialFormatting, useTransactionsByDateRange } from '@/hooks/useFinancial';
import { DollarSign, Calculator, Lock, Unlock, Eye, FileText, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { CashRegister as CashRegisterType } from '@/context/models/types';

export const CashRegister: React.FC = () => {
  const { createCashRegister, closeCashRegister, transactions } = useFinancial();
  const { formatCurrency, formatDate } = useFinancialFormatting();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [openingBalance, setOpeningBalance] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [viewMode, setViewMode] = useState<'summary' | 'detailed'>('summary');

  const cashBalance = useCashBalance(selectedDate);

  // Filtrar transações do dia selecionado
  const dayTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date).toDateString();
      const targetDate = new Date(selectedDate || new Date()).toDateString();
      return transactionDate === targetDate;
    });
  }, [transactions, selectedDate]);

  // Calcular totais por método de pagamento
  const paymentMethodTotals = useMemo(() => {
    const totals: Record<string, { income: number; expenses: number }> = {};

    dayTransactions.forEach(transaction => {
      const method = transaction.paymentMethod || 'Não informado';
      if (!totals[method]) {
        totals[method] = { income: 0, expenses: 0 };
      }

      if (transaction.type === 'INCOME') {
        totals[method].income += transaction.amount;
      } else {
        totals[method].expenses += transaction.amount;
      }
    });

    return totals;
  }, [dayTransactions]);

  const handleCreateCashRegister = async () => {
    if (!openingBalance || parseFloat(openingBalance) < 0) {
      toast({
        title: "Erro",
        description: "Informe um saldo inicial válido",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      await createCashRegister({
        date: selectedDate || new Date().toISOString().split('T')[0],
        openingBalance: parseFloat(openingBalance),
        notes: `Caixa aberto em ${formatDate(new Date())}`
      });

      toast({
        title: "Sucesso",
        description: "Caixa criado com sucesso!"
      });

      setOpeningBalance('');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o caixa",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCloseCashRegister = async () => {
    setIsClosing(true);
    try {
      await closeCashRegister(selectedDate || new Date().toISOString().split('T')[0]);

      toast({
        title: "Sucesso",
        description: "Caixa fechado com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível fechar o caixa",
        variant: "destructive"
      });
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controle de Data e Modo de Visualização */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Controle de Caixa Detalhado
          </CardTitle>
          <CardDescription>
            Gerencie o caixa diário com controle detalhado de movimentações
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="date">Data do Caixa</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="flex-1">
              <Label htmlFor="openingBalance">Saldo Inicial (R$)</Label>
              <Input
                id="openingBalance"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={openingBalance}
                onChange={(e) => setOpeningBalance(e.target.value)}
              />
            </div>

            <div className="flex-1">
              <Label htmlFor="viewMode">Modo de Visualização</Label>
              <Select value={viewMode} onValueChange={(value: 'summary' | 'detailed') => setViewMode(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Resumo</SelectItem>
                  <SelectItem value="detailed">Detalhado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleCreateCashRegister}
              disabled={isCreating}
              className="h-10"
            >
              {isCreating ? 'Criando...' : 'Criar Caixa'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status do Caixa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Status do Caixa - {formatDate(selectedDate || new Date())}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Saldo Inicial */}
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Saldo Inicial</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(0)} {/* Será implementado quando tivermos o caixa real */}
              </p>
            </div>

            {/* Movimentações do Dia */}
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Receitas</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(cashBalance.income)}
              </p>
              <p className="text-xs text-gray-500">{dayTransactions.filter(t => t.type === 'INCOME').length} transações</p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Despesas</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(cashBalance.expenses)}
              </p>
              <p className="text-xs text-gray-500">{dayTransactions.filter(t => t.type === 'EXPENSE').length} transações</p>
            </div>

            {/* Total de Transações */}
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Total Transações</p>
              <p className="text-2xl font-bold text-purple-600">
                {dayTransactions.length}
              </p>
              <p className="text-xs text-gray-500">Movimentações</p>
            </div>
          </div>

          {/* Saldo Final Calculado */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Saldo Final Calculado</p>
                <p className="text-3xl font-bold">
                  {formatCurrency(cashBalance.balance)}
                </p>
              </div>

              <div className="flex gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Unlock className="h-3 w-3" />
                  Aberto
                </Badge>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCloseCashRegister}
                  disabled={isClosing}
                  className="flex items-center gap-2"
                >
                  <Lock className="h-4 w-4" />
                  {isClosing ? 'Fechando...' : 'Fechar Caixa'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Movimentações por Método de Pagamento */}
      {viewMode === 'detailed' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Movimentações por Método de Pagamento
            </CardTitle>
            <CardDescription>
              Detalhamento das transações por forma de pagamento
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(paymentMethodTotals).map(([method, totals]) => (
                <div key={method} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{method}</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Receitas:</span>
                      <span className="font-medium text-green-600">{formatCurrency(totals.income)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-red-600">Despesas:</span>
                      <span className="font-medium text-red-600">{formatCurrency(totals.expenses)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium border-t pt-1">
                      <span>Saldo:</span>
                      <span className={totals.income - totals.expenses >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(totals.income - totals.expenses)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transações do Dia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Transações do Dia
          </CardTitle>
          <CardDescription>
            Movimentações financeiras da data selecionada
          </CardDescription>
        </CardHeader>

        <CardContent>
          {dayTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhuma transação encontrada para esta data</p>
            </div>
          ) : (
            <div className="space-y-3">
              {viewMode === 'detailed' ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead>Tosador</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="text-center">Tipo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dayTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.description}</TableCell>
                        <TableCell>{transaction.category?.name}</TableCell>
                        <TableCell>{transaction.paymentMethod || 'N/A'}</TableCell>
                        <TableCell>{transaction.groomer?.name || 'N/A'}</TableCell>
                        <TableCell className={`text-right font-bold ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'INCOME' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={transaction.type === 'INCOME' ? 'default' : 'secondary'}
                            className={transaction.type === 'INCOME' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                          >
                            {transaction.type === 'INCOME' ? 'Receita' : 'Despesa'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="space-y-3">
                  {dayTransactions.slice(0, 10).map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{transaction.category?.name}</span>
                          <span>{transaction.paymentMethod || 'N/A'}</span>
                          {transaction.groomer && <span>Tosador: {transaction.groomer.name}</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={transaction.type === 'INCOME' ? 'default' : 'secondary'}
                          className={transaction.type === 'INCOME' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                        >
                          {transaction.type === 'INCOME' ? 'Receita' : 'Despesa'}
                        </Badge>
                        <p className={`font-bold ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'INCOME' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {dayTransactions.length > 10 && (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">
                        Mostrando 10 de {dayTransactions.length} transações.
                        Use o modo detalhado para ver todas.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};