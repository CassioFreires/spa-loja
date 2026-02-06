import React, { useState, useEffect } from 'react';
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

export default function ProductDetailModal({ product, isOpen, onClose }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedNum, setSelectedNum] = useState<string>(""); 
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = [...new Set(product.variations?.filter(v => v?.type === 'Tamanho').map(v => v.value))];
  const colors = [...new Set(product.variations?.filter(v => v?.type === 'Cor').map(v => v.value))];
  const numbers = [...new Set(product.variations?.filter(v => v?.type === 'Numeração').map(v => v.value))];

  const getSelectedVariationId = (): number | null => {
    const variation = product.variations?.find(v => 
      (sizes.length > 0 ? v.value === selectedSize : true) &&
      (colors.length > 0 ? v.value === selectedColor : true) &&
      (numbers.length > 0 ? v.value === selectedNum : true)
    );
    return variation ? Number(variation.variation_id || variation.id) : null;
  };

  const handleAction = (isBuyNow = false) => {
    // Validações
    if (sizes.length > 0 && !selectedSize) return toast.error("Selecione um tamanho!");
    if (colors.length > 0 && !selectedColor) return toast.error("Selecione uma cor!");
    if (numbers.length > 0 && !selectedNum) return toast.error("Selecione a numeração!");

    const variationId = getSelectedVariationId() ?? undefined;

    if (isBuyNow) {
      // 1. Adiciona ao carrinho
      addToCart(product, selectedSize || selectedNum, selectedColor, variationId);
      // 2. Fecha o modal primeiro para limpar o body overflow
      onClose();
      // 3. Navega para o checkout (ou endereço como estava no seu código)
      // Certifique-se de que a rota '/endereco' existe no seu App.tsx
      setTimeout(() => {
        navigate('/endereco');
      }, 100);
    } else {
      setIsAdding(true);
      addToCart(product, selectedSize || selectedNum, selectedColor, variationId);
      
      setTimeout(() => {
        setIsAdding(false);
        onClose(); 
      }, 500);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-black/75 backdrop-blur-sm animate-in fade-in duration-300 italic">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-[1.5rem] shadow-2xl relative flex flex-col md:flex-row leading-none text-left border border-zinc-100">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-white/90 p-1.5 rounded-full hover:bg-black hover:text-white transition-all shadow-md text-zinc-400"
        >
          <X size={18} />
        </button>

        <div className="w-full md:w-[40%] bg-zinc-50 flex items-center justify-center overflow-hidden border-r border-zinc-50">
          <img
            src={product.image_url || (product as any).image_1}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          />
        </div>

        <div className="w-full md:w-[60%] p-6 md:p-8 overflow-y-auto custom-scrollbar flex flex-col justify-between bg-white">
          <div className="space-y-5">
            <div>
              <span className="text-[9px] font-black uppercase text-yellow-600 tracking-[0.2em] mb-1.5 block leading-none">
                {product.brand_name} • {product.category_name}
              </span>
              <h2 className="text-2xl font-black uppercase text-zinc-900 tracking-tighter leading-tight mb-2">
                {product.name}
              </h2>
              <div className="flex items-center gap-1.5">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="currentColor" />)}
                </div>
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">12 avaliações</span>
              </div>
            </div>

            <div className="flex flex-col py-2 border-y border-zinc-50">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-black tracking-tighter">
                  R$ {Number(product.price).toFixed(2)}
                </span>
                {product.old_price && (
                  <span className="text-xs text-zinc-300 line-through font-bold">
                    R$ {Number(product.old_price).toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-[9px] font-bold text-zinc-400 uppercase mt-1">
                ou 12x de <span className="text-zinc-600">R$ {(Number(product.price) / 12).toFixed(2)}</span> sem juros
              </p>
            </div>

            <div className="space-y-4">
              {colors.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black uppercase mb-2 text-zinc-400">Cor</h4>
                  <div className="flex flex-wrap gap-2">
                    {colors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 text-[9px] font-black uppercase border transition-all rounded ${
                          selectedColor === color ? 'border-black bg-black text-white' : 'border-zinc-100 text-zinc-400'
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
                  <h4 className="text-[10px] font-black uppercase mb-2 text-zinc-400">
                    {sizes.length > 0 ? 'Tamanho' : 'Numeração'}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(sizes.length > 0 ? sizes : numbers).map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => sizes.length > 0 ? setSelectedSize(val) : setSelectedNum(val)}
                        className={`w-10 h-10 text-[11px] font-black border transition-all flex items-center justify-center rounded-lg ${
                          (selectedSize === val || selectedNum === val) 
                          ? 'border-yellow-500 bg-yellow-500 text-black shadow-md' 
                          : 'border-zinc-100 text-zinc-400'
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

          <div className="mt-6 space-y-2">
            <button 
              type="button"
              onClick={() => handleAction(true)}
              className="w-full bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-yellow-600 hover:text-black transition-all active:scale-95 shadow-lg"
            >
              Comprar Agora
            </button>

            <button
              type="button"
              onClick={() => handleAction(false)}
              disabled={isAdding}
              className="w-full border border-black py-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all hover:bg-zinc-50 active:scale-95"
            >
              {isAdding ? <Check size={14} className="text-green-600" /> : <ShoppingCart size={14} />}
              {isAdding ? "Adicionado!" : "Adicionar ao Carrinho"}
            </button>

            <div className="flex justify-center gap-4 pt-3">
               <div className="flex items-center gap-1.5 opacity-50">
                  <Truck size={12} />
                  <span className="text-[8px] font-black uppercase">Entrega Express</span>
               </div>
               <div className="flex items-center gap-1.5 opacity-50">
                  <ShieldCheck size={12} />
                  <span className="text-[8px] font-black uppercase">Compra Segura</span>
               </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #eab308; border-radius: 10px; }
      `}</style>
    </div>,
    document.body
  );
}