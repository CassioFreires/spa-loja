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
      {/* 2. LAYER DE CONTEÚDO (PRECISA SER RELATIVE E SEM OVERFLOW HIDDEN) */}
      <div className="relative z-10 w-full">
        
        {/* --- TOP BAR --- */}
        <div className="hidden md:flex w-full bg-zinc-900/30 border-b border-white/5 py-2">
          <div className="max-w-[1440px] mx-auto px-8 flex justify-between items-center w-full">
            <div className="flex items-center gap-1.5 text-zinc-400 text-[9px] font-black uppercase tracking-widest">
              <ShieldCheck size={12} className="text-yellow-500" /> Site 100% Seguro
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
              className="md:hidden text-white p-2 hover:bg-white/10 rounded-xl transition-all"
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon className="w-7 h-7" />
            </button>

            <Link to="/" className="flex-shrink-0 transition-transform active:scale-95">
              <div className="h-10 md:h-16 lg:h-20 w-auto">
                <img src="assets/images/logo.png" alt="Logo" className="h-full object-contain" />
              </div>
            </Link>

            <div className="hidden md:flex flex-1 max-w-2xl">
              <SearchBar />
            </div>

            <div className="flex items-center gap-2 md:gap-6">
              <div className="relative group italic text-white">
                {!isAuthenticated ? (
                  <Link to="/login" className="flex items-center gap-3 p-2.5 bg-white/5 rounded-2xl hover:bg-yellow-500 hover:text-black transition-all">
                    <User className="w-6 h-6 md:w-7 md:h-7" />
                  </Link>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className={`p-2.5 rounded-2xl border transition-all ${
                        isProfileOpen ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-white/5 text-yellow-500 border-white/10'
                      }`}
                    >
                      <User className="w-6 h-6 md:w-7 md:h-7" />
                    </button>
                    <ProfileDropdown isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
                  </div>
                )}
              </div>

              <Link to="/carrinho" className="relative p-2.5 bg-white/5 rounded-2xl hover:bg-zinc-800 transition-all">
                <ShoppingCart className="w-6 h-6 md:w-7 md:h-7 text-white" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-lg bg-yellow-500 text-[10px] font-black text-black ring-[3px] ring-black">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* --- NAVBAR (AQUI ESTÃO OS LINKS QUE NÃO APARECIAM) --- */}
        <NavBar
          isOpen={isMobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          onToggleAdminMenu={onToggleAdminMenu}
        />

        {/* SEARCH MOBILE */}
        <div className="md:hidden bg-black px-4 pb-4">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}