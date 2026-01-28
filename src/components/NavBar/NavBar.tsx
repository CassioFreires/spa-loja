import { useState } from 'react';
import { ChevronDown, X, Truck, Ruler, ShieldCheck, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NavBar({ isOpen, onClose }: NavBarProps) {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const categorias = [
    { name: 'Camisas Dry Fit', path: '/categoria/dry-fit' },
    { name: 'Camisas de Times', path: '/categoria/times' },
    { name: 'Camisas Premium', path: '/categoria/premium' },
    { name: 'Shorts & Bermudas', path: '/categoria/shorts' },
    { name: 'Tênis Elite', path: '/categoria/tenis' },
    { name: 'Acessórios Gold', path: '/categoria/acessorios' },
  ];

  const suporteLinks = [
    { name: 'Rastreio', path: '/rastreio', icon: <Truck className="w-3.5 h-3.5" /> },
    { name: 'Guia de Medidas', path: '/guia-medidas', icon: <Ruler className="w-3.5 h-3.5" /> },
    { name: 'Segurança', path: '/seguranca', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { name: 'Trocas', path: '/trocas', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { name: 'Feedback', path: '/feedback', icon: <StarIcon /> },
  ];

  return (
    <>
      {/* --- DESKTOP NAVBAR --- */}
      <nav className="w-full bg-white border-b border-zinc-100 hidden md:block">
        <div className="max-w-[1440px] mx-auto px-8">
          <ul className="flex items-center justify-center gap-8 py-3.5">
            
            {/* Link Início */}
            <li>
              <Link to="/" className="text-[12px] font-black text-black hover:text-yellow-600 transition-all uppercase tracking-widest">Início</Link>
            </li>

            {/* Dropdown CATEGORIAS */}
            <li className="relative group">
              <button className="flex items-center gap-1.5 text-[12px] font-black text-black group-hover:text-yellow-600 transition-colors uppercase tracking-widest">
                Categorias <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute left-0 mt-3 w-56 bg-white shadow-2xl border border-zinc-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] rounded-xl overflow-hidden">
                <ul className="py-2">
                  {categorias.map((cat) => (
                    <Link key={cat.name} to={cat.path}>
                      <li className="px-5 py-3 hover:bg-yellow-50 text-[11px] font-bold text-zinc-600 hover:text-black border-b border-zinc-50 last:border-0 transition-colors uppercase tracking-tighter">
                        {cat.name}
                      </li>
                    </Link>
                  ))}
                </ul>
              </div>
            </li>

            {/* Link Direto: CAMISAS DE TIME */}
            <li>
              <Link to="/camisas-de-time" className="text-[12px] font-black text-black hover:text-yellow-600 transition-all uppercase tracking-widest">Camisas de Time</Link>
            </li>

            {/* Dropdown AJUDA & SUPORTE (Onde entram os links que faltavam) */}
            <li className="relative group">
              <button className="flex items-center gap-1.5 text-[12px] font-black text-black group-hover:text-yellow-600 transition-colors uppercase tracking-widest">
                Suporte <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute left-0 mt-3 w-60 bg-white shadow-2xl border border-zinc-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] rounded-xl overflow-hidden">
                <ul className="py-2">
                  {suporteLinks.map((link) => (
                    <Link key={link.name} to={link.path}>
                      <li className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-50 text-[11px] font-bold text-zinc-600 hover:text-black border-b border-zinc-50 last:border-0 transition-colors uppercase">
                        <span className="text-yellow-600">{link.icon}</span>
                        {link.name}
                      </li>
                    </Link>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </nav>

      {/* --- MOBILE SIDEBAR --- */}
      <div className={`fixed inset-0 z-[1000] transition-opacity duration-500 md:hidden ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
        
        <div className={`absolute left-0 top-0 h-full w-[80%] max-w-[300px] bg-white transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          
          <div className="flex items-center justify-between p-6 bg-black text-white">
            <span className="font-black text-yellow-500 italic text-xl">GOLD STORE</span>
            <X className="w-6 h-6 cursor-pointer" onClick={onClose} />
          </div>
          
          <div className="overflow-y-auto h-[calc(100vh-80px)]">
            <ul className="flex flex-col">
              {/* Accordion Categorias */}
              <li className="border-b border-zinc-100">
                <button onClick={() => setIsCategoriesOpen(!isCategoriesOpen)} className="flex items-center justify-between w-full p-6 text-[13px] font-black uppercase tracking-widest">
                  Categorias <ChevronDown className={`w-4 h-4 transition-transform ${isCategoriesOpen ? 'rotate-180 text-yellow-500' : ''}`} />
                </button>
                <div className={`bg-zinc-50 overflow-hidden transition-all duration-300 ${isCategoriesOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
                  {categorias.map((cat) => (
                    <Link key={cat.name} to={cat.path} className="block p-4 pl-10 text-[11px] font-bold text-zinc-500 uppercase" onClick={onClose}>{cat.name}</Link>
                  ))}
                </div>
              </li>

              {/* Accordion Suporte (Mobile) */}
              <li className="border-b border-zinc-100">
                <button onClick={() => setIsHelpOpen(!isHelpOpen)} className="flex items-center justify-between w-full p-6 text-[13px] font-black uppercase tracking-widest">
                  Suporte <ChevronDown className={`w-4 h-4 transition-transform ${isHelpOpen ? 'rotate-180 text-yellow-500' : ''}`} />
                </button>
                <div className={`bg-zinc-50 overflow-hidden transition-all duration-300 ${isHelpOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
                  {suporteLinks.map((link) => (
                    <Link key={link.name} to={link.path} className="flex items-center gap-3 p-4 pl-10 text-[11px] font-bold text-zinc-500 uppercase" onClick={onClose}>
                      {link.icon} {link.name}
                    </Link>
                  ))}
                </div>
              </li>

              {/* Link Início Mobile */}
              <li className="border-b border-zinc-100">
                <Link to="/" className="block p-6 text-[13px] font-black uppercase tracking-widest" onClick={onClose}>Início</Link>
              </li>
              <li className="border-b border-zinc-100">
                <Link to="/camisas-de-time" className="block p-6 text-[13px] font-black uppercase tracking-widest" onClick={onClose}>Camisas de Time</Link>
              </li>
            </ul>

            <div className="p-8 mt-10">
               <div className="flex items-center gap-2 text-green-600 mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase">Loja Verificada</span>
               </div>
               <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Nova Iguaçu - Rio de Janeiro</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Sub-componente de Ícone para Feedback
function StarIcon() {
  return (
    <div className="flex gap-0.5">
      {[...Array(3)].map((_, i) => <div key={i} className="w-1 h-1 bg-yellow-500 rounded-full" />)}
    </div>
  );
}