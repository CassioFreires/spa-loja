import { ShoppingBag, Star, Crown, Sparkles, Loader2 } from 'lucide-react';
import { useAccessories } from '../../hooks/useAcessories';
import { useState } from 'react';
import ProductDetailModal from '../modals/productDetailModal';

export default function ImportedAccessories() {
  const { data: accessories, isLoading } = useAccessories();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-yellow-500 w-10 h-10" />
        <span className="font-black uppercase italic text-[10px] tracking-widest text-zinc-400">Carregando Exclusividades...</span>
      </div>
    );
  }

  // Se não houver acessórios, o componente não renderiza nada ou uma mensagem amigável
  if (!accessories || accessories.length === 0) return null;

  return (
    <section className="relative py-16 md:py-28 px-4 overflow-hidden bg-transparent leading-none">
      <div className="max-w-[1440px] mx-auto relative z-10">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12 md:mb-20 gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-yellow-600 mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="font-black text-[10px] md:text-xs uppercase tracking-[0.4em]">Linha Exclusive</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-black text-black uppercase italic tracking-tighter leading-none">
              Acessórios <span className="text-yellow-500">Importados</span>
            </h2>
          </div>
          <div className="max-w-xs text-center md:text-right italic">
             <p className="text-zinc-500 text-xs md:text-sm font-medium leading-relaxed mb-4">
               A curadoria Gold Store traz peças selecionadas para quem não aceita o comum.
             </p>
             <div className="h-1 w-20 bg-yellow-500 ml-auto hidden md:block" />
          </div>
        </div>

        {/* Grid Dinâmico */}
        <div className="flex md:grid md:grid-cols-3 lg:grid-cols-5 gap-5 overflow-x-auto pb-10 md:pb-0 scrollbar-hide snap-x snap-mandatory px-2">
          {accessories.map((item) => (
            <div 
              key={item.id} 
              onClick={() => handleOpenModal(item)}
              className="min-w-[280px] md:min-w-full snap-center group relative bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-5 border border-white/60 hover:border-yellow-500/40 shadow-xl hover:shadow-2xl transition-all duration-700 flex flex-col cursor-pointer"
            >
              {/* Badge de Destaque - Lógica baseada em estoque ou preço alto */}
              {item.price > 500 && (
                <div className="absolute top-7 right-7 z-20 bg-black text-yellow-500 p-2 rounded-full shadow-lg border border-yellow-500/20 scale-90 group-hover:scale-110 transition-transform">
                  <Crown className="w-3.5 h-3.5" />
                </div>
              )}

              {/* Imagem do Produto vinda do Banco */}
              <div className="relative aspect-square overflow-hidden rounded-[1.8rem] bg-zinc-200/50 mb-6">
                <img 
                  src={item.image_1 || item.image_url} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
              </div>

              {/* Info & CTA */}
              <div className="flex flex-col flex-grow italic">
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mb-1">
                  {item.subcategory_name || item.brand_name}
                </span>
                <h3 className="font-bold text-zinc-900 text-lg leading-tight group-hover:text-yellow-600 transition-colors uppercase mb-4 h-12 line-clamp-2">
                  {item.name}
                </h3>
                
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500" />
                  ))}
                  <span className="text-[10px] text-zinc-400 ml-1 font-bold">5.0</span>
                </div>

                <div className="mt-auto leading-none">
                  <div className="flex items-baseline gap-1 mb-5">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase font-sans">R$</span>
                    <span className="text-3xl font-black text-black tracking-tighter">
                      {Number(item.price).toFixed(2)}
                    </span>
                  </div>

                  <button className="w-full bg-black hover:bg-yellow-500 text-white hover:text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-500 active:scale-95 group/btn shadow-lg">
                    <ShoppingBag className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    <span className="text-[10px] uppercase tracking-widest">Adicionar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navegação Auxiliar Mobile */}
        <div className="mt-10 md:hidden flex justify-center items-center gap-4 text-zinc-400 animate-pulse">
           <div className="w-12 h-[1px] bg-zinc-300" />
           <p className="text-[10px] font-black uppercase tracking-widest">Deslize para ver</p>
           <div className="w-12 h-[1px] bg-zinc-300" />
        </div>
      </div>

      {/* Modal de Detalhes integrado com dados reais */}
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}