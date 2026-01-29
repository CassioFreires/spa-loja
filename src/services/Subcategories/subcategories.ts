import axios from 'axios';


export interface Subcategory {
  id: number;
  name: string;
  description?: string;
  category_id: number;
  parent_id?: number | null; // Suporte para o nível de "Marcas"
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


/**
 * Obtém todas as subcategorias (findAll)
 */
export const getSubcategories = async (): Promise<Subcategory[]> => {
  try {
    const response = await axiosInstance.get<Subcategory[]>('/subcategories');
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Erro ao carregar subcategorias');
  }
};

/* =========================
   Helper de Erro
========================= */
const handleApiError = (error: unknown, fallbackMessage: string) => {
  if (axios.isAxiosError(error)) {
    return new Error(error.response?.data?.message || fallbackMessage);
  }
  return new Error(fallbackMessage);
};
