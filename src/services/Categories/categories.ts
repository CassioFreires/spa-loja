import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/';

// --- Interfaces ---

export interface Subcategory {
  id: number;
  name: string;
  description?: string;
  category_id: number;
  parent_id?: number | null; // Suporte para o nível de "Marcas"
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  subcategories?: Subcategory[]; // Para quando buscamos a árvore completa
}

// --- Configuração da Instância ---

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// --- Métodos do Serviço ---

/**
 * Obtém todas as categorias principais
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await axiosInstance.get<Category[]>('/categories');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};


/**
 * Obtém a árvore completa de categorias (Menu)
 * Útil para renderizar o menu lateral das imagens que você enviou
 */
export const getCategoryTree = async (): Promise<Category[]> => {
  try {
    const response = await axiosInstance.get<Category[]>('/categories/tree');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Busca uma categoria ou subcategoria pelo ID
 */
export const getCategoryById = async (id: number): Promise<Category> => {
  try {
    const response = await axiosInstance.get<Category>(`/categories/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};


// --- Helper de Erro ---

const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    return new Error(error.response?.data?.message || 'Erro ao carregar categorias');
  }
  return error;
};

export default axiosInstance;