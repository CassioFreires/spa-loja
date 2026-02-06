import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  Settings,
  ShieldCheck,
  UserCircle,
  PlusCircle,
  TrendingUp // Ícone para Ofertas
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideBar({ isOpen, onClose }: SideBarProps) {
  const { user } = useAuth();
  const isAdmin = user?.role.name === "ADMIN";
  const permissions = user?.permissions || [];
  const can = (permission: string) => permissions.includes(permission);

  // Lista de navegação inteligente atualizada
  const navItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, show: true },
    { to: "/admin/produtos", label: "Meus Produtos", icon: Package, show: can("GERENCIAR_PRODUTOS") },
    { to: "/admin/produto/adicionar", label: "Cadastrar Novo", icon: PlusCircle, show: can("GERENCIAR_PRODUTOS") },
    
    // --- ITEM ADICIONADO: GESTÃO DE OFERTAS ---
    { 
      to: "/admin/produto/desconto", 
      label: "Gestão de Ofertas", 
      icon: TrendingUp, 
      show: can("GERENCIAR_PRODUTOS") // Geralmente quem gerencia produtos gerencia as ofertas
    },
    
    { to: "/admin/pedidos", label: "Vendas & Pedidos", icon: ShoppingBag, show: can("VISUALIZAR_PEDIDOS") },
    { to: "/admin/usuarios", label: "Gestão de Usuários", icon: Users, show: can("GERENCIAR_USUARIOS") },
    { to: "/admin/permissoes", label: "Permissões", icon: ShieldCheck, show: isAdmin },
    { to: "/perfil", label: "Meu Perfil", icon: UserCircle, show: true },
  ];

  return (
    <>
      {/* OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-[70]
          w-72 bg-zinc-950 text-white
          flex flex-col border-r border-white/10
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* HEADER DA SIDEBAR */}
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 bg-yellow-500 rounded-full" />
            <h2 className="text-xl font-black uppercase italic leading-tight tracking-tighter">
              Gold <span className="text-yellow-500">Admin</span>
            </h2>
          </div>
          
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
            <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-1">Acesso Nível</p>
            <p className="text-xs font-bold text-yellow-500 uppercase italic">
                {isAdmin ? "Administrador Master" : "Equipe de Suporte"}
            </p>
            <div className="mt-3 pt-3 border-t border-white/5">
                <p className="text-sm text-zinc-300 truncate font-medium italic">{user?.name}</p>
            </div>
          </div>
        </div>

        {/* LINKS DE NAVEGAÇÃO */}
        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => item.show && (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group
                ${isActive 
                  ? "bg-yellow-500 text-black font-black shadow-[0_10px_20px_-10px_rgba(234,179,8,0.5)] italic scale-[1.02]" 
                  : "text-zinc-500 hover:bg-white/5 hover:text-white"}
              `}
            >
              <item.icon size={20} className={`shrink-0 transition-transform duration-300 ${isOpen ? 'group-hover:rotate-12' : ''}`} />
              <span className="tracking-widest text-[11px] font-black uppercase">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* RODAPÉ DA SIDEBAR */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <NavLink
            to="/configuracoes"
            onClick={onClose}
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-zinc-600 hover:text-white transition-all group"
          >
            <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">Configurações</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
}