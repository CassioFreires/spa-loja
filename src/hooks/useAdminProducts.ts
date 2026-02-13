import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getProducts } from '../services/Products/products';

export function useAdminProducts(page: number, searchTerm: string) {
  const filters = { name: searchTerm || undefined };

  const query = useQuery({
    queryKey: ['admin-products', page, searchTerm],
    queryFn: () => getProducts(undefined, false, page, filters),
    staleTime: 1000 * 60 * 5,
  });

  // Cálculo de produtos e estatísticas em um único Memo para performance
  const processedData = useMemo(() => {
    const rawProducts = query.data?.products || [];
    
    let lowStockCount = 0;
    let outOfStockCount = 0;

    const normalizedProducts = rawProducts.map((p: any) => {
      const hasVariations = p.variations && p.variations.length > 0;
      const totalStock = hasVariations 
        ? p.variations.reduce((acc: number, v: any) => acc + Number(v.stock || 0), 0)
        : Number(p.stock || 0);

      // Contagem para os stats
      if (totalStock === 0) outOfStockCount++;
      else if (totalStock <= 5) lowStockCount++;

      return {
        ...p,
        stock: totalStock, // Dashboard usa p.stock
        displayStock: totalStock,
        hasVariations,
        stockStatus: totalStock === 0 ? 'out' : totalStock <= 5 ? 'low' : 'ok'
      };
    });

    return {
      products: normalizedProducts,
      stats: {
        total: query.data?.pagination?.total || normalizedProducts.length,
        lowStock: lowStockCount,
        outOfStock: outOfStockCount
      }
    };
  }, [query.data?.products, query.data?.pagination]);

  // Agora retornamos stats explicitamente
  return { 
    ...query, 
    products: processedData.products, 
    stats: processedData.stats, 
    pagination: query.data?.pagination 
  };
}