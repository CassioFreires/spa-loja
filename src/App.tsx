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
import CheckoutAddress from "./pages/private/shared/Address/Address";
import MyOrders from "./pages/public/MyOrders/MyOrders";

// 1. Importar o Provider e o Toaster
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast"; // <--- IMPORTANTE
import PaymentSelection from "./pages/private/shared/PaymentMethod/PaymentMethod";
import Cart from "./pages/public/Cart/Cart";
import { CartProvider } from "./context/CartContext";
import TrackingPage from "./pages/private/shared/TrakingPage/TrakingPage";
import SizeGuidePage from "./pages/public/SizeGuide/SizeGuide";
import SecurityPolicy from "./pages/public/Security/Security";
import ReturnsPolicy from "./pages/public/ReturnPolicy/ReturnPolicy";

// 2. Configuração global opcional do Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24,
      gcTime: 1000 * 60 * 60 * 48,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* 3. CONFIGURAÇÃO DO TOASTER 
          Colocamos aqui para que as notificações funcionem em TODAS as páginas.
          Personalizei com o estilo de luxo (Preto e Amarelo).
      */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          // Estilo padrão para todos os toasts (Preto Luxo)
          style: {
            background: '#18181b', // zinc-900
            color: '#fff',
            fontSize: '11px',
            fontWeight: '900',
            textTransform: 'uppercase',
            fontStyle: 'italic',
            letterSpacing: '0.1em',
            borderRadius: '16px',
            padding: '16px 24px',
            border: '1px solid #27272a', // zinc-800
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
          },
          // Customização do ícone de sucesso (Amarelo Premium)
          success: {
            iconTheme: {
              primary: '#ca8a04', // yellow-600
              secondary: '#fff',
            },
          },
          // Customização do ícone de erro
          error: {
            iconTheme: {
              primary: '#ef4444', // red-500
              secondary: '#fff',
            },
          },
        }}
      />

      <CartProvider>
        <MainLayout>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastre-se" element={<RegisterPage />} />
            <Route path="/categoria/:id" element={<CategoryPage isSubcategory={false} />} />
            <Route path="/categoria/sub/:subId" element={<CategoryPage isSubcategory={true} />} />
            <Route path="/carrinho" element={<Cart />} />
            <Route path="/meus-pedidos" element={<MyOrders />} />
            <Route path="/rastreamento-do-pedido" element={<TrackingPage />} />
            <Route path="/guia-de-medidas" element={<SizeGuidePage />} />
            <Route path="/seguranca" element={<SecurityPolicy />} />
            <Route path="/trocas" element={<ReturnsPolicy />} />

            {/* --- ROTAS DE CHECKOUT (PRIVADAS) --- */}
            <Route path="/endereco" element={
              <PrivateRoute>
                <CheckoutAddress />
              </PrivateRoute>
            } />

            <Route path="/pagamento" element={
              <PrivateRoute>
                <PaymentSelection />
              </PrivateRoute>
            } />

            {/* Outras Rotas Privadas e Admin */}
            <Route path="/perfil/*" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/produto/adicionar" element={<PrivateRoute><AdminAddProduct /></PrivateRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;