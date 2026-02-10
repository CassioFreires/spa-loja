import { ArrowUpRight, LayoutGrid, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCategoriesWithCount } from '../../../hooks/useCategories';

/**
 * @component CategoryGrid
 * @description Grid de categorias otimizado para SEO de alta performance e UX mobile premium.
 */
export default function CategoryGrid() {
  const { data: categories, isLoading, isError } = useCategoriesWithCount();

  const DEFAULT_IMAGE = "/assets/images/categories/default-cat.jpg";

  const getCategoryImage = (name: string) => {
    if (!name) return DEFAULT_IMAGE;
    const slug = name.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-');
    return `/assets/images/categories/cat-${slug}.jpg`;
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center bg-transparent" role="status">
        <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
        <span className="ml-4 font-black uppercase italic text-zinc-400 tracking-[0.3em] animate-pulse">
          Sincronizando Gold Store...
        </span>
      </div>
    );
  }

  if (isError || !categories) return null;

  return (
    <section 
      className="relative max-w-[1440px] mx-auto px-4 md:px-6 py-16 md:py-32 bg-transparent"
      aria-labelledby="category-title"
    >
      {/* Background Decorativo - Performance-Safe Glow */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-yellow-500/5 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none select-none" />

      {/* Header Semântico para SEO/IA */}
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-8 relative z-10 leading-none">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 text-yellow-600 mb-4 italic font-black">
            <LayoutGrid size={20} className="drop-shadow-sm" />
            <span className="text-[10px] md:text-xs uppercase tracking-[0.4em]">Curadoria por Estilo</span>
          </div>
          <h2 
            id="category-title"
            className="text-5xl md:text-8xl font-black text-zinc-950 uppercase italic tracking-tighter leading-[0.8] mb-4"
          >
            Categorias em <span className="text-yellow-500">Destaque</span>
          </h2>
        </div>
        <p className="text-zinc-500 max-w-sm text-xs md:text-base font-medium text-center md:text-right italic leading-relaxed text-balance">
          Estilo e autenticidade: O drop mais exclusivo de <strong className="text-zinc-950 font-black border-b-2 border-yellow-500">Nova Iguaçu</strong> para o cenário nacional.
        </p>
      </header>

      {/* Grid com Suporte a Gestos e SEO de Lista */}
      <div 
        className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8 overflow-x-auto pb-10 md:pb-0 scrollbar-hide snap-x snap-mandatory scroll-p-6 relative z-10"
        role="list"
      >
        {categories.slice(0, 4).map((cat, index) => (
          <article 
            key={cat.id} 
            role="listitem"
            className="min-w-[85vw] sm:min-w-[340px] md:min-w-full snap-center"
          >
            <Link 
              to={`/categoria/${cat.id}`}
              className="group relative block aspect-[4/5] overflow-hidden rounded-[2.8rem] bg-zinc-100 shadow-2xl shadow-zinc-200/50 border border-zinc-200/50 transition-all duration-700 hover:shadow-yellow-500/20 active:scale-95"
              aria-label={`Explorar coleção de ${cat.name}`}
            >
              {/* Imagem Otimizada com Hint de Carregamento */}
              <img 
                src={getCategoryImage(cat.name)} 
                alt={`Coleção Gold Store - ${cat.name}`} 
                className="w-full h-full object-cover transition-transform duration-[1.5s] cubic-bezier(0.4, 0, 0.2, 1) group-hover:scale-110"
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== window.location.origin + DEFAULT_IMAGE) {
                    target.onerror = null;
                    target.src = DEFAULT_IMAGE;
                  }
                }}
              />
              
              {/* Overlay Dinâmico - Melhoria de Contraste UX */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
              
              {/* Conteúdo Textual com Hierarquia Visual */}
              <div className="absolute inset-0 p-10 flex flex-col justify-end italic">
                <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <span className="inline-block bg-yellow-500 text-black text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4 leading-none">
                    {cat.product_count} + Modelos
                  </span>
                  <h3 className="text-white text-3xl md:text-4xl font-black uppercase italic tracking-tighter leading-[0.9] mb-4 drop-shadow-lg">
                    {cat.name}
                  </h3>
                </div>
                
                {/* Micro-interação de Exploração */}
                <div className="flex items-center gap-3 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 delay-150 font-black uppercase text-[10px] tracking-[0.2em]">
                  <span className="border-b border-white/50 pb-1">Shop Now</span>
                  <div className="bg-white p-2.5 rounded-full text-black shadow-xl transform -rotate-45 group-hover:rotate-0 transition-transform duration-500">
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; touch-action: pan-x; }
      `}</style>
    </section>
  );
}