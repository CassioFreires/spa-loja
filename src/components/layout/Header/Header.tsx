import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, ShoppingCart, Menu as MenuIcon } from 'lucide-react';

import SearchBar from '../../searchs/SearchBar';
import NavBar from '../../NavBar/NavBar';
import { useAuth } from '../../../context/AuthContext';

interface HeaderProps {
  onToggleAdminMenu?: () => void;
}

export default function Header({ onToggleAdminMenu }: HeaderProps) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Faixa Principal */}
      <div className="w-full bg-black py-4 shadow-xl border-b border-white/5">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between gap-4 md:gap-6">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 transition-transform active:scale-95">
            <img
              src="assets/images/logo.png"
              alt="Gold Store Multimarcas"
              className="h-12 md:h-20 w-auto"
            />
          </Link>

          {/* Busca Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <SearchBar />
          </div>

          {/* Ações do Usuário */}
          <div className="flex items-center gap-3 md:gap-6">

            {/* Conta / Perfil */}
            <div className="relative flex items-center gap-2 md:gap-3">

              {/* ================= DESLOGADO ================= */}
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    className="p-1 hover:bg-white/10 rounded-full transition-colors group"
                  >
                    <User className="w-7 h-7 md:w-8 md:h-8 text-white stroke-[1.2] group-hover:text-yellow-500 transition-colors" />
                  </Link>

                  <div className="hidden lg:flex flex-col text-left leading-none">
                    <Link
                      to="/cadastre-se"
                      className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hover:text-yellow-500 transition-colors mb-1"
                    >
                      Olá, Cadastre-se
                    </Link>

                    <Link
                      to="/login"
                      className="text-[14px] text-white font-black uppercase italic tracking-tighter hover:text-yellow-500 transition-colors"
                    >
                      Minha Conta
                    </Link>
                  </div>
                </>
              )}

              {/* ================= LOGADO ================= */}
              {isAuthenticated && (
                <>
                  <button
                    onClick={() => setIsProfileOpen((prev) => !prev)}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors group"
                  >
                    <User className="w-7 h-7 md:w-8 md:h-8 text-yellow-500 stroke-[1.5]" />
                  </button>

                  <div className="hidden lg:flex flex-col text-left leading-none">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                      Olá,
                    </span>
                    <span className="text-[14px] text-white font-black uppercase italic tracking-tighter">
                      {user?.name.split(' ')[0]}
                    </span>
                  </div>

                  {/* Dropdown Perfil */}
                  {isProfileOpen && (
                    <div className="absolute right-0 top-12 w-52 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                      <ul className="flex flex-col text-sm">

                        <li>
                          <Link
                            to="/perfil"
                            className="block px-4 py-3 text-white hover:bg-yellow-500 hover:text-black transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            Meus Dados
                          </Link>
                        </li>

                        <li>
                          <Link
                            to="/configuracoes"
                            className="block px-4 py-3 text-white hover:bg-yellow-500 hover:text-black transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            Configurações
                          </Link>
                        </li>

                        <li>
                          <Link
                            to="/meus-pedidos"
                            className="block px-4 py-3 text-white hover:bg-yellow-500 hover:text-black transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            Meus Pedidos
                          </Link>
                        </li>

                        <li className="border-t border-white/10">
                          <button
                            onClick={() => {
                              logout();
                              setIsProfileOpen(false);
                            }}
                            className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                          >
                            Sair
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Carrinho */}
            <Link
              to="/cart"
              className="relative group p-1 transition-transform active:scale-90"
            >
              <ShoppingCart className="w-7 h-7 md:w-8 md:h-8 text-white stroke-[1.2] group-hover:text-yellow-500 transition-colors" />
              <span className="absolute -top-1 -right-2 flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full bg-yellow-500 text-[10px] md:text-[12px] font-black text-black ring-2 ring-black">
                0
              </span>
            </Link>

            {/* Menu Mobile */}
            <button
              className="md:hidden text-white p-1 focus:outline-none transition-colors hover:text-yellow-500"
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>

      {/* Menu de Navegação - AGORA RECEBENDO A FUNÇÃO DO PAINEL */}
      <NavBar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        onToggleAdminMenu={onToggleAdminMenu} 
      />

      {/* Busca Mobile */}
      <div className="md:hidden bg-black px-4 pb-4 border-b border-white/5">
        <SearchBar />
      </div>
    </header>
  );
}