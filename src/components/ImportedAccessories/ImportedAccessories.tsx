import { ShoppingBag, Star, Crown, Sparkles } from 'lucide-react';

const accessories = [
  { id: 1, name: "Boné Premium Importado", price: 50.00, category: "Bonés", image: "assets/images/bone-gold.jpg", featured: true },
  { id: 2, name: "Bucket Street Style", price: 60.00, category: "Buckets", image: "assets/images/bucket-importado.jpg", featured: false },
  { id: 3, name: "Bag Transversal Gold", price: 80.00, category: "Bags", image: "assets/images/bag-premium.jpg", featured: true },
  { id: 4, name: "Bolsa Luxo Multimarcas", price: 150.00, category: "Bolsas", image: "assets/images/bolsa-luxo.jpg", featured: false },
  { id: 5, name: "Necessaire Organizadora", price: 80.00, category: "Acessórios", image: "assets/images/necessaire.jpg", featured: false }
];

export default function ImportedAccessories() {
  return (
    <section className="relative py-16 md:py-28 px-4 overflow-hidden bg-transparent">
      {/* Container decorativo interno para foco visual */}
      <div className="max-w-[1440px] mx-auto relative z-10">
        
        {/* Cabeçalho de Grife */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12 md:mb-20 gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-yellow-600 mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="font-black text-[10px] md:text-xs uppercase tracking-[0.4em]">Linha Exclusive</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-black text-black uppercase italic tracking-tighter leading-none">
              Acessórios <span className="text-yellow-500">Importados</span>
            </h2>
          </div>
          <div className="max-w-xs text-center md:text-right">
             <p className="text-zinc-500 text-xs md:text-sm font-medium leading-relaxed mb-4">
               A curadoria Gold Store traz peças selecionadas para quem não aceita o comum.
             </p>
             <div className="h-1 w-20 bg-yellow-500 ml-auto hidden md:block" />
          </div>
        </div>

        {/* Grid de 5 Colunas com Scroll Mobile Suave */}
        <div className="flex md:grid md:grid-cols-3 lg:grid-cols-5 gap-5 overflow-x-auto pb-10 md:pb-0 scrollbar-hide snap-x snap-mandatory px-2">
          {accessories.map((item) => (
            <div 
              key={item.id} 
              className="min-w-[280px] md:min-w-full snap-center group relative bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-5 border border-white/60 hover:border-yellow-500/40 shadow-xl hover:shadow-2xl transition-all duration-700 flex flex-col"
            >
              {/* Badge de Destaque */}
              {item.featured && (
                <div className="absolute top-7 right-7 z-20 bg-black text-yellow-500 p-2 rounded-full shadow-lg border border-yellow-500/20 scale-90 group-hover:scale-110 transition-transform">
                  <Crown className="w-3.5 h-3.5" />
                </div>
              )}

              {/* Imagem do Produto */}
              <div className="relative aspect-square overflow-hidden rounded-[1.8rem] bg-zinc-200/50 mb-6">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                {/* Overlay sutil ao passar o mouse */}
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
              </div>

              {/* Info & CTA */}
              <div className="flex flex-col flex-grow">
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mb-1">{item.category}</span>
                <h3 className="font-bold text-zinc-900 text-lg leading-tight group-hover:text-yellow-600 transition-colors uppercase italic mb-4 h-12 line-clamp-2">
                  {item.name}
                </h3>
                
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500" />
                  ))}
                  <span className="text-[10px] text-zinc-400 ml-1 font-bold">5.0</span>
                </div>

                <div className="mt-auto">
                  <div className="flex items-baseline gap-1 mb-5">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">R$</span>
                    <span className="text-3xl font-black text-black tracking-tighter">
                      {item.price.toFixed(2)}
                    </span>
                  </div>

                  <button className="w-full bg-black hover:bg-yellow-500 text-white hover:text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-500 active:scale-95 group/btn">
                    <ShoppingBag className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    <span className="text-[10px] uppercase tracking-widest">Adicionar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navegação Auxiliar Mobile */}
        <div className="mt-10 md:hidden flex justify-center items-center gap-4 text-zinc-400">
           <div className="w-12 h-[1px] bg-zinc-300" />
           <p className="text-[10px] font-black uppercase tracking-widest">Deslize para ver</p>
           <div className="w-12 h-[1px] bg-zinc-300" />
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}