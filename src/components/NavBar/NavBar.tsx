import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Link } from 'react-router-dom';

// 1. Definimos a "Interface" para as props
interface NavBarProps {
  isOpen: boolean;    // Indica se o menu mobile está aberto
  onClose: () => void; // Função que fecha o menu
}

export default function NavBar({ isOpen, onClose }: NavBarProps) {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const links = [
    { name: 'INÍCIO', path: '/' },
    { name: 'CAMISAS DE TIME', path: '/camisas-de-time' },
    { name: 'RASTREAMENTO DE PEDIDO', path: '/rastreio' },
    { name: 'GUIA DE MEDIDAS', path: '/guia-medidas' },
    { name: 'POLÍTICA DE SEGURANÇA', path: '/seguranca' },
    { name: 'TROCAS E DEVOLUÇÕES', path: '/trocas' },
    { name: 'FEEDBACK DE CLIENTES', path: '/feedback' },
  ];

  const categorias = [
    { name: 'Camisas Dry Fit', path: '/categoria/dry-fit' },
    { name: 'Camisas de Times', path: '/categoria/times' },
    { name: 'Camisas Premium', path: '/categoria/premium' },
    { name: 'Shorts (Jeans/Dry Fit)', path: '/categoria/shorts' },
    { name: 'Tênis (Nike/Adidas)', path: '/categoria/tenis' },
    { name: 'Acessórios (Bonés/Bags)', path: '/categoria/acessorios' },
  ];

  return (
    <>
      {/* --- DESKTOP NAVBAR (Centralizada) --- */}
      <nav className="w-full bg-white border-b border-gray-200 hidden md:block">
        <div className="max-w-[1440px] mx-auto px-8">
          <ul className="flex items-center justify-center gap-8 py-4">
            <li className="relative group">
              <button className="flex items-center gap-1 text-[13px] font-bold text-black hover:text-yellow-600 transition-colors uppercase">
                CATEGORIAS <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute left-0 mt-2 w-64 bg-white shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] rounded-b-lg">
                <ul className="py-2 text-left">
                  {categorias.map((cat) => (
                    <Link key={cat.name} to={cat.path}>
                      <li className="px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 border-b border-gray-50 last:border-0 transition-colors">
                        {cat.name}
                      </li>
                    </Link>
                  ))}
                </ul>
              </div>
            </li>

            {links.map((link) => (
              <li key={link.name}>
                <Link to={link.path} className="text-[13px] font-bold text-black hover:text-yellow-600 transition-all duration-300 uppercase">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* --- MOBILE SIDEBAR --- */}
      <div className={`fixed inset-0 z-[1000] transition-opacity duration-300 md:hidden ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
        <div className={`absolute left-0 top-0 h-full w-[85%] max-w-xs bg-white shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          
          <div className="flex items-center justify-between p-5 border-b bg-black text-white">
            <span className="font-bold text-yellow-500 text-lg">GOLD STORE</span>
            <X className="w-7 h-7 cursor-pointer" onClick={onClose} />
          </div>
          
          <ul className="flex flex-col h-full overflow-y-auto">
            {/* Seção de Categorias no Mobile (Accordion) */}
            <li className="border-b border-gray-100">
              <button 
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center justify-between w-full p-5 text-[15px] font-bold text-black uppercase"
              >
                Categorias 
                <ChevronDown className={`w-5 h-5 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Lista de Categorias Expandível */}
              <div className={`bg-gray-50 overflow-hidden transition-all duration-300 ${isCategoriesOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
                {categorias.map((cat) => (
                  <Link 
                    key={cat.name} 
                    to={cat.path} 
                    className="block p-4 pl-8 text-sm text-gray-600 border-b border-gray-200 last:border-0"
                    onClick={onClose}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </li>

            {/* Demais Links */}
            {links.map((link) => (
              <li key={link.name} className="border-b border-gray-100">
                <Link to={link.path} className="block p-5 text-[15px] font-bold text-black uppercase" onClick={onClose}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}