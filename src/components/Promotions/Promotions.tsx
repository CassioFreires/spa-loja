import { Tag, Timer, ArrowRight } from 'lucide-react';

const deals = [
  {
    id: 1,
    name: "Regata Tradicional",
    price: 65.00,
    oldPrice: 89.00,
    discount: "25% OFF",
    image: "/assets/images/regata-promo.jpg",
    category: "Regatas"
  },
  {
    id: 2,
    name: "Manto 2 Flamengo (S/ Pers.)",
    price: 170.00,
    oldPrice: 220.00,
    discount: "R$ 50 OFF",
    image: "/assets/images/manto2-fla.jpg",
    category: "Flamengo"
  },
  {
    id: 3,
    name: "Tênis New Balance",
    price: 150.00,
    oldPrice: 199.00,
    discount: "OFERTA",
    image: "/assets/images/nb-promo.jpg",
    category: "Calçados"
  },
  {
    id: 4,
    name: "Chinelo Slide",
    price: 80.00,
    oldPrice: 110.00,
    discount: "MENOR PREÇO",
    image: "/assets/images/slide-promo.jpg",
    category: "Chinelos"
  }
];

export default function Promotions() {
  return (
    <section className="bg-black py-20 px-6 relative overflow-hidden">
      {/* Detalhe de fundo decorativo */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
      
      <div className="max-w-[1440px] mx-auto relative z-10">
        
        {/* Cabeçalho da Seção */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-yellow-500 mb-2">
              <Timer className="w-5 h-5 animate-pulse" />
              <span className="font-black text-xs uppercase tracking-[0.3em]">Ofertas por Tempo Limitado</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">
              Saldão <span className="text-yellow-500">Gold Store</span>
            </h2>
          </div>
          
          <div className="hidden md:block">
            <button className="group flex items-center gap-3 bg-white text-black font-black px-8 py-4 rounded-full hover:bg-yellow-500 transition-all">
              VER TODAS AS OFERTAS
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>

        {/* Grid de Ofertas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map((item) => (
            <div key={item.id} className="group relative bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-yellow-500/50 transition-all duration-500">
              
              {/* Badge de Desconto */}
              <div className="absolute top-4 left-4 z-20 bg-yellow-500 text-black font-black text-[10px] px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                <Tag className="w-3 h-3" />
                {item.discount}
              </div>

              {/* Imagem com Zoom */}
              <div className="aspect-[4/5] overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                />
              </div>

              {/* Conteúdo */}
              <div className="p-6">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{item.category}</span>
                <h3 className="text-white font-bold text-lg mt-1 italic group-hover:text-yellow-500 transition-colors uppercase">
                  {item.name}
                </h3>
                
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-2xl font-black text-yellow-500 tracking-tighter">
                    R$ {item.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-zinc-500 line-through font-medium">
                    R$ {item.oldPrice.toFixed(2)}
                  </span>
                </div>

                <button className="w-full mt-6 py-3 border border-zinc-700 text-white font-black text-xs uppercase tracking-widest rounded-xl group-hover:bg-white group-hover:text-black transition-all">
                  Aproveitar Agora
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Botão Mobile */}
        <div className="mt-10 md:hidden">
          <button className="w-full bg-white text-black font-black py-4 rounded-full text-sm uppercase tracking-widest">
            Ver todas as ofertas
          </button>
        </div>
      </div>
    </section>
  );
}