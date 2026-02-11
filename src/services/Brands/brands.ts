import axiosInstance from "../api";

export const getBrands = async () => {
  const response = await axiosInstance.get('/brands'); // Sua rota de marcas no NestJS
  return response.data;
};