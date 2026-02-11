import axiosInstance from "../api";


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
