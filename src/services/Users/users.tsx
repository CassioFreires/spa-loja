import { CadastreSeSchema } from '../../schema/Cadastre-se/schema-cadastre-se';
import { z } from 'zod';
import axiosInstance from '../api';

type CadastreSeData = z.infer<typeof CadastreSeSchema>;

export interface User {
    id: number;
    email: string;
    name: string;
    phone: string | null;
    role_id: number;
    active: boolean; // Adicionado explicitamente aqui
    created_at: string;
    role?: {
        id: number;
        name: string;
    };
    permissions?: string[];
}

export interface AuthResponse {
  access_token?: string;
  user: User; // Referência à interface acima
  message?: string;
}


// Helper para obter headers com token atualizado
const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('authToken') || ''}` }
});

/**
 * BUSCA TODOS OS USUÁRIOS (ADMIN)
 * Suporta paginação e filtro de busca
 */
export const getUsers = async (page: number = 1, search: string = '') => {
  const response = await axiosInstance.get('/users', {
    params: { page, limit: 10, search },
    ...getHeaders()
  });
  return response.data;
};

/**
 * BUSCA TODOS OS CARGOS DISPONÍVEIS (ADMIN)
 */
export const getRoles = async () => {
  const response = await axiosInstance.get('/users/roles/all', getHeaders());
  return response.data;
}

/**
 * BUSCA DADOS DO USUÁRIO LOGADO (ME)
 */
export const getMe = async (): Promise<AuthResponse['user']> => {
  const response = await axiosInstance.get<AuthResponse['user']>('/users/me', getHeaders());
  return response.data;
};

/**
 * CADASTRO DE NOVO USUÁRIO
 */
export const createUser = async (userData: CadastreSeData): Promise<AuthResponse> => {
  try {
    const { confirmPassword, ...dataToSend } = userData;
    const response = await axiosInstance.post<AuthResponse>('/users', dataToSend);

    if (response.data.access_token) {
      localStorage.setItem('authToken', response.data.access_token);
    }
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao criar usuário.');
  }
};

/**
 * ATUALIZAÇÃO DE USUÁRIO (ADMIN OU PRÓPRIO PERFIL)
 */
export const updateUser = async (
  id: number | string,
  updateData: Partial<AuthResponse['user'] | CadastreSeData>
): Promise<AuthResponse['user']> => {
  try {
    const response = await axiosInstance.patch<AuthResponse['user']>(
      `/users/${id}`,
      updateData,
      getHeaders()
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro ao atualizar dados.');
  }
};

/**
 * DELETAR USUÁRIO (ADMIN)
 */
export const deleteUser = async (id: number | string): Promise<void> => {
    await axiosInstance.delete(`/users/${id}`, getHeaders());
};


export default axiosInstance;