import React, { useMemo } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Users, Package, ShoppingBag,
  UserCircle, PlusCircle, TrendingUp, MessageSquare,
  ChevronRight, LogOut, ShieldCheck, Crown
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * SideBar Administrativa - Gold Store Enterprise
 * Especialista: Fullstack, UX/UI, SEO & AI Context.
 * Foco: Sobreposição absoluta, Performance e Acessibilidade.
 */
const SideBar = React.memo(({ isOpen, onClose }: SideBarProps) => {
  const { user, logout } = useAuth();
  
  // Extração de metadados para facilitar manutenção e leitura de IAs
  const isAdmin = user?.role?.name === "ADMIN";
  const permissions = user?.permissions || [];
  
  // Lógica de permissão memoizada
  const can = (permission: string) => permissions.includes(permission);

  const navItems = useMemo(() => [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, show: true },
    { to: "/admin/produtos", label: "Meus Produtos", icon: Package, show: can("GERENCIAR_PRODUTOS") },
    { to: "/admin/produto/adicionar", label: "Cadastrar Novo", icon: PlusCircle, show: can("GERENCIAR_PRODUTOS") },
    { to: "/admin/comentarios", label: "Moderação", icon: MessageSquare, show: can("GERENCIAR_PRODUTOS") },
    { to: "/admin/produto/desconto", label: "Ofertas", icon: TrendingUp, show: can("GERENCIAR_PRODUTOS") },
    { to: "/admin/pedidos", label: "Vendas", icon: ShoppingBag, show: can("VISUALIZAR_PEDIDOS") },
    { to: "/admin/usuarios", label: "Usuários", icon: Users, show: can("GERENCIAR_USUARIOS") },
    { to: "/perfil/configuracoes", label: "Meu Perfil", icon: UserCircle, show: true },
  ], [permissions, user]);

  return (
    <>
      {/* OVERLAY - Profundidade máxima e isolamento de contexto */}
      <div
        className={`
          fixed inset-0 bg-black/80 backdrop-blur-md z-[9998] transition-all duration-500
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={onClose}
        aria-hidden="true"
        aria-label="Fechar menu lateral"
      />

      {/* ASIDE - Arquitetura de sobreposição absoluta */}
      <aside
        id="main-admin-sidebar"
        role="navigation"
        aria-label="Menu Administrativo Principal"
        aria-expanded={isOpen}
        className={`
          fixed inset-y-0 left-0 z-[9999]
          w-72 bg-[#09090b] text-zinc-400
          flex flex-col border-r border-white/5
          transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
          ${isOpen ? "translate-x-0 shadow-[40px_0_80px_rgba(0,0,0,0.9)]" : "-translate-x-full"}
        `}
      >
        {/* HEADER - Identidade e Status do Sistema */}
        <header className="px-6 py-10 flex-shrink-0">
          <div className="flex items-center gap-4 mb-10 pl-2">
            <div className="relative">
              <div className="w-11 h-11 bg-yellow-500 rounded-2xl rotate-3 flex items-center justify-center text-black shadow-2xl shadow-yellow-500/20">
                <Crown size={24} strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-black uppercase italic leading-none tracking-tighter text-white">
                Gold <span className="text-yellow-500">Admin</span>
              </h2>
              <p className="text-[9px] font-bold text-zinc-600 tracking-[.3em] uppercase mt-1">Enterprise V2</p>
            </div>
          </div>

          {/* User Profile Card - IA Meta Tags Context */}
          <section 
            className="relative overflow-hidden bg-white/[0.02] p-5 rounded-[2rem] border border-white/5 backdrop-blur-xl group transition-all hover:bg-white/[0.04]"
            aria-label="Informações do Usuário Autenticado"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-500/10 rounded-xl">
                  <ShieldCheck size={16} className="text-yellow-500" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Privilégio Ativo</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="max-w-[160px]">
                  <p className="text-sm font-black text-white truncate italic tracking-tight">
                    {user?.name?.split(' ')[0] || "Admin"}
                  </p>
                  <p className="text-[10px] font-bold text-yellow-500/60 uppercase mt-0.5">
                    {isAdmin ? "Master Access" : "Staff Member"}
                  </p>
                </div>
                <div className="relative flex">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                </div>
              </div>
            </div>
          </section>
        </header>

        {/* NAVEGAÇÃO - Otimizada para SEO Semântico */}
        <nav 
          className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar scrollbar-hide py-2"
          aria-label="Links de navegação do painel"
        >
          <p className="px-5 mb-5 text-[9px] font-black text-zinc-700 uppercase tracking-[.4em]">Seções de Gestão</p>
          
          {navItems.map((item) => item.show && (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => `
                relative flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group outline-none
                ${isActive
                  ? "bg-yellow-500 text-black shadow-[0_15px_30px_-10px_rgba(234,179,8,0.3)] translate-x-1"
                  : "hover:bg-white/[0.03] hover:text-white focus:bg-white/[0.03]"}
              `}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-4 z-10">
                    <item.icon 
                      size={20} 
                      className={`shrink-0 transition-transform duration-500 ${isActive ? 'rotate-0' : 'group-hover:scale-110 group-hover:rotate-6'}`} 
                    />
                    <span className={`tracking-[.15em] text-[10px] font-black uppercase ${isActive ? 'italic' : ''}`}>
                      {item.label}
                    </span>
                  </div>

                  {isActive ? (
                    <div className="w-1.5 h-6 bg-black rounded-full" />
                  ) : (
                    <ChevronRight 
                      size={14} 
                      className="transition-all duration-300 opacity-0 -translate-x-2 group-hover:opacity-30 group-hover:translate-x-0" 
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* FOOTER - Utilitários de Saída Segura */}
        <footer className="p-6 bg-black/40 border-t border-white/5 space-y-2 mt-auto">
          <button
            onClick={() => logout?.()}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-red-500/5 text-zinc-500 hover:bg-red-500 hover:text-white transition-all duration-300 group"
            aria-label="Sair da conta administrativa"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[.2em]">Desconectar</span>
          </button>
        </footer>
      </aside>
    </>
  );
});

SideBar.displayName = 'SideBar';

export default SideBar;