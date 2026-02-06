import { useQuery } from '@tanstack/react-query';
import { getImportedAccessories } from '../services/Products/products';

export function useAccessories() {
  return useQuery({
    queryKey: ['imported-accessories'],
    queryFn: getImportedAccessories,
    staleTime: 1000 * 60 * 30, // 30 minutos de cache
  });
}