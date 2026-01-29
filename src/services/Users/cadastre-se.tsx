import axios from 'axios';
import { CadastreSeSchema } from '../../schema/Cadastre-se/schema-cadastre-se';
import { z } from 'zod';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/';

type CadastreSeData = z.infer<typeof CadastreSeSchema>;

export interface AuthResponse {
  access_token?: string; // Opcional, pois o /me pode retornar apenas o user
  user: {
    id: string;
    email: string;
    name: string;
    phone: string | null;
    role_id: string;
    active: boolean;
    created_at: string;
  };
  message?: string;
}
// Criar instância do axios com configurações padrão
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Cria um novo usuário (Cadastro)
 * @param userData - Dados do formulário de cadastro
 * @returns Token e dados do usuário
 */
export const createUser = async (
  userData: CadastreSeData
): Promise<AuthResponse> => {
  try {
    const { confirmPassword, ...dataToSend } = userData;

    const response = await axiosInstance.post<AuthResponse>(
      '/users',
      dataToSend
    );

    console.log('Cadastro realizado com sucesso:', response.data);

    // Se o backend retornar token, já autentica
    if (response.data.access_token) {
      localStorage.setItem('authToken', response.data.access_token);
      axiosInstance.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${response.data.access_token}`;
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          'Erro ao criar usuário. Tente novamente.'
      );
    }
    throw error;
  }
};


/**
 * Busca os dados do usuário logado usando o token
 */
export const getMe = async (): Promise<AuthResponse['user']> => {
  try {
    // Note que usamos /users/me conforme configuramos no NestJS
    const response = await axiosInstance.get<AuthResponse['user']>('/users/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`,
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Sessão expirada. Faça login novamente.'
      );
    }
    throw error;
  }
};

export const updateUser = async (
  id: string,
  updateData: Partial<CadastreSeData>
): Promise<AuthResponse['user']> => {
  try {
    const response = await axiosInstance.patch<AuthResponse['user']>(
      `/users/${id}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`,
        }
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar dados.');
    }
    throw error;
  }
};

export default axiosInstance;
