import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Captura o token atualizado para cada chamada
const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
});


export async function getFeaturedProducts(limit?: number) {
    const result = await axiosInstance.get('/featured-product', {
        params: { limit }
    });
    return result.data;
}



export async function createFeaturedProduct(data: { 
    product_id: number; 
    discount_percentage: number; 
    sort_order?: number 
}) {
    const result = await axiosInstance.post('/featured-product', data, getHeaders());
    return result.data;
}

export async function deleteFeaturedProduct(id: number) {
    await axiosInstance.delete(`/featured-product/${id}`, getHeaders());
}