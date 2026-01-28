import { CategoryCard } from "../CategoryCard/CategoryCard";

export default function CategoryGrid() {
  const categories = [
    { 
      title: "Camisas de Time", 
      image: "/assets/images/cat-times.jpg", 
      path: "/categoria/times" 
    },
    { 
      title: "Tênis Premium", 
      image: "/assets/images/cat-tenis.jpg", 
      path: "/categoria/tenis" 
    },
    { 
      title: "Corta-Vento", 
      image: "/assets/images/cat-jaquetas.jpg", 
      path: "/categoria/corta-vento" 
    },
    { 
      title: "Acessórios", 
      image: "/assets/images/cat-acessorios.jpg", 
      path: "/categoria/acessorios" 
    },
  ];

  return (
    <section className="max-w-[1440px] mx-auto px-6 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-yellow-600 font-bold text-sm tracking-[0.2em] uppercase">
            Navegue por Estilo
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-black uppercase italic tracking-tighter">
            Categorias em <span className="text-yellow-500">Destaque</span>
          </h2>
        </div>
        <p className="text-gray-500 max-w-sm text-sm">
          Explore nossa curadoria de artigos importados e nacionais com envio direto de Nova Iguaçu.
        </p>
      </div>

      {/* Grid Responsivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <CategoryCard key={cat.title} {...cat} />
        ))}
      </div>
    </section>
  );
}