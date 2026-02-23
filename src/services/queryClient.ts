import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 1. Aumentamos o staleTime para 5 min por padrão. 
      // 24h é arriscado para e-commerce (preços/estoque mudam).
      staleTime: 1000 * 60 * 5, 
      
      // 2. RETRY: A chave para o seu problema com Docker.
      // Tenta 3 vezes antes de marcar como erro.
      retry: 3, 
      
      // 3. RETRY DELAY: Estratégia de Exponential Backoff
      // 1ª tentativa: 1s | 2ª: 2s | 3ª: 4s
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // 4. RESILIÊNCIA:
      // Se o usuário trocar de aba e voltar, ele tenta atualizar se os dados forem 'stale'
      refetchOnWindowFocus: true,
      
      // Mantém no cache por 24h, mas valida conforme o staleTime
      gcTime: 1000 * 60 * 60 * 24, 
    },
  },
});