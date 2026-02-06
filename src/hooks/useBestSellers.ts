import { useQuery } from '@tanstack/react-query';
import { getBestSellers } from '../services/Products/products';

export function useBestSellers(limit: number = 4) {
  return useQuery({
    queryKey: ['best-sellers', limit],
    queryFn: () => getBestSellers(limit),
    staleTime: 1000 * 60 * 15, // Cache por 15 minutos
  });
}