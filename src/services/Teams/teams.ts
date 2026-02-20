import axiosInstance from "../api";

/* =========================
   Tipagens
========================= */
export interface Team {
  id: number;
  name: string;
  slug: string;
  logo_url?: string | null;
  subcategory_id?: number | null;
}

/**
 * Obtém a lista de todos os times/clubes cadastrados
 * Utilizado no seletor de criação de produtos (Mantos)
 */
export const getTeams = async (): Promise<Team[]> => {
  try {
    const response = await axiosInstance.get<Team[]>('/teams');
    return response.data;
  } catch (error) {
    // Mantendo a compatibilidade com o seu helper de erro robusto
    throw new Error('Erro ao carregar a lista de times');
  }
};