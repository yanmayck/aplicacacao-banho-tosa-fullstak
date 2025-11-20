import { useCallback } from 'react';
import { useInventory } from '../InventoryContext';
import { Product, ProductFilters } from '../../models/types';

export const useProducts = () => {
  const { state, fetchProducts, createProduct, updateProduct, deleteProduct, updateProductStock } = useInventory();

  const products = state.products;
  const loading = state.loading.products;
  const error = state.error.products;

  const getProduct = useCallback((id: string) => {
    return products.find(product => product.id === id);
  }, [products]);

  const getProductsByCategory = useCallback((categoryId: string) => {
    return products.filter(product => product.categoryId === categoryId);
  }, [products]);

  const getLowStockProducts = useCallback(() => {
    return products.filter(product => product.currentStock <= product.minStock);
  }, [products]);

  const searchProducts = useCallback((searchTerm: string) => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products]);

  const refreshProducts = useCallback((filters?: ProductFilters) => {
    return fetchProducts(filters);
  }, [fetchProducts]);

  const addProduct = useCallback(async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await createProduct(productData);
  }, [createProduct]);

  const editProduct = useCallback(async (id: string, productData: Partial<Product>) => {
    return await updateProduct(id, productData);
  }, [updateProduct]);

  const removeProduct = useCallback(async (id: string) => {
    return await deleteProduct(id);
  }, [deleteProduct]);

  const adjustStock = useCallback(async (id: string, quantity: number) => {
    return await updateProductStock(id, quantity);
  }, [updateProductStock]);

  return {
    // Estado
    products,
    loading,
    error,

    // Ações
    getProduct,
    getProductsByCategory,
    getLowStockProducts,
    searchProducts,
    refreshProducts,
    addProduct,
    editProduct,
    removeProduct,
    adjustStock,
  };
};