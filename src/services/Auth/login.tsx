import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/';

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
  };
}

// Criar instância do axios com configurações padrão
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Autentica o usuário com o backend
 * @param credentials - Email e senha do usuário
 * @returns Promise com o token e dados do usuário
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });

    console.log('Login bem-sucedido:', response.data);
    // Armazenar token no localStorage
    if (response.data.access_token) {
      localStorage.setItem('authToken', response.data.access_token);
      // Adicionar token aos headers padrão para requisições futuras
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    }
    throw error;
  }
};

/**
 * Faz logout do usuário
 */
export const logout = (): void => {
  localStorage.removeItem('authToken');
  delete axiosInstance.defaults.headers.common['Authorization'];
};

/**
 * Obtém o token armazenado
 */
export const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

/**
 * Valida se o usuário está autenticado
 */
export const isAuthenticated = (): boolean => {
  const token = getToken();
  return !!token;
};

/**
 * Inicializa o token no axios se existir
 */
export const initializeAuthToken = (): void => {
  const token = getToken();
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

export default axiosInstance;
