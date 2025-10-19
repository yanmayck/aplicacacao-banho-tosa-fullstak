import { useInventory as useInventoryContext } from '../InventoryContext';
import { useProducts } from './useProducts';
import { useCategories } from './useCategories';
import { useStockMovements } from './useStockMovements';

export const useInventory = () => {
  const context = useInventoryContext();
  const products = useProducts();
  const categories = useCategories();
  const movements = useStockMovements();

  return {
    // Estado geral
    loading: {
      products: products.loading,
      categories: categories.loading,
      movements: movements.loading,
    },
    error: {
      products: products.error,
      categories: categories.error,
      movements: movements.error,
    },

    // Hooks específicos
    products,
    categories,
    movements,

    // Utilitários gerais
    getInventorySummary: () => {
      const totalProducts = context.state.products.length;
      const lowStockProducts = context.getLowStockProducts().length;
      const totalCategories = context.state.categories.length;
      const recentMovements = context.state.movements.length;

      return {
        totalProducts,
        lowStockProducts,
        totalCategories,
        recentMovements,
      };
    },

    // Verificações rápidas
    hasLowStock: () => {
      return context.getLowStockProducts().length > 0;
    },

    isLoading: () => {
      return products.loading || categories.loading || movements.loading;
    },

    hasError: () => {
      return !!(products.error || categories.error || movements.error);
    },
  };
};