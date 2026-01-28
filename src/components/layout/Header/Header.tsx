import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, ShoppingCart, Menu as MenuIcon } from 'lucide-react';
import SearchBar from '../../searchs/SearchBar';
import NavBar from '../../NavBar/NavBar';

export default function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            
            {/* Bloco de Conta/Cadastro */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Ícone levará para login por padrão */}
              <Link to="/login" className="p-1 hover:bg-white/10 rounded-full transition-colors group">
                <User className="w-7 h-7 md:w-8 md:h-8 text-white stroke-[1.2] group-hover:text-yellow-500 transition-colors" />
              </Link>
              
              <div className="hidden lg:flex flex-col text-left leading-none">
                {/* Link de Cadastro Corrigido */}
                <Link 
                  to="/cadastre-se" 
                  className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hover:text-yellow-500 transition-colors mb-1"
                >
                  Olá, Cadastre-se
                </Link>
                
                {/* Link de Login */}
                <Link 
                  to="/login" 
                  className="text-[14px] text-white font-black uppercase italic tracking-tighter hover:text-yellow-500 transition-colors"
                >
                  Minha Conta
                </Link>
              </div>
            </div>

            {/* Carrinho com Contador Gold */}
            <Link to="/cart" className="relative group p-1 transition-transform active:scale-90">
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

      {/* Menu de Navegação / Categorias */}
      <NavBar isOpen={isMobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Busca Mobile (Apenas em telas pequenas) */}
      <div className="md:hidden bg-black px-4 pb-4 border-b border-white/5">
        <SearchBar />
      </div>
    </header>
  );
}