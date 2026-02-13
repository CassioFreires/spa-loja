import { useState } from "react";
import Header from "../Header/Header";
import SideBar from "../../SideBar/SideBar";
import { useAuth } from "../../../context/AuthContext";
import Footer from "../Footer/Footer";
import WhatsAppButton from "../../WhatsappButton/WhatsappButton";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const { user } = useAuth();
  const hasSidebar = user?.role.name === "ADMIN" || user?.role.name === "SUPORTE";

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 relative">
      {/* Header fixo no topo */}
      <Header onToggleAdminMenu={() => setIsAdminMenuOpen(!isAdminMenuOpen)} />

      <div className="flex flex-1 flex-row relative overflow-hidden">
        {hasSidebar && (
          <SideBar
            isOpen={isAdminMenuOpen}
            onClose={() => setIsAdminMenuOpen(false)}
          />
        )}

        <main className="flex-1 relative overflow-y-auto p-0 md:p-0 w-full transition-all duration-300">
          {children}
        </main>
      </div>
      <Footer />

      <WhatsAppButton />
    </div>
  );
}