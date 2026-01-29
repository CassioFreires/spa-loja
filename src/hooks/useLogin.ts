import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginService } from '../services/Auth/login';
import type { LoginCredentials } from '../services/Auth/login';
import { logError, logSuccess } from '../utils/logger';

export const useLogin = () => {
  const navigate = useNavigate();
  const { setUser, login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginService(credentials);
      
      // Salva no contexto e no localStorage via função do context
      login(response.access_token, response.user);
      
      logSuccess('Login bem sucedido', { userId: response.user.id });
      navigate('/', { replace: true }); // Redireciona para a Home ou Dashboard
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao autenticar';
      setError(msg);
      logError('Falha no login', { msg });
    } finally {
      setIsLoading(false);
    }
  }, [navigate, login]);

  return { isLoading, error, handleLogin, clearError: () => setError(null) };
};