// services/api.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

// INTERCEPTOR: Adiciona o Token de forma global
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Tratamento de erro 401 (Token expirado ou inválido)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;