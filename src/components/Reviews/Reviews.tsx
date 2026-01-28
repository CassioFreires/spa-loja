import { Star, UserCheck, ShieldCheck } from 'lucide-react';

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
    comment: "O tênis Adidas Campus chegou impecável em Mesquita. O atendimento pelo WhatsApp foi muito rápido.",
    product: "Adidas Campus",
    rating: 5
  },
  {
    id: 3,
    author: "Felipe T.",
    date: "Há 2 semanas",
    comment: "Corta-vento de muita qualidade. Ideal para o frio aqui do RJ. Recomendo a Gold Store para todos!",
    product: "Corta-Vento The North Face",
    rating: 5
  }
];

export default function Reviews() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Título e Selos de Confiança */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 text-yellow-600 mb-4">
             <ShieldCheck className="w-5 h-5" />
             <span className="font-black text-xs uppercase tracking-[0.2em]">Loja 100% Segura</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-black uppercase italic tracking-tighter leading-tight">
            O que dizem sobre <span className="text-yellow-500">Nós</span>
          </h2>
          <div className="flex items-center gap-2 mt-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
              ))}
            </div>
            <span className="font-bold text-black">(4.9/5 de 1.250 avaliações)</span>
          </div>
        </div>

        {/* Grid de Depoimentos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100 flex flex-col justify-between hover:shadow-xl transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">{review.date}</span>
                </div>
                
                <p className="text-zinc-700 font-medium leading-relaxed italic mb-6">
                  "{review.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-zinc-200">
                <div className="bg-yellow-500 p-2 rounded-full">
                  <UserCheck className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h4 className="font-black text-black text-sm uppercase">{review.author}</h4>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Comprei: {review.product}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Local */}
        <div className="mt-16 text-center">
          <p className="text-zinc-500 text-sm font-medium">
            Atendimento especializado em Nova Iguaçu – RJ e envios para todo o Brasil.
          </p>
        </div>
      </div>
    </section>
  );
}