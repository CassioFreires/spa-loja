import { useMutation } from '@tanstack/react-query';
import { trackOrderGuest } from '../services/Orders/orders';
import toast from 'react-hot-toast';

export const useTrackOrder = () => {
    return useMutation({
        mutationFn: ({ orderCode, email }: { orderCode: string; email: string }) => 
            trackOrderGuest(orderCode, email),
        onError: (error: any) => {
            // Se o backend retornou 404, a mensagem será "Pedido não localizado"
            const message = error.response?.data?.message || "Erro ao conectar com o servidor.";
            
            toast.error(message, {
                duration: 3000,
                id: 'track-error', // Evita múltiplas mensagens na tela
                style: {
                    background: '#18181b', // zinc-900
                    color: '#fff',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                }
            });
        },
        onSuccess: () => {
            toast.success("PEDIDO LOCALIZADO!", {
                duration: 2000,
                style: { background: '#18181b', color: '#eab308' }
            });
        }
    });
};