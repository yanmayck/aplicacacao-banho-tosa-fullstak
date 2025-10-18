import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFinancial } from '@/context/financial/FinancialContext';
import { useFinancialFormatting, useFinancialFormValidation } from '@/hooks/useFinancial';
import { Transaction, TransactionType } from '@/context/models/types';
import { Save, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface TransactionFormProps {
  transaction?: Transaction;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  onSuccess,
  onCancel
}) => {
  const { addTransaction, updateTransaction, categories } = useFinancial();
  const { formatCurrency } = useFinancialFormatting();
  const { validateTransaction } = useFinancialFormValidation();

  const [formData, setFormData] = useState({
    type: transaction?.type || 'INCOME' as TransactionType,
    amount: transaction?.amount?.toString() || '',
    description: transaction?.description || '',
    date: transaction?.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    categoryId: transaction?.categoryId || '',
    paymentMethod: transaction?.paymentMethod || '',
    notes: transaction?.notes || '',
    receiptUrl: transaction?.receiptUrl || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtrar categorias pelo tipo selecionado
  const availableCategories = categories.filter(cat =>
    cat.type === formData.type && cat.isActive
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar formulário
    const validation = validateTransaction(formData as any);
    setErrors(validation.errors);

    if (!validation.isValid) {
      toast({
        title: "Erro de validação",
        description: "Verifique os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      if (transaction) {
        await updateTransaction({
          ...transaction,
          ...transactionData,
          date: transactionData.date || transaction.date
        } as Transaction);
        toast({
          title: "Sucesso",
          description: "Transação atualizada com sucesso!"
        });
      } else {
        await addTransaction(transactionData as any);
        toast({
          title: "Sucesso",
          description: "Transação criada com sucesso!"
        });
      }

      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a transação",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {transaction ? 'Editar Transação' : 'Nova Transação'}
        </CardTitle>
        <CardDescription>
          {transaction ? 'Atualize os dados da transação financeira' : 'Registre uma nova transação financeira'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Transação */}
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Transação *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange('type', value)}
            >
              <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INCOME">Receita</SelectItem>
                <SelectItem value="EXPENSE">Despesa</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
          </div>

          {/* Valor */}
          <div className="space-y-2">
            <Label htmlFor="amount">Valor *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              className={errors.amount ? 'border-red-500' : ''}
            />
            {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
            {formData.amount && (
              <p className="text-sm text-gray-500">
                Valor formatado: {formatCurrency(parseFloat(formData.amount) || 0)}
              </p>
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Input
              id="description"
              placeholder="Descrição da transação"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          {/* Data */}
          <div className="space-y-2">
            <Label htmlFor="date">Data *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className={errors.date ? 'border-red-500' : ''}
            />
            {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <Label htmlFor="categoryId">Categoria *</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => handleInputChange('categoryId', value)}
            >
              <SelectTrigger className={errors.categoryId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId}</p>}
          </div>

          {/* Método de Pagamento */}
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Método de Pagamento</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) => handleInputChange('paymentMethod', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o método de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                <SelectItem value="PIX">PIX</SelectItem>
                <SelectItem value="Transferência">Transferência Bancária</SelectItem>
                <SelectItem value="Cheque">Cheque</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              placeholder="Observações adicionais (opcional)"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>

          {/* URL do Comprovante */}
          <div className="space-y-2">
            <Label htmlFor="receiptUrl">URL do Comprovante</Label>
            <Input
              id="receiptUrl"
              type="url"
              placeholder="https://exemplo.com/comprovante.pdf"
              value={formData.receiptUrl}
              onChange={(e) => handleInputChange('receiptUrl', e.target.value)}
            />
          </div>

          {/* Botões */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Salvando...' : (transaction ? 'Atualizar' : 'Criar')}
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};