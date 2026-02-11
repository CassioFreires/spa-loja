import type { Address } from "../../components/modals/AddressModal";
import axiosInstance from "../api";

export const getMyAddresses = async (token: string) => {
    const response = await axiosInstance.get('/address/my-addresses', { // Rota ajustada para o seu @Get() padrão ou findByUserId
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const createAddressAPI = async (token: string, data: Address) => {
    // MAPEAMENTO: Criamos um objeto novo contendo APENAS o que o DTO aceita
    // Se enviarmos "zip_code" ou "is_default", o NestJS dará erro 400 por causa do 'forbidNonWhitelisted'
    const payload = {
        street: data.street,
        number: data.number,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zipcode: data.zip_code, // Mapeando zip_code -> zipcode
        complement: data.complement || ""
    };

    console.log("Enviando Payload para API:", payload);

    const response = await axiosInstance.post('/address', payload, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updateAddressAPI = async (token: string, id: string, data: Address) => {
  const payload = {
    street: data.street,
    number: data.number,
    neighborhood: data.neighborhood,
    city: data.city,
    state: data.state,
    zipcode: data.zip_code,
    complement: data.complement || "",
  };

  const response = await axiosInstance.patch(`/address/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return response.data;
};

export const deleteAddressAPI = async (token: string, id: string) => {
    await axiosInstance.delete(`/address/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};