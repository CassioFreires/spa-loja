import { Star, UserCheck, ShieldCheck, Quote, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Reviews() {
  // Buscamos os comentários reais do backend
  const { data, isLoading } = useQuery({
    queryKey: ['public-reviews-home'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/comments/approved?page=1&limit=3`);
      return res.data;
    }
  });

  const reviews = data?.data || [];

  return (
    <section className="relative py-20 md:py-32 px-4 overflow-hidden bg-transparent">
      <div className="max-w-[1440px] mx-auto relative z-10">
        
        {/* Cabeçalho */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-4 py-1.5 rounded-full text-yellow-600 mb-6">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-black text-[10px] uppercase tracking-[0.2em]">Depoimentos Reais</span>
          </div>
          
          <h2 className="text-4xl md:text-7xl font-black text-black uppercase italic tracking-tighter leading-none mb-6">
            O que dizem sobre <br />
            <span className="text-yellow-500 drop-shadow-sm">Nossa Loja</span>
          </h2>

          <Link 
            to="/avaliacoes" 
            className="group flex items-center gap-3 bg-black text-white px-8 py-4 rounded-2xl hover:bg-yellow-600 hover:text-black transition-all active:scale-95 shadow-2xl font-black uppercase italic text-xs tracking-widest"
          >
            Ver todas as avaliações
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
          </div>
        ) : (
          <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto pb-10 md:pb-0 scrollbar-hide snap-x snap-mandatory px-2">
            {reviews.map((review: any) => (
              <div 
                key={review.id} 
                className="min-w-[85vw] md:min-w-full snap-center bg-white/40 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-white/60 flex flex-col justify-between hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-700 relative group"
              >
                <Quote className="absolute top-8 right-8 w-10 h-10 text-yellow-500/10 group-hover:text-yellow-500/20 transition-colors" />

                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={16} className="fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                    <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">
                        {new Date(review.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <p className="text-zinc-800 font-medium text-lg md:text-xl leading-relaxed italic mb-10 relative z-10">
                    "{review.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-8 border-t border-black/5">
                  <div className="bg-yellow-500 p-3 rounded-2xl shadow-lg">
                    <UserCheck className="w-6 h-6 text-black" />
                  </div>
                  <div className="flex flex-col text-left">
                    <h4 className="font-black text-black text-base uppercase tracking-tighter leading-none">{review.user_name}</h4>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase mt-1">
                        Comprou: {review.product_name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}