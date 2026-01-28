import { ArrowUpRight, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  { 
    title: "Camisas de Time", 
    image: "assets/images/cat-times.jpg", 
    path: "/categoria/times",
    count: "120+ Itens"
  },
  { 
    title: "Tênis Premium", 
    image: "assets/images/cat-tenis.jpg", 
    path: "/categoria/tenis",
    count: "80+ Itens"
  },
  { 
    title: "Corta-Vento", 
    image: "assets/images/cat-jaquetas.jpg", 
    path: "/categoria/corta-vento",
    count: "45+ Itens"
  },
  { 
    title: "Acessórios", 
    image: "assets/images/cat-acessorios.jpg", 
    path: "/categoria/acessorios",
    count: "60+ Itens"
  },
];

export default function CategoryGrid() {
  return (
    <section className="relative max-w-[1440px] mx-auto px-4 md:px-6 py-12 md:py-24 bg-transparent">
      
      {/* Header com Tipografia Fluida */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-6">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-yellow-600 mb-3">
            <LayoutGrid className="w-4 h-4" />
            <span className="font-black text-[10px] md:text-xs uppercase tracking-[0.3em]">
              Navegue por Estilo
            </span>
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-black uppercase italic tracking-tighter leading-none">
            Categorias em <span className="text-yellow-500">Destaque</span>
          </h2>
        </div>
        <p className="text-zinc-500 max-w-xs text-xs md:text-sm font-medium text-center md:text-right leading-relaxed">
          Explore nossa curadoria de artigos com envio direto de <span className="text-black font-bold">Nova Iguaçu</span> para todo o Brasil.
        </p>
      </div>

      {/* Grid Responsivo / Scroll Lateral Mobile */}
      <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 overflow-x-auto pb-8 md:pb-0 scrollbar-hide snap-x snap-mandatory">
        {categories.map((cat) => (
          <Link 
            key={cat.title} 
            to={cat.path}
            className="min-w-[75vw] sm:min-w-[300px] md:min-w-full snap-center group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-zinc-100 shadow-xl"
          >
            {/* Imagem de Fundo com Zoom */}
            <img 
              src={cat.image} 
              alt={cat.title} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            
            {/* Overlay Gradiente com Glassmorphism no fundo */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-80" />
            
            {/* Conteúdo do Card */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-2 block">
                  {cat.count}
                </span>
                <h3 className="text-white text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none mb-4">
                  {cat.title}
                </h3>
              </div>
              
              {/* Botão flutuante que aparece no Hover */}
              <div className="flex items-center gap-2 text-white/0 group-hover:text-white transition-all duration-500 delay-100">
                <span className="text-xs font-bold uppercase tracking-widest">Explorar</span>
                <div className="bg-yellow-500 p-2 rounded-full text-black">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Indicador Mobile */}
      <div className="flex md:hidden items-center justify-center gap-3 mt-4 text-zinc-400">
        <div className="w-10 h-[1px] bg-zinc-300" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Arraste para ver mais</span>
        <div className="w-10 h-[1px] bg-zinc-300" />
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}