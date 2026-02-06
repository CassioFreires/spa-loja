import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../../../services/Products/products';
import { getBrands } from '../../../services/Brands/brands';
import ProductPageLayout from '../Product/Product';

export default function CategoryPage({ isSubcategory = false }) {
    const { id, subId } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const targetId = isSubcategory ? subId : id;

    const [filters, setFilters] = useState({
        color: '', size: '', brand_id: '', min_price: '', max_price: '', sort: 'name_asc'
    });

    const { data: brandsData } = useQuery({
        queryKey: ['brands-list'],
        queryFn: getBrands,
        staleTime: 1000 * 60 * 60,
    });

    useEffect(() => {
        setCurrentPage(1);
        setFilters({ color: '', size: '', brand_id: '', min_price: '', max_price: '', sort: 'name_asc' });
    }, [id, subId, isSubcategory]);

    const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '' && value !== null)
    );

    const { data, isLoading } = useQuery({
        queryKey: ['products', isSubcategory ? 'sub' : 'cat', targetId, currentPage, activeFilters],
        queryFn: () => getProducts(targetId, isSubcategory, currentPage, activeFilters),
        staleTime: 1000 * 60 * 5,
        enabled: !!targetId,
    });

    return (
        <ProductPageLayout
            title={data?.categoryName || (isSubcategory ? 'Subcategoria' : 'Categoria')}
            products={data?.products || []}
            brands={brandsData || []} 
            isLoading={isLoading}
            pagination={data?.pagination}
            onPageChange={setCurrentPage}
            filters={filters}
            onFilterChange={(newF: any) => { setFilters(prev => ({...prev, ...newF})); setCurrentPage(1); }}
        />
    );
}