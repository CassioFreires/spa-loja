import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../services/api';

export function useAdminOrders() {
  return useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
        const token = String(localStorage.getItem('authToken'));
        const response = await axiosInstance.get('/orders', { // Rota que retorna todos
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
    refetchInterval: 30000, // Atualiza a cada 30s para ver novos pagamentos
  });
}