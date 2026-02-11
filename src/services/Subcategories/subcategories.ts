import axios from 'axios'; // Import necessário para o axios.isAxiosError
import axiosInstance from "../api";

export interface Subcategory {
  id: number;
  name: string;
  description?: string;
  category_id: number;
  parent_id?: number | null;
}

/**
 * Obtém todas as subcategorias
 */
export const getSubcategories = async (): Promise<Subcategory[]> => {
  try {
    const response = await axiosInstance.get<Subcategory[]>('/subcategories');
    return response.data;
  } catch (error) {
    // Agora o helper recebe o erro tratado
    throw handleApiError(error, 'Erro ao carregar subcategorias');
  }
};

/* =========================
    Helper de Erro (Robusto)
========================= */
const handleApiError = (error: unknown, fallbackMessage: string) => {
  if (axios.isAxiosError(error)) {
    // Tenta pegar a mensagem do NestJS (error.response.data.message)
    // Se for um erro de rede ou servidor fora do ar, usa o fallback
    const apiMessage = error.response?.data?.message;
    
    // Se a mensagem for um array (comum em validações de DTO do NestJS), faz o join
    const finalMessage = Array.isArray(apiMessage) 
      ? apiMessage.join(', ') 
      : apiMessage;

    return new Error(finalMessage || fallbackMessage);
  }
  
  return new Error(fallbackMessage);
};