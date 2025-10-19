import { useCallback } from 'react';
import { useInventory } from '../InventoryContext';
import { StockMovement, StockMovementFilters } from '../../models/types';

export const useStockMovements = () => {
  const { state, fetchMovements, createMovement } = useInventory();

  const movements = state.movements;
  const loading = state.loading.movements;
  const error = state.error.movements;

  const getMovement = useCallback((id: string) => {
    return movements.find(movement => movement.id === id);
  }, [movements]);

  const getMovementsByProduct = useCallback((productId: string) => {
    return movements.filter(movement => movement.productId === productId);
  }, [movements]);

  const getMovementsByType = useCallback((type: string) => {
    return movements.filter(movement => movement.type === type);
  }, [movements]);

  const getRecentMovements = useCallback((limit: number = 10) => {
    return movements.slice(0, limit);
  }, [movements]);

  const refreshMovements = useCallback((filters?: StockMovementFilters) => {
    return fetchMovements(filters);
  }, [fetchMovements]);

  const addMovement = useCallback(async (movementData: Omit<StockMovement, 'id' | 'createdAt'>) => {
    return await createMovement(movementData);
  }, [createMovement]);

  return {
    // Estado
    movements,
    loading,
    error,

    // Ações
    getMovement,
    getMovementsByProduct,
    getMovementsByType,
    getRecentMovements,
    refreshMovements,
    addMovement,
  };
};