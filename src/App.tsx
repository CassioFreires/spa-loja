import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

// Configurações Externas (Para manter o App.tsx limpo)
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Notificações globais com estilo premium */}
      <Toaster position="top-center" toastOptions={premiumToastOptions} />

      <CartProvider>
        <MainLayout>
          <Routes>
            
            {/* ==========================================
                ROTAS PÚBLICAS
               ========================================== */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastre-se" element={<RegisterPage />} />
            <Route path="/carrinho" element={<Cart />} />
            
            {/* Categorias e Subcategorias */}
            <Route path="/categoria/:id" element={<CategoryPage isSubcategory={false} />} />
            <Route path="/categoria/sub/:subId" element={<CategoryPage isSubcategory={true} />} />
            
            {/* Institucional */}
            <Route path="/guia-de-medidas" element={<SizeGuidePage />} />
            <Route path="/seguranca" element={<SecurityPolicy />} />
            <Route path="/trocas" element={<ReturnsPolicy />} />
            <Route path="/rastreamento-do-pedido" element={<TrackingPage />} />

            {/* ==========================================
                ROTAS PRIVADAS (CLIENTE LOGADO)
               ========================================== */}
            <Route path="/perfil" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/meus-pedidos" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
            
            {/* Fluxo de Checkout */}
            <Route path="/endereco" element={<PrivateRoute><CheckoutAddress /></PrivateRoute>} />
            <Route path="/pagamento" element={<PrivateRoute><PaymentSelection /></PrivateRoute>} />
            <Route path="/checkout/redirect" element={<PrivateRoute><PaymentRedirect /></PrivateRoute>} />

            {/* ==========================================
                ROTAS ADMINISTRATIVAS
               ========================================== */}
            <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />

            <Route path="/admin/produtos" element={<PrivateRoute><MyProducts /></PrivateRoute>} />
            <Route path="/admin/produto/adicionar" element={<PrivateRoute><AdminAddProduct /></PrivateRoute>} />
            <Route path="/admin/produto/desconto" element={<PrivateRoute><AdminFeaturedProducts /></PrivateRoute>} />

            <Route path="/admin/pedidos" element={<PrivateRoute><AdminOrders /></PrivateRoute>} />

            {/* ==========================================
                FALLBACK (404 / REDIRECT)
               ========================================== */}
            <Route path="*" element={<Navigate to="/" replace />} />
            
          </Routes>
        </MainLayout>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;