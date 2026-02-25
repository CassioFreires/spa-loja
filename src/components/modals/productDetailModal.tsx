import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, ShoppingCart, Check, Truck, ShieldCheck, Star, ArrowRight, CreditCard } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/getImageUrl';
import type { Product } from '../../pages/public/Product/Product';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedNum, setSelectedNum] = useState<string>("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Utilitário de parcelamento dinâmico (Big Tech Style)
  const installmentInfo = useMemo(() => {
    const value = (product.price || 0) / 12;
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }, [product.price]);

  // Galeria dinâmica de até 6 imagens
  const productImages = useMemo(() => {
    return [
      product.image_1, product.image_2, product.image_3,
      product.image_4, product.image_5, product.image_6
    ].filter(Boolean) as string[];
  }, [product]);

  // Gestão de estado do corpo e atalhos
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
      window.addEventListener('keydown', handleEsc);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isOpen, onClose]);

  // Variações únicas para os seletores
  const sizes = useMemo(() => [...new Set(product.variations?.filter(v => v?.type === 'Tamanho').map(v => v.value))], [product]);
  const colors = useMemo(() => [...new Set(product.variations?.filter(v => v?.type === 'Cor').map(v => v.value))], [product]);
  const numbers = useMemo(() => [...new Set(product.variations?.filter(v => v?.type === 'Numeração').map(v => v.value))], [product]);

  // Engine de Zoom Otimizada (GPU Accelerated)
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || window.innerWidth < 768) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  }, []);

  const handleAction = (isBuyNow = false) => {
    if (sizes.length > 0 && !selectedSize) return toast.error("Selecione o tamanho!");
    if (colors.length > 0 && !selectedColor) return toast.error("Selecione a cor!");
    if (numbers.length > 0 && !selectedNum) return toast.error("Selecione a numeração!");

    const variation = product.variations?.find(v =>
      (selectedSize ? v.value === selectedSize : true) &&
      (selectedColor ? v.value === selectedColor : true) &&
      (selectedNum ? v.value === selectedNum : true)
    );

    const variationData = variation ? { id: Number(variation.variation_id || variation.id), value: variation.value, extra_price: 0 } : null;

    if (isBuyNow) {
      addToCart(product, variationData);
      onClose();
      const token = localStorage.getItem('authToken');
      navigate(token ? '/endereco' : '/identificacao');
    } else {
      setIsAdding(true);
      addToCart(product, variationData);
      setTimeout(() => { setIsAdding(false); onClose(); }, 600);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300 px-0 md:px-6" 
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-6xl max-h-[98vh] md:max-h-[90vh] overflow-hidden rounded-t-[2.5rem] md:rounded-[2rem] shadow-2xl relative flex flex-col md:flex-row border border-zinc-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* BOTÃO FECHAR MASTER */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 md:top-6 md:right-6 z-[130] bg-white border border-zinc-100 p-2.5 rounded-full hover:bg-zinc-900 hover:text-white transition-all shadow-xl active:scale-90"
        >
          <X size={20} />
        </button>

        {/* COLUNA ESQUERDA: GALERIA SMART & ZOOM PRO */}
        <div className="w-full md:w-[60%] flex flex-col-reverse md:flex-row bg-[#F8F8F8] p-3 md:p-8 gap-4 md:gap-6 overflow-hidden">
          {/* Miniaturas com Scroll Invisível */}
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 no-scrollbar md:max-h-[500px]">
            {productImages.map((img, idx) => (
              <button
                key={idx}
                onMouseEnter={() => setActiveImageIndex(idx)}
                onClick={() => setActiveImageIndex(idx)}
                className={`flex-shrink-0 w-16 h-20 md:w-24 md:h-32 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                  activeImageIndex === idx ? 'border-zinc-900 scale-105 shadow-md bg-white' : 'border-transparent opacity-40 hover:opacity-100'
                }`}
              >
                <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Container Principal com Zoom Isolado (Sem Bug de Background) */}
          <div 
            className="flex-1 relative bg-white rounded-[2rem] overflow-hidden cursor-crosshair border border-zinc-100 shadow-inner group"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
          >
            <img
              src={getImageUrl(productImages[activeImageIndex])}
              alt={product.name}
              className={`w-full h-full object-contain md:object-cover transition-opacity duration-300 ${isZooming ? 'opacity-0' : 'opacity-100'}`}
            />
            
            {/* Camada de Zoom de Alta Definição */}
            <div 
              className={`absolute inset-0 pointer-events-none hidden md:block transition-opacity duration-200 z-20 ${isZooming ? 'opacity-100' : 'opacity-0'}`}
              style={{
                backgroundImage: `url(${getImageUrl(productImages[activeImageIndex])})`,
                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                backgroundSize: '240%',
                backgroundRepeat: 'no-repeat',
              }}
            />
          </div>
        </div>

        {/* COLUNA DIREITA: INFOS & CONVERSÃO */}
        <div className="w-full md:w-[40%] p-6 md:p-12 overflow-y-auto custom-scrollbar bg-white flex flex-col border-l border-zinc-50">
          <div className="flex-1 italic text-left font-sans">
            <header className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase text-yellow-600 tracking-[0.2em]">
                  {product.brand_name || 'Original Premium'}
                </span>
                <div className="flex items-center gap-1 bg-zinc-50 px-2 py-1 rounded-full border border-zinc-100">
                  <Star size={12} className="fill-yellow-500 text-yellow-500" />
                  <span className="text-[10px] font-black text-zinc-800">4.9</span>
                </div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black uppercase text-zinc-900 tracking-tighter leading-[0.85] mb-6">
                {product.name}
              </h2>

              <div className="space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black italic tracking-tighter text-zinc-950">
                    R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  {product.old_price && (
                    <span className="text-lg text-zinc-400 line-through font-bold decoration-zinc-300">
                      R$ {Number(product.old_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-[11px] uppercase tracking-tighter">
                  <CreditCard size={14} />
                  <span>Até 12x de R$ {installmentInfo} sem juros</span>
                </div>
              </div>
            </header>

            <div className="space-y-10 mb-12">
              {colors.length > 0 && (
                <div>
                  <label className="text-[11px] font-black uppercase text-zinc-400 tracking-widest block mb-4">Cores Disponíveis</label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-6 py-3 text-[10px] font-black uppercase rounded-xl border-2 transition-all ${
                          selectedColor === color 
                          ? 'border-zinc-950 bg-zinc-950 text-white shadow-xl scale-105' 
                          : 'border-zinc-100 text-zinc-400 hover:border-zinc-300'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(sizes.length > 0 || numbers.length > 0) && (
                <div>
                  <div className="flex justify-between mb-4">
                    <label className="text-[11px] font-black uppercase text-zinc-400 tracking-widest">Tamanho / Grade</label>
                    <button className="text-[9px] font-black text-zinc-400 underline uppercase hover:text-zinc-900 transition-colors">Guia de medidas</button>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {(sizes.length > 0 ? sizes : numbers).map(val => (
                      <button
                        key={val}
                        onClick={() => sizes.length > 0 ? setSelectedSize(val) : setSelectedNum(val)}
                        className={`aspect-square text-[13px] font-black border-2 transition-all flex items-center justify-center rounded-xl ${
                          (selectedSize === val || selectedNum === val)
                            ? 'border-yellow-500 bg-yellow-500 text-zinc-950 shadow-lg shadow-yellow-500/20 scale-105'
                            : 'border-zinc-100 text-zinc-400 hover:border-zinc-950 hover:text-zinc-950'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RODAPÉ DE AÇÕES FIXO */}
          <div className="pt-8 border-t border-zinc-100 space-y-4 bg-white mt-auto">
            <button
              onClick={() => handleAction(true)}
              className="w-full bg-zinc-950 text-white py-6 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[12px] hover:bg-yellow-500 hover:text-zinc-950 transition-all active:scale-[0.98] shadow-2xl shadow-zinc-900/20"
            >
              Comprar Agora
            </button>

            <button
              onClick={() => handleAction(false)}
              disabled={isAdding}
              className={`w-full border-2 py-6 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[12px] flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
                isAdding ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'border-zinc-100 text-zinc-400 hover:bg-zinc-50 hover:border-zinc-900 hover:text-zinc-900'
              }`}
            >
              {isAdding ? <Check size={20} /> : <ShoppingCart size={20} />}
              {isAdding ? "Adicionado!" : "Adicionar à Sacola"}
            </button>

            <div className="flex justify-between items-center px-2 pt-2">
              <div className="flex items-center gap-2 text-zinc-400">
                <Truck size={16} className="text-yellow-600" />
                <span className="text-[9px] font-black uppercase tracking-tighter">Envio em 24h</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <ShieldCheck size={16} className="text-yellow-600" />
                <span className="text-[9px] font-black uppercase tracking-tighter">Produto Original</span>
              </div>
            </div>
            
            <Link 
              to={`/produto/${product.id}`} 
              onClick={onClose}
              className="w-full text-center text-[10px] font-black uppercase text-zinc-300 hover:text-yellow-600 transition-colors flex items-center justify-center gap-2"
            >
              Ver ficha completa <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #F1F1F1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #EAB308; }
        @media (max-width: 768px) { .custom-scrollbar { scrollbar-width: none; } }
      `}</style>
    </div>,
    document.body
  );
}