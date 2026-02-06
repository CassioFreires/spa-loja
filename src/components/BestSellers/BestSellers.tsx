import { ShoppingCart, Star, Flame, ArrowRight, Loader2, Tag } from 'lucide-react';
import { useState } from 'react';
import { useBestSellers } from '../../hooks/useBestSellers';
import { useCart } from '../../context/CartContext'; // Importando o contexto
import ProductDetailModal from '../modals/productDetailModal';

export default function BestSellers() {
  const { data: products, isLoading } = useBestSellers(4);
  const { addToCart } = useCart(); // Hook do carrinho
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Função para calcular a porcentagem de desconto dinamicamente
  const calculateDiscount = (oldPrice: number, currentPrice: number) => {
    if (!oldPrice || oldPrice <= currentPrice) return null;
    const discount = ((oldPrice - currentPrice) / oldPrice) * 100;
    return Math.round(discount);
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4 bg-transparent">
        <Loader2 className="animate-spin text-yellow-500 w-10 h-10" />
        <span className="font-black uppercase italic text-[10px] tracking-widest text-zinc-400">Analisando tendências...</span>
      </div>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <section className="relative py-12 md:py-24 px-4 md:px-6 bg-transparent overflow-hidden leading-none italic">
      <div className="max-w-[1440px] mx-auto relative z-10">

        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-10 md:mb-16 gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-yellow-600 mb-3 font-black uppercase italic">
              <Flame className="w-5 h-5 animate-pulse text-yellow-500" />
              <span className="text-[10px] md:text-xs tracking-[0.4em]">Os Favoritos da Galera</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-black text-black uppercase italic tracking-tighter leading-none">
              Mais <span className="text-yellow-500">Vendidos</span>
            </h2>
          </div>
          <button className="group flex items-center gap-2 text-xs md:text-sm font-black uppercase tracking-widest text-zinc-600 hover:text-yellow-600 transition-all">
            Ver Coleção Completa
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        {/* Grid Dinâmico */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 overflow-x-auto pb-10 md:pb-0 scrollbar-hide snap-x snap-mandatory">
          {products.map((product, index) => {
            const discountBadge = calculateDiscount(Number(product.old_price), Number(product.price));

            return (
              <div
                key={product.id}
                onClick={() => handleOpenModal(product)}
                className="min-w-[80vw] sm:min-w-[320px] md:min-w-full snap-center group relative bg-white/40 backdrop-blur-md rounded-[2.5rem] p-4 border border-white/60 hover:border-yellow-500/50 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col cursor-pointer"
              >
                {/* Container da Imagem */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-zinc-100 mb-6">
                  {/* Badge TOP Ranking */}
                  <div className="absolute top-4 left-4 z-10 bg-black text-yellow-500 text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest shadow-lg">
                    TOP {index + 1}
                  </div>

                  {/* Badge de Desconto Calculado */}
                  {discountBadge && (
                    <div className="absolute top-4 right-4 z-10 bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-lg animate-bounce">
                      <Tag size={10} />
                      {discountBadge}% OFF
                    </div>
                  )}

                  <img
                    src={product.image_1 || product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />

                  {/* Overlay de Compra */}
                  <div className="absolute inset-x-4 bottom-4 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleOpenModal(product);
                      }}
                      className="w-full bg-yellow-500 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      ESCOLHER OPÇÕES
                    </button>
                  </div>
                </div>

                {/* Detalhes */}
                <div className="px-2 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none">
                      {product.brand_name || product.category_name}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      <span className="text-[10px] font-bold text-zinc-400">5.0</span>
                    </div>
                  </div>

                  <h3 className="font-black text-zinc-900 text-lg md:text-xl leading-tight group-hover:text-yellow-600 transition-colors uppercase italic mb-4 line-clamp-2 h-12">
                    {product.name}
                  </h3>

                  <div className="mt-auto pt-4 border-t border-black/5 flex items-end justify-between leading-none">
                    <div className="flex flex-col">
                      {product.old_price && (
                        <span className="text-[11px] text-zinc-400 line-through font-bold mb-1">
                          R$ {Number(product.old_price).toFixed(2)}
                        </span>
                      )}
                      <span className="text-2xl md:text-3xl font-black text-black tracking-tighter">
                        R$ {Number(product.price).toFixed(2)}
                      </span>
                    </div>
                    <div className="text-[9px] font-black bg-black text-white px-2 py-1 rounded">
                      SHOP NOW
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Detalhes Integrado */}
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