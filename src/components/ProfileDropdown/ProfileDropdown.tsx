import { 
  User, 
  Settings, 
  LogOut, 
  Package, 
  ShieldCheck, 
  ChevronRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileDropdown({ isOpen, onClose }: ProfileDropdownProps) {
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full pt-4 z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Overlay invisível para fechar ao clicar fora */}
      <div className="fixed inset-0 z-[-1]" onClick={onClose} />

      <div className="w-72 bg-white border border-zinc-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2rem] overflow-hidden">
        
        {/* Header do Perfil */}
        <header className="p-6 bg-zinc-950 text-white italic">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center text-zinc-950 shadow-lg shadow-yellow-500/20">
              <User size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-black uppercase text-yellow-500 tracking-widest mb-1.5">Membro Gold</span>
              <h4 className="text-base font-black uppercase tracking-tighter truncate max-w-[140px]">
                {user?.name?.split(' ')[0] || 'Usuário'}
              </h4>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/5">
            <ShieldCheck size={12} className="text-yellow-500" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Acesso Protegido</span>
          </div>
        </header>

        {/* Links */}
        <nav className="p-2 bg-white italic">
          <DropdownItem to="/meus-pedidos" icon={<Package size={18} />} label="Rastrear Pedidos" onClick={onClose} />
          {/* <DropdownItem to="/favoritos" icon={<Heart size={18} />} label="Meus Desejos" onClick={onClose} /> */}
          <DropdownItem to="/perfil/configuracoes" icon={<Settings size={18} />} label="Minha Conta" onClick={onClose} />

          <div className="h-px bg-zinc-50 my-2 mx-4" />

          <button
            onClick={() => { logout(); onClose(); }}
            className="w-full flex items-center justify-between px-5 py-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-100 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-colors">
                <LogOut size={16} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Encerrar Sessão</span>
            </div>
            <ChevronRight size={14} className="opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </button>
        </nav>
      </div>
    </div>
  );
}

function DropdownItem({ to, icon, label, onClick }: { to: string; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className="flex items-center justify-between px-5 py-4 text-zinc-600 hover:bg-zinc-950 hover:text-yellow-500 rounded-2xl transition-all group"
    >
      <div className="flex items-center gap-4">
        <span className="text-zinc-400 group-hover:text-yellow-500 transition-colors">{icon}</span>
        <span className="text-xs font-black uppercase tracking-widest">{label}</span>
      </div>
      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
    </Link>
  );
}