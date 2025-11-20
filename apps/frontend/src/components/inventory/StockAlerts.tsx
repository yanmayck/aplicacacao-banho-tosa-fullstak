import React from 'react';
import { useProducts } from '../../context/inventory/hooks/useProducts';
import { Product } from '../../context/models/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { AlertTriangle, AlertCircle, Package, TrendingDown, Bell, BellOff } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface StockAlertsProps {
  onViewProduct?: (product: Product) => void;
  onStockAdjustment?: (product: Product) => void;
  compact?: boolean;
  maxAlerts?: number;
}

export const StockAlerts: React.FC<StockAlertsProps> = ({
  onViewProduct,
  onStockAdjustment,
  compact = false,
  maxAlerts = 5,
}) => {
  const { products, getLowStockProducts } = useProducts();

  const lowStockProducts = getLowStockProducts();
  const outOfStockProducts = products.filter(p => p.currentStock <= 0);
  const criticalProducts = products.filter(p => p.currentStock <= 0);

  const getStockStatus = (product: Product) => {
    if (product.currentStock <= 0) {
      return {
        level: 'critical',
        label: 'SEM ESTOQUE',
        variant: 'destructive' as const,
        icon: AlertCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-50 border-red-200'
      };
    }
    if (product.currentStock <= product.minStock * 0.5) {
      return {
        level: 'very-low',
        label: 'MUITO BAIXO',
        variant: 'destructive' as const,
        icon: AlertTriangle,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50 border-orange-200'
      };
    }
    if (product.currentStock <= product.minStock) {
      return {
        level: 'low',
        label: 'BAIXO',
        variant: 'secondary' as const,
        icon: TrendingDown,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 border-yellow-200'
      };
    }
    return null;
  };

  const getAlertMessage = (product: Product) => {
    const status = getStockStatus(product);
    if (!status) return '';

    const shortage = product.minStock - product.currentStock;
    return `${product.name} - Faltam ${shortage} ${product.unitOfMeasure} para atingir o estoque mínimo`;
  };

  const getAlertIcon = (product: Product) => {
    const status = getStockStatus(product);
    if (status) {
      const Icon = status.icon;
      return <Icon className={`h-4 w-4 ${status.color}`} />;
    }
    return null;
  };

  // Se não há alertas, retorna null ou componente vazio
  if (lowStockProducts.length === 0 && outOfStockProducts.length === 0) {
    return compact ? null : (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center text-muted-foreground">
            <BellOff className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="font-medium text-green-600">Tudo em ordem!</p>
            <p className="text-sm">Todos os produtos estão com estoque adequado.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className="space-y-2">
        {[...outOfStockProducts, ...lowStockProducts]
          .slice(0, maxAlerts)
          .map((product) => {
            const status = getStockStatus(product);
            if (!status) return null;

            return (
              <div
                key={product.id}
                className={`flex items-center justify-between p-2 rounded-lg border ${status.bgColor}`}
              >
                <div className="flex items-center gap-2">
                  {getAlertIcon(product)}
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.currentStock} {product.unitOfMeasure} restantes
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant={status.variant} className="text-xs">
                    {status.label}
                  </Badge>
                  {onStockAdjustment && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onStockAdjustment(product)}
                      className="h-6 px-2 text-xs"
                    >
                      Ajustar
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-orange-500" />
          Alertas de Estoque ({lowStockProducts.length + outOfStockProducts.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Produtos sem estoque (críticos) */}
        {outOfStockProducts.length > 0 && (
          <div>
            <h3 className="font-semibold text-red-600 mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Produtos sem Estoque ({outOfStockProducts.length})
            </h3>
            <div className="space-y-2">
              {outOfStockProducts.map((product) => (
                <Alert key={product.id} variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{product.name}</span>
                      <span className="text-sm ml-2">
                        Estoque mínimo: {product.minStock} {product.unitOfMeasure}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">SEM ESTOQUE</Badge>
                      {onStockAdjustment && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onStockAdjustment(product)}
                        >
                          Repor Estoque
                        </Button>
                      )}
                      {onViewProduct && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewProduct(product)}
                        >
                          Ver Produto
                        </Button>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {/* Produtos com estoque baixo */}
        {lowStockProducts.length > 0 && (
          <div>
            <h3 className="font-semibold text-yellow-600 mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Produtos com Estoque Baixo ({lowStockProducts.length})
            </h3>
            <div className="space-y-2">
              {lowStockProducts.map((product) => {
                const status = getStockStatus(product);
                if (!status) return null;

                return (
                  <Alert key={product.id}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{product.name}</span>
                        <span className="text-sm ml-2">
                          Atual: {product.currentStock} {product.unitOfMeasure} | Mínimo: {product.minStock} {product.unitOfMeasure}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={status.variant}>{status.label}</Badge>
                        {onStockAdjustment && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onStockAdjustment(product)}
                          >
                            Ajustar Estoque
                          </Button>
                        )}
                        {onViewProduct && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewProduct(product)}
                          >
                            Ver Produto
                          </Button>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                );
              })}
            </div>
          </div>
        )}

        {/* Resumo geral */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-600">{outOfStockProducts.length}</div>
              <div className="text-sm text-muted-foreground">Sem Estoque</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{lowStockProducts.length}</div>
              <div className="text-sm text-muted-foreground">Estoque Baixo</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {products.filter(p => p.currentStock > p.minStock).length}
              </div>
              <div className="text-sm text-muted-foreground">Estoque OK</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};