import React, { useState } from 'react';
import { InventoryProvider } from '../context/inventory/InventoryContext';
import { ProductList } from '../components/inventory/ProductList';
import { ProductForm } from '../components/inventory/ProductForm';
import { StockControl } from '../components/inventory/StockControl';
import { StockAlerts } from '../components/inventory/StockAlerts';
import { Product } from '../context/models/types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Package, AlertTriangle, BarChart3, Plus } from 'lucide-react';

const InventoryContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleSaveProduct = (product: Product) => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleCancelProduct = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleStockAdjustment = (product: Product) => {
    // Aqui você poderia abrir um modal específico para ajuste de estoque
    console.log('Ajustar estoque do produto:', product.name);
  };

  if (showProductForm) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={handleCancelProduct}
            className="mb-4"
          >
            ← Voltar para Inventário
          </Button>
        </div>
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={handleCancelProduct}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Estoque</h1>
          <p className="text-muted-foreground">
            Controle completo do seu inventário de produtos
          </p>
        </div>
      </div>

      {/* Alertas rápidos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StockAlerts
            compact={false}
            onViewProduct={handleEditProduct}
            onStockAdjustment={handleStockAdjustment}
          />
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleAddProduct}
                className="w-full"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Produto
              </Button>
              <Button
                variant="outline"
                onClick={() => setActiveTab('control')}
                className="w-full"
                size="sm"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Controle de Estoque
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs principais */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Produtos
          </TabsTrigger>
          <TabsTrigger value="control" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Controle Visual
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alertas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          <ProductList
            onEditProduct={handleEditProduct}
            onAddProduct={handleAddProduct}
            onStockAdjustment={handleStockAdjustment}
          />
        </TabsContent>

        <TabsContent value="control" className="space-y-6">
          <StockControl
            onStockAdjustment={handleStockAdjustment}
          />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <StockAlerts
            compact={false}
            onViewProduct={handleEditProduct}
            onStockAdjustment={handleStockAdjustment}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export const Inventory: React.FC = () => {
  return (
    <InventoryProvider>
      <InventoryContent />
    </InventoryProvider>
  );
};