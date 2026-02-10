import { Star, UserCheck, ShieldCheck, Quote, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * @component Reviews
 * @description Vitrine de depoimentos com foco em Prova Social (Social Proof), SEO Local e UX Mobile-First.
 */
export default function Reviews() {
  const { data, isLoading } = useQuery({
    queryKey: ['public-reviews-home'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/comments/approved?page=1&limit=3`);
      return res.data;
    }
  });

  const reviews = data?.data || [];

  return (
    <section 
      className="relative py-20 md:py-32 px-4 overflow-hidden bg-transparent"
      aria-labelledby="reviews-heading"
    >
      <div className="max-w-[1440px] mx-auto relative z-10">
        
        {/* Cabeçalho Estruturado para SEO/IA */}
        <header className="flex flex-col items-center text-center mb-16 md:mb-24">
          <div 
            className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-5 py-2 rounded-full text-yellow-600 mb-6 animate-fade-in"
            role="status"
          >
              <ShieldCheck className="w-4 h-4" />
              <span className="font-black text-[10px] uppercase tracking-[0.3em]">Prova Social Verificada</span>
          </div>
          
          <h2 
            id="reviews-heading"
            className="text-5xl md:text-8xl font-black text-zinc-950 uppercase italic tracking-tighter leading-[0.85] mb-10"
          >
            O que dizem sobre <br />
            <span className="text-yellow-500 drop-shadow-sm">Nossa Loja</span>
          </h2>

          <Link 
            to="/avaliacoes" 
            className="group flex items-center gap-4 bg-zinc-950 text-white px-10 py-5 rounded-2xl hover:bg-yellow-500 hover:text-zinc-950 transition-all active:scale-95 shadow-2xl font-black uppercase text-[11px] tracking-[0.2em]"
            aria-label="Ver todos os depoimentos de clientes"
          >
            Ver todos os depoimentos
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4" role="status">
            <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
            <span className="text-zinc-400 font-black uppercase text-[10px] tracking-widest">Sincronizando Feedbacks...</span>
          </div>
        ) : (
          /* Grid Híbrido: Snap Scroll no Mobile / Grid no Desktop */
          <div 
            className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 overflow-x-auto pb-12 md:pb-0 scrollbar-hide snap-x snap-mandatory scroll-p-6"
            role="list"
          >
            {reviews.map((review: any) => (
              <article 
                key={review.id} 
                role="listitem"
                className="min-w-[88vw] md:min-w-full snap-center group relative h-full bg-white/40 backdrop-blur-md rounded-[3rem] p-8 md:p-12 border border-white/60 flex flex-col justify-between hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-700"
              >
                <Quote className="absolute top-10 right-10 w-12 h-12 text-yellow-500/5 group-hover:text-yellow-500/10 transition-colors pointer-events-none" />

                <div className="relative z-10 flex flex-col h-full">
                  <header className="flex items-center justify-between mb-10">
                    <div 
                      className="flex gap-1.5" 
                      aria-label={`Avaliação de ${review.rating} estrelas`}
                    >
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className={`${i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-zinc-200'} transition-colors`} 
                        />
                      ))}
                    </div>
                    <time 
                      dateTime={review.created_at}
                      className="text-[10px] text-zinc-400 font-black uppercase tracking-widest italic"
                    >
                      {new Date(review.created_at).toLocaleDateString('pt-BR')}
                    </time>
                  </header>
                  
                  <blockquote className="flex-grow">
                    <p className="text-zinc-900 font-bold text-xl md:text-2xl leading-[1.2] italic mb-12 tracking-tight text-left text-balance">
                      "{review.comment}"
                    </p>
                  </blockquote>

                  {/* Footer do Card com Local SEO implicito */}
                  <footer className="flex items-center gap-5 pt-8 border-t border-zinc-950/5 text-left mt-auto">
                    <div className="relative shrink-0">
                      <div className="bg-zinc-950 text-yellow-500 p-3.5 rounded-2xl shadow-xl group-hover:bg-yellow-500 group-hover:text-zinc-950 transition-colors">
                          <UserCheck className="w-6 h-6" />
                      </div>
                      <CheckCircle2 
                        className="absolute -bottom-1 -right-1 w-5 h-5 text-green-600 fill-white" 
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex flex-col leading-none">
                      <h4 className="font-black text-zinc-950 text-lg uppercase tracking-tighter mb-1.5 italic">
                        {review.user_name}
                      </h4>
                      <span className="text-[10px] text-yellow-600 font-black uppercase tracking-widest truncate max-w-[180px]">
                        {review.product_name || "Cliente Verificado"}
                      </span>
                    </div>
                  </footer>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}