import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const createProductVariation = async (data: {
  product_id: number;
  variant_option_id: number;
  stock?: number;
  extra_price?: number;
  sku: string;
}) => {
  const response = await axiosInstance.post('/product-variations', data);
  return response.data;
};

export const updateProductVariation = async (
  id: number | string,
  data: any
) => {
  const response = await axiosInstance.patch(`/product-variations/${id}`, data);
  return response.data;
};

export const deleteProductVariation = async (id: number | string) => {
  const response = await axiosInstance.delete(`/product-variations/${id}`);
  return response.data;
};
