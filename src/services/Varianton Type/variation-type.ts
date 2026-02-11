import axiosInstance from "../api";

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
