import { ArrowUpRight, LayoutGrid, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCategoriesWithCount } from '../../../hooks/useCategories';

export default function CategoryGrid() {
  const { data: categories, isLoading, isError } = useCategoriesWithCount();

  // URL da imagem padrão caso a da categoria não exista
  const DEFAULT_IMAGE = "/assets/images/categories/default-cat.jpg";

  const getCategoryImage = (name: string) => {
    if (!name) return DEFAULT_IMAGE;
    // Normaliza: "Camisetas Peruanas" -> "camisetas-peruanas"
    const slug = name.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-');
    return `/assets/images/categories/cat-${slug}.jpg`;
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center bg-transparent">
        <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
        <span className="ml-4 font-black uppercase italic text-zinc-400 tracking-widest">Sincronizando Gold Store...</span>
      </div>
    );
  }

  if (isError || !categories) return null;

  return (
    <section className="relative max-w-[1440px] mx-auto px-4 md:px-6 py-12 md:py-24 bg-transparent">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[150px] -mr-64 -mt-64 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-6 relative z-10 leading-none">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-yellow-600 mb-3 italic font-black">
            <LayoutGrid size={18} />
            <span className="text-[10px] md:text-xs uppercase tracking-[0.3em]">Navegue por Estilo</span>
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-black uppercase italic tracking-tighter leading-[0.85]">
            Categorias em <span className="text-yellow-500">Destaque</span>
          </h2>
        </div>
        <p className="text-zinc-500 max-w-xs text-xs md:text-sm font-medium text-center md:text-right italic leading-relaxed">
          Curadoria de luxo: Envio direto de <span className="text-black font-bold">Nova Iguaçu</span> para todo o Brasil.
        </p>
      </div>

      {/* Grid Dinâmico */}
      <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 overflow-x-auto pb-8 md:pb-0 scrollbar-hide snap-x snap-mandatory relative z-10">
        {categories.slice(0, 4).map((cat) => (
          <Link 
            key={cat.id} 
            to={`/categoria/${cat.id}`}
            className="min-w-[78vw] sm:min-w-[300px] md:min-w-full snap-center group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-zinc-200 shadow-xl border border-zinc-100 hover:border-yellow-500/50 transition-all duration-500"
          >
            <img 
              src={getCategoryImage(cat.name)} 
              alt={cat.name} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              // O segredo para parar o looping: 
              // 1. Removemos o evento após a primeira falha.
              // 2. Só trocamos o SRC se ele já não for a imagem padrão.
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== window.location.origin + DEFAULT_IMAGE) {
                  target.onerror = null; // Remove o evento para evitar looping
                  target.src = DEFAULT_IMAGE;
                }
              }}
            />
            
            {/* Overlay Gradiente */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-80" />
            
            {/* Conteúdo do Card */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end italic">
              <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-2 block leading-none">
                  {cat.product_count} + Itens Disponíveis
                </span>
                <h3 className="text-white text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none mb-4">
                  {cat.name}
                </h3>
              </div>
              
              <div className="flex items-center gap-2 text-white/0 group-hover:text-white transition-all duration-500 delay-100 font-bold uppercase text-[10px] tracking-widest">
                <span>Explorar Coleção</span>
                <div className="bg-yellow-500 p-2 rounded-full text-black shadow-lg shadow-yellow-500/20">
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}