import axiosInstance from "../api";

export const getCep = async (cep: string) => {
  const cleanCep = cep.replace(/\D/g, "");

  if (cleanCep.length !== 8) {
    // Esse erro será capturado pelo 'catch' no seu AddressModal
    throw new Error("CEP incompleto");
  }

  try {
    // Certifique-se que o axiosInstance aponte para a URL do seu Backend (ex: http://localhost:3000)
    const { data } = await axiosInstance.get(`/address/cep/${cleanCep}`);
    return data;
  } catch (error: any) {
    // Tenta pegar a mensagem de erro vinda do seu Backend (NestJS)
    const message = error.response?.data?.message || "Erro ao buscar CEP";
    throw new Error(message);
  }
};