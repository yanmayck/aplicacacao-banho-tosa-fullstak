import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product, ProductCategory, StockMovement, ProductFilters, StockMovementFilters } from '../models/types';
import { api } from '../../lib/api';
import { ApiErrorType, getErrorMessage } from '../../types/api';

// Estado inicial
interface InventoryState {
  products: Product[];
  categories: ProductCategory[];
  movements: StockMovement[];
  loading: {
    products: boolean;
    categories: boolean;
    movements: boolean;
  };
  error: {
    products: string | null;
    categories: string | null;
    movements: string | null;
  };
}

// Ações possíveis
type InventoryAction =
  | { type: 'SET_LOADING'; payload: { section: keyof InventoryState['loading']; loading: boolean } }
  | { type: 'SET_ERROR'; payload: { section: keyof InventoryState['error']; error: string | null } }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_CATEGORIES'; payload: ProductCategory[] }
  | { type: 'SET_MOVEMENTS'; payload: StockMovement[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: ProductCategory }
  | { type: 'UPDATE_CATEGORY'; payload: ProductCategory }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'ADD_MOVEMENT'; payload: StockMovement };

// Reducer
const inventoryReducer = (state: InventoryState, action: InventoryAction): InventoryState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.section]: action.payload.loading,
        },
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: {
          ...state.error,
          [action.payload.section]: action.payload.error,
        },
      };

    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.payload,
        loading: { ...state.loading, products: false },
        error: { ...state.error, products: null },
      };

    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload,
        loading: { ...state.loading, categories: false },
        error: { ...state.error, categories: null },
      };

    case 'SET_MOVEMENTS':
      return {
        ...state,
        movements: action.payload,
        loading: { ...state.loading, movements: false },
        error: { ...state.error, movements: null },
      };

    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [...state.products, action.payload],
      };

    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id ? action.payload : product
        ),
      };

    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter((product) => product.id !== action.payload),
      };

    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };

    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map((category) =>
          category.id === action.payload.id ? action.payload : category
        ),
      };

    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter((category) => category.id !== action.payload),
      };

    case 'ADD_MOVEMENT':
      return {
        ...state,
        movements: [action.payload, ...state.movements],
      };

    default:
      return state;
  }
};

// Estado inicial
const initialState: InventoryState = {
  products: [],
  categories: [],
  movements: [],
  loading: {
    products: false,
    categories: false,
    movements: false,
  },
  error: {
    products: null,
    categories: null,
    movements: null,
  },
};

// Contexto
interface InventoryContextType {
  state: InventoryState;

  // Ações de produtos
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Product>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  updateProductStock: (id: string, quantity: number) => Promise<void>;

  // Ações de categorias
  fetchCategories: () => Promise<void>;
  createCategory: (category: Omit<ProductCategory, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ProductCategory>;
  updateCategory: (id: string, category: Partial<ProductCategory>) => Promise<ProductCategory>;
  deleteCategory: (id: string) => Promise<void>;

  // Ações de movimentações
  fetchMovements: (filters?: StockMovementFilters) => Promise<void>;
  createMovement: (movement: Omit<StockMovement, 'id' | 'createdAt'>) => Promise<StockMovement>;

  // Utilitários
  getLowStockProducts: () => Product[];
  getProductsByCategory: (categoryId: string) => Product[];
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

// Provider
interface InventoryProviderProps {
  children: ReactNode;
}

export const InventoryProvider: React.FC<InventoryProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(inventoryReducer, initialState);

  // Produtos
  const fetchProducts = async (filters?: ProductFilters) => {
    dispatch({ type: 'SET_LOADING', payload: { section: 'products', loading: true } });
    try {
      const queryParams = new URLSearchParams();

      if (filters?.search) queryParams.append('search', filters.search);
      if (filters?.categoryId) queryParams.append('categoryId', filters.categoryId);
      if (filters?.type) queryParams.append('type', filters.type);
      if (filters?.isActive !== undefined) queryParams.append('isActive', filters.isActive.toString());
      if (filters?.lowStock) queryParams.append('lowStock', 'true');

      if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters?.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

      const response = await api.get(`/products?${queryParams.toString()}`);
      dispatch({ type: 'SET_PRODUCTS', payload: response.data });
    } catch (error: unknown) {
      dispatch({
        type: 'SET_ERROR',
        payload: { section: 'products', error: getErrorMessage(error as ApiErrorType) || 'Erro ao carregar produtos' }
      });
    }
  };

  const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await api.post('/products', productData);
      const newProduct = response.data;
      dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
      return newProduct;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error as ApiErrorType) || 'Erro ao criar produto');
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const response = await api.patch(`/products/${id}`, productData);
      const updatedProduct = response.data;
      dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
      return updatedProduct;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error as ApiErrorType) || 'Erro ao atualizar produto');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error as ApiErrorType) || 'Erro ao excluir produto');
    }
  };

  const updateProductStock = async (id: string, quantity: number) => {
    try {
      await api.patch(`/products/${id}/stock`, { quantity });
      // Recarregar produtos para refletir o novo estoque
      await fetchProducts();
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error as ApiErrorType) || 'Erro ao atualizar estoque');
    }
  };

  // Categorias
  const fetchCategories = async () => {
    dispatch({ type: 'SET_LOADING', payload: { section: 'categories', loading: true } });
    try {
      const response = await api.get('/product-categories');
      dispatch({ type: 'SET_CATEGORIES', payload: response.data });
    } catch (error: unknown) {
      dispatch({
        type: 'SET_ERROR',
        payload: { section: 'categories', error: getErrorMessage(error as ApiErrorType) || 'Erro ao carregar categorias' }
      });
    }
  };

  const createCategory = async (categoryData: Omit<ProductCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await api.post('/product-categories', categoryData);
      const newCategory = response.data;
      dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
      return newCategory;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error as ApiErrorType) || 'Erro ao criar categoria');
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<ProductCategory>) => {
    try {
      const response = await api.patch(`/product-categories/${id}`, categoryData);
      const updatedCategory = response.data;
      dispatch({ type: 'UPDATE_CATEGORY', payload: updatedCategory });
      return updatedCategory;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error as ApiErrorType) || 'Erro ao atualizar categoria');
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await api.delete(`/product-categories/${id}`);
      dispatch({ type: 'DELETE_CATEGORY', payload: id });
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error as ApiErrorType) || 'Erro ao excluir categoria');
    }
  };

  // Movimentações
  const fetchMovements = async (filters?: StockMovementFilters) => {
    dispatch({ type: 'SET_LOADING', payload: { section: 'movements', loading: true } });
    try {
      const queryParams = new URLSearchParams();

      if (filters?.productId) queryParams.append('productId', filters.productId);
      if (filters?.type) queryParams.append('type', filters.type);
      if (filters?.startDate) queryParams.append('startDate', filters.startDate);
      if (filters?.endDate) queryParams.append('endDate', filters.endDate);

      if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters?.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

      const response = await api.get(`/stock-movements?${queryParams.toString()}`);
      dispatch({ type: 'SET_MOVEMENTS', payload: response.data });
    } catch (error: unknown) {
      dispatch({
        type: 'SET_ERROR',
        payload: { section: 'movements', error: getErrorMessage(error as ApiErrorType) || 'Erro ao carregar movimentações' }
      });
    }
  };

  const createMovement = async (movementData: Omit<StockMovement, 'id' | 'createdAt'>) => {
    try {
      const response = await api.post('/stock-movements', movementData);
      const newMovement = response.data;
      dispatch({ type: 'ADD_MOVEMENT', payload: newMovement });
      return newMovement;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error as ApiErrorType) || 'Erro ao criar movimentação');
    }
  };

  // Utilitários
  const getLowStockProducts = () => {
    return state.products.filter(product => product.currentStock <= product.minStock);
  };

  const getProductsByCategory = (categoryId: string) => {
    return state.products.filter(product => product.categoryId === categoryId);
  };

  // Carregar dados iniciais
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchMovements();
  }, []);

  const value: InventoryContextType = {
    state,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchMovements,
    createMovement,
    getLowStockProducts,
    getProductsByCategory,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

// Hook personalizado
export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};