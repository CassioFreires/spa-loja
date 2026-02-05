import { useQuery } from '@tanstack/react-query';
import { getMyOrders } from '../services/Orders/orders';
import { useAuth } from '../context/AuthContext';

export function useOrdersCount() {
  const { isAuthenticated } = useAuth();

  const { data: orders = [], refetch } = useQuery({
    queryKey: ['my-orders-count'],
    queryFn: getMyOrders,
    enabled: isAuthenticated, 
    // staleTime em 0 garante que ele sempre valide se há novos dados
    staleTime: 0, 
    // Atualiza automaticamente em segundo plano a cada 30 segundos
    refetchInterval: 30000,
    refetchOnWindowFocus: true, 
  });

  // Filtro rigoroso apenas para status PENDENTE
  const count = orders.filter((order: any) => order.status === 'PENDENTE').length;

  return { count, refetch };
}