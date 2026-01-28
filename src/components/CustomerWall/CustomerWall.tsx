import { ChevronRight, Instagram } from 'lucide-react';

const customerPhotos = [
  { id: 1, image: "/assets/images/cliente1.jpg", tag: "@usuario1" },
  { id: 2, image: "/assets/images/cliente2.jpg", tag: "@usuario2" },
  { id: 3, image: "/assets/images/cliente3.jpg", tag: "@usuario3" },
  { id: 4, image: "/assets/images/cliente4.jpg", tag: "@usuario4" },
  { id: 5, image: "/assets/images/cliente5.jpg", tag: "@usuario5" },
  { id: 6, image: "/assets/images/cliente6.jpg", tag: "@usuario6" },
];

export default function CustomerWall() {
  return (
    <section className="bg-white py-20 px-6 overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Cabeçalho Profissional */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="text-left">
            <span className="text-yellow-600 font-bold text-sm tracking-[0.3em] uppercase">Comunidade</span>
            <h2 className="text-4xl md:text-6xl font-black text-black uppercase italic tracking-tighter leading-none mt-2">
              Quem Veste <span className="text-yellow-500 text-stroke-black">Gold Store</span>
            </h2>
          </div>
          <div className="flex items-center gap-3 bg-zinc-100 px-5 py-3 rounded-full hover:bg-yellow-500 transition-all group cursor-pointer">
            <Instagram className="w-5 h-5 text-black" />
            <span className="text-xs font-black uppercase tracking-widest">Siga @goldstoremultimarcas_</span>
          </div>
        </div>

        {/* Galeria Snap Scroll */}
        <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory">
          {customerPhotos.map((photo) => (
            <div 
              key={photo.id}
              className="min-w-[260px] md:min-w-[320px] aspect-[3/4] snap-center group relative overflow-hidden rounded-2xl bg-zinc-100"
            >
              {/* Foto do Cliente */}
              <img 
                src={photo.image} 
                alt="Cliente Gold Store" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay no Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                <span className="text-yellow-500 font-black text-sm tracking-widest uppercase">
                  {photo.tag}
                </span>
                <span className="text-white text-[10px] font-bold uppercase tracking-widest mt-1">
                  Nova Iguaçu - RJ
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Indicador de Ação para Celular */}
        <div className="flex items-center justify-center gap-2 mt-4 md:hidden text-zinc-400">
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Deslize para ver mais</span>
          <ChevronRight className="w-4 h-4 animate-bounce-x" />
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        .animate-bounce-x { animation: bounce-x 1s infinite; }
      `}</style>
    </section>
  );
}