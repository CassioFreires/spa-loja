import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, ShoppingCart, Check, Truck, ShieldCheck, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import type { Product } from '../../pages/public/Product/Product';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * @component ProductDetailModal
 * @description Modal de conversão rápida otimizado para SEO, UX mobile e performance.
 */
export default function ProductDetailModal({ product, isOpen, onClose }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedNum, setSelectedNum] = useState<string>(""); 
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Bloqueio de scroll do body com cleanup robusto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = 'var(--scrollbar-width)'; // Evita "pulo" de layout
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0';
    };
  }, [isOpen]);

  // Memoização das variações para performance
  const sizes = useMemo(() => [...new Set(product.variations?.filter(v => v?.type === 'Tamanho').map(v => v.value))], [product]);
  const colors = useMemo(() => [...new Set(product.variations?.filter(v => v?.type === 'Cor').map(v => v.value))], [product]);
  const numbers = useMemo(() => [...new Set(product.variations?.filter(v => v?.type === 'Numeração').map(v => v.value))], [product]);

  if (!isOpen) return null;

  // REFATORADO: Busca o objeto da variação para passar ao Contexto
  const getSelectedVariation = () => {
    const variation = product.variations?.find(v => 
      (sizes.length > 0 ? v.value === selectedSize : true) &&
      (colors.length > 0 ? v.value === selectedColor : true) &&
      (numbers.length > 0 ? v.value === selectedNum : true)
    );
    
    if (!variation) return null;

    return {
      id: Number(variation.variation_id || variation.id),
      value: selectedSize || selectedNum || selectedColor,
      extra_price: 0
    };
  };

  const handleAction = (isBuyNow = false) => {
    if (sizes.length > 0 && !selectedSize) return toast.error("Selecione um tamanho!");
    if (colors.length > 0 && !selectedColor) return toast.error("Selecione uma cor!");
    if (numbers.length > 0 && !selectedNum) return toast.error("Selecione a numeração!");

    const variation = getSelectedVariation();

    if (isBuyNow) {
      addToCart(product, variation);
      onClose();
      
      // LÓGICA DE REDIRECIONAMENTO REFATORADA
      const token = localStorage.getItem('authToken');
      if (token) {
        setTimeout(() => navigate('/endereco'), 100);
      } else {
        // Se não tiver autenticado, vai para Identificação
        setTimeout(() => navigate('/identificacao'), 100);
      }
    } else {
      setIsAdding(true);
      addToCart(product, variation);
      setTimeout(() => {
        setIsAdding(false);
        onClose(); 
      }, 500);
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center p-0 md:p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] overflow-hidden rounded-t-[2rem] md:rounded-[2rem] shadow-2xl relative flex flex-col md:flex-row border border-zinc-200/50">
        
        <button
          onClick={onClose}
          aria-label="Fechar modal"
          className="absolute top-4 right-4 z-50 bg-white/80 backdrop-blur-md p-2.5 rounded-full hover:bg-black hover:text-white transition-all shadow-lg active:scale-90 text-zinc-500"
        >
          <X size={20} />
        </button>

        <div className="w-full md:w-[45%] h-[40vh] md:h-auto bg-zinc-100 flex items-center justify-center overflow-hidden">
          <img
            src={product.image_url || (product as any).image_1}
            alt={`${product.name} - ${product.brand_name}`}
            className="w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-105"
            loading="eager"
          />
        </div>

        <div className="w-full md:w-[55%] p-6 md:p-10 overflow-y-auto custom-scrollbar bg-white flex flex-col">
          <div className="flex-1">
            <header className="mb-6">
              <nav className="flex gap-2 mb-2" aria-label="Breadcrumb">
                <span className="text-[10px] font-black uppercase text-yellow-600 tracking-widest italic">{product.brand_name}</span>
                <span className="text-[10px] font-medium text-zinc-300">/</span>
                <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest italic">{product.category_name}</span>
              </nav>
              <h2 className="text-2xl md:text-3xl font-black uppercase text-zinc-900 tracking-tighter italic leading-none mb-3">
                {product.name}
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-500" aria-hidden="true">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                </div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">(12 Reviews)</span>
              </div>
            </header>

            <div className="bg-zinc-50 rounded-2xl p-4 mb-8 border border-zinc-100">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-zinc-950 tracking-tighter italic">
                  R$ {Number(product.price).toFixed(2)}
                </span>
                {product.old_price && (
                  <span className="text-sm text-zinc-400 line-through font-bold decoration-red-500/50">
                    R$ {Number(product.old_price).toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase mt-2">
                💳 Parcelamento em até <span className="text-zinc-900">12x sem juros</span> no cartão
              </p>
            </div>

            <div className="space-y-6 mb-8">
              {colors.length > 0 && (
                <div>
                  <label className="text-[11px] font-black uppercase mb-3 block text-zinc-900 italic tracking-widest">Cor Disponível</label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2.5 text-[10px] font-black uppercase border transition-all rounded-xl ${
                          selectedColor === color 
                          ? 'border-zinc-900 bg-zinc-900 text-white shadow-xl scale-105' 
                          : 'border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:bg-zinc-50'
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
                  <label className="text-[11px] font-black uppercase mb-3 block text-zinc-900 italic tracking-widest">
                    {sizes.length > 0 ? 'Selecione o Tamanho' : 'Selecione a Numeração'}
                  </label>
                  <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                    {(sizes.length > 0 ? sizes : numbers).map(val => (
                      <button
                        key={val}
                        onClick={() => sizes.length > 0 ? setSelectedSize(val) : setSelectedNum(val)}
                        className={`aspect-square text-[12px] font-black border transition-all flex items-center justify-center rounded-xl ${
                          (selectedSize === val || selectedNum === val) 
                          ? 'border-yellow-500 bg-yellow-500 text-zinc-950 shadow-lg shadow-yellow-500/20 scale-105' 
                          : 'border-zinc-200 text-zinc-400 hover:border-zinc-900 hover:text-zinc-900'
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

          <div className="pt-4 mt-auto border-t border-zinc-100 space-y-3 bg-white">
            <button 
              type="button"
              onClick={() => handleAction(true)}
              className="w-full bg-zinc-950 text-white py-4 md:py-5 rounded-2xl font-black uppercase tracking-[0.1em] text-[11px] hover:bg-yellow-500 hover:text-zinc-950 transition-all active:scale-[0.98] shadow-2xl shadow-zinc-900/20"
            >
              Finalizar Compra Agora
            </button>

            <button
              type="button"
              onClick={() => handleAction(false)}
              disabled={isAdding}
              className="w-full border-2 border-zinc-200 py-4 md:py-5 rounded-2xl font-black uppercase tracking-[0.1em] text-[11px] flex items-center justify-center gap-3 transition-all hover:bg-zinc-50 hover:border-zinc-900 active:scale-[0.98]"
            >
              {isAdding ? <Check size={16} className="text-green-600" /> : <ShoppingCart size={16} />}
              {isAdding ? "Adicionado com sucesso" : "Adicionar à Sacola"}
            </button>

            <div className="flex justify-center gap-6 pt-4 border-t border-zinc-50 mt-4">
               <div className="flex items-center gap-2 text-zinc-400">
                  <Truck size={14} className="text-yellow-600" />
                  <span className="text-[9px] font-black uppercase tracking-tighter">Entrega Expressa</span>
               </div>
               <div className="flex items-center gap-2 text-zinc-400">
                  <ShieldCheck size={14} className="text-yellow-600" />
                  <span className="text-[9px] font-black uppercase tracking-tighter">Garantia Total</span>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #eab308; }
        @media (max-width: 768px) {
          .custom-scrollbar { scrollbar-width: none; }
        }
      `}</style>
    </div>,
    document.body
  );
}