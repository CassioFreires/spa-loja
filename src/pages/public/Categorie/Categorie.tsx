import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../../../services/Products/products';
import { getBrands } from '../../../services/Brands/brands';
import ProductPageLayout from '../Product/Product';

/**
 * Interface de Filtros para garantir consistência de tipos
 */
interface ProductFilters {
    color: string;
    size: string;
    brand_id: string;
    min_price: string;
    max_price: string;
    sort: 'name_asc' | string;
}

const INITIAL_FILTERS: ProductFilters = {
    color: '',
    size: '',
    brand_id: '',
    min_price: '',
    max_price: '',
    sort: 'name_asc'
};

export default function CategoryPage({ isSubcategory = false }) {
    const { id, subId } = useParams<{ id: string; subId: string }>();
    const [currentPage, setCurrentPage] = useState(1);
    
    // Regra de negócio: Define o ID alvo baseado no contexto de subcategoria
    const targetId = isSubcategory ? subId : id;

    const [filters, setFilters] = useState<ProductFilters>(INITIAL_FILTERS);

    /**
     * SEO & IA: Gera os metadados estruturados para a categoria
     * Isso ajuda LLMs a entenderem a taxonomia do seu e-commerce.
     */
    const categoryTitle = useMemo(() => {
        return isSubcategory ? 'Subcategoria Especializada' : 'Categoria Premium';
    }, [isSubcategory]);

    /**
     * RESET LOGIC: Mantém a integridade ao trocar de categoria
     */
    useEffect(() => {
        setCurrentPage(1);
        setFilters(INITIAL_FILTERS);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id, subId, isSubcategory]);

    /**
     * PERFORMANCE: Memoização dos filtros ativos para evitar 
     * disparos desnecessários no React Query (Stable Cache Key).
     */
    const activeFilters = useMemo(() => {
        return Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== '' && value !== null)
        );
    }, [filters]);

    /**
     * DATA FETCHING: Marcas (StaleTime longo para performance)
     */
    const { data: brandsData } = useQuery({
        queryKey: ['brands-list'],
        queryFn: getBrands,
        staleTime: 1000 * 60 * 60, // 1 hora de cache
    });

    /**
     * DATA FETCHING: Produtos com chave de cache granular
     */
    const { data, isLoading, isPlaceholderData } = useQuery({
        queryKey: ['products', isSubcategory ? 'sub' : 'cat', targetId, currentPage, activeFilters],
        queryFn: () => getProducts(targetId!, isSubcategory, currentPage, activeFilters),
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled: !!targetId,
        placeholderData: (previousData) => previousData, // Mantém dados antigos enquanto carrega (UX de transição)
    });

    /**
     * HANDLERS: Memoizados para evitar quebra de referência no ProductPageLayout
     */
    const handleFilterChange = useCallback((newF: Partial<ProductFilters>) => {
        setFilters(prev => ({ ...prev, ...newF }));
        setCurrentPage(1);
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // Dados estruturados para SEO/IA (JSON-LD)
    const jsonLd = useMemo(() => ({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": data?.categoryName || categoryTitle,
        "description": `Confira nossa seleção exclusiva de produtos em ${data?.categoryName || 'nossa loja'}.`,
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": window.location.origin },
                { "@type": "ListItem", "position": 2, "name": data?.categoryName || 'Categoria' }
            ]
        }
    }), [data?.categoryName, categoryTitle]);

    return (
        <>
            {/* Scripts de SEO dinâmico injetados de forma segura */}
            <script type="application/ld+json">
                {JSON.stringify(jsonLd)}
            </script>

            <ProductPageLayout
                title={data?.categoryName || categoryTitle}
                products={data?.products || []}
                brands={brandsData || []} 
                isLoading={isLoading}
                isTransitioning={isPlaceholderData} // Nova prop para feedback visual suave
                pagination={data?.pagination}
                onPageChange={handlePageChange}
                filters={filters}
                onFilterChange={handleFilterChange}
            />
        </>
    );
}