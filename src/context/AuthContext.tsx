import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/* ===================== TYPES ===================== */
export interface Role {
  id: string;
  name: "ADMIN" | "SUPORTE" | "CLIENTE";
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ===================== HELPER: VALIDAÇÃO DE TOKEN ===================== */
// Verifica se o JWT expirou sem precisar de biblioteca externa
const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const { exp } = JSON.parse(jsonPayload);
    if (!exp) return false; // Se não tiver expiração, assume válido
    
    return (Date.now() >= exp * 1000);
  } catch (error) {
    return true; // Se der erro ao decodificar, desloga por segurança
  }
};

/* ===================== PROVIDER ===================== */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Função de logout memorizada para usar em outros lugares
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    setUser(null);
    navigate("/login");
  }, [navigate]);

  // 1. Verificação ao Carregar a Página
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      if (isTokenExpired(token)) {
        logout();
      } else {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          logout();
        }
      }
    }
  }, [logout]);

  // 2. Timer de Verificação Periódica (Opcional, mas recomendado)
  // Verifica a cada 1 minuto se o token expirou enquanto o usuário navega
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token && isTokenExpired(token)) {
        logout();
      }
    }, 60000); 

    return () => clearInterval(interval);
  }, [logout]);

  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
};