import axiosInstance from '../api';

/* =========================
   Tipagens
========================= */
export interface ProductFilters {
    product_type?: 'Time' | 'Casual' | 'Acessório';
    region?: 'Nacional' | 'Internacional';
    category_id?: number | string;
    subcategory_id?: number | string;
    brand_id?: number | string;
    team_id?: number | string;
    active?: string | boolean;
    limit?: number;
    page?: number;
    sort?: string;
}

/**
 * SOBRECARGA DE FUNÇÕES:
 * Mantém compatibilidade com chamadas antigas e permite o novo formato de objeto.
 */
export async function getProducts(filters: ProductFilters): Promise<any>;

export async function getProducts(
    targetId?: string | number,
    isSubcategory?: boolean,
    page?: number,
    filters?: any
): Promise<any>;

// Implementação Unificada
export async function getProducts(
    arg1?: string | number | ProductFilters,
    isSubcategory: boolean = false,
    page: number = 1,
    extraFilters?: any
): Promise<any> {
    try {
        let params: any = {};

        // Verificação: O primeiro argumento é o novo objeto de filtros?
        if (typeof arg1 === 'object' && arg1 !== null && !Array.isArray(arg1)) {
            params = {
                page: arg1.page || 1,
                limit: arg1.limit || 12,
                active: 'true',
                ...arg1
            };
        }
        // Caso contrário, trata como a lógica antiga (compatibilidade)
        else {
            params = {
                page,
                limit: extraFilters?.limit || 12,
                active: 'true',
                ...extraFilters
            };

            const targetId = arg1;
            if (params.brand_id) {
                delete params.subcategory_id;
                delete params.category_id;
            } else if (targetId) {
                if (isSubcategory) params.subcategory_id = targetId;
                else params.category_id = targetId;
            }
        }

        const response = await axiosInstance.get('/products', { params });
        const data = response.data;

        return {
            products: data.data || [],
            pagination: data.pagination || null,
            categoryName: data.data?.[0]?.category_name || ''
        };
    } catch (error: any) {
        return { products: [], pagination: null };
    }
}

/* =========================
   Demais Serviços
========================= */

export const getVariationTypes = async () => {
    const response = await axiosInstance.get('/variation-types');
    return response.data;
};

export const getVariantOptions = async () => {
    const response = await axiosInstance.get('/variants-options');
    return response.data;
};

export const findOneWithVariations = async (id: number): Promise<any> => {
    const response = await axiosInstance.get(`/products/${id}/details`);
    return response.data;
};

// Se precisar atualizar o produto principal
export const updateProduct = async (id: number, data: any) => {
    const response = await axiosInstance.patch(`/products/${id}`, data);
    return response.data;
};

// Se precisar atualizar a variação específica
export const updateProductVariation = async (vId: number, data: any) => {
    const response = await axiosInstance.patch(`/product-variations/${vId}`, data);
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
        return response.data;
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
        return response.data;
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