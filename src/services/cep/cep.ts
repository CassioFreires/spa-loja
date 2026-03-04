// src/services/cep/cep.ts
import axiosInstance from "../api";

export const getCep = async (cep: string, cartValue: number = 0) => {
  const cleanCep = cep.replace(/\D/g, "");
  if (cleanCep.length !== 8) throw new Error("CEP incompleto");

  try {
    const { data } = await axiosInstance.get(`/address/cep/${cleanCep}`, {
      params: { cartValue }
    });
    
    return data; 
  } catch (error: any) {
    console.error("ERRO NA API LOCAL:", error.response?.data || error.message);
    throw new Error("Erro ao consultar CEP no servidor.");
  }
};