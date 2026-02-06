import { useQuery } from '@tanstack/react-query';
import { getFootwear } from '../../services/Products/products';

export function useFootwear() {
  return useQuery({
    queryKey: ['footwear-collection'],
    queryFn: getFootwear,
    staleTime: 1000 * 60 * 30, // 30 minutos de cache
  });
}