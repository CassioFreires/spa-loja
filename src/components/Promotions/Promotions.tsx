import { useState } from 'react';
import { Timer, ArrowRight, Loader2 } from 'lucide-react';
import { useFeaturedProducts } from '../../hooks/useFeaturedProducts';
import ProductDetailModal from '../modals/productDetailModal';
import ProductCard from '../Cards/ProductCard/ProductCard';

/**
 * @component Promotions
 * @description Seção de ofertas de alta conversão utilizando o componente atômico ProductCard.
 */
export default function Promotions() {
  const { featured, loading } = useFeaturedProducts(4);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleOpenModal = (item: any) => {
    // Normalização dos dados para o Modal, mantendo compatibilidade com o backend
    const formattedProduct = {
      ...item,
      id: item.product_id,
      image_url: item.image_1,
      price: item.sale_price,
      old_price: item.original_price,
      brand_name: item.brand_name || 'Gold Store',
      category_name: item.category_name || 'Oferta'
    };
    setSelectedProduct(formattedProduct);
    setIsModalOpen(true);
  };

  return (
    <section 
      className="relative py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-transparent"
      aria-labelledby="promo-heading"
    >
      <div className="max-w-[1440px] mx-auto relative z-10">
        
        {/* Cabeçalho Estruturado para SEO/IA */}
        <header className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12 md:mb-20 gap-8 text-center md:text-left leading-none">
          <div className="max-w-2xl">
            <div className="flex items-center justify-center md:justify-start gap-3 text-yellow-500 mb-6 font-black uppercase italic">
              <Timer className="w-5 h-5 animate-pulse" />
              <span className="text-[10px] md:text-xs tracking-[0.4em]">
                Ofertas por Tempo Limitado
              </span>
            </div>
            <h2 
              id="promo-heading"
              className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-black text-zinc-950 uppercase italic tracking-tighter leading-[0.85] drop-shadow-sm"
            >
              Saldão <span className="text-yellow-500">Gold Store</span>
            </h2>
            <p className="mt-8 text-zinc-600 font-medium text-sm md:text-lg max-w-xl italic leading-relaxed text-balance">
              As melhores camisas tailandesas com preços imbatíveis. Qualidade 1:1 garantida para o seu manto.
            </p>
          </div>

          <button 
            className="hidden md:flex group items-center gap-4 bg-zinc-950 text-white font-black px-10 py-5 rounded-2xl hover:bg-yellow-500 hover:text-zinc-950 transition-all duration-500 active:scale-95 shadow-2xl shadow-zinc-950/20 italic text-xs tracking-widest"
            aria-label="Ver todas as promoções"
          >
            CATÁLOGO COMPLETO
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6" role="status">
            <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
            <span className="text-zinc-400 font-black uppercase text-xs tracking-[0.3em] italic animate-pulse">Sincronizando Ofertas...</span>
          </div>
        ) : (
          /* Grid Híbrido utilizando ProductCard centralizado */
          <div 
            className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 overflow-x-auto pb-12 md:pb-0 scrollbar-hide snap-x snap-mandatory scroll-p-4"
            role="list"
          >
            {featured.length > 0 ? (
              featured.map((item) => (
                <div key={item.featured_id} className="min-w-[85vw] sm:min-w-[45vw] md:min-w-full snap-center">
                  <ProductCard 
                    product={{
                      ...item,
                      id: item.product_id,
                      price: item.sale_price,
                      old_price: item.original_price,
                      image_url: item.image_1
                    }}
                    isOffer={true}
                    onOpenModal={() => handleOpenModal(item)}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full py-32 text-center w-full bg-zinc-900/10 rounded-[3rem] border-2 border-dashed border-zinc-200">
                <p className="text-zinc-500 font-black uppercase italic tracking-[0.3em] text-sm">Nenhum drop disponível no momento...</p>
              </div>
            )}
          </div>
        )}

        {/* Footer UX Mobile: Swipe Indicator */}
        {!loading && featured.length > 0 && (
          <div className="mt-12 md:hidden flex flex-col items-center gap-8">
            <button className="w-full bg-zinc-950 text-white font-black py-5 rounded-2xl text-[11px] uppercase tracking-[0.2em] shadow-2xl active:scale-95 italic">
              VER TODAS AS OFERTAS
            </button>
            <div className="flex items-center gap-3 text-zinc-500 animate-bounce">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Deslize para explorar</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        )}
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