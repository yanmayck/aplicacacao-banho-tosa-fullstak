import React, { useState, useEffect } from 'react';
import { useProducts } from '../../context/inventory/hooks/useProducts';
import { useCategories } from '../../context/inventory/hooks/useCategories';
import { Product, ProductType, UnitOfMeasure } from '../../context/models/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Save, X } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface ProductFormProps {
  product?: Product | null;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSave,
  onCancel,
}) => {
  const { addProduct, editProduct } = useProducts();
  const { categories } = useCategories();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    barcode: '',
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    purchasePrice: 0,
    salePrice: 0,
    type: 'OTHER' as ProductType,
    unitOfMeasure: 'UNIT' as UnitOfMeasure,
    brand: '',
    model: '',
    hasExpiration: false,
    expirationDate: '',
    categoryId: '',
    supplierId: '',
    isActive: true,
    isServiceItem: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados do produto para edição
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        sku: product.sku || '',
        barcode: product.barcode || '',
        currentStock: product.currentStock,
        minStock: product.minStock,
        maxStock: product.maxStock || 0,
        purchasePrice: product.purchasePrice,
        salePrice: product.salePrice,
        type: product.type,
        unitOfMeasure: product.unitOfMeasure,
        brand: product.brand || '',
        model: product.model || '',
        hasExpiration: product.hasExpiration,
        expirationDate: product.expirationDate?.split('T')[0] || '',
        categoryId: product.categoryId,
        supplierId: product.supplierId || '',
        isActive: product.isActive,
        isServiceItem: product.isServiceItem,
      });
    }
  }, [product]);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Nome do produto é obrigatório');
      return false;
    }
    if (formData.currentStock < 0) {
      setError('Estoque atual não pode ser negativo');
      return false;
    }
    if (formData.minStock < 0) {
      setError('Estoque mínimo não pode ser negativo');
      return false;
    }
    if (formData.purchasePrice < 0) {
      setError('Preço de compra não pode ser negativo');
      return false;
    }
    if (formData.salePrice < 0) {
      setError('Preço de venda não pode ser negativo');
      return false;
    }
    if (!formData.categoryId) {
      setError('Categoria é obrigatória');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let savedProduct: Product;

      if (product) {
        // Editar produto existente
        savedProduct = await editProduct(product.id, formData);
      } else {
        // Criar novo produto
        savedProduct = await addProduct(formData);
      }

      onSave(savedProduct);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar produto');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {product ? 'Editar Produto' : 'Novo Produto'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Informações básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Digite o nome do produto"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Digite a descrição do produto"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                placeholder="Código SKU"
              />
            </div>

            <div>
              <Label htmlFor="barcode">Código de Barras</Label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => handleInputChange('barcode', e.target.value)}
                placeholder="Código de barras"
              />
            </div>
          </div>

          {/* Controle de estoque */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Controle de Estoque</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="currentStock">Estoque Atual</Label>
                <Input
                  id="currentStock"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.currentStock}
                  onChange={(e) => handleInputChange('currentStock', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div>
                <Label htmlFor="minStock">Estoque Mínimo</Label>
                <Input
                  id="minStock"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.minStock}
                  onChange={(e) => handleInputChange('minStock', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div>
                <Label htmlFor="maxStock">Estoque Máximo</Label>
                <Input
                  id="maxStock"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.maxStock}
                  onChange={(e) => handleInputChange('maxStock', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          {/* Preços */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preços</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="purchasePrice">Preço de Compra (R$)</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.purchasePrice}
                  onChange={(e) => handleInputChange('purchasePrice', parseFloat(e.target.value) || 0)}
                />
                {formData.purchasePrice > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatCurrency(formData.purchasePrice)}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="salePrice">Preço de Venda (R$)</Label>
                <Input
                  id="salePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.salePrice}
                  onChange={(e) => handleInputChange('salePrice', parseFloat(e.target.value) || 0)}
                />
                {formData.salePrice > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatCurrency(formData.salePrice)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Características */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Características</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Categoria *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => handleInputChange('categoryId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type">Tipo de Produto</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SHAMPOO">Shampoo</SelectItem>
                    <SelectItem value="MEDICINE">Medicamento</SelectItem>
                    <SelectItem value="ACCESSORY">Acessório</SelectItem>
                    <SelectItem value="FOOD">Alimento</SelectItem>
                    <SelectItem value="HYGIENE">Higiene</SelectItem>
                    <SelectItem value="TOY">Brinquedo</SelectItem>
                    <SelectItem value="OTHER">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="unitOfMeasure">Unidade de Medida</Label>
                <Select
                  value={formData.unitOfMeasure}
                  onValueChange={(value) => handleInputChange('unitOfMeasure', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UNIT">Unidade</SelectItem>
                    <SelectItem value="KG">Quilograma</SelectItem>
                    <SelectItem value="G">Grama</SelectItem>
                    <SelectItem value="L">Litro</SelectItem>
                    <SelectItem value="ML">Mililitro</SelectItem>
                    <SelectItem value="PACK">Pacote</SelectItem>
                    <SelectItem value="BOX">Caixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="brand">Marca</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  placeholder="Marca do produto"
                />
              </div>

              <div>
                <Label htmlFor="model">Modelo</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  placeholder="Modelo do produto"
                />
              </div>

              <div>
                <Label htmlFor="expirationDate">Data de Validade</Label>
                <Input
                  id="expirationDate"
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                  disabled={!formData.hasExpiration}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="hasExpiration"
                checked={formData.hasExpiration}
                onCheckedChange={(checked) => handleInputChange('hasExpiration', checked)}
              />
              <Label htmlFor="hasExpiration">Produto com data de validade</Label>
            </div>
          </div>

          {/* Configurações */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configurações</h3>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange('isActive', checked)}
              />
              <Label htmlFor="isActive">Produto ativo</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isServiceItem"
                checked={formData.isServiceItem}
                onCheckedChange={(checked) => handleInputChange('isServiceItem', checked)}
              />
              <Label htmlFor="isServiceItem">Produto utilizado em serviços</Label>
            </div>
          </div>

          {/* Ações */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};