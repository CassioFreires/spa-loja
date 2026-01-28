import { Star, UserCheck, ShieldCheck, Quote, CheckCircle2 } from 'lucide-react';

const reviews = [
  {
    id: 1,
    author: "Ricardo M.",
    date: "Há 2 dias",
    comment: "Melhor camisa tailandesa que já comprei. O tecido Dry Fit é idêntico ao original e o caimento modelo jogador é perfeito.",
    product: "Manto Flamengo 2026",
    rating: 5
  },
  {
    id: 2,
    author: "Juliana F.",
    date: "Há 1 semana",
    comment: "O tênis Adidas Campus chegou impecável em Mesquita. O atendimento pelo WhatsApp foi muito rápido e atencioso.",
    product: "Adidas Campus",
    rating: 5
  },
  {
    id: 3,
    author: "Felipe T.",
    date: "Há 2 semanas",
    comment: "Corta-vento de muita qualidade. Ideal para o frio aqui do RJ. Recomendo a Gold Store para todos os meus amigos!",
    product: "Corta-Vento The North Face",
    rating: 5
  }
];

export default function Reviews() {
  return (
    <section className="relative py-20 md:py-32 px-4 overflow-hidden bg-transparent">
      
      <div className="max-w-[1440px] mx-auto relative z-10">
        
        {/* Título e Selos de Confiança */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-4 py-1.5 rounded-full text-yellow-600 mb-6">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-black text-[10px] uppercase tracking-[0.2em]">Plataforma 100% Segura</span>
          </div>
          
          <h2 className="text-4xl md:text-7xl font-black text-black uppercase italic tracking-tighter leading-none mb-6">
            O que dizem sobre <br />
            <span className="text-yellow-500 drop-shadow-sm">Nossa Loja</span>
          </h2>

          <div className="flex flex-col items-center gap-2 bg-white/40 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/60 shadow-xl">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
              ))}
            </div>
            <span className="font-black text-black text-sm uppercase tracking-tighter">
              4.9/5 <span className="text-zinc-500 font-bold ml-1">• 1.250 AVALIAÇÕES</span>
            </span>
          </div>
        </div>

        {/* Grid de Depoimentos com Scroll Mobile */}
        <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto pb-10 md:pb-0 scrollbar-hide snap-x snap-mandatory px-2">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="min-w-[85vw] md:min-w-full snap-center bg-white/40 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-white/60 flex flex-col justify-between hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-700 relative group"
            >
              {/* Ícone de Aspas Flutuante */}
              <Quote className="absolute top-8 right-8 w-10 h-10 text-yellow-500/10 group-hover:text-yellow-500/20 transition-colors" />

              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">{review.date}</span>
                </div>
                
                <p className="text-zinc-800 font-medium text-lg md:text-xl leading-relaxed italic mb-10 relative z-10">
                  "{review.comment}"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-8 border-t border-black/5">
                <div className="relative">
                    <div className="bg-yellow-500 p-3 rounded-2xl shadow-lg shadow-yellow-500/30">
                        <UserCheck className="w-6 h-6 text-black" />
                    </div>
                    <CheckCircle2 className="absolute -bottom-1 -right-1 w-4 h-4 text-green-600 fill-white" />
                </div>
                <div className="flex flex-col">
                  <h4 className="font-black text-black text-base uppercase tracking-tighter">{review.author}</h4>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] bg-black text-white px-2 py-0.5 rounded font-black uppercase">Verificado</span>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase truncate max-w-[120px]">
                        {review.product}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rodapé da Seção com Info de Localização */}
        <div className="mt-16 md:mt-24 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-black rounded-2xl text-white shadow-2xl">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
               Sede Própria em Nova Iguaçu – RJ
            </span>
          </div>
          <p className="mt-6 text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
            Envios diários para todo o Brasil • Qualidade Tailandesa 1:1
          </p>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}