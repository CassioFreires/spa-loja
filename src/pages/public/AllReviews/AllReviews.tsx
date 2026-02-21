import { useState, useMemo, useCallback } from 'react';
import { Star, ArrowLeft, Loader2, ShieldCheck, UserCheck, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Configuração de API centralizada
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * PAGE: AllReviews
 * Focada em Social Proof, Performance e SEO Estruturado.
 */
export default function AllReviews() {
  const [page, setPage] = useState(1);

  // DATA FETCHING: Preservando regra de negócio original
  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ['all-approved-reviews', page],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/comments/approved?page=${page}&limit=12`);
      return res.data;
    },
    placeholderData: (prev) => prev, // UX: Mantém dados na tela enquanto carrega nova página
    staleTime: 5000,
  });

  const reviews = useMemo(() => data?.data || [], [data]);
  const pagination = data?.pagination;

  // HANDLERS: Memoizados para performance
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // SEO: Dados estruturados para IA e Google (AggregateRating)
  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Gold Store Exclusive Collection",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": pagination?.total || "100",
      "bestRating": "5",
      "worstRating": "1"
    }
  }), [pagination?.total]);

  return (
    <main className="min-h-screen bg-[#F8F9FB] py-12 md:py-20 px-4 sm:px-6 lg:px-8 font-sans italic leading-none selection:bg-yellow-100">
      {/* Script de SEO Dinâmico */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SEMÂNTICO */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-16 md:mb-24 gap-8">
          <div className="flex items-center gap-4 md:gap-6">
            <Link 
              to="/" 
              className="p-4 bg-white border border-zinc-100 rounded-2xl hover:bg-zinc-50 transition-all shadow-sm focus:ring-2 focus:ring-yellow-500 outline-none"
              aria-label="Voltar para a página inicial"
            >
              <ArrowLeft size={24} aria-hidden="true" />
            </Link>
            <div className="text-left">
              <h1 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-[0.9]">
                Voz do <span className="text-yellow-500">Cliente</span>
              </h1>
              <p className="text-zinc-400 font-bold uppercase text-[9px] md:text-[10px] tracking-[0.3em] mt-3">
                Transparência Total Gold Store • Prova Social Verificada
              </p>
            </div>
          </div>
          
          <section 
            className="bg-zinc-900 text-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] flex items-center gap-6 border border-zinc-800 shadow-2xl transition-transform hover:scale-105"
            aria-label="Avaliação Geral"
          >
            <ShieldCheck className="text-yellow-500 w-10 h-10" aria-hidden="true" />
            <div className="text-left">
              <p className="text-3xl md:text-4xl font-black italic leading-none">4.9/5</p>
              <p className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest mt-2">Satisfação Global</p>
            </div>
          </section>
        </header>

        {/* ESTADOS DE CARREGAMENTO */}
        {isLoading && !isPlaceholderData ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4" role="alert" aria-busy="true">
            <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
            <p className="font-black uppercase italic text-xs tracking-widest text-zinc-400">Sincronizando depoimentos...</p>
          </div>
        ) : (
          <div className={`transition-opacity duration-300 ${isPlaceholderData ? 'opacity-50' : 'opacity-100'}`}>
            {/* GRID DE REVIEWS - Artigos Semânticos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {reviews.map((review: any) => (
                <article 
                  key={review.id} 
                  className="bg-white p-8 rounded-[2.5rem] md:rounded-[3rem] border border-zinc-100 shadow-sm flex flex-col justify-between hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 text-left group"
                >
                  <div>
                    <header className="flex items-center justify-between mb-6">
                      <div className="flex gap-0.5" aria-label={`Avaliação de ${review.rating} estrelas`}>
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            className={i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-zinc-100"} 
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <time 
                        dateTime={review.created_at} 
                        className="text-[10px] font-black text-zinc-300 uppercase tracking-widest"
                      >
                        {new Date(review.created_at).toLocaleDateString('pt-BR')}
                      </time>
                    </header>
                    <blockquote className="text-zinc-700 font-medium text-lg md:text-xl leading-relaxed italic mb-10 min-h-[120px]">
                      "{review.comment}"
                    </blockquote>
                  </div>

                  <footer className="flex items-center gap-4 pt-6 border-t border-zinc-50">
                    <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-300 group-hover:bg-yellow-50 group-hover:text-yellow-600 transition-colors">
                      <UserCheck size={22} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-black text-sm uppercase text-zinc-900 leading-none mb-1">{review.user_name}</p>
                      <p className="text-[10px] font-bold text-yellow-600 uppercase italic line-clamp-1 tracking-tight">
                        Adquiriu: {review.product_name}
                      </p>
                    </div>
                  </footer>
                </article>
              ))}
            </div>

            {/* PAGINAÇÃO PROFISSIONAL */}
            {pagination && pagination.lastPage > 1 && (
              <nav className="mt-20 flex flex-wrap justify-center gap-3" aria-label="Navegação de páginas">
                {[...Array(pagination.lastPage)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    aria-current={page === i + 1 ? 'page' : undefined}
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl font-black text-sm transition-all active:scale-90 ${
                      page === i + 1 
                      ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/30 italic scale-110" 
                      : "bg-white text-zinc-400 border border-zinc-100 hover:bg-zinc-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </nav>
            )}
          </div>
        )}

        {/* EMPTY STATE */}
        {reviews.length === 0 && !isLoading && (
          <section className="py-40 text-center bg-white rounded-[3rem] md:rounded-[4rem] border-2 border-dashed border-zinc-100">
            <MessageCircle className="w-16 h-16 text-zinc-100 mx-auto mb-4" aria-hidden="true" />
            <p className="text-zinc-400 font-black uppercase italic tracking-widest text-xs">
              Nenhum depoimento disponível no momento.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}