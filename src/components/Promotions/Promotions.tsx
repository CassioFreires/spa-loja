import { Tag, Timer, ArrowRight } from 'lucide-react';

const deals = [
  {
    id: 1,
    name: "Regata Tradicional",
    price: 65.00,
    oldPrice: 89.00,
    discount: "25% OFF",
    image: "assets/images/regata-promo.jpg",
    category: "Regatas"
  },
  {
    id: 2,
    name: "Manto 2 Flamengo (S/ Pers.)",
    price: 170.00,
    oldPrice: 220.00,
    discount: "R$ 50 OFF",
    image: "assets/images/manto2-fla.jpg",
    category: "Flamengo"
  },
  {
    id: 3,
    name: "Tênis New Balance",
    price: 150.00,
    oldPrice: 199.00,
    discount: "OFERTA",
    image: "assets/images/nb-promo.jpg",
    category: "Calçados"
  },
  {
    id: 4,
    name: "Chinelo Slide",
    price: 80.00,
    oldPrice: 110.00,
    discount: "MENOR PREÇO",
    image: "assets/images/slide-promo.jpg",
    category: "Chinelos"
  }
];

export default function Promotions() {
  return (
    <section className="bg-transparent py-16 md:py-24 px-4 md:px-6 relative overflow-hidden">
      {/* Glow decorativo de fundo para destacar as partículas do canvas nessa área */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[150px] -mr-64 -mt-64 pointer-events-none" />
      
      <div className="max-w-[1440px] mx-auto relative z-10">
        
        {/* Cabeçalho da Seção */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 md:mb-16 gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-yellow-500 mb-3">
              <Timer className="w-5 h-5 animate-pulse" />
              <span className="font-black text-[10px] md:text-xs uppercase tracking-[0.4em]">Ofertas por Tempo Limitado</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-black text-black uppercase italic tracking-tighter leading-none drop-shadow-md">
              Saldão <span className="text-yellow-500">Gold Store</span>
            </h2>
          </div>
          
          <button className="hidden md:flex group items-center gap-3 bg-white text-black font-black px-10 py-5 rounded-2xl hover:bg-yellow-500 transition-all active:scale-95 shadow-xl">
            VER TODAS AS OFERTAS
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        {/* Grid com Snap Scroll para Mobile */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 overflow-x-auto pb-8 md:pb-0 scrollbar-hide snap-x snap-mandatory">
          {deals.map((item) => (
            <div 
              key={item.id} 
              className="min-w-[300px] md:min-w-full snap-center group relative bg-zinc-950/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-zinc-800/30 hover:border-yellow-500/50 transition-all duration-500 shadow-2xl"
            >
              
              {/* Badge de Desconto */}
              <div className="absolute top-6 left-6 z-20 bg-yellow-500 text-black font-black text-[10px] px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-yellow-500/20">
                <Tag className="w-3 h-3" />
                {item.discount}
              </div>

              {/* Container da Imagem com Overlay sutil */}
              <div className="aspect-[1/1.1] overflow-hidden bg-zinc-900 relative">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
              </div>

              {/* Conteúdo */}
              <div className="p-8 relative">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block mb-2">{item.category}</span>
                <h3 className="text-white font-bold text-xl md:text-2xl italic group-hover:text-yellow-500 transition-colors uppercase leading-tight h-14 line-clamp-2">
                  {item.name}
                </h3>
                
                <div className="flex flex-col gap-1 mt-6">
                  <span className="text-zinc-500 line-through font-bold text-sm">
                    De R$ {item.oldPrice.toFixed(2)}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold text-yellow-500/80">Por</span>
                    <span className="text-4xl font-black text-yellow-500 tracking-tighter drop-shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                      R$ {item.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button className="w-full mt-8 py-4 bg-white/5 border border-zinc-700/50 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl group-hover:bg-yellow-500 group-hover:text-black group-hover:border-yellow-500 transition-all active:scale-95 flex items-center justify-center gap-2">
                  Aproveitar Agora
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Mobile */}
        <div className="mt-10 md:hidden flex flex-col items-center gap-4">
          <button className="w-full bg-white text-black font-black py-5 rounded-2xl text-xs uppercase tracking-widest shadow-lg">
            Ver todas as ofertas
          </button>
          <div className="flex items-center gap-2 text-zinc-500 animate-pulse">
            <ArrowRight className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Arraste para o lado</span>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}