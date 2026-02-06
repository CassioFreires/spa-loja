import { useState, useEffect, useCallback } from 'react';
import { getFeaturedProducts, createFeaturedProduct, deleteFeaturedProduct } from '../services/Featured Products/featured_products';
import { getProducts } from '../services/Products/products';
import toast from 'react-hot-toast';

export function useFeaturedProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [featured, setFeatured] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [allProdsRes, featuredProds] = await Promise.all([
                getProducts(),
                getFeaturedProducts()
            ]);

            // CORREÇÃO: Verifica se a resposta de produtos está dentro de .data (paginação)
            const productsList = allProdsRes?.data || (Array.isArray(allProdsRes) ? allProdsRes : []);
            
            setProducts(productsList);
            setFeatured(Array.isArray(featuredProds) ? featuredProds : []);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao carregar dados.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const addFeatured = async (productId: string, discount: number) => {
        try {
            await createFeaturedProduct({
                product_id: Number(productId),
                discount_percentage: discount,
                sort_order: featured.length + 1
            });
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
            toast.success("Removido!");
            await loadData();
        } catch (error) {
            toast.error("Erro ao remover");
        }
    };

    return { products, featured, loading, addFeatured, removeFeatured };
}