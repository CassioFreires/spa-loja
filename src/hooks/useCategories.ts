import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import axiosInstance from '../services/api';

export interface CategoryWithCount {
  id: number;
  name: string;
  description: string;
  product_count: string | number;
}

/**
 * Hook para buscar categorias com a contagem de produtos
 */
export function useCategoriesWithCount() {
  return useQuery({
    queryKey: ['categories-with-count'],
    queryFn: async () => {
      try {
        // Não use API_BASE_URL aqui, o axiosInstance já tem a baseURL configurada
        const { data } = await axiosInstance.get<CategoryWithCount[]>('/categories/with-count');
        return data;
      } catch (error) {
        // Tratamento de erro padronizado
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message;
          throw new Error(Array.isArray(message) ? message.join(', ') : message || 'Erro ao carregar categorias');
        }
        throw new Error('Erro inesperado ao buscar categorias');
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutos de cache
    // Opcional: retry: false (para não ficar tentando em caso de 403/401)
  });
}