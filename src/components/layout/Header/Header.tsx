import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, ShoppingCart, Menu as MenuIcon } from 'lucide-react';
import SearchBar from '../../searchs/SearchBar';
import NavBar from '../../NavBar/NavBar';

export default function Header() {
  // 1. Criamos o estado aqui
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-50">
      <div className="w-full bg-black py-4">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between gap-4 md:gap-6">
          
          <Link to="/" className="flex-shrink-0">
            <img
              src="/assets/images/logo.png" 
              alt="Gold Store Multimarcas"
              className="h-14 md:h-20 w-auto"
            />
          </Link>

          <div className="hidden md:flex flex-1 max-w-xl">
            <SearchBar />
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <Link to="/login" className="flex items-center gap-2 md:gap-3 group">
              <User className="w-8 h-8 text-white stroke-[1.2] group-hover:text-yellow-500 transition-colors" />
              <div className="hidden lg:flex flex-col text-left leading-none">
                <span className="text-[11px] text-gray-400 font-light">Olá, Cadastre-se</span>
                <span className="text-[15px] text-white font-bold group-hover:text-yellow-500 transition-colors">Fazer login</span>
              </div>
            </Link>

            <Link to="/cart" className="relative group p-1">
              <ShoppingCart className="w-8 h-8 text-white stroke-[1.2] group-hover:text-yellow-500 transition-colors" />
              <span className="absolute -top-1 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#f1b400] text-[12px] font-black text-black ring-2 ring-black">
                0
              </span>
            </Link>
            
            {/* 2. Botão que altera o estado para 'true' */}
            <button className="md:hidden text-white p-1 focus:outline-none" onClick={() => setMobileMenuOpen(true)}>
              <MenuIcon className="w-9 h-9" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Passamos o estado e a função de fechar para a NavBar */}
      <NavBar isOpen={isMobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div className="md:hidden bg-black px-4 pb-4">
        <SearchBar />
      </div>
    </header>
  );
}