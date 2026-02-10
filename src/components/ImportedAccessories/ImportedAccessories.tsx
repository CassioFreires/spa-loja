import { ShoppingBag, Star, Crown, Sparkles, Loader2 } from 'lucide-react';
import { useAccessories } from '../../hooks/useAcessories';
import { useState } from 'react';
import ProductDetailModal from '../modals/productDetailModal';

/**
 * @component ImportedAccessories
 * @description Vitrine de acessórios premium com foco em SEO Semântico e UX Mobile-First.
 */
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
      <div className="py-32 flex flex-col items-center justify-center gap-6" role="status">
        <Loader2 className="animate-spin text-yellow-500 w-12 h-12" />
        <span className="font-black uppercase italic text-xs tracking-[0.3em] text-zinc-400 animate-pulse">
          Sincronizando Exclusividades...
        </span>
      </div>
    );
  }

  if (!accessories || accessories.length === 0) return null;

  return (
    <section 
      className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-transparent"
      aria-labelledby="accessories-heading"
    >
      <div className="max-w-[1440px] mx-auto relative z-10">
        
        {/* Cabeçalho Estruturado para SEO */}
        <header className="flex flex-col md:flex-row items-center md:items-end justify-between mb-16 md:mb-24 gap-10 text-center md:text-left">
          <div className="max-w-3xl">
            <div className="flex items-center justify-center md:justify-start gap-3 text-yellow-600 mb-6">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="font-black text-[10px] md:text-xs uppercase tracking-[0.4em] leading-none">
                Curadoria Gold: Linha Exclusive
              </span>
            </div>
            <h2 
              id="accessories-heading"
              className="text-5xl md:text-8xl font-black text-zinc-950 uppercase italic tracking-tighter leading-[0.85]"
            >
              Acessórios <span className="text-yellow-500 drop-shadow-sm">Importados</span>
            </h2>
          </div>
          <div className="max-w-xs flex flex-col gap-6 italic">
            <p className="text-zinc-500 text-sm md:text-base font-medium leading-relaxed">
              Peças selecionadas que definem o lifestyle de quem exige autenticidade e luxo em cada detalhe.
            </p>
            <div className="h-[2px] w-24 bg-gradient-to-r from-yellow-500 to-transparent ml-auto hidden md:block" />
          </div>
        </header>

        {/* Grid Híbrido: Scroll no Mobile, Grid no Desktop */}
        <div 
          className="flex md:grid md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 overflow-x-auto pb-12 md:pb-0 scrollbar-hide snap-x snap-mandatory scroll-p-4"
          role="list"
        >
          {accessories.map((item) => (
            <article 
              key={item.id} 
              role="listitem"
              className="min-w-[88vw] sm:min-w-[45vw] md:min-w-full snap-center group"
            >
              <div 
                onClick={() => handleOpenModal(item)}
                className="relative h-full bg-white/40 backdrop-blur-md rounded-[2.8rem] p-6 border border-white/60 hover:border-yellow-500/40 shadow-2xl shadow-zinc-200/50 hover:shadow-yellow-500/10 transition-all duration-700 flex flex-col cursor-pointer active:scale-95 md:active:scale-100"
              >
                {/* Badge de Relevância Visual */}
                {item.price > 500 && (
                  <div 
                    className="absolute top-8 right-8 z-20 bg-zinc-950 text-yellow-500 p-2.5 rounded-full shadow-2xl border border-yellow-500/30 group-hover:rotate-12 transition-transform"
                    title="Item de Luxo"
                  >
                    <Crown className="w-4 h-4" />
                  </div>
                )}

                {/* Container de Imagem Otimizado (Prevenção de CLS) */}
                <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-zinc-100 mb-8">
                  <img 
                    src={item.image_1 || item.image_url} 
                    alt={`Acessório Gold Store: ${item.name}`} 
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>

                {/* Detalhes do Produto com Hierarquia UI */}
                <div className="flex flex-col flex-grow italic leading-none">
                  <span className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.25em] mb-3 block">
                    {item.subcategory_name || item.brand_name}
                  </span>
                  <h3 className="font-black text-zinc-950 text-xl lg:text-2xl leading-[0.9] group-hover:text-yellow-600 transition-colors uppercase mb-6 h-14 line-clamp-2 tracking-tighter">
                    {item.name}
                  </h3>
                  
                  {/* Rating Semântico */}
                  <div className="flex items-center gap-1.5 mb-8" aria-label="Avaliação: 5 de 5 estrelas">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} className="fill-yellow-500" />
                      ))}
                    </div>
                    <span className="text-[10px] text-zinc-400 font-black uppercase tracking-tighter">Premium Grade</span>
                  </div>

                  {/* Preço e CTA */}
                  <div className="mt-auto">
                    <div className="flex items-baseline gap-1.5 mb-6">
                      <span className="text-xs font-bold text-zinc-400 uppercase italic">R$</span>
                      <span className="text-4xl font-black text-zinc-950 tracking-tighter">
                        {Number(item.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <button 
                      className="w-full bg-zinc-950 hover:bg-yellow-500 text-white hover:text-zinc-950 font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-500 group/btn shadow-xl shadow-zinc-950/10 active:scale-90"
                      aria-label={`Comprar ${item.name} agora`}
                    >
                      <ShoppingBag className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                      <span className="text-[11px] uppercase tracking-[0.2em]">Add to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Indicador de Gesto Mobile Otimizado */}
        <footer className="mt-14 md:hidden flex flex-col items-center gap-4 text-zinc-400">
           <div className="flex items-center gap-3 animate-pulse">
              <div className="w-16 h-[1.5px] bg-gradient-to-r from-transparent to-zinc-300" />
              <p className="text-[9px] font-black uppercase tracking-[0.3em]">Swipe to Explore</p>
              <div className="w-16 h-[1.5px] bg-gradient-to-l from-transparent to-zinc-300" />
           </div>
        </footer>
      </div>

      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; touch-action: pan-x; }
      `}</style>
    </section>
  );
}