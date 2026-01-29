import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  Settings,
  ShieldCheck,
  UserCircle, // Importado para o link de Perfil
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

  const navItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, show: true },
    { to: "/admin/usuarios", label: "Usuários", icon: Users, show: can("GERENCIAR_USUARIOS") },
    { to: "/admin/produtos", label: "Produtos", icon: Package, show: can("GERENCIAR_PRODUTOS") },
    { to: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag, show: can("VISUALIZAR_PEDIDOS") },
    { to: "/admin/permissoes", label: "Permissões", icon: ShieldCheck, show: isAdmin },
    // NOVO ITEM: Perfil Pessoal
    { to: "/perfil", label: "Meu Perfil", icon: UserCircle, show: true },
  ];

  return (
    <>
      {/* OVERLAY: Agora aparece em qualquer tela se o menu estiver aberto */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* SIDEBAR: Z-index maior que o header (50) para não ficar embaixo */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-[70]
          w-72 bg-zinc-950 text-white
          flex flex-col border-r border-white/10
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1.5 h-8 bg-yellow-500 rounded-full" />
            <h2 className="text-xl font-black uppercase italic leading-tight">
              Painel <br />
              <span className="text-yellow-500">{isAdmin ? "Admin" : "Suporte"}</span>
            </h2>
          </div>
          <div className="px-4">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Usuário</p>
            <p className="text-sm text-zinc-300 truncate font-medium">{user?.name}</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
          {navItems.map((item) => item.show && (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group
                ${isActive 
                  ? "bg-yellow-500 text-black font-bold shadow-lg" 
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"}
              `}
            >
              <item.icon size={20} className="shrink-0 transition-transform duration-300 group-hover:scale-110" />
              <span className="tracking-wide text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <NavLink
            to="/configuracoes"
            onClick={onClose}
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-zinc-500 hover:text-red-400 transition-all duration-300 group"
          >
            <Settings size={20} className="group-hover:rotate-90 transition-transform duration-500" />
            <span className="text-sm font-medium">Configurações</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
}