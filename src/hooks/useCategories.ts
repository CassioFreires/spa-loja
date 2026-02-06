import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface CategoryWithCount {
  id: number;
  name: string;
  description: string;
  product_count: string | number;
}

export function useCategoriesWithCount() {
  return useQuery({
    queryKey: ['categories-with-count'],
    queryFn: async () => {
      const { data } = await axios.get<CategoryWithCount[]>(`${API_BASE_URL}/categories/with-count`);
      return data;
    },
    staleTime: 1000 * 60 * 10, // Cache por 10 minutos
  });
}