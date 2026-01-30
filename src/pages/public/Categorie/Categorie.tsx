import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../../../services/Products/products';
import { getBrands } from '../../../services/Brands/brands';
import ProductPageLayout from '../Product/Product';

export default function CategoryPage({ isSubcategory = false }) {
    const { id, subId } = useParams();
    const [currentPage, setCurrentPage] = useState(1);

    // O targetId vem da URL, mas precisamos garantir que ele seja tratado como string/número limpo
    const targetId = isSubcategory ? subId : id;

    const [filters, setFilters] = useState({
        color: '',
        size: '',
        brand_id: '',
        min_price: '',
        max_price: '',
        sort: 'name_asc'
    });

    const { data: brandsData } = useQuery({
        queryKey: ['brands-list'],
        queryFn: getBrands,
        staleTime: 1000 * 60 * 60,
    });

    // Resetar estados ao trocar de rota
    useEffect(() => {
        setCurrentPage(1);
        setFilters({
            color: '',
            size: '',
            brand_id: '',
            min_price: '',
            max_price: '',
            sort: 'name_asc'
        });
    }, [id, subId, isSubcategory]);

    // O SEGREDO: Criamos um objeto de filtros "limpo" para a queryKey e para a função
    // Isso remove chaves vazias que travam o seu backend
    const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '' && value !== null)
    );

    const queryKey = [
        'products', 
        isSubcategory ? 'subcategory' : 'category', 
        targetId, 
        currentPage, 
        activeFilters
    ];

    const { data, isLoading } = useQuery({
        queryKey,
        queryFn: () => getProducts(targetId, isSubcategory, currentPage, activeFilters),
        staleTime: 1000 * 60 * 5,
        placeholderData: (previousData) => previousData,
        enabled: !!targetId, // Só executa se houver um ID na URL
    });

    const handleFilterChange = (newFilters: any) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setCurrentPage(1);
    };

    return (
        <ProductPageLayout
            title={data?.categoryName || (isSubcategory ? 'Subcategoria' : 'Categoria')}
            products={data?.products || []}
            brands={brandsData || []} 
            isLoading={isLoading}
            pagination={data?.pagination}
            onPageChange={setCurrentPage}
            filters={filters}
            onFilterChange={handleFilterChange}
        />
    );
}