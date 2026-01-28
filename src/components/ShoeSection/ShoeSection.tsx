import { ArrowRight, ShoppingCart, Footprints, Star } from 'lucide-react';

const shoeCollection = [
  { id: 1, name: "Tênis Nike Premium", price: 250.00, category: "Performance", image: "assets/images/nike-shoe.jpg", badge: "Premium" },
  { id: 2, name: "Tênis Adidas Campus", price: 200.00, category: "Casual / Street", image: "assets/images/adidas-campus.jpg", badge: "Mais Procurado" },
  { id: 3, name: "Tênis New Balance", price: 150.00, category: "Casual", image: "assets/images/new-balance.jpg", badge: "Oferta" },
  { id: 4, name: "Chinelo Kenner", price: 120.00, category: "Conforto", image: "assets/images/kenner.jpg", badge: "Original" },
  { id: 5, name: "Chinelo Slide", price: 80.00, category: "Verão", image: "assets/images/slide.jpg", badge: "" }
];

export default function ShoeSection() {
  return (
    <section className="relative py-16 md:py-32 px-4 overflow-hidden bg-transparent">
      
      <div className="max-w-[1440px] mx-auto relative z-10">
        
        {/* Cabeçalho de Alta Performance */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 md:mb-20 gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 text-yellow-600 mb-4">
              <Footprints className="w-6 h-6" />
              <span className="font-black text-[10px] md:text-xs uppercase tracking-[0.4em] drop-shadow-md">Passo com Estilo</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-black text-black uppercase italic tracking-tighter leading-none">
              Elite em <span className="text-yellow-500 underline decoration-black/5">Calçados</span>
            </h2>
          </div>
          <div className="hidden lg:block text-right">
             <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-2 italic">Nova Iguaçu • RJ</p>
             <div className="w-32 h-1 bg-yellow-500 ml-auto" />
          </div>
        </div>

        {/* Container de Scroll Snap para Mobile e Grid para Desktop */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-5 gap-5 md:gap-8 overflow-x-auto pb-10 md:pb-0 scrollbar-hide snap-x snap-mandatory px-2">
          {shoeCollection.map((shoe) => (
            <div 
              key={shoe.id} 
              className="min-w-[80vw] sm:min-w-[320px] md:min-w-full snap-center group relative bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/60 hover:border-yellow-500/50 shadow-xl hover:shadow-2xl transition-all duration-700 flex flex-col"
            >
              
              {/* Container da Imagem com Badge Dinâmica */}
              <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-zinc-200/30 mb-6 flex items-center justify-center">
                {shoe.badge && (
                  <span className="absolute top-4 left-4 z-20 bg-black text-yellow-500 text-[10px] font-black px-4 py-1.5 rounded-xl uppercase italic shadow-lg">
                    {shoe.badge}
                  </span>
                )}
                
                <img 
                  src={shoe.image} 
                  alt={shoe.name} 
                  className="w-full h-full object-contain p-6 transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-[-5deg]"
                />
              </div>

              {/* Informações e Rating */}
              <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{shoe.category}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    <span className="text-[10px] font-black">5.0</span>
                  </div>
                </div>

                <h3 className="font-bold text-zinc-900 text-xl leading-tight group-hover:text-yellow-600 transition-colors uppercase italic mb-6">
                  {shoe.name}
                </h3>
                
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-black/5">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase mb-1">Preço Gold</span>
                    <span className="text-3xl font-black text-black tracking-tighter">
                      R$ {shoe.price.toFixed(2)}
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

        {/* Navegação Mobile */}
        <div className="mt-12 md:hidden flex flex-col items-center gap-4">
           <div className="flex gap-2">
              <div className="w-8 h-1 bg-yellow-500 rounded-full" />
              <div className="w-2 h-1 bg-zinc-300 rounded-full" />
              <div className="w-2 h-1 bg-zinc-300 rounded-full" />
           </div>
           <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest animate-pulse">Deslize lateral</span>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}