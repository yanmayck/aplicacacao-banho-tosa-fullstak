// Interfaces para tratamento de erros de API
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: Record<string, unknown>;
}

// Interface para resposta de erro do Axios
export interface AxiosErrorResponse {
  message: string;
  response?: {
    data?: {
      message?: string;
      error?: string;
      details?: Record<string, unknown>;
    };
    status?: number;
  };
}

// Tipo union para erros de API
export type ApiErrorType = ApiError | AxiosErrorResponse | Error;

// Helper function para extrair mensagem de erro
export const getErrorMessage = (error: ApiErrorType): string => {
  if ('response' in error && error.response?.data?.message) {
    return error.response.data.message;
  }
  if ('message' in error) {
    return error.message;
  }
  return 'Erro desconhecido';
};

// Interface para filtros genéricos de API
export interface ApiFilters {
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
}

// Interface para resposta paginada
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}