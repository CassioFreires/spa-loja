import { useState } from 'react';
import {
  ChevronDown,
  X,
  Truck,
  Ruler,
  ShieldCheck,
  MessageSquare,
  LayoutGrid,
  Loader2,
  Package
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; // Hook de cache

import { useAuth } from '../../context/AuthContext';
import { getSubcategories } from '../../services/Subcategories/subcategories';

/* =========================
   Tipagens
========================= */
interface Subcategory {
  id: string | number;
  name: string;
  description?: string;
  category_id?: string | number;
}

interface CategoryWithSub {
  id: string | number;
  name: string;
  description?: string;
  subcategories?: Subcategory[];
  path?: string;
}

interface NavBarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleAdminMenu?: () => void;
}

const SUPORTE_LINKS = [
  { name: 'Rastreio', path: '/rastreamento-do-pedido', icon: <Truck className="w-3.5 h-3.5" /> },
  { name: 'Guia de Medidas', path: '/guia-de-medidas', icon: <Ruler className="w-3.5 h-3.5" /> },
  { name: 'Segurança', path: '/seguranca', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  { name: 'Trocas', path: '/trocas', icon: <MessageSquare className="w-3.5 h-3.5" /> },
];

/* =========================
   Sub-Componentes (Desktop)
========================= */

function DropdownCategories({
  categories,
  isLoading
}: {
  categories: CategoryWithSub[],
  isLoading: boolean
}) {
  return (
    <li className="relative group">
      <button className="flex items-center gap-1.5 text-[12px] font-black uppercase tracking-widest hover:text-yellow-600 transition-colors py-2">
        Categorias
        <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
      </button>

      <ul className="absolute left-0 top-full w-64 bg-white shadow-2xl border border-zinc-100 rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100]">

        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
          </div>
        )}

        {!isLoading && categories.map((cat) => {
          const hasSubs = cat.subcategories && cat.subcategories.length > 0;

          return (
            <li key={cat.id} className="relative group/sub">
              <Link
                to={cat.path || `/categoria/${cat.id}`}
                className="flex justify-between items-center px-5 py-3 text-[11px] font-bold uppercase text-zinc-600 hover:bg-yellow-50 hover:text-black transition-colors"
              >
                {cat.name}
                {hasSubs && <ChevronDown className="w-3 h-3 -rotate-90 text-zinc-400" />}
              </Link>

              {hasSubs && (
                <ul className="
                  absolute left-[100%] top-[-8px] ml-[2px] 
                  w-60 bg-white border border-zinc-100 shadow-2xl rounded-xl py-2 
                  opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible 
                  transition-all duration-200 z-[110]
                  max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-200
                ">
                  {cat.subcategories?.map((sub) => (
                    <li key={sub.id}>
                      <Link
                        to={`/categoria/sub/${sub.id}`}
                        className="block px-5 py-3 text-[11px] font-bold uppercase text-zinc-600 hover:bg-yellow-50 hover:text-black transition-colors"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </li>
  );
}

/* =========================
   Componente Principal NavBar
========================= */
export default function NavBar({ isOpen, onClose, onToggleAdminMenu }: NavBarProps) {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const { user, isAuthenticated } = useAuth();
  const hasAdminAccess = user?.role.name === 'ADMIN' || user?.role.name === 'SUPORTE';

  // --- IMPLEMENTAÇÃO DO CACHE ---
  const { data: categories = [], isLoading } = useQuery<CategoryWithSub[]>({
    queryKey: ['subcategories-menu'],
    queryFn: getSubcategories,
    staleTime: Infinity, // Os dados nunca ficam "velhos" na sessão atual
  });

  return (
    <>
      {/* DESKTOP */}
      <nav className="w-full bg-white border-b border-zinc-100 hidden md:block">
        <div className="max-w-[1440px] mx-auto px-8">
          <ul className="flex items-center justify-center gap-8 py-3.5">
            <li>
              <Link to="/" className="text-[12px] font-black uppercase tracking-widest hover:text-yellow-600 transition-colors">
                Início
              </Link>
            </li>

            <DropdownCategories categories={categories} isLoading={isLoading} />

            <li>
              <Link to="/camisas-de-time" className="text-[12px] font-black uppercase tracking-widest hover:text-yellow-600 transition-colors">
                Camisas de Time
              </Link>
            </li>

            <DropdownStatic
              label="Suporte"
              items={SUPORTE_LINKS.map(l => ({ label: l.name, to: l.path, icon: l.icon }))}
            />

            {/* LINK DIFERENCIADO: MEUS PEDIDOS (Apenas Logados) */}
            {isAuthenticated && (
              <li>
                <Link to="/meus-pedidos" className="flex items-center gap-2 text-[12px] font-black text-zinc-900 uppercase tracking-widest hover:text-yellow-600 transition-all italic border-l pl-8 border-zinc-200 ml-2">
                  <Package className="w-4 h-4 text-yellow-600" /> Meus Pedidos
                </Link>
              </li>
            )}

            {/* PAINEL ADMIN */}
            {isAuthenticated && hasAdminAccess && (
              <li>
                <button onClick={onToggleAdminMenu} className="flex items-center gap-2 text-[12px] font-black text-yellow-600 uppercase tracking-widest hover:opacity-80 transition-all">
                  <LayoutGrid className="w-4 h-4" /> Painel Admin
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>

      {/* MOBILE */}
      <div className={`fixed inset-0 z-[1000] md:hidden ${isOpen ? 'visible' : 'invisible'} transition-all`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <aside className={`absolute left-0 top-0 h-full w-[85%] max-w-[320px] bg-white transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <header className="flex items-center justify-between p-6 bg-black text-white">
            <span className="font-black text-yellow-500 italic text-xl">GOLD STORE</span>
            <X className="w-6 h-6 cursor-pointer" onClick={onClose} />
          </header>

          <div className="overflow-y-auto h-[calc(100%-80px)]">
            {/* LINK DIFERENCIADO MOBILE: MEUS PEDIDOS */}
            {isAuthenticated && (
              <Link
                to="/meus-pedidos"
                onClick={onClose}
                className="flex items-center gap-4 p-6 font-black uppercase text-[12px] tracking-widest text-white bg-zinc-900 border-b border-white/10"
              >
                <Package className="w-5 h-5 text-yellow-500" /> Meus Pedidos
              </Link>
            )}

            <MobileAccordion title="Categorias" open={isCategoriesOpen} toggle={() => setIsCategoriesOpen(!isCategoriesOpen)}>
              {categories.map((cat) => (
                <div key={cat.id}>
                  <Link to={`/categoria/${cat.id}`} onClick={onClose} className="block p-4 pl-8 text-[11px] font-bold uppercase bg-zinc-50">{cat.name}</Link>
                  {cat.subcategories?.map((sub) => (
                    <Link key={sub.id} to={`/categoria/sub/${sub.id}`} onClick={onClose} className="block p-3 pl-12 text-[10px] text-zinc-500">└ {sub.name}</Link>
                  ))}
                </div>
              ))}
            </MobileAccordion>

            {/* Links de Suporte no Mobile */}
            <div className="py-4">
              {SUPORTE_LINKS.map(link => (
                <Link key={link.path} to={link.path} onClick={onClose} className="flex items-center gap-3 p-4 pl-6 text-[11px] font-bold uppercase text-zinc-600 hover:text-black">
                  {link.icon} {link.name}
                </Link>
              ))}
            </div>

            {/* PAINEL ADMIN MOBILE */}
            {isAuthenticated && hasAdminAccess && (
              <button
                onClick={() => { onClose(); onToggleAdminMenu?.(); }}
                className="flex items-center gap-4 w-full p-6 font-black uppercase text-[12px] tracking-widest text-yellow-600 border-t border-zinc-100"
              >
                <LayoutGrid className="w-5 h-5" /> Painel Admin
              </button>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}

/* =========================
   Ajudantes
========================= */
function DropdownStatic({ label, items }: { label: string; items: any[] }) {
  return (
    <li className="relative group">
      <button className="flex items-center gap-1.5 text-[12px] font-black uppercase py-2 tracking-widest hover:text-yellow-600">
        {label} <ChevronDown className="w-3 h-3" />
      </button>
      <ul className="absolute left-0 top-full w-56 bg-white shadow-2xl border border-zinc-100 rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100]">
        {items.map((item) => (
          <li key={item.label}><Link to={item.to} className="flex items-center gap-3 px-5 py-3 text-[11px] font-bold uppercase text-zinc-600 hover:bg-yellow-50 hover:text-black">{item.icon} {item.label}</Link></li>
        ))}
      </ul>
    </li>
  );
}

function MobileAccordion({ title, open, toggle, children }: { title: string; open: boolean; toggle: () => void; children: React.ReactNode }) {
  return (
    <div className="border-b border-zinc-100">
      <button onClick={toggle} className="flex justify-between w-full p-6 font-black uppercase text-[12px] tracking-widest">{title} <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} /></button>
      <div className={`${open ? 'block' : 'hidden'} bg-white`}>{children}</div>
    </div>
  );
}