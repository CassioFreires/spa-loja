
import { Routes, Route, Navigate } from "react-router-dom"
import MainLayout from "./components/layout/MainLayout/MainLayout";
import Home from "./pages/public/Home/Home";
import LoginPage from "./pages/public/Login/Login";
import RegisterPage from "./pages/public/Cadastre-se/Cadastre-se";
import ProfilePage from "./pages/private/shared/Perfil/Perfil";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

function App() {
  return (
    <MainLayout>
      <Routes>
        {/* Rota publica */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<h1>About Page</h1>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastre-se" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />

        {/* Rota privada */}
        <Route path="/perfil/*" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      </Routes>
    </MainLayout>
  )
}

export default App
