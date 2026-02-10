import { ShoppingCart, Star, Flame, ArrowRight, Loader2, Tag } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useBestSellers } from '../../hooks/useBestSellers';
import { useCart } from '../../context/CartContext';
import ProductDetailModal from '../modals/productDetailModal';

/**
 * @component BestSellers
 * @description Seção de produtos mais vendidos com foco em SEO estruturado, UX mobile-first e alta performance.
 */
export default function BestSellers() {
  const { data: products, isLoading } = useBestSellers(4);
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Memoização do cálculo de desconto para evitar processamento desnecessário no render
  const calculateDiscount = (oldPrice: number, currentPrice: number) => {
    if (!oldPrice || oldPrice <= currentPrice) return null;
    return Math.round(((oldPrice - currentPrice) / oldPrice) * 100);
  };

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-6 bg-transparent" role="status">
        <Loader2 className="animate-spin text-yellow-500 w-12 h-12" />
        <span className="font-black uppercase italic text-xs tracking-[0.3em] text-zinc-400 animate-pulse">
          Sincronizando Tendências...
        </span>
      </div>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <section 
      className="relative py-16 md:py-32 px-4 md:px-8 bg-transparent overflow-hidden"
      aria-labelledby="bestsellers-heading"
    >
      <div className="max-w-[1440px] mx-auto relative z-10">

        {/* Cabeçalho Otimizado para SEO */}
        <header className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12 md:mb-20 gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 text-yellow-600 mb-4">
              <Flame className="w-5 h-5 animate-pulse text-yellow-500" />
              <span className="font-black uppercase italic text-[10px] md:text-xs tracking-[0.4em]">
                Os Favoritos da Galera
              </span>
            </div>
            <h2 
              id="bestsellers-heading"
              className="text-5xl md:text-8xl font-black text-zinc-950 uppercase italic tracking-tighter leading-[0.8] drop-shadow-sm"
            >
              Mais <span className="text-yellow-500">Vendidos</span>
            </h2>
          </div>
          
          <button 
            className="group flex items-center gap-3 text-xs md:text-sm font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-950 transition-all duration-300"
            aria-label="Ver toda a coleção de produtos"
          >
            Ver Coleção Completa
            <div className="bg-zinc-100 p-2 rounded-full group-hover:bg-yellow-500 group-hover:text-zinc-950 transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </header>

        {/* Grid Híbrido: Scroll Nativo no Mobile / Grid no Desktop */}
        <div 
          className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 overflow-x-auto pb-12 md:pb-0 scrollbar-hide snap-x snap-mandatory touch-pan-x"
          role="list"
        >
          {products.map((product, index) => {
            const discountBadge = calculateDiscount(Number(product.old_price), Number(product.price));

            return (
              <article
                key={product.id}
                role="listitem"
                className="min-w-[85vw] sm:min-w-[340px] md:min-w-full snap-center group"
              >
                <div 
                  onClick={() => handleOpenModal(product)}
                  className="relative h-full bg-white/40 backdrop-blur-xl rounded-[2.8rem] p-5 border border-white/60 hover:border-yellow-500/40 shadow-2xl shadow-zinc-200/50 transition-all duration-700 flex flex-col cursor-pointer active:scale-[0.98]"
                >
                  {/* Container da Imagem com Aspect Ratio fixo para evitar CLS */}
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[2.2rem] bg-zinc-100 mb-8">
                    {/* TOP Ranking Badge */}
                    <div className="absolute top-5 left-5 z-20 bg-zinc-950 text-yellow-500 text-[9px] font-black px-5 py-2 rounded-full tracking-widest shadow-2xl">
                      TOP {index + 1}
                    </div>

                    {/* Badge de Desconto */}
                    {discountBadge && (
                      <div className="absolute top-5 right-5 z-20 bg-red-600 text-white text-[10px] font-black px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl animate-float">
                        <Tag size={12} className="fill-current" />
                        {discountBadge}% OFF
                      </div>
                    )}

                    <img
                      src={product.image_1 || product.image_url}
                      alt={`Camisa ${product.name}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                    />

                    {/* CTA Overlay Desktop - UX Intuitiva */}
                    <div className="absolute inset-x-5 bottom-5 z-30 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hidden md:block">
                      <button
                        className="w-full bg-yellow-500 text-zinc-950 font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 shadow-2xl shadow-yellow-500/40"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        ESCOLHER OPÇÕES
                      </button>
                    </div>
                  </div>

                  {/* Detalhes do Produto */}
                  <div className="px-3 flex flex-col flex-grow italic leading-none">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em]">
                        {product.brand_name || product.category_name}
                      </span>
                      <div className="flex items-center gap-1.5 bg-zinc-50 px-2 py-1 rounded-full">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        <span className="text-[10px] font-black text-zinc-900">5.0</span>
                      </div>
                    </div>

                    <h3 className="font-black text-zinc-950 text-xl md:text-2xl leading-[0.9] group-hover:text-yellow-600 transition-colors uppercase mb-8 line-clamp-2 h-14 tracking-tighter">
                      {product.name}
                    </h3>

                    {/* Preço e Action Mobile */}
                    <div className="mt-auto pt-6 border-t border-zinc-100/50 flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        {product.old_price && (
                          <span className="text-xs text-zinc-300 line-through font-bold">
                            R$ {Number(product.old_price).toFixed(2)}
                          </span>
                        )}
                        <span className="text-3xl md:text-4xl font-black text-zinc-950 tracking-tighter italic">
                          <span className="text-sm mr-1">R$</span>
                          {Number(product.price).toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="md:hidden bg-zinc-950 text-white p-4 rounded-2xl shadow-xl active:scale-90 transition-transform">
                        <ShoppingCart size={20} />
                      </div>
                      <div className="hidden md:block text-[10px] font-black bg-zinc-950 text-white px-4 py-2 rounded-xl tracking-widest group-hover:bg-yellow-500 group-hover:text-zinc-950 transition-colors">
                        SHOP NOW
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
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
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>
    </section>
  );
}