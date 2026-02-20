import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axiosInstance from '../services/api';

export function useEditProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data, variations }: { id: number | string, data: any, variations: any[], hasVariations: boolean }) => {
            
            // 1. Patch no Produto Principal (FormData para aceitar imagens)
            const isFormData = data instanceof FormData;
            await axiosInstance.patch(`/products/${id}`, data, {
                headers: {
                    'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
                }
            });

            // 2. Patch nas Variações (Grade Master)
            if (variations && variations.length > 0) {
                const variationPromises = variations.map((v: any) => {
                    const vId = v.id || v.variation_id;

                    // LÓGICA DE LIMPEZA: Enviamos apenas o que o seu DTO de variação aceita
                    // Removemos o 'gender_option_id' que causou o erro 400
                    const payload = {
                        color_option_id: v.color_option_id ? Number(v.color_option_id) : null,
                        size_option_id: v.size_option_id ? Number(v.size_option_id) : null,
                        model_option_id: v.model_option_id ? Number(v.model_option_id) : null,
                        stock: Number(v.stock),
                        sku: String(v.sku).trim().toUpperCase()
                    };

                    return axiosInstance.patch(`/product-variations/${vId}`, payload);
                });
                
                await Promise.all(variationPromises);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            toast.success("Produto e grade atualizados!");
        },
        onError: (error: any) => {
            const msg = error.response?.data?.message;
            toast.error(Array.isArray(msg) ? msg[0] : "Erro ao atualizar variações.");
        }
    });
}