import { useState, useMemo, memo } from 'react';
import {
  ChevronDown,
  X,
  Truck,
  LayoutGrid,
  Loader2,
  Package,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { useAuth } from '../../context/AuthContext';
import { getSubcategories } from '../../services/Subcategories/subcategories';

/* =========================
   Tipagens (Interfaces)
========================= */

interface Subcategory {
  id: string | number;
  name: string;
}

interface CategoryWithSub {
  id: string | number;
  name: string;
  description?: string;
  path?: string;
  subcategories: Subcategory[];
}

interface NavBarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleAdminMenu?: () => void;
}


/* =========================
   Sub-Componentes Memoizados
========================= */

const CategoryColumn = memo(({ cat, onClose }: { cat: CategoryWithSub, onClose: () => void }) => (
  <div className="flex flex-col gap-3 min-w-[180px] break-inside-avoid mb-8 group/col">
    <Link
      to={`/categoria/${cat.id}`}
      onClick={onClose}
      className="text-[11px] font-black uppercase text-zinc-950 hover:text-yellow-600 transition-colors border-b border-zinc-100 pb-2 italic tracking-tighter flex justify-between items-center"
    >
      {cat.name}
      <ChevronRight size={12} className="opacity-0 group-hover/col:opacity-100 transition-opacity text-yellow-500" />
    </Link>
    
    {cat.subcategories && cat.subcategories.length > 0 && (
      <ul className="space-y-2">
        {cat.subcategories.map((sub: Subcategory) => (
          <li key={sub.id}>
            <Link
              to={`/categoria/sub/${sub.id}`}
              onClick={onClose}
              className="text-[10px] font-bold uppercase text-zinc-500 hover:text-black transition-colors flex items-center gap-1.5 group/sub"
            >
              <ChevronRight size={10} className="text-zinc-300 group-hover/sub:text-yellow-500 transition-colors" />
              {sub.name}
            </Link>
          </li>
        ))}
      </ul>
    )}
  </div>
));

/* =========================
   Componente Principal
========================= */

export default function NavBar({ isOpen, onClose, onToggleAdminMenu }: NavBarProps) {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const hasAdminAccess = user?.role?.name === 'ADMIN' || user?.role?.name === 'SUPORTE';

  // O 'as any' aqui resolve o conflito de overload do React Query com o seu service
  const { data, isLoading } = useQuery({
    queryKey: ['subcategories-menu'],
    queryFn: getSubcategories as any, 
    staleTime: 1000 * 60 * 60, 
  });

  // Garantimos que 'categories' seja tratado como o tipo complexo que precisamos
  const categories = useMemo(() => (data as unknown as CategoryWithSub[]) || [], [data]);

  const filteredCategories = useMemo(() => 
    categories.filter((cat: CategoryWithSub) => cat.name.toLowerCase() !== 'camisas de time'),
    [categories]
  );

  return (
    <>
      {/* --- DESKTOP NAVBAR --- */}
      <nav className="w-full bg-white border-b border-zinc-100 hidden md:block sticky top-0 z-[1000] shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <ul className="flex items-center justify-center gap-6 lg:gap-10">
            <li>
              <Link to="/" className="text-[12px] font-black uppercase tracking-widest hover:text-yellow-600 transition-colors py-5 block">
                Início
              </Link>
            </li>

            {/* MEGA MENU ESCALÁVEL */}
            <li className="group static">
              <button className="flex items-center gap-1.5 text-[12px] font-black uppercase tracking-widest py-5 outline-none hover:text-yellow-600 transition-colors">
                Categorias <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
              </button>

              <div className="absolute left-0 right-0 top-full bg-white shadow-2xl border-t border-zinc-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[9999] translate-y-2 group-hover:translate-y-0 overflow-hidden">
                <div className="max-w-[1440px] mx-auto p-8 lg:p-12">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12"><Loader2 className="animate-spin text-yellow-500" /></div>
                  ) : (
                    <div className="columns-2 lg:columns-3 xl:columns-4 gap-x-12 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
                      {filteredCategories.map((cat: CategoryWithSub) => (
                        <CategoryColumn key={cat.id} cat={cat} onClose={onClose} />
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-zinc-50 p-4 border-t border-zinc-100 flex justify-center">
                   <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest italic">Gold Store Signature Collection</p>
                </div>
              </div>
            </li>

            <li>
              <Link to="/mantos" className="text-[12px] font-black uppercase tracking-widest text-yellow-600 hover:text-yellow-700 transition-all py-5 block">
                Camisas de Time
              </Link>
            </li>

            <li className="relative group">
              <button className="flex items-center gap-1.5 text-[12px] font-black uppercase tracking-widest py-5 outline-none hover:text-yellow-600 transition-colors">
                Suporte <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
              </button>
              <ul className="absolute left-0 top-full w-56 bg-white shadow-xl border border-zinc-100 rounded-b-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[999]">
                {['Rastreio', 'Guia de Medidas', 'Segurança', 'Trocas'].map((item: string) => (
                  <li key={item}>
                    <Link 
                      to={`/${item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, '-')}`} 
                      className="block px-6 py-2.5 text-[10px] font-bold uppercase text-zinc-600 hover:bg-zinc-50 hover:text-black transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li className="border-l border-zinc-200 pl-8 ml-2">
              <Link to="/meus-pedidos" className="flex items-center gap-2 text-[12px] font-black text-zinc-900 uppercase tracking-widest hover:text-yellow-600 transition-all italic group">
                <Package className="w-4 h-4 text-yellow-600 transition-transform group-hover:-translate-y-0.5" /> Meus Pedidos
              </Link>
            </li>

            {isAuthenticated && hasAdminAccess && (
              <li>
                <button onClick={onToggleAdminMenu} className="flex items-center gap-2 text-[10px] font-black text-white bg-zinc-950 px-5 py-2 rounded-full hover:bg-yellow-600 transition-all uppercase tracking-widest shadow-lg shadow-zinc-200">
                  <LayoutGrid className="w-3.5 h-3.5" /> Painel
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>

      {/* --- MOBILE SIDEBAR --- */}
      <div className={`fixed inset-0 z-[9999] md:hidden ${isOpen ? 'visible' : 'invisible'} transition-all`}>
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
          onClick={onClose} 
        />
        <aside className={`absolute left-0 top-0 h-full w-[85%] max-w-[340px] bg-white transition-transform duration-500 shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <header className="flex items-center justify-between p-6 border-b border-zinc-100 flex-shrink-0">
            <span className="font-black text-black italic text-xl tracking-tighter uppercase">Gold Store</span>
            <button onClick={onClose} className="p-2 bg-zinc-100 rounded-full active:scale-90 transition-transform">
               <X className="w-5 h-5" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            <Link to="/meus-pedidos" onClick={onClose} className="flex items-center justify-between p-5 bg-zinc-950 text-white rounded-2xl mb-2 shadow-xl shadow-zinc-900/20">
              <div className="flex items-center gap-3">
                <Package className="text-yellow-500 w-5 h-5" />
                <span className="text-[11px] font-black uppercase tracking-widest italic">Meus Pedidos</span>
              </div>
              <ChevronRight size={14} />
            </Link>

            <div className="border border-zinc-100 rounded-2xl overflow-hidden shadow-sm">
              <button 
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center justify-between w-full p-5 font-black uppercase text-[12px] tracking-widest bg-zinc-50 italic"
              >
                Categorias <ChevronDown className={`w-4 h-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              <div className={`${isCategoriesOpen ? 'max-h-[3000px]' : 'max-h-0'} transition-all duration-700 ease-in-out overflow-hidden bg-white`}>
                {filteredCategories.map((cat: CategoryWithSub) => (
                  <div key={cat.id} className="border-t border-zinc-50 p-5 pl-7">
                    <Link 
                      to={`/categoria/${cat.id}`} 
                      onClick={onClose} 
                      className="block text-[11px] font-black uppercase text-zinc-950 mb-3 border-l-2 border-yellow-500 pl-3 italic"
                    >
                      {cat.name}
                    </Link>
                    <div className="space-y-3 pl-3">
                      {cat.subcategories?.map((sub: Subcategory) => (
                        <Link 
                          key={sub.id} 
                          to={`/categoria/sub/${sub.id}`} 
                          onClick={onClose} 
                          className="block text-[10px] font-bold uppercase text-zinc-500 active:text-black"
                        >
                          └ {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link to="/mantos" onClick={onClose} className="block p-5 text-[12px] font-black uppercase tracking-widest text-yellow-600 border border-zinc-100 rounded-2xl italic">
              Camisas de Time
            </Link>

            <div className="py-4 space-y-1">
               <p className="px-5 text-[9px] font-black text-zinc-300 uppercase tracking-widest mb-2 italic">Institucional</p>
               {['Rastreio', 'Guia de Medidas', 'Segurança', 'Trocas'].map((item: string) => (
                 <Link 
                  key={item} 
                  to={`/${item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, '-')}`} 
                  onClick={onClose} 
                  className="block p-4 px-5 text-[11px] font-bold uppercase text-zinc-500"
                >
                  {item}
                 </Link>
               ))}
            </div>
          </div>
          
          <footer className="p-6 border-t border-zinc-100 bg-zinc-50/50">
             <div className="flex items-center gap-3 text-zinc-400">
                <Truck size={14} /> <span className="text-[9px] font-black uppercase tracking-tighter italic">Enviamos para todo Brasil</span>
             </div>
          </footer>
        </aside>
      </div>
    </>
  );
}