import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/';


// --- Configuração da Instância ---

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getBrands = async () => {
  const response = await axiosInstance.get('/brands'); // Sua rota de marcas no NestJS
  return response.data;
};