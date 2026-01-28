interface CategoryCardProps {
  title: string;
  image: string;
  path: string;
}

export function CategoryCard({ title, image, path }: CategoryCardProps) {
  return (
    <a 
      href={path} 
      className="group relative h-64 md:h-80 w-full overflow-hidden rounded-xl bg-zinc-200"
    >
      {/* Imagem com efeito Zoom */}
      <img 
        src={image} 
        alt={title} 
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      
      {/* Overlay Escuro */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      
      {/* Texto e Botão */}
      <div className="absolute bottom-0 left-0 w-full p-6 text-center">
        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">
          {title}
        </h3>
        <span className="inline-block bg-yellow-500 text-black text-[10px] font-black px-4 py-1 rounded-full opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          VER PRODUTOS
        </span>
      </div>
    </a>
  );
}