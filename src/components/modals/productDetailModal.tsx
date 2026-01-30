import React, { useState } from 'react';
import { X, ShoppingCart, Check, Truck, ShieldCheck, Star } from 'lucide-react';
import type { Product } from '../../pages/public/Product/Product';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  // Extração única de tamanhos e cores das variações
  const sizes = [...new Set(product.variations?.filter(v => v?.type === 'Tamanho').map(v => v.value))];
  const colors = [...new Set(product.variations?.filter(v => v?.type === 'Cor').map(v => v.value))];

  const handleAddToCart = () => {
    setIsAdding(true);
    // Simulação de lógica de carrinho
    setTimeout(() => {
      setIsAdding(false);
      alert(`${product.name} adicionado ao carrinho!`);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative flex flex-col md:flex-row">
        
        {/* BOTÃO FECHAR */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full hover:bg-black hover:text-white transition-all shadow-md"
        >
          <X size={20} />
        </button>

        {/* LADO ESQUERDO: IMAGEM */}
        <div className="w-full md:w-1/2 bg-zinc-100 flex items-center justify-center">
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-full object-cover max-h-[500px] md:max-h-full transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* LADO DIREITO: INFORMAÇÕES */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase text-yellow-600 tracking-[0.2em] italic mb-2 block">
                {product.brand_name} • {product.category_name}
              </span>
              <h2 className="text-3xl font-black uppercase italic text-zinc-900 leading-tight">
                {product.name}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase italic">(12 avaliações)</span>
              </div>
            </div>

            <div className="flex flex-col">
              {product.old_price && (
                <span className="text-sm text-zinc-400 line-through font-bold italic">
                  R$ {Number(product.old_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              )}
              <span className="text-4xl font-black text-yellow-600 italic tracking-tighter">
                R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase mt-1 italic">
                ou 12x de R$ {(Number(product.price) / 12).toFixed(2)} sem juros
              </span>
            </div>

            {/* SELEÇÃO DE CORES */}
            {colors.length > 0 && (
              <div>
                <h4 className="text-[11px] font-black uppercase italic mb-3">Selecione a Cor:</h4>
                <div className="flex gap-3">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 text-[10px] font-black uppercase border-2 transition-all ${
                        selectedColor === color ? 'border-black bg-black text-white' : 'border-zinc-100 hover:border-zinc-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SELEÇÃO DE TAMANHOS */}
            {sizes.length > 0 && (
              <div>
                <h4 className="text-[11px] font-black uppercase italic mb-3">Selecione o Tamanho:</h4>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 text-xs font-black border-2 transition-all flex items-center justify-center rounded-lg ${
                        selectedSize === size ? 'border-yellow-600 bg-yellow-600 text-white shadow-lg' : 'border-zinc-100 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* BOTÕES DE AÇÃO */}
          <div className="mt-10 space-y-3">
            <button 
              className="w-full bg-black text-white py-5 rounded-xl font-black uppercase italic text-sm hover:bg-yellow-600 hover:text-black transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 active:scale-95"
            >
              Comprar Agora
            </button>
            
            <button 
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full border-2 border-black py-5 rounded-xl font-black uppercase italic text-sm hover:bg-zinc-50 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              {isAdding ? (
                <Check size={18} className="animate-bounce" />
              ) : (
                <ShoppingCart size={18} />
              )}
              {isAdding ? "Adicionado!" : "Adicionar ao Carrinho"}
            </button>
          </div>

          {/* BENEFÍCIOS RÁPIDOS */}
          <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-6">
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-yellow-600" />
              <span className="text-[9px] font-bold uppercase italic">Entrega em todo Brasil</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-yellow-600" />
              <span className="text-[9px] font-bold uppercase italic">Compra 100% Segura</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}