import React, { useState, useEffect } from 'react';
import { useProducts } from '../../context/inventory/hooks/useProducts';
import { Product } from '../../context/models/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { AlertTriangle, Package, Search, Plus } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface ProductListProps {
  onEditProduct?: (product: Product) => void;
  onAddProduct?: () => void;
  onStockAdjustment?: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  onEditProduct,
  onAddProduct,
  onStockAdjustment,
}) => {
  const { products, loading, error, refreshProducts, getLowStockProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (product: Product) => {
    if (product.currentStock <= 0) {
      return { status: 'out', label: 'Sem estoque', variant: 'destructive' as const };
    }
    if (product.currentStock <= product.minStock) {
      return { status: 'low', label: 'Estoque baixo', variant: 'secondary' as const };
    }
    return { status: 'ok', label: 'Estoque OK', variant: 'default' as const };
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const lowStockProducts = getLowStockProducts();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Carregando produtos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Erro ao carregar produtos: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Alertas de estoque baixo */}
      {lowStockProducts.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {lowStockProducts.length} produto(s) com estoque baixo ou zerado.
          </AlertDescription>
        </Alert>
      )}

      {/* Cabeçalho com filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Produtos ({filteredProducts.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              {onAddProduct && (
                <Button onClick={onAddProduct} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Produto
                </Button>
              )}
            </div>
          </div>

          {/* Filtros básicos */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Lista de produtos */}
      <div className="grid gap-4">
        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center p-8">
              <div className="text-center text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4" />
                <p>Nenhum produto encontrado</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product);
            return (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{product.name}</h3>
                        <Badge variant={stockStatus.variant}>
                          {stockStatus.label}
                        </Badge>
                        {product.sku && (
                          <Badge variant="outline">{product.sku}</Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Estoque:</span> {product.currentStock} {product.unitOfMeasure}
                        </div>
                        <div>
                          <span className="font-medium">Mínimo:</span> {product.minStock} {product.unitOfMeasure}
                        </div>
                        <div>
                          <span className="font-medium">Preço:</span> {formatCurrency(product.salePrice)}
                        </div>
                        <div>
                          <span className="font-medium">Categoria:</span> {product.category?.name || 'N/A'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {onStockAdjustment && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onStockAdjustment(product)}
                        >
                          Ajustar Estoque
                        </Button>
                      )}
                      {onEditProduct && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditProduct(product)}
                        >
                          Editar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};