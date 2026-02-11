import axiosInstance from '../api';

export const getProducts = async (
    targetId?: string | number,
    isSubcategory: boolean = false,
    page: number = 1,
    filters?: any
): Promise<any> => {
    try {
        const params = {
            page,
            limit: filters?.limit || 12,
            active: 'true',
            ...filters
        };

        if (params.brand_id) {
            delete params.subcategory_id;
            delete params.category_id;
        } else if (targetId) {
            if (isSubcategory) params.subcategory_id = targetId;
            else params.category_id = targetId;
        }

        const response = await axiosInstance.get('/products', { params });
        
        // PADRONIZAÇÃO DO RETORNO:
        // Sempre retorna um objeto com a lista e metadados
        const data = response.data;
        return {
            products: data.data || [],
            pagination: data.pagination || null,
            categoryName: data.data?.[0]?.category_name || ''
        };
    } catch (error: any) {
        return { products: [], pagination: null };
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
