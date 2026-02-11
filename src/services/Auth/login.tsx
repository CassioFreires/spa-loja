import type{ InternalAxiosRequestConfig } from 'axios';
import axiosInstance from '../api';

// --- INTERFACES ---
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string; // Adicionado para bater com seu backend
  };
}

// --- INSTÂNCIA ---


// --- INTERCEPTORS (A Mágica da Segurança) ---

// Injeta o token em cada requisição antes dela sair
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Trata erros globais (Ex: se o token expirar na VPS, desloga na hora)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      localStorage.removeItem('authToken');
      window.location.href = '/login'; // Redireciona para login
    }
    return Promise.reject(error);
  }
);

// --- FUNÇÕES DE AÇÃO ---

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);

    if (response.data.access_token) {
      localStorage.setItem('authToken', response.data.access_token);
      // Não precisamos setar o default header aqui, o interceptor cuidará disso!
    }

    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Erro ao fazer login';
    throw new Error(message);
  }
};

export const logout = (): void => {
  localStorage.removeItem('authToken');
  // Opcional: Redirecionar para home
  window.location.href = '/';
};

export const getToken = (): string | null => localStorage.getItem('authToken');

export const isAuthenticated = (): boolean => !!getToken();

export default axiosInstance;