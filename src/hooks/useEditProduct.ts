import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axiosInstance from '../services/api';

export function useEditProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data, variations }: { id: number, data: any, variations: any[] }) => {
      // 1. Atualiza o produto pai (Nome, Preço base, Descrição)
      await axiosInstance.patch(`/products/${id}`, {
        ...data,
        price: Number(data.price),
        stock: Number(data.stock || 0)
      });

      // 2. Atualiza cada variação individualmente
      // Usamos um filtro para garantir que não tentamos atualizar IDs indefinidos
      const validVariations = variations.filter(v => (v.id || v.variation_id));

      const variationPromises = validVariations.map(v => {
        const vId = v.id || v.variation_id;
        
        return axiosInstance.patch(`/product-variations/${vId}`, {
          // Forçamos a conversão para Number para satisfazer o DTO do NestJS
          stock: Math.max(0, Number(v.stock)), 
          extra_price: Number(v.extra_price || 0),
          sku: String(v.sku).trim()
        });
      });
      
      return Promise.all(variationPromises);
    },
    onSuccess: () => {
      // Invalida o cache para atualizar a tabela de produtos e o Dashboard
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success("Produto e grade atualizados com sucesso!");
    },
    onError: (error: any) => {
      console.error("Erro na mutação:", error);
      const message = error.response?.data?.message;
      toast.error(Array.isArray(message) ? message[0] : "Erro ao atualizar produto.");
    }
  });
}