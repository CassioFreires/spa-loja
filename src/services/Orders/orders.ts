import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * INTERFACES DE PAYLOAD
 */
export interface OrderItemPayload {
    product_id: number;
    variation_id?: number | null;
    quantity: number;
    unit_price: number;
}

export interface CreateOrderPayload {
    address_id?: number | null; // Pode ser null para visitantes
    amount_paid_shipping: number;
    items: OrderItemPayload[];
    guest_info?: {
        name: string;
        email: string;
    };
    guest_address?: any; // Objeto completo do endereço para visitantes
}

export interface ShippingResponse {
    price: number;
    eta: number;
}

// Configuração da Instância do Axios
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

/**
 * INTERCEPTOR DE AUTENTICAÇÃO
 * Garante que o token mais recente do localStorage seja injetado em cada chamada.
 */
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * BUSCAR MEUS PEDIDOS
 * O backend agora filtra por user_id OU guest_email baseado no token enviado.
 */
export const getMyOrders = async () => {
    const response = await axiosInstance.get('/orders/my-orders');
    console.log(response.data)
    return response.data;
};

/**
 * CRIAR NOVO PEDIDO
 * Lógica Híbrida: Se não houver token, busca os dados de guest no localStorage.
 */
export const createOrder = async (orderData: Partial<CreateOrderPayload>) => {
    const token = localStorage.getItem('authToken');
    const guestUserStr = localStorage.getItem('@app:guest_user');
    const guestAddressStr = localStorage.getItem('@app:guest_address');

    // Montagem inteligente do payload
    const payload = {
        ...orderData,
        // Injetamos guest_info e guest_address caso o usuário não esteja logado
        ...(!token && guestUserStr && { guest_info: JSON.parse(guestUserStr) }),
        ...(!token && guestAddressStr && { guest_address: JSON.parse(guestAddressStr) })
    };

    const response = await axiosInstance.post('/orders', payload);

    // Limpeza de cache pós-sucesso (apenas para visitantes)
    if (response.data && !token) {
        localStorage.removeItem('@app:guest_user');
        localStorage.removeItem('@app:guest_address');
    }

    return response.data;
};

/**
 * CANCELAR PEDIDO
 * Apenas pedidos PENDENTES podem ser cancelados no backend.
 */
export const cancelOrder = async (orderId: number) => {
    const response = await axiosInstance.patch(`/orders/${orderId}/cancel`);
    return response.data;
};

/**
 * CÁLCULO DE FRETE (LOGGI)
 */
export const calculateShippingAPI = async (zipCode: string): Promise<ShippingResponse> => {
    // Limpa o CEP para enviar apenas números
    const cleanZip = zipCode.replace(/\D/g, '');

    const response = await axiosInstance.post('/orders/calculate', { 
        zipCode: cleanZip 
    });

    return response.data;
};


export const getOrderById = async (id: number) => {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data;
};

export const trackOrderGuest = async (orderCode: string, email: string) => {
    const response = await axiosInstance.post('/orders/track', { orderCode, email });
    return response.data;
};


export const cancelOrderGuest = async (orderCode: string, email: string) => {
    const response = await axiosInstance.patch('/orders/track/cancel', { orderCode, email });
    return response.data;
};