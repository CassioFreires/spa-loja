import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../services/api';
import toast from 'react-hot-toast';

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string | number) => {
      return await axiosInstance.delete(`/products/${productId}`);
    },
    onSuccess: () => {
      // Atualiza a lista automaticamente sem refresh
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success("Produto removido permanentemente.");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Erro ao excluir produto.";
      toast.error(msg);
    }
  });
}