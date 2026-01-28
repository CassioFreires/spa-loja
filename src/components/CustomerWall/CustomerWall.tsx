import { Instagram, Camera, MapPin } from 'lucide-react';

const customerPhotos = [
  { id: 1, image: "assets/images/cliente1.jpg", tag: "@usuario1" },
  { id: 2, image: "assets/images/cliente2.jpg", tag: "@usuario2" },
  { id: 3, image: "assets/images/cliente3.jpg", tag: "@usuario3" },
  { id: 4, image: "assets/images/cliente4.jpg", tag: "@usuario4" },
  { id: 5, image: "assets/images/cliente5.jpg", tag: "@usuario5" },
  { id: 6, image: "assets/images/cliente6.jpg", tag: "@usuario6" },
];

export default function CustomerWall() {
  return (
    <section className="relative py-20 md:py-32 px-4 overflow-hidden bg-transparent">
      
      <div className="max-w-[1440px] mx-auto relative z-10">
        
        {/* Cabeçalho Estilo Social Media */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 md:mb-20 gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-yellow-600 mb-4">
              <Camera className="w-5 h-5" />
              <span className="font-black text-[10px] md:text-xs uppercase tracking-[0.4em]">Nosso Time</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-black text-black uppercase italic tracking-tighter leading-none">
              Quem Veste <span className="text-yellow-500">Gold</span>
            </h2>
          </div>

          <a 
            href="https://instagram.com/goldstoremultimarcas_" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-black text-white px-8 py-4 rounded-2xl hover:bg-yellow-500 hover:text-black transition-all duration-500 group shadow-2xl shadow-black/20 active:scale-95"
          >
            <Instagram className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-bold uppercase opacity-60 leading-none">Siga no Insta</span>
              <span className="text-sm font-black tracking-tight">@goldstoremultimarcas_</span>
            </div>
          </a>
        </div>

        {/* Galeria Snap Scroll com Efeito de Card Premium */}
        <div className="flex gap-6 overflow-x-auto pb-12 scrollbar-hide snap-x snap-mandatory px-2">
          {customerPhotos.map((photo) => (
            <div 
              key={photo.id}
              className="min-w-[280px] md:min-w-[350px] aspect-[3/4] snap-center group relative overflow-hidden rounded-[2.5rem] bg-white/30 backdrop-blur-md border border-white/60 shadow-xl hover:shadow-yellow-500/20 transition-all duration-700"
            >
              {/* Foto do Cliente com Zoom suave */}
              <img 
                src={photo.image} 
                alt="Cliente Gold Store" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
              />
              
              {/* Overlay Informativo */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 md:opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-8 h-[2px] bg-yellow-500" />
                   <span className="text-yellow-500 font-black text-sm tracking-[0.2em] uppercase">
                    {photo.tag}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-white/80">
                  <MapPin className="w-3 h-3 text-yellow-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Nova Iguaçu - RJ
                  </span>
                </div>
              </div>

              {/* Tag de Verificação Visual */}
              <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Indicador de Movimento Customizado */}
        <div className="mt-8 flex justify-center items-center gap-6 md:hidden">
          <div className="h-[2px] w-20 bg-zinc-200 overflow-hidden">
            <div className="h-full bg-yellow-500 w-1/2 animate-slide-loading" />
          </div>
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">Arraste</span>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes slide-loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-slide-loading {
          animation: slide-loading 2s infinite linear;
        }
      `}</style>
    </section>
  );
}