import { ArrowRight, ShoppingCart, Footprints, Star, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useFootwear } from '../modals/useFootwear';

/**
 * @component ShoeSection
 * @description Vitrine de calçados premium com foco em SEO Semântico, Performance e UX Mobile-First.
 */
export default function ShoeSection() {
  const { data: shoes, isLoading } = useFootwear();
  const [, setSelectedProduct] = useState<any>(null);
  const [, setIsModalOpen] = useState(false);

  const DEFAULT_SHOE = "/assets/images/products/default-shoe.jpg";

  const handleOpenModal = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-6 bg-transparent" role="status">
        <Loader2 className="animate-spin text-yellow-500 w-12 h-12" />
        <span className="font-black uppercase italic text-xs tracking-[0.3em] text-zinc-400 animate-pulse">
          Sincronizando Pisantes...
        </span>
      </div>
    );
  }

  if (!shoes || shoes.length === 0) return null;

  return (
    <section 
      className="relative py-16 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-transparent"
      aria-labelledby="shoes-heading"
    >
      <div className="max-w-[1440px] mx-auto relative z-10">
        
        {/* Cabeçalho Estruturado para SEO/IA */}
        <header className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12 md:mb-24 gap-8">
          <div className="text-center md:text-left leading-none">
            <div className="flex items-center justify-center md:justify-start gap-3 text-yellow-600 mb-6 font-black uppercase italic">
              <Footprints className="w-6 h-6 drop-shadow-sm" />
              <span className="text-[10px] md:text-xs uppercase tracking-[0.4em]">Passo com Estilo</span>
            </div>
            <h2 
              id="shoes-heading"
              className="text-5xl md:text-8xl font-black text-zinc-950 uppercase italic tracking-tighter leading-[0.8] mb-4"
            >
              Elite em <span className="text-yellow-500 drop-shadow-sm">Calçados</span>
            </h2>
          </div>
          <div className="hidden lg:block text-right italic">
             <p className="text-zinc-500 text-sm font-black uppercase tracking-[0.2em] mb-3">
               Envio imediato • <span className="text-zinc-950">Gold Store Premium</span>
             </p>
             <div className="w-40 h-[2px] bg-gradient-to-r from-transparent to-yellow-500 ml-auto" />
          </div>
        </header>

        {/* Grid Híbrido: Snap Scroll no Mobile / Grid no Desktop */}
        <div 
          className="flex md:grid md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 overflow-x-auto pb-12 md:pb-0 scrollbar-hide snap-x snap-mandatory scroll-p-4"
          role="list"
        >
          {shoes.map((shoe) => (
            <article 
              key={shoe.id} 
              role="listitem"
              className="min-w-[85vw] sm:min-w-[340px] md:min-w-full snap-center group"
            >
              <div 
                onClick={() => handleOpenModal(shoe)}
                className="relative h-full bg-white/40 backdrop-blur-xl rounded-[2.8rem] p-6 border border-white/60 hover:border-yellow-500/40 shadow-2xl shadow-zinc-200/50 transition-all duration-700 flex flex-col cursor-pointer active:scale-[0.98]"
              >
                
                {/* Image Container Otimizado (Prevenção de CLS) */}
                <div className="relative aspect-square overflow-hidden rounded-[2.2rem] bg-zinc-100/50 mb-8 flex items-center justify-center">
                  {shoe.old_price && (
                    <div className="absolute top-5 left-5 z-20 bg-zinc-950 text-yellow-500 text-[9px] font-black px-4 py-2 rounded-full uppercase italic shadow-2xl tracking-widest">
                      Oferta
                    </div>
                  )}
                  
                  <img 
                    src={shoe.image_1 || shoe.image_url || DEFAULT_SHOE} 
                    alt={`Tênis ${shoe.name} - Qualidade Premium Gold Store`} 
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain p-8 transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1) group-hover:scale-110 group-hover:rotate-[-5deg]"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== window.location.origin + DEFAULT_SHOE) {
                        target.onerror = null;
                        target.src = DEFAULT_SHOE;
                      }
                    }}
                  />
                </div>

                {/* Info & Micro-SEO */}
                <div className="flex flex-col flex-grow italic leading-none text-left">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em]">
                      {shoe.brand_name || shoe.subcategory_name}
                    </span>
                    <div className="flex items-center gap-1.5 bg-zinc-50 px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      <span className="text-[10px] font-black text-zinc-900 tracking-tighter">5.0</span>
                    </div>
                  </div>

                  <h3 className="font-black text-zinc-950 text-xl lg:text-2xl leading-[0.9] group-hover:text-yellow-600 transition-colors uppercase mb-8 line-clamp-2 h-14 tracking-tighter">
                    {shoe.name}
                  </h3>
                  
                  {/* Pricing & CTA */}
                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-zinc-100/50">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-zinc-400 font-black uppercase tracking-widest">Preço Gold</span>
                      <span className="text-3xl lg:text-4xl font-black text-zinc-950 tracking-tighter italic">
                        <span className="text-sm mr-1">R$</span>
                        {Number(shoe.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    
                    <button 
                      className="bg-zinc-950 text-white p-5 rounded-2xl hover:bg-yellow-500 hover:text-zinc-950 transition-all duration-500 shadow-xl active:scale-90"
                      aria-label={`Adicionar ${shoe.name} ao carrinho`}
                    >
                      <ShoppingCart className="w-5 h-5 transition-transform group-hover:rotate-12" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}

          {/* Call-to-Action Card Otimizado */}
          <div 
            onClick={() => {/* Adicione sua navegação aqui */}}
            className="min-w-[85vw] sm:min-w-[340px] md:min-w-full snap-center group relative flex flex-col items-center justify-center rounded-[2.8rem] bg-yellow-500/5 border-2 border-dashed border-yellow-500/20 hover:bg-yellow-500 transition-all duration-700 active:scale-95 cursor-pointer"
          >
             <div className="bg-white p-8 rounded-full shadow-2xl shadow-yellow-500/10 group-hover:scale-110 group-hover:rotate-45 transition-all duration-500">
               <ArrowRight className="w-10 h-10 text-zinc-950" />
             </div>
             <span className="mt-8 font-black text-[11px] uppercase tracking-[0.4em] text-zinc-950 italic">
               Explorar Tudo
             </span>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; touch-action: pan-x; }
      `}</style>
    </section>
  );
}