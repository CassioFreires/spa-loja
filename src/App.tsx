import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

// Configurações Externas
import { queryClient } from "./services/queryClient";
import { premiumToastOptions } from "./utils/toastConfig";

// Providers e Layout
import { CartProvider } from "./context/CartContext";
import MainLayout from "./components/layout/MainLayout/MainLayout";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

// --- PÁGINAS PÚBLICAS ---
import Home from "./pages/public/Home/Home";
import LoginPage from "./pages/public/Login/Login";
import RegisterPage from "./pages/public/Cadastre-se/Cadastre-se";
import CategoryPage from "./pages/public/Categorie/Categorie";
import Cart from "./pages/public/Cart/Cart";
import TrackingPage from "./pages/private/shared/TrakingPage/TrakingPage";
import SizeGuidePage from "./pages/public/SizeGuide/SizeGuide";
import SecurityPolicy from "./pages/public/Security/Security";
import ReturnsPolicy from "./pages/public/ReturnPolicy/ReturnPolicy";
import GuestIdentification from "./pages/public/GuestIdentification/GuestIdentification";
import OrderTracking from "./pages/public/OrderTracking/OrderTracking";
import AllReviews from "./pages/public/AllReviews/AllReviews";

// --- PÁGINAS DO CLIENTE (PRIVADAS) ---
import CheckoutAddress from "./pages/private/shared/Address/Address";
import PaymentSelection from "./pages/private/shared/PaymentMethod/PaymentMethod";
import PaymentRedirect from "./pages/private/shared/PaymentRedirect/PaymentRedirect";
import MyOrders from "./pages/public/MyOrders/MyOrders";
import ProfilePage from "./pages/private/shared/Perfil/Perfil";

// --- PÁGINAS ADMIN (PRIVADAS) ---
import AdminDashboard from "./pages/private/admin/Dashboard/Dashboard";
import MyProducts from "./pages/private/admin/MyProducts/MyProducts";
import AdminAddProduct from "./pages/private/admin/AddProduct/AddProduct";
import AdminOrders from "./pages/private/admin/Orders/Orders";
import AdminFeaturedProducts from "./pages/private/admin/FeaturedProducts/FeaturedProducts";
import AdminComments from "./pages/private/admin/Comments/Comments";
import AdminUsers from "./pages/private/admin/Users/Users";
import WelcomeModal from "./components/modals/Welcome";

/**
 * COMPONENTE DE DECISÃO HÍBRIDO
 * Lógica: Se logado, PrivateRoute garante o acesso à lista completa. 
 * Se deslogado, cai no rastreio manual por código.
 */
const MyOrdersDecision = () => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  return isAuthenticated ? (
    <PrivateRoute requiredRole={["ADMIN", "SUPORTE", "CLIENTE"]}>
      <MyOrders />
    </PrivateRoute>
  ) : (
    <OrderTracking />
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" toastOptions={premiumToastOptions} />
      <CartProvider>
        <WelcomeModal />
        <MainLayout>
          <Routes>
            {/* ==========================================
                1. ROTAS PÚBLICAS 
                Acessíveis por qualquer visitante.
                ========================================== 
            */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastre-se" element={<RegisterPage />} />
            <Route path="/carrinho" element={<Cart />} />
            <Route path="/categoria/:id" element={<CategoryPage isSubcategory={false} />} />
            <Route path="/categoria/sub/:subId" element={<CategoryPage isSubcategory={true} />} />

            {/* Fluxo de Checkout (Híbrido/Público) */}
            <Route path="/identificacao" element={<GuestIdentification />} />
            <Route path="/endereco" element={<CheckoutAddress />} />
            <Route path="/pagamento" element={<PaymentSelection />} />
            <Route path="/checkout/redirect" element={<PaymentRedirect />} />

            {/* Institucional */}
            <Route path="/guia-de-medidas" element={<SizeGuidePage />} />
            <Route path="/seguranca" element={<SecurityPolicy />} />
            <Route path="/trocas" element={<ReturnsPolicy />} />
            <Route path="/rastreamento-do-pedido" element={<TrackingPage />} />
            <Route path="/avaliacoes" element={<AllReviews />} />

            {/* Decisão de Pedidos (Logado vs Visitante) */}
            <Route path="/meus-pedidos" element={<MyOrdersDecision />} />

            {/* ==========================================
                2. ROTAS PRIVADAS (CLIENTE / COMPRADOR)
                Requer login básico.
                ========================================== 
            */}
            <Route
              path="/perfil/configuracoes"
              element={<PrivateRoute requiredRole={["ADMIN", "SUPORTE", "CLIENTE"]}><ProfilePage /></PrivateRoute>} />

            {/* ==========================================
                3. ROTAS ADMINISTRATIVAS (GESTÃO)
                Nível: Admin e Suporte
                ========================================== 
            */}
            <Route
              path="/admin/dashboard"
              element={<PrivateRoute requiredRole={["ADMIN", "SUPORTE"]}><AdminDashboard /></PrivateRoute>}
            />
            <Route
              path="/admin/produtos"
              element={<PrivateRoute requiredRole={["ADMIN", "SUPORTE"]}><MyProducts /></PrivateRoute>}
            />
            <Route
              path="/admin/produto/adicionar"
              element={<PrivateRoute requiredRole={["ADMIN", "SUPORTE"]}><AdminAddProduct /></PrivateRoute>}
            />
            <Route
              path="/admin/produto/desconto"
              element={<PrivateRoute requiredRole={["ADMIN", "SUPORTE"]}><AdminFeaturedProducts /></PrivateRoute>}
            />
            <Route
              path="/admin/pedidos"
              element={<PrivateRoute requiredRole={["ADMIN", "SUPORTE"]}><AdminOrders /></PrivateRoute>}
            />
            <Route
              path="/admin/comentarios"
              element={<PrivateRoute requiredRole={["ADMIN", "SUPORTE"]}><AdminComments /></PrivateRoute>}
            />

            {/* ==========================================
                4. ROTAS CRÍTICAS (APENAS ADMIN)
                Nível: Apenas Administradores (Gestão de Staff/Usuários)
                ========================================== 
            */}
            <Route
              path="/admin/usuarios"
              element={<PrivateRoute requiredRole="ADMIN"><AdminUsers /></PrivateRoute>}
            />

            {/* FALLBACK: Redireciona rotas inexistentes para a Home */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </MainLayout>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;