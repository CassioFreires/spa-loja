import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const getVariantOptions = async () => {
  const response = await axiosInstance.get('/variants-options');
  return response.data;
};

export const createVariantOption = async (data: {
  variation_type_id: number;
  value: string;
}) => {
  const response = await axiosInstance.post('/variants-options', data);
  return response.data;
};

export const updateVariantOption = async (
  id: number | string,
  data: any
) => {
  const response = await axiosInstance.patch(`/variants-options/${id}`, data);
  return response.data;
};

export const deleteVariantOption = async (id: number | string) => {
  const response = await axiosInstance.delete(`/variants-options/${id}`);
  return response.data;
};
