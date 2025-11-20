import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useFinancial } from '@/context/financial/FinancialContext';
import { useCashBalance, useFinancialFormatting } from '@/hooks/useFinancial';
import { DollarSign, Calculator, Lock, Unlock } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export const CashRegister: React.FC = () => {
  const { createCashRegister, closeCashRegister } = useFinancial();
  const { formatCurrency, formatDate } = useFinancialFormatting();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [openingBalance, setOpeningBalance] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const cashBalance = useCashBalance(selectedDate);

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
        date: selectedDate ?? new Date().toISOString().split('T')[0],
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
      await closeCashRegister(selectedDate ?? new Date().toISOString().split('T')[0]);

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
      {/* Controle de Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Controle de Caixa
          </CardTitle>
          <CardDescription>
            Gerencie o caixa diário do pet shop
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            </div>

            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Despesas</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(cashBalance.expenses)}
              </p>
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

      {/* Transações do Dia */}
      <Card>
        <CardHeader>
          <CardTitle>Transações do Dia</CardTitle>
          <CardDescription>
            Movimentações financeiras da data selecionada
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {/* Exemplo de transações - será substituído por dados reais */}
            <div className="flex justify-between items-center p-3 border rounded">
              <div>
                <p className="font-medium">Banho - Rex (Golden Retriever)</p>
                <p className="text-sm text-gray-500">Cliente: João Silva</p>
              </div>
              <div className="text-right">
                <Badge className="bg-green-100 text-green-800">Receita</Badge>
                <p className="font-bold text-green-600">+ R$ 45,00</p>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 border rounded">
              <div>
                <p className="font-medium">Compra de produtos de limpeza</p>
                <p className="text-sm text-gray-500">Fornecedor: PetShop Suprimentos</p>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="bg-red-100 text-red-800">Despesa</Badge>
                <p className="font-bold text-red-600">- R$ 120,00</p>
              </div>
            </div>

            {cashBalance.income === 0 && cashBalance.expenses === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma transação encontrada para esta data</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};