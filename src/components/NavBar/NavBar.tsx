import { useEffect, useState, type ReactNode } from 'react';
import {
  ChevronDown,
  X,
  Truck,
  Ruler,
  ShieldCheck,
  MessageSquare,
  LayoutGrid,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { getCategories } from '../../services/Categories/categories';
import { getSubcategories } from '../../services/Subcategories/subcategories';

/* =========================
   Tipagens
========================= */
interface NavBarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleAdminMenu?: () => void;
}

interface Category {
  name: string;
  path: string;
}

/* =========================
   Mock (fallback)
========================= */
const MOCK_CATEGORIES: Category[] = [
  { name: 'Camisas Dry Fit', path: '/categoria/dry-fit' },
  { name: 'Camisas de Times', path: '/categoria/times' },
  { name: 'Camisas Premium', path: '/categoria/premium' },
  { name: 'Shorts & Bermudas', path: '/categoria/shorts' },
  { name: 'Tênis Elite', path: '/categoria/tenis' },
  { name: 'Acessórios Gold', path: '/categoria/acessorios' },
];

/* =========================
   Links de Suporte
========================= */
const SUPORTE_LINKS = [
  { name: 'Rastreio', path: '/rastreio', icon: <Truck className="w-3.5 h-3.5" /> },
  { name: 'Guia de Medidas', path: '/guia-medidas', icon: <Ruler className="w-3.5 h-3.5" /> },
  { name: 'Segurança', path: '/seguranca', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  { name: 'Trocas', path: '/trocas', icon: <MessageSquare className="w-3.5 h-3.5" /> },
  { name: 'Feedback', path: '/feedback', icon: <StarIcon /> },
];

/* =========================
   Componente
========================= */
export default function NavBar({
  isOpen,
  onClose,
  onToggleAdminMenu,
}: NavBarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategorias, setSubCategorias] = useState<any[]>([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const { user, isAuthenticated } = useAuth();
  const hasAdminAccess =
    user?.role.name === 'ADMIN' || user?.role.name === 'SUPORTE';

  /* =========================
     Buscar categorias
  ========================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();

        if (Array.isArray(data) && data.length > 0) {
          const formatted: Category[] = data.map((cat) => ({
            name: cat.name,
            path: `/categoria/${cat.name
              .toLowerCase()
              .replace(/\s+/g, '-')}`,
          }));

          setCategories(formatted);
        } else {
          setCategories(MOCK_CATEGORIES);
        }
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        setCategories(MOCK_CATEGORIES);
      }
    };

    fetchCategories();

    const fetchSubcategories = async () => {
      try {
        const data = await getSubcategories(); // Exemplo com categoryId = 1
        console.log('Subcategorias:', data);
        if (!Array.isArray(data)) {
          throw new Error('Dados de subcategorias inválidos');
        }
        setSubCategorias(data);
        return data;
      } catch (error) {
        console.error('Erro ao buscar subcategorias:', error);
      }
    }
    fetchSubcategories()

  }, []);

  /* =========================
     Render
  ========================= */
  return (
    <>
      {/* ===== DESKTOP ===== */}
      <nav className="w-full bg-white border-b border-zinc-100 hidden md:block">
        <div className="max-w-[1440px] mx-auto px-8">
          <ul className="flex items-center justify-center gap-8 py-3.5">
            <NavLink to="/" label="Início" />

            {/* Categorias */}
            <Dropdown
              label="Categorias"
              items={categories.map((cat) => ({
                label: cat.name,
                to: cat.path,
              }))}
            />

            <NavLink to="/camisas-de-time" label="Camisas de Time" />

            {/* Suporte */}
            <Dropdown
              label="Suporte"
              items={SUPORTE_LINKS.map((link) => ({
                label: link.name,
                to: link.path,
                icon: link.icon,
              }))}
            />

            {/* Admin */}
            {isAuthenticated && hasAdminAccess && (
              <li>
                <button
                  onClick={onToggleAdminMenu}
                  className="flex items-center gap-2 text-[12px] font-black text-yellow-600 uppercase tracking-widest"
                >
                  <LayoutGrid className="w-4 h-4" />
                  Painel Admin
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>

      {/* ===== MOBILE ===== */}
      <div
        className={`fixed inset-0 z-[1000] md:hidden ${isOpen ? 'visible' : 'invisible'
          }`}
      >
        <div className="absolute inset-0 bg-black/60" onClick={onClose} />

        <aside
          className={`absolute left-0 top-0 h-full w-[80%] max-w-[300px] bg-white transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          <header className="flex items-center justify-between p-6 bg-black text-white">
            <span className="font-black text-yellow-500 italic text-xl">
              GOLD STORE
            </span>
            <X className="w-6 h-6 cursor-pointer" onClick={onClose} />
          </header>

          <ul>
            {isAuthenticated && hasAdminAccess && (
              <li className="border-b">
                <button
                  onClick={() => {
                    onClose();
                    onToggleAdminMenu?.();
                  }}
                  className="flex items-center gap-3 w-full p-6 font-black uppercase text-yellow-700"
                >
                  <LayoutGrid className="w-5 h-5" />
                  Abrir Painel Admin
                </button>
              </li>
            )}

            {/* Categorias */}
            <MobileAccordion
              title="Categorias"
              open={isCategoriesOpen}
              toggle={() => setIsCategoriesOpen(!isCategoriesOpen)}
            >
              {categories.map((cat) => (
                <MobileLink
                  key={cat.name}
                  to={cat.path}
                  onClick={onClose}
                >
                  {cat.name}
                </MobileLink>
              ))}
            </MobileAccordion>

            {/* Suporte */}
            <MobileAccordion
              title="Suporte"
              open={isHelpOpen}
              toggle={() => setIsHelpOpen(!isHelpOpen)}
            >
              {SUPORTE_LINKS.map((link) => (
                <MobileLink
                  key={link.name}
                  to={link.path}
                  onClick={onClose}
                >
                  {link.icon} {link.name}
                </MobileLink>
              ))}
            </MobileAccordion>

            <MobileLink to="/" onClick={onClose}>
              Início
            </MobileLink>
            <MobileLink to="/camisas-de-time" onClick={onClose}>
              Camisas de Time
            </MobileLink>
          </ul>
        </aside>
      </div>
    </>
  );
}

/* =========================
   Componentes Auxiliares
========================= */
function NavLink({ to, label }: { to: string; label: string }) {
  return (
    <li>
      <Link
        to={to}
        className="text-[12px] font-black uppercase tracking-widest hover:text-yellow-600"
      >
        {label}
      </Link>
    </li>
  );
}

function Dropdown({
  label,
  items,
}: {
  label: string;
  items: { label: string; to: string; icon?: ReactNode }[];
}) {
  return (
    <li className="relative group">
      {/* Botão */}
      <button className="flex items-center gap-1.5 text-[12px] font-black uppercase tracking-widest hover:text-yellow-600 transition-colors">
        {label}
        <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
      </button>

      {/* Hover bridge (área invisível) */}
      <div className="absolute left-0 top-full h-3 w-full" />

      {/* Menu */}
      <ul
        className="
          absolute left-0 top-full
          w-56
          bg-white
          shadow-2xl
          border border-zinc-100
          rounded-xl
          overflow-hidden
          z-[100]
          opacity-0 invisible
          group-hover:opacity-100 group-hover:visible
          transition-all duration-200
        "
      >
        {items.map((item) => (
          <Link key={item.label} to={item.to}>
            <li className="flex items-center gap-3 px-5 py-3 text-[11px] font-bold text-zinc-600 hover:bg-yellow-50 hover:text-black uppercase transition-colors">
              {item.icon && <span className="text-yellow-600">{item.icon}</span>}
              {item.label}
            </li>
          </Link>
        ))}
      </ul>
    </li>
  );
}

function MobileAccordion({
  title,
  open,
  toggle,
  children,
}: {
  title: string;
  open: boolean;
  toggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <li className="border-b">
      <button
        onClick={toggle}
        className="flex justify-between w-full p-6 font-black uppercase"
      >
        {title}
        <ChevronDown
          className={`w-4 h-4 transition ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div className={`bg-zinc-50 ${open ? 'block' : 'hidden'}`}>
        {children}
      </div>
    </li>
  );
}

function MobileLink({
  to,
  onClick,
  children,
}: {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block p-4 pl-10 text-[11px] font-bold uppercase text-zinc-500"
    >
      {children}
    </Link>
  );
}

function StarIcon() {
  return (
    <div className="flex gap-0.5">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="w-1 h-1 bg-yellow-500 rounded-full" />
      ))}
    </div>
  );
}
