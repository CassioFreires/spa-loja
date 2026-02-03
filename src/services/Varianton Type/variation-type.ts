import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getVariationTypes = async () => {
  const response = await axiosInstance.get('/variation-types');
  return response.data;
};

export const createVariationType = async (data: {
  name: string;
  active?: boolean;
}) => {
  const response = await axiosInstance.post('/variation-types', data);
  return response.data;
};

export const updateVariationType = async (
  id: number | string,
  data: any
) => {
  const response = await axiosInstance.patch(`/variation-types/${id}`, data);
  return response.data;
};

export const deleteVariationType = async (id: number | string) => {
  const response = await axiosInstance.delete(`/variation-types/${id}`);
  return response.data;
};
