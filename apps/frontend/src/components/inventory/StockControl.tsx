import React, { useState } from 'react';
import { useProducts } from '../../context/inventory/hooks/useProducts';
import { Product } from '../../context/models/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { AlertTriangle, TrendingUp, TrendingDown, Package, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface StockControlProps {
  onStockAdjustment?: (product: Product) => void;
}

export const StockControl: React.FC<StockControlProps> = ({ onStockAdjustment }) => {
  const { products, getLowStockProducts } = useProducts();
  const [viewMode, setViewMode] = useState<'overview' | 'low-stock' | 'all'>('overview');

  const lowStockProducts = getLowStockProducts();
  const outOfStockProducts = products.filter(p => p.currentStock <= 0);
  const wellStockedProducts = products.filter(p => p.currentStock > p.minStock);

  const getStockLevel = (product: Product) => {
    if (product.currentStock <= 0) return 0;
    if (product.maxStock && product.maxStock > 0) {
      return Math.min((product.currentStock / product.maxStock) * 100, 100);
    }
    return Math.min((product.currentStock / product.minStock) * 100, 100);
  };

  const getStockStatus = (product: Product) => {
    if (product.currentStock <= 0) {
      return {
        status: 'out',
        label: 'Sem estoque',
        color: 'bg-red-500',
        icon: AlertCircle,
        variant: 'destructive' as const
      };
    }
    if (product.currentStock <= product.minStock) {
      return {
        status: 'low',
        label: 'Estoque baixo',
        color: 'bg-yellow-500',
        icon: AlertTriangle,
        variant: 'secondary' as const
      };
    }
    return {
      status: 'good',
      label: 'Estoque OK',
      color: 'bg-green-500',
      icon: CheckCircle,
      variant: 'default' as const
    };
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total de Produtos</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Estoque OK</p>
                <p className="text-2xl font-bold">{wellStockedProducts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Estoque Baixo</p>
                <p className="text-2xl font-bold">{lowStockProducts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Sem Estoque</p>
                <p className="text-2xl font-bold">{outOfStockProducts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Produtos com estoque baixo */}
      {lowStockProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Produtos com Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockProducts.slice(0, 5).map((product) => {
                const stockLevel = getStockLevel(product);
                const status = getStockStatus(product);
                const Icon = status.icon;

                return (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{product.name}</span>
                        <Badge variant={status.variant} className="text-xs">
                          {status.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Atual: {product.currentStock} {product.unitOfMeasure}</span>
                        <span>Mínimo: {product.minStock} {product.unitOfMeasure}</span>
                      </div>
                      <Progress value={stockLevel} className="mt-2 h-2" />
                    </div>
                    {onStockAdjustment && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onStockAdjustment(product)}
                        className="ml-4"
                      >
                        Ajustar
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Produtos sem estoque */}
      {outOfStockProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Produtos sem Estoque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {outOfStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg border-red-200 bg-red-50">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="font-medium">{product.name}</span>
                    <Badge variant="destructive">Sem estoque</Badge>
                  </div>
                  {onStockAdjustment && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onStockAdjustment(product)}
                    >
                      Repor Estoque
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderLowStock = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Produtos com Estoque Baixo</h2>
        <Badge variant="secondary">{lowStockProducts.length} produtos</Badge>
      </div>

      {lowStockProducts.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p>Todos os produtos estão com estoque adequado!</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {lowStockProducts.map((product) => {
            const stockLevel = getStockLevel(product);
            const status = getStockStatus(product);
            const Icon = status.icon;

            return (
              <Card key={product.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-4 w-4" />
                        <span className="font-medium">{product.name}</span>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
                        <div>
                          <span className="font-medium">Atual:</span> {product.currentStock} {product.unitOfMeasure}
                        </div>
                        <div>
                          <span className="font-medium">Mínimo:</span> {product.minStock} {product.unitOfMeasure}
                        </div>
                        <div>
                          <span className="font-medium">Categoria:</span> {product.category?.name || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">SKU:</span> {product.sku || 'N/A'}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Nível de Estoque</span>
                          <span>{Math.round(stockLevel)}%</span>
                        </div>
                        <Progress value={stockLevel} className="h-2" />
                      </div>
                    </div>
                    {onStockAdjustment && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onStockAdjustment(product)}
                        className="ml-4"
                      >
                        Ajustar Estoque
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderAllProducts = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Todos os Produtos</h2>
        <Badge variant="outline">{products.length} produtos</Badge>
      </div>

      <div className="grid gap-4">
        {products.map((product) => {
          const stockLevel = getStockLevel(product);
          const status = getStockStatus(product);
          const Icon = status.icon;

          return (
            <Card key={product.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{product.name}</span>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
                      <div>
                        <span className="font-medium">Atual:</span> {product.currentStock} {product.unitOfMeasure}
                      </div>
                      <div>
                        <span className="font-medium">Mínimo:</span> {product.minStock} {product.unitOfMeasure}
                      </div>
                      <div>
                        <span className="font-medium">Categoria:</span> {product.category?.name || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">SKU:</span> {product.sku || 'N/A'}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Nível de Estoque</span>
                        <span>{Math.round(stockLevel)}%</span>
                      </div>
                      <Progress value={stockLevel} className="h-2" />
                    </div>
                  </div>
                  {onStockAdjustment && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onStockAdjustment(product)}
                      className="ml-4"
                    >
                      Ajustar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Navegação por abas */}
      <div className="flex space-x-2">
        <Button
          variant={viewMode === 'overview' ? 'default' : 'outline'}
          onClick={() => setViewMode('overview')}
        >
          Visão Geral
        </Button>
        <Button
          variant={viewMode === 'low-stock' ? 'default' : 'outline'}
          onClick={() => setViewMode('low-stock')}
        >
          Estoque Baixo ({lowStockProducts.length})
        </Button>
        <Button
          variant={viewMode === 'all' ? 'default' : 'outline'}
          onClick={() => setViewMode('all')}
        >
          Todos os Produtos
        </Button>
      </div>

      {/* Conteúdo baseado na aba selecionada */}
      {viewMode === 'overview' && renderOverview()}
      {viewMode === 'low-stock' && renderLowStock()}
      {viewMode === 'all' && renderAllProducts()}
    </div>
  );
};