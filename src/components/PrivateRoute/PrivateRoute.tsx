// components/PrivateRoute/PrivateRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface PrivateRouteProps {
  children: React.ReactNode;
  // Agora aceita uma string ou um array de strings
  requiredRole?: 'ADMIN' | 'SUPORTE' | 'CLIENTE' | Array<'ADMIN' | 'SUPORTE' | 'CLIENTE'>;
}

const PrivateRoute = ({ children, requiredRole }: PrivateRouteProps) => {
  const token = localStorage.getItem('authToken');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    const decoded: any = jwtDecode(token);
    const userRole = decoded.role; // Ex: 'SUPORTE'

    if (requiredRole) {
      // Converte para array caso seja apenas uma string, para facilitar a checagem
      const rolesArray = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

      // Verifica se a role do usuário está inclusa nas roles permitidas
      // Dica: ADMIN geralmente ignora as travas e acessa tudo
      const hasPermission = rolesArray.includes(userRole) || userRole === 'ADMIN';

      if (!hasPermission) {
        return <Navigate to="/" replace />;
      }
    }

    return children;
  } catch (error) {
    localStorage.removeItem('authToken');
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;