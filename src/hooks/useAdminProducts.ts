import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/Products/products';

export function useAdminProducts(page: number, searchTerm: string) {
    const filters = { name: searchTerm || undefined };

    const query = useQuery({
        queryKey: ['admin-products', page, searchTerm],
        queryFn: () => getProducts(undefined, false, page, filters),
        staleTime: 1000 * 60 * 5, // 5 minutos de cache
    });

    const products = query.data?.products || [];
    
    const stats = {
        total: query.data?.pagination?.total || 0,
        lowStock: products.filter((p: any) => Number(p.stock) <= 5 && Number(p.stock) > 0).length,
        outOfStock: products.filter((p: any) => Number(p.stock) === 0).length,
    };

    return { ...query, products, stats, pagination: query.data?.pagination };
}