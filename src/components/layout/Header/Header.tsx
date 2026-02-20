import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, ShoppingCart, Menu as MenuIcon, ShieldCheck } from 'lucide-react';

import SearchBar from '../../searchs/SearchBar';
import NavBar from '../../NavBar/NavBar';
import ProfileDropdown from '../../ProfileDropdown/ProfileDropdown';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';

interface HeaderProps {
  onToggleAdminMenu?: () => void;
}

export default function Header({ onToggleAdminMenu }: HeaderProps) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { totalItems } = useCart();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  return (
    <header
      className={`w-full sticky top-0 z-[100] transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-md shadow-2xl' : 'bg-black'
      }`}
      role="banner"
    >
      {/* 2. LAYER DE CONTEÚDO: Relative z-10 para ficar acima do Canvas e SEM overflow-hidden */}
      <div className="relative z-10 w-full">
        
        {/* --- TOP BAR (TRUST & INFO) --- */}
        <div className="hidden md:flex w-full bg-zinc-900/50 border-b border-white/5 py-2">
          <div className="max-w-[1440px] mx-auto px-8 flex justify-between items-center w-full">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-zinc-400 text-[9px] font-black uppercase tracking-widest">
                <ShieldCheck size={12} className="text-yellow-500" /> Site 100% Seguro
              </div>
            </div>
            <span className="text-zinc-500 text-[9px] font-black uppercase tracking-widest italic">
              Qualidade Tailandesa 1:1 • Envio para todo Brasil
            </span>
          </div>
        </div>

        {/* --- MAIN HEADER --- */}
        <div className="w-full py-3 md:py-5 px-4 md:px-8">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4 md:gap-10">
            <button
              aria-label="Abrir menu de navegação"
              className="md:hidden text-white p-2 hover:bg-white/10 rounded-xl transition-all active:scale-90"
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon className="w-7 h-7" />
            </button>

            <Link
              to="/"
              className="flex-shrink-0 flex items-center justify-center transition-transform active:scale-95 duration-300"
              aria-label="Gold Store - Início"
            >
              <div className="relative h-10 md:h-16 lg:h-20 w-auto aspect-[3/1] flex items-center">
                <img
                  src="assets/images/logo.png"
                  alt="Logo Gold Store Multimarcas"
                  className="h-full w-full object-contain"
                  loading="eager"
                  fetchPriority="high"
                  onLoad={(e) => (e.currentTarget.style.opacity = "1")}
                  style={{ opacity: 0, transition: "opacity 0.2s ease-in" }}
                />
              </div>
            </Link>

            <div className="hidden md:flex flex-1 max-w-2xl animate-in fade-in slide-in-from-top-1 duration-500">
              <SearchBar />
            </div>

            <div className="flex items-center gap-2 md:gap-6">
              <div className="relative group italic">
                {!isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <Link to="/login" className="p-2.5 bg-white/5 hover:bg-yellow-500 hover:text-black rounded-2xl transition-all duration-300 group shadow-xl">
                      <User className="w-6 h-6 md:w-7 md:h-7 stroke-[1.5]" />
                    </Link>
                    <div className="hidden lg:flex flex-col text-left leading-tight">
                      <Link to="/cadastre-se" className="text-[9px] text-zinc-500 font-black uppercase tracking-widest hover:text-yellow-500 transition-colors">Olá, Cadastre-se</Link>
                      <Link to="/login" className="text-[13px] text-white font-black uppercase tracking-tighter hover:text-yellow-500 transition-colors">Minha Conta</Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsProfileOpen((prev) => !prev)}
                      className={`p-2.5 rounded-2xl transition-all duration-300 shadow-xl border ${isProfileOpen ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-white/5 text-yellow-500 border-white/10 hover:border-yellow-500/50'}`}
                    >
                      <User className="w-6 h-6 md:w-7 md:h-7 stroke-[2]" />
                    </button>
                    <div className="hidden lg:flex flex-col text-left leading-tight cursor-pointer" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                      <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Bem-vindo,</span>
                      <span className="text-[13px] text-white font-black uppercase tracking-tighter truncate max-w-[100px]">{user?.name.split(' ')[0]}</span>
                    </div>
                    <ProfileDropdown isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
                  </div>
                )}
              </div>

              <Link to="/carrinho" className="relative p-2.5 bg-white/5 hover:bg-zinc-800 rounded-2xl transition-all duration-300 group shadow-xl active:scale-90">
                <ShoppingCart className="w-6 h-6 md:w-7 md:h-7 text-white stroke-[1.5] group-hover:text-yellow-500 transition-colors" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-lg bg-yellow-500 text-[10px] md:text-[11px] font-black text-black ring-[3px] ring-black animate-in zoom-in duration-500">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* --- NAVIGATION MENU --- */}
        <NavBar
          isOpen={isMobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          onToggleAdminMenu={onToggleAdminMenu}
        />

        {/* --- MOBILE SEARCH BAR --- */}
        <div className="md:hidden bg-black px-4 pb-4 animate-in slide-in-from-top-2 duration-300">
          <SearchBar />
        </div>
      </div>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Gold Store Multimarcas",
          "url": window.location.origin,
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${window.location.origin}/busca?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
    </header>
  );
}