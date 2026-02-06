import { useState } from 'react';
import { Tag, Timer, ArrowRight, Loader2 } from 'lucide-react';
import { useFeaturedProducts } from '../../hooks/useFeaturedProducts';
import ProductDetailModal from '../modals/productDetailModal';

export default function Promotions() {
  const { featured, loading } = useFeaturedProducts();
  
  // Estados para controle do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Função para formatar os dados do Destaque para o formato que o Modal espera
  const handleOpenModal = (item: any) => {
    const formattedProduct = {
      ...item,
      id: item.product_id,            // ID do produto original
      image_url: item.image_1,        // URL da imagem principal
      price: item.sale_price,         // Preço já com desconto vindo do backend
      old_price: item.original_price, // Preço original para o "riscado"
      brand_name: item.brand_name || 'Gold Store',
      category_name: item.category_name || 'Oferta'
    };
    setSelectedProduct(formattedProduct);
    setIsModalOpen(true);
  };

  return (
    <section className="bg-transparent py-12 md:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Glow decorativo */}
      <div className="absolute top-0 right-0 w-72 h-72 sm:w-[500px] sm:h-[500px] bg-yellow-500/5 rounded-full blur-[80px] sm:blur-[150px] -mr-32 -mt-32 pointer-events-none" />
      
      <div className="max-w-[1440px] mx-auto relative z-10">
        
        {/* Cabeçalho Responsivo */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-8 md:mb-16 gap-6 text-center md:text-left">
          <div className="max-w-2xl">
            <div className="flex items-center justify-center md:justify-start gap-2 text-yellow-500 mb-4">
              <Timer className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />
              <span className="font-black text-[9px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.4em]">Ofertas por Tempo Limitado</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-black uppercase italic tracking-tighter leading-[0.9] drop-shadow-md">
              Saldão <span className="text-yellow-500">Gold Store</span>
            </h2>
          </div>
          
          <button className="hidden md:flex group items-center gap-3 bg-white text-black font-black px-8 py-4 lg:px-10 lg:py-5 rounded-2xl hover:bg-yellow-500 transition-all active:scale-95 shadow-xl whitespace-nowrap">
            VER TODAS AS OFERTAS
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
            <p className="text-zinc-500 font-black uppercase text-[10px] tracking-widest">Buscando Ofertas...</p>
          </div>
        ) : (
          /* Grid Adaptável */
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 overflow-x-auto pb-6 md:pb-0 scrollbar-hide snap-x snap-mandatory">
            {featured.length > 0 ? (
              featured.map((item) => (
                <div 
                  key={item.featured_id} 
                  className="min-w-[85vw] sm:min-w-[45vw] md:min-w-full snap-center group relative bg-zinc-950/40 backdrop-blur-md rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-zinc-800/30 hover:border-yellow-500/50 transition-all duration-500 shadow-2xl"
                >
                  {/* Badge de Desconto */}
                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 bg-yellow-500 text-black font-black text-[9px] sm:text-[10px] px-3 py-1 sm:px-4 sm:py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-yellow-500/20">
                    <Tag className="w-3 h-3" />
                    {item.discount_percentage}% OFF
                  </div>

                  {/* Imagem */}
                  <div className="aspect-square sm:aspect-[1/1.1] overflow-hidden bg-zinc-900 relative">
                    <img 
                      src={item.image_1} 
                      alt={item.name} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />
                  </div>

                  {/* Conteúdo */}
                  <div className="p-6 sm:p-8 relative">
                    <span className="text-[9px] sm:text-[10px] text-zinc-500 font-bold uppercase tracking-widest block mb-2">Exclusivo Gold</span>
                    <h3 className="text-white font-bold text-lg sm:text-xl lg:text-2xl italic group-hover:text-yellow-500 transition-colors uppercase leading-tight h-14 line-clamp-2">
                      {item.name}
                    </h3>
                    
                    <div className="flex flex-col gap-1 mt-4 sm:mt-6">
                      <span className="text-zinc-500 line-through font-bold text-xs sm:text-sm">
                        De R$ {Number(item.original_price).toFixed(2)}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[10px] sm:text-sm font-bold text-yellow-500/80 uppercase">Por</span>
                        <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-yellow-500 tracking-tighter drop-shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                          R$ {Number(item.sale_price).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleOpenModal(item)}
                      className="w-full mt-6 sm:mt-8 py-3.5 sm:py-4 bg-white/5 border border-zinc-700/50 text-white font-black text-[9px] sm:text-[10px] uppercase tracking-widest rounded-xl sm:rounded-2xl group-hover:bg-yellow-500 group-hover:text-black group-hover:border-yellow-500 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      Aproveitar Agora
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center w-full">
                <p className="text-zinc-500 font-black uppercase italic tracking-widest text-xs">Nenhuma oferta ativa no momento.</p>
              </div>
            )}
          </div>
        )}

        {/* Botão Mobile Centralizado */}
        {!loading && featured.length > 0 && (
          <div className="mt-8 md:hidden flex flex-col items-center gap-6">
            <button className="w-full bg-white text-black font-black py-4 rounded-xl text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-transform">
              Ver todas as ofertas
            </button>
            <div className="flex items-center gap-2 text-zinc-500 animate-bounce">
              <span className="text-[9px] font-bold uppercase tracking-widest">Deslize para conferir</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        )}
      </div>

      {/* Renderização do Modal de Detalhes */}
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