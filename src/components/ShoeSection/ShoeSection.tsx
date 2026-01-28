import { ArrowRight, ShoppingCart } from 'lucide-react';

const shoeCollection = [
  {
    id: 1,
    name: "Tênis Nike Premium",
    price: 250.00,
    category: "Performance",
    image: "/assets/images/nike-shoe.jpg",
    badge: "Premium"
  },
  {
    id: 2,
    name: "Tênis Adidas Campus",
    price: 200.00,
    category: "Casual / Street",
    image: "/assets/images/adidas-campus.jpg",
    badge: "Mais Procurado"
  },
  {
    id: 3,
    name: "Tênis New Balance",
    price: 150.00,
    category: "Casual",
    image: "/assets/images/new-balance.jpg",
    badge: "Oferta"
  },
  {
    id: 4,
    name: "Chinelo Kenner",
    price: 120.00,
    category: "Conforto",
    image: "/assets/images/kenner.jpg",
    badge: "Original"
  },
  {
    id: 5,
    name: "Chinelo Slide",
    price: 80.00,
    category: "Verão",
    image: "/assets/images/slide.jpg",
    badge: ""
  }
];

export default function ShoeSection() {
  return (
    <section className="bg-zinc-50 py-20 px-6">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Cabeçalho da Seção */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 border-b border-zinc-200 pb-8">
          <div className="text-center md:text-left">
            <span className="text-yellow-600 font-bold text-sm tracking-[0.3em] uppercase">Passo com Estilo</span>
            <h2 className="text-4xl md:text-6xl font-black text-black uppercase italic tracking-tighter mt-2">
              Variedade de <span className="text-yellow-500">Calçados</span>
            </h2>
          </div>
          <p className="text-gray-500 max-w-xs text-center md:text-right font-medium text-sm">
            Do Kenner ao Nike: a maior variedade de calçados de Nova Iguaçu você encontra aqui.
          </p>
        </div>

        {/* Grid Flexível de Calçados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {shoeCollection.map((shoe) => (
            <div key={shoe.id} className="group bg-white rounded-2xl p-4 shadow-sm border border-transparent hover:border-yellow-500/30 transition-all duration-300">
              
              {/* Imagem do Calçado */}
              <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-100 mb-4">
                {shoe.badge && (
                  <span className="absolute top-2 left-2 z-10 bg-yellow-500 text-black text-[9px] font-black px-2 py-1 rounded-sm uppercase italic">
                    {shoe.badge}
                  </span>
                )}
                <img 
                  src={shoe.image} 
                  alt={shoe.name} 
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 p-4"
                />
              </div>

              {/* Info e Preço */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{shoe.category}</span>
                <h3 className="font-bold text-zinc-900 text-sm md:text-base leading-tight group-hover:text-yellow-600 transition-colors uppercase italic">
                  {shoe.name}
                </h3>
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-400 font-medium leading-none mb-1">Por apenas:</span>
                    <span className="text-xl font-black text-black tracking-tighter">
                      R$ {shoe.badge === "Oferta" ? shoe.price.toFixed(2) : shoe.price.toFixed(2)}
                    </span>
                  </div>
                  
                  <button className="bg-black text-white p-2.5 rounded-full hover:bg-yellow-500 hover:text-black transition-all active:scale-90">
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Card Especial de "Ver Mais" */}
          <div className="group relative aspect-square md:aspect-auto flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 hover:border-yellow-500 transition-all cursor-pointer">
             <div className="bg-white p-4 rounded-full shadow-lg group-hover:bg-yellow-500 transition-colors">
               <ArrowRight className="w-6 h-6 text-black" />
             </div>
             <span className="mt-4 font-black text-xs uppercase tracking-widest group-hover:text-yellow-600">Ver Todos os Modelos</span>
          </div>
        </div>
      </div>
    </section>
  );
}