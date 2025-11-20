import { useCallback } from 'react';
import { useInventory } from '../InventoryContext';
import { ProductCategory } from '../../models/types';

export const useCategories = () => {
  const { state, fetchCategories, createCategory, updateCategory, deleteCategory } = useInventory();

  const categories = state.categories;
  const loading = state.loading.categories;
  const error = state.error.categories;

  const getCategory = useCallback((id: string) => {
    return categories.find(category => category.id === id);
  }, [categories]);

  const getActiveCategories = useCallback(() => {
    return categories.filter(category => category.isActive);
  }, [categories]);

  const refreshCategories = useCallback(() => {
    return fetchCategories();
  }, [fetchCategories]);

  const addCategory = useCallback(async (categoryData: Omit<ProductCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await createCategory(categoryData);
  }, [createCategory]);

  const editCategory = useCallback(async (id: string, categoryData: Partial<ProductCategory>) => {
    return await updateCategory(id, categoryData);
  }, [updateCategory]);

  const removeCategory = useCallback(async (id: string) => {
    return await deleteCategory(id);
  }, [deleteCategory]);

  return {
    // Estado
    categories,
    loading,
    error,

    // Ações
    getCategory,
    getActiveCategories,
    refreshCategories,
    addCategory,
    editCategory,
    removeCategory,
  };
};