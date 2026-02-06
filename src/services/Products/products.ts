import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

export const getProducts = async (
    targetId?: string | number,
    isSubcategory: boolean = false,
    page: number = 1,
    filters?: any
): Promise<any> => {
    try {
        const params: any = {
            page,
            limit: 12,
            active: 'true',
            ...filters
        };

        // AJUSTE AQUI: Se o usuário selecionou uma marca, 
        // priorizamos a marca e removemos o filtro restrito de subcategoria
        if (params.brand_id) {
            delete params.subcategory_id;
            delete params.category_id;
        } else if (targetId) {
            // Se não tem marca selecionada, mantém a navegação normal por ID
            if (isSubcategory) params.subcategory_id = targetId;
            else params.category_id = targetId;
        }

        // Limpeza de campos vazios
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v !== '' && v != null)
        );

        const response = await axiosInstance.get('/products', { params: cleanParams });
        const products = response.data.data || [];

        return {
            products,
            pagination: response.data.pagination,
            categoryName: products[0]?.brand_name || products[0]?.category_name || products[0]?.subcategory_name
        };
    } catch (error: any) {
        if (error.response?.status === 404) return { products: [], pagination: null, categoryName: '' };
        throw error;
    }
};

// Busca os tipos de variações (Tamanho, Cor, Numeração)
export const getVariationTypes = async () => {
    const response = await axiosInstance.get('/variation-types'); // Crie este endpoint no Nest
    return response.data;
};

// Busca as opções de um tipo (P, M, G ou 40, 41...)
export const getVariantOptions = async () => {
    const response = await axiosInstance.get('/variants-options'); // Crie este endpoint no Nest
    return response.data;
};

export const createProduct = async (data: FormData) => {
    console.log(data)
    const response = await axiosInstance.post('/products', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const createProductVariation = async (data: any) => {
    const response = await axiosInstance.post('/product-variations', data);
    return response.data;
};

export const getImportedAccessories = async (): Promise<any[]> => {
    try {
        const response = await axiosInstance.get('/products/category/accessories');
        return response.data; // Retorna o array de produtos com variações
    } catch (error: any) {
        if (error.response?.status === 404) return [];
        throw error;
    }
};

export const getBestSellers = async (limit: number = 4): Promise<any[]> => {
    try {
        const response = await axiosInstance.get('/products/best-sellers', {
            params: { limit }
        });
        return response.data; // Retorna array de produtos com variações
    } catch (error: any) {
        if (error.response?.status === 404) return [];
        throw error;
    }
};

export const getFootwear = async (): Promise<any[]> => {
    try {
        const response = await axiosInstance.get('/products/category/footwear');
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 404) return [];
        throw error;
    }
};

export default axiosInstance;