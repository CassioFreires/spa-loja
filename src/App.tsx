import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout/MainLayout";
import Home from "./pages/public/Home/Home";
import LoginPage from "./pages/public/Login/Login";
import RegisterPage from "./pages/public/Cadastre-se/Cadastre-se";
import ProfilePage from "./pages/private/shared/Perfil/Perfil";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import CategoryPage from "./pages/public/Categorie/Categorie";
import AdminAddProduct from "./pages/private/admin/AddProduct/AddProduct";
import AdminDashboard from "./pages/private/admin/Dashboard/Dashboard";

// 1. Importar o Provider
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 2. Configuração global opcional do Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 24 horas em milissegundos (1000ms * 60s * 60m * 24h)
      staleTime: 1000 * 60 * 60 * 24,

      // Mantém no cache por 48 horas mesmo que o componente não esteja na tela
      gcTime: 1000 * 60 * 60 * 48,

      // DESATIVAR revalidações automáticas desnecessárias
      refetchOnWindowFocus: false, // Não chama a API ao voltar para a aba do site
      refetchOnMount: false,       // Não chama a API toda vez que o componente aparece
      refetchOnReconnect: false,   // Não chama a API se a internet cair e voltar
      retry: false,                // Se falhou uma vez, não fica tentando várias vezes
    },
  },
});

function App() {
  return (
    // 3. Envolver todo o App com o Provider
    <QueryClientProvider client={queryClient}>
      <MainLayout>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<h1>About Page</h1>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastre-se" element={<RegisterPage />} />
          <Route path="/categoria/:id" element={<CategoryPage isSubcategory={false} />} />
          <Route path="/categoria/sub/:subId" element={<CategoryPage isSubcategory={true} />} />

          {/* Rota Privada */}
          <Route
            path="/perfil/*"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          <Route path="/admin/dashboard" element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/admin/produto/adicionar" element={
            <PrivateRoute>
              <AdminAddProduct />
            </PrivateRoute>
          } />


          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </QueryClientProvider>
  );
}

export default App;