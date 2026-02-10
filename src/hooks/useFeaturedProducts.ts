import { useState, useEffect, useCallback, useMemo } from 'react';
import { getFeaturedProducts, createFeaturedProduct, deleteFeaturedProduct } from '../services/Featured Products/featured_products';
import { getProducts } from '../services/Products/products';
import toast from 'react-hot-toast';

export function useFeaturedProducts(limit?: number) {
    const [allProducts, setAllProducts] = useState<any[]>([]); // Lista total
    const [featured, setFeatured] = useState<any[]>([]);       // Lista da vitrine
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [allProdsRes, featuredProds] = await Promise.all([
                getProducts(undefined, false, 1, { limit: 1000 }),
                getFeaturedProducts(limit)
            ]);

            const productsList = allProdsRes?.products || [];
            const featuredList = Array.isArray(featuredProds) ? featuredProds : [];

            setAllProducts(productsList);
            setFeatured(featuredList);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao carregar dados da vitrine.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    /**
     * LÓGICA DE FILTRO: 
     * Retorna apenas produtos que NÃO possuem seu ID na lista de 'featured'
     */
    const availableProducts = useMemo(() => {
        const featuredIds = featured.map(f => f.product_id);
        return allProducts.filter(p => !featuredIds.includes(p.id));
    }, [allProducts, featured]);

    const addFeatured = async (productId: string, discount: number) => {
        try {
            await createFeaturedProduct({
                product_id: Number(productId),
                discount_percentage: discount,
                sort_order: featured.length + 1
            });
            toast.success("Oferta ativada!");
            await loadData();
            return true;
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Erro ao adicionar");
            return false;
        }
    };

    const removeFeatured = async (id: number) => {
        try {
            await deleteFeaturedProduct(id);
            toast.success("Removido da vitrine");
            await loadData();
        } catch (error) {
            toast.error("Erro ao remover");
        }
    };

    return {
        products: availableProducts, // Enviamos apenas os filtrados para o componente
        featured,
        loading,
        addFeatured,
        removeFeatured
    };
}