import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// --- CRIAR NOVO PEDIDO ---
interface OrderItemPayload {
    product_id: number;
    variation_id?: number | null;
    quantity: number;
}

interface CreateOrderPayload {
    address_id: number;
    items: OrderItemPayload[];
}

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

export const getMyOrders = async () => {
    const token = localStorage.getItem('authToken'); // Pega o token atualizado
    const response = await axiosInstance.get('/orders/my-orders', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const createOrder = async (orderData: CreateOrderPayload) => {
    const token = localStorage.getItem('authToken'); // Pega o token atualizado
    const response = await axiosInstance.post('/orders', orderData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};