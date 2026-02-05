// hooks/useShipmentMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../services/Products/products';
import toast from 'react-hot-toast';

export function useAddTrackingEvent(onSuccessCallback: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ shipmentId, status, location, description }: any) => {
      const token = localStorage.getItem('authToken');
      const response = await axiosInstance.post(`/shipments/${shipmentId}/events`, 
        { status, location, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Timeline atualizada!");
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      onSuccessCallback();
    },
    onError: () => {
      toast.error("Erro ao atualizar rastreio.");
    }
  });
}