import axios from 'axios';

// Prioriza o .env, senão usa o IP fixo da sua VPS
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://187.77.36.30:3000';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// INTERCEPTOR: Adiciona o Token em todas as requisições
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken'); 
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// INTERCEPTOR: Tratamento de erro global (401)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Se a API retornar 401, desloga o usuário
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            // Evita loop infinito se já estiver no login
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;