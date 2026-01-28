import { ShoppingCart, Star, Flame, ArrowRight } from 'lucide-react';

const bestSellers = [
  {
    id: 1,
    name: "Camisa Modelo Jogador - 2026",
    price: 200,
    oldPrice: 249,
    category: "Camisas de Time",
    image: "assets/images/jogador-flamengo.jpg",
    tag: "MAIS VENDIDO"
  },
  {
    id: 2,
    name: "Tênis Adidas Campus Premium",
    price: 200,
    oldPrice: 280,
    category: "Calçados",
    image: "assets/images/adidas-campus.jpg",
    tag: "LANÇAMENTO"
  },
  {
    id: 3,
    name: "Camisa Dry Fit Tradicional",
    price: 100,
    oldPrice: 130,
    category: "Casual",
    image: "assets/images/dryfit-oakley.jpg",
    tag: "OFERTA"
  },
  {
    id: 4,
    name: "Corta-Vento The North Face",
    price: 280,
    oldPrice: 350,
    category: "Inverno",
    image: "assets/images/north-face.jpg",
    tag: "PREMIUM"
  }
];

export default function BestSellers() {
  return (
    <section className="relative py-12 md:py-24 px-4 md:px-6 bg-transparent overflow-hidden">
      <div className="max-w-[1440px] mx-auto relative z-10">
        
        {/* Cabeçalho de Impacto */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-10 md:mb-16 gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-yellow-600 mb-3">
              <Flame className="w-5 h-5 animate-pulse text-yellow-500" />
              <span className="font-black text-[10px] md:text-xs uppercase tracking-[0.4em]">Os Favoritos da Galera</span>
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

        {/* Grid / Carrossel Mobile */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 overflow-x-auto pb-10 md:pb-0 scrollbar-hide snap-x snap-mandatory">
          {bestSellers.map((product) => (
            <div 
              key={product.id} 
              className="min-w-[80vw] sm:min-w-[320px] md:min-w-full snap-center group relative bg-white/40 backdrop-blur-md rounded-[2.5rem] p-4 border border-white/60 hover:border-yellow-500/50 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col"
            >
              
              {/* Container da Imagem */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-zinc-100 mb-6">
                {product.tag && (
                  <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-md text-yellow-500 text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest shadow-lg border border-yellow-500/20">
                    {product.tag}
                  </div>
                )}
                
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                {/* Botão de Compra Rápida - Mobile amigável */}
                <div className="absolute inset-x-4 bottom-4 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <button className="w-full bg-yellow-500 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-yellow-500/30 active:scale-95">
                    <ShoppingCart className="w-4 h-4" />
                    ADICIONAR AO CARRINHO
                  </button>
                </div>
              </div>

              {/* Detalhes do Produto */}
              <div className="px-2 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{product.category}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    <span className="text-[10px] font-bold text-zinc-400">4.9</span>
                  </div>
                </div>

                <h3 className="font-bold text-zinc-900 text-lg md:text-xl leading-tight group-hover:text-yellow-600 transition-colors italic uppercase mb-4">
                  {product.name}
                </h3>
                
                <div className="mt-auto pt-4 border-t border-black/5 flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-400 line-through font-bold">R$ {product.oldPrice.toFixed(2)}</span>
                    <span className="text-2xl md:text-3xl font-black text-black tracking-tighter">
                      R$ {product.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-[9px] font-black bg-black text-white px-2 py-1 rounded">
                    PIX
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Indicador Mobile */}
        <div className="flex md:hidden items-center justify-center gap-2 mt-4 text-zinc-400">
          <span className="text-[10px] font-black uppercase tracking-widest">Arraste para o lado</span>
          <ArrowRight className="w-4 h-4 animate-pulse" />
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}