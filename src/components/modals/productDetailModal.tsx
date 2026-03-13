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

  const installmentInfo = useMemo(() => {
    const value = (product.price || 0) / 12;
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }, [product.price]);

  const productImages = useMemo(() => {
    return [
      product.image_1, product.image_2, product.image_3,
      product.image_4, product.image_5, product.image_6
    ].filter(Boolean) as string[];
  }, [product]);

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

  const sizes = useMemo(() => [...new Set(product.variations?.filter(v => v?.type === 'Tamanho').map(v => v.value))], [product]);
  const colors = useMemo(() => [...new Set(product.variations?.filter(v => v?.type === 'Cor').map(v => v.value))], [product]);
  const numbers = useMemo(() => [...new Set(product.variations?.filter(v => v?.type === 'Numeração').map(v => v.value))], [product]);

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
        className="bg-white w-full max-w-6xl max-h-[92vh] md:max-h-[90vh] overflow-hidden rounded-t-[2rem] md:rounded-[2rem] shadow-2xl relative flex flex-col md:flex-row border border-zinc-200 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* BOTÃO FECHAR - Mais discreto no mobile */}
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 md:top-6 md:right-6 z-[130] bg-white/80 backdrop-blur-md border border-zinc-100 p-2 rounded-full hover:bg-zinc-900 hover:text-white transition-all shadow-lg active:scale-90"
        >
          <X size={18} className="md:w-5 md:h-5" />
        </button>

        {/* COLUNA ESQUERDA: GALERIA */}
        <div className="w-full md:w-[55%] flex flex-col-reverse md:flex-row bg-[#F8F8F8] p-2 md:p-6 gap-3 md:gap-4 overflow-hidden">
          {/* Miniaturas */}
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto no-scrollbar md:max-h-[450px]">
            {productImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`flex-shrink-0 w-12 h-16 md:w-20 md:h-28 rounded-xl overflow-hidden border-2 transition-all ${
                  activeImageIndex === idx ? 'border-zinc-900 scale-105 shadow-md bg-white' : 'border-transparent opacity-50'
                }`}
              >
                <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Imagem Principal */}
          <div 
            className="flex-1 relative bg-white rounded-2xl md:rounded-[2rem] overflow-hidden border border-zinc-100 shadow-inner aspect-[4/5] md:aspect-auto"
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
            <div 
              className={`absolute inset-0 pointer-events-none hidden md:block transition-opacity duration-200 z-20 ${isZooming ? 'opacity-100' : 'opacity-0'}`}
              style={{
                backgroundImage: `url(${getImageUrl(productImages[activeImageIndex])})`,
                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                backgroundSize: '220%',
                backgroundRepeat: 'no-repeat',
              }}
            />
          </div>
        </div>

        {/* COLUNA DIREITA: INFOS */}
        <div className="w-full md:w-[45%] p-4 md:p-10 overflow-y-auto custom-scrollbar bg-white flex flex-col border-l border-zinc-50">
          <div className="flex-1 italic text-left font-sans">
            <header className="mb-4 md:mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-black uppercase text-yellow-600 tracking-widest">
                  {product.brand_name || 'Original Premium'}
                </span>
                <div className="flex items-center gap-1 bg-zinc-50 px-2 py-0.5 rounded-full border border-zinc-100">
                  <Star size={10} className="fill-yellow-500 text-yellow-500" />
                  <span className="text-[9px] font-black text-zinc-800">4.9</span>
                </div>
              </div>
              
              <h2 className="text-xl md:text-3xl font-black uppercase text-zinc-900 tracking-tighter leading-none mb-3">
                {product.name}
              </h2>

              <div className="space-y-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-4xl font-black italic tracking-tighter text-zinc-950">
                    R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  {product.old_price && (
                    <span className="text-sm md:text-lg text-zinc-400 line-through font-bold">
                      R$ {Number(product.old_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] uppercase tracking-tighter">
                  <CreditCard size={12} />
                  <span>Até 12x de R$ {installmentInfo} sem juros</span>
                </div>
              </div>
            </header>

            <div className="space-y-6 md:space-y-8 mb-6">
              {colors.length > 0 && (
                <div>
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest block mb-2">Cores</label>
                  <div className="flex flex-wrap gap-1.5">
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 text-[9px] font-black uppercase rounded-lg border-2 transition-all ${
                          selectedColor === color 
                          ? 'border-zinc-950 bg-zinc-950 text-white shadow-md' 
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
                  <div className="flex justify-between mb-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Grade</label>
                    <button className="text-[8px] font-black text-zinc-400 underline uppercase">Guia de medidas</button>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {(sizes.length > 0 ? sizes : numbers).map(val => (
                      <button
                        key={val}
                        onClick={() => sizes.length > 0 ? setSelectedSize(val) : setSelectedNum(val)}
                        className={`aspect-square text-[11px] font-black border-2 transition-all flex items-center justify-center rounded-lg ${
                          (selectedSize === val || selectedNum === val)
                            ? 'border-yellow-500 bg-yellow-500 text-zinc-950 shadow-md'
                            : 'border-zinc-100 text-zinc-400 hover:border-zinc-950'
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

          {/* AÇÕES FIXAS NO MOBILE PARA FÁCIL ACESSO */}
          <div className="pt-4 md:pt-6 border-t border-zinc-100 space-y-3 bg-white mt-auto">
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
              <button
                onClick={() => handleAction(false)}
                disabled={isAdding}
                className={`order-2 md:order-none py-4 md:py-5 rounded-xl font-black uppercase tracking-tighter text-[11px] flex items-center justify-center gap-2 border-2 transition-all active:scale-[0.98] ${
                  isAdding ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'border-zinc-100 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                {isAdding ? <Check size={16} /> : <ShoppingCart size={16} />}
                {isAdding ? "Pronto!" : "Na Sacola"}
              </button>

              <button
                onClick={() => handleAction(true)}
                className="py-4 md:py-5 rounded-xl bg-zinc-950 text-white font-black uppercase tracking-tighter text-[11px] hover:bg-yellow-500 hover:text-zinc-950 transition-all active:scale-[0.98] shadow-lg shadow-zinc-900/10"
              >
                Comprar Agora
              </button>
            </div>

            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-1 text-zinc-400">
                <Truck size={12} className="text-yellow-600" />
                <span className="text-[8px] font-black uppercase tracking-tighter">Envio 24h</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-400">
                <ShieldCheck size={12} className="text-yellow-600" />
                <span className="text-[8px] font-black uppercase tracking-tighter">Premium 1:1</span>
              </div>
            </div>
            
            <Link 
              to={`/produto/${product.id}`} 
              onClick={onClose}
              className="block text-center text-[9px] font-black uppercase text-zinc-300 hover:text-yellow-600 transition-colors"
            >
              Ficha Técnica <ArrowRight size={10} className="inline ml-1" />
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #EEE; border-radius: 10px; }
        @media (max-width: 768px) { 
          .custom-scrollbar { scrollbar-width: none; } 
        }
      `}</style>
    </div>,
    document.body
  );
}