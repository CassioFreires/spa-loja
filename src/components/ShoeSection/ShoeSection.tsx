import { ArrowRight, ShoppingCart, Footprints, Star, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useFootwear } from '../modals/useFootwear';
import ProductDetailModal from '../modals/productDetailModal';

export default function ShoeSection() {
  const { data: shoes, isLoading } = useFootwear();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const DEFAULT_SHOE = "/assets/images/products/default-shoe.jpg";

  const handleOpenModal = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-4 bg-transparent">
        <Loader2 className="animate-spin text-yellow-500 w-12 h-12" />
        <span className="font-black uppercase italic text-xs tracking-[0.3em] text-zinc-400">Preparando o pisante...</span>
      </div>
    );
  }

  if (!shoes || shoes.length === 0) return null;

  return (
    <section className="relative py-16 md:py-32 px-4 overflow-hidden bg-transparent leading-none italic text-left">
      <div className="max-w-[1440px] mx-auto relative z-10">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 md:mb-20 gap-8">
          <div className="text-center md:text-left leading-none">
            <div className="flex items-center justify-center md:justify-start gap-3 text-yellow-600 mb-4 font-black uppercase italic">
              <Footprints className="w-6 h-6" />
              <span className="text-[10px] md:text-xs tracking-[0.4em]">Passo com Estilo</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-black text-black uppercase tracking-tighter leading-[0.85]">
              Elite em <span className="text-yellow-500">Calçados</span>
            </h2>
          </div>
          <div className="hidden lg:block text-right">
             <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-2 italic">Envio imediato • Gold Store</p>
             <div className="w-32 h-1 bg-yellow-500 ml-auto" />
          </div>
        </div>

        {/* Grid de Produtos */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-5 gap-5 md:gap-8 overflow-x-auto pb-10 md:pb-0 scrollbar-hide snap-x snap-mandatory px-2">
          {shoes.map((shoe) => (
            <div 
              key={shoe.id} 
              onClick={() => handleOpenModal(shoe)}
              className="min-w-[80vw] sm:min-w-[320px] md:min-w-full snap-center group relative bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/60 hover:border-yellow-500/50 shadow-xl hover:shadow-2xl transition-all duration-700 flex flex-col cursor-pointer"
            >
              
              {/* Imagem com Fallback */}
              <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-zinc-200/30 mb-6 flex items-center justify-center">
                {shoe.old_price && (
                  <span className="absolute top-4 left-4 z-20 bg-black text-yellow-500 text-[10px] font-black px-4 py-1.5 rounded-xl uppercase italic shadow-lg">
                    Oferta
                  </span>
                )}
                
                <img 
                  src={shoe.image_1 || shoe.image_url || DEFAULT_SHOE} 
                  alt={shoe.name} 
                  className="w-full h-full object-contain p-6 transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-[-5deg]"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== window.location.origin + DEFAULT_SHOE) {
                      target.onerror = null;
                      target.src = DEFAULT_SHOE;
                    }
                  }}
                />
              </div>

              {/* Informações */}
              <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-none">
                    {shoe.brand_name || shoe.subcategory_name}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    <span className="text-[10px] font-black">5.0</span>
                  </div>
                </div>

                <h3 className="font-black text-zinc-900 text-xl leading-tight group-hover:text-yellow-600 transition-colors uppercase italic mb-6 line-clamp-2 h-12">
                  {shoe.name}
                </h3>
                
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-black/5 leading-none">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase mb-1">Preço Gold</span>
                    <span className="text-3xl font-black text-black tracking-tighter">
                      R$ {Number(shoe.price).toFixed(2)}
                    </span>
                  </div>
                  
                  <button className="bg-black text-white p-4 rounded-2xl hover:bg-yellow-500 hover:text-black transition-all duration-500 active:scale-90 shadow-lg group-hover:rotate-[360deg]">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Card Final: Ver Todos */}
          <div className="min-w-[80vw] sm:min-w-[320px] md:min-w-full snap-center group relative aspect-square md:aspect-auto flex flex-col items-center justify-center rounded-[2.5rem] bg-yellow-500/10 border-2 border-dashed border-yellow-500/30 hover:bg-yellow-500 transition-all duration-500 cursor-pointer">
             <div className="bg-white p-6 rounded-full shadow-2xl group-hover:scale-110 transition-transform">
               <ArrowRight className="w-8 h-8 text-black" />
             </div>
             <span className="mt-6 font-black text-xs uppercase tracking-[0.3em] text-black italic">Ver Coleção</span>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes Integrado via Portal */}
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