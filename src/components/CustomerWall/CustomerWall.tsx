import { Instagram, Camera, MapPin } from 'lucide-react';

const customerPhotos = [
  { id: 1, image: "assets/images/cliente1.jpg", tag: "@usuario1" },
  { id: 2, image: "assets/images/cliente2.jpg", tag: "@usuario2" },
  { id: 3, image: "assets/images/cliente3.jpg", tag: "@usuario3" },
];

/**
 * @component CustomerWall
 * @description Seção de prova social com galeria centralizada, otimizada para SEO local e performance mobile.
 */
export default function CustomerWall() {
  return (
    <section 
      className="relative py-20 md:py-32 px-4 overflow-hidden bg-transparent"
      aria-labelledby="wall-title"
    >
      <div className="max-w-[1440px] mx-auto relative z-10 flex flex-col items-center">
        
        {/* Cabeçalho Estruturado e Centralizado */}
        <header className="flex flex-col md:flex-row items-center justify-between w-full mb-16 md:mb-24 gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 text-yellow-600 mb-6 font-black uppercase italic">
              <Camera className="w-5 h-5 drop-shadow-sm" />
              <span className="text-[10px] md:text-xs tracking-[0.4em] leading-none">Social Proof: Nosso Time</span>
            </div>
            <h2 
              id="wall-title"
              className="text-5xl md:text-8xl font-black text-zinc-950 uppercase italic tracking-tighter leading-[0.85]"
            >
              Quem Veste <span className="text-yellow-500 drop-shadow-sm">Gold</span>
            </h2>
          </div>

          <a 
            href="https://instagram.com/goldstoremultimarcas_" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Siga a Gold Store no Instagram"
            className="flex items-center gap-5 bg-zinc-950 text-white px-10 py-5 rounded-[1.8rem] hover:bg-yellow-500 hover:text-zinc-950 transition-all duration-500 group shadow-2xl shadow-zinc-950/20 active:scale-95"
          >
            <Instagram className="w-7 h-7 group-hover:rotate-12 transition-transform" />
            <div className="flex flex-col items-start leading-none">
              <span className="text-[10px] font-black uppercase opacity-60 mb-1 tracking-widest">Join the Club</span>
              <span className="text-base font-black tracking-tighter italic">@goldstoremultimarcas_</span>
            </div>
          </a>
        </header>

        {/* Galeria Centralizada com Snap Scroll */}
        <div 
          className="flex justify-center gap-6 overflow-x-auto w-full pb-16 scrollbar-hide snap-x snap-mandatory scroll-p-6 px-4"
          role="list"
          aria-roledescription="carousel"
        >
          {customerPhotos.map((photo) => (
            <article 
              key={photo.id}
              role="listitem"
              className="min-w-[85vw] sm:min-w-[320px] md:min-w-[380px] aspect-[3/4] snap-center group relative overflow-hidden rounded-[3rem] bg-zinc-100 border border-zinc-200 shadow-2xl transition-all duration-700 hover:shadow-yellow-500/20"
            >
              <img 
                src={photo.image} 
                alt={`Cliente da Gold Store utilizando produtos premium - ${photo.tag}`} 
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 grayscale-[15%] group-hover:grayscale-0"
              />
              
              {/* Overlay - Otimizado para legibilidade em qualquer dispositivo */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-95 md:opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-10 italic">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <div className="flex items-center gap-3 mb-3">
                     <div className="w-10 h-[2px] bg-yellow-500" />
                     <span className="text-yellow-500 font-black text-lg tracking-[0.1em] uppercase">
                      {photo.tag}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-100 font-bold">
                    <MapPin className="w-4 h-4 text-yellow-500" />
                    <span className="text-[11px] uppercase tracking-[0.2em] leading-none">
                      Nova Iguaçu • RJ
                    </span>
                  </div>
                </div>
              </div>

              {/* Verified Visual Indicator */}
              <div className="absolute top-8 right-8 bg-zinc-950/40 backdrop-blur-md border border-white/20 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100">
                 <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full shadow-[0_0_15px_#eab308]" />
              </div>
            </article>
          ))}
        </div>

        {/* Footer UX: Indicador Mobile Centralizado */}
        <footer className="mt-4 flex flex-col items-center gap-4 md:hidden select-none">
          <div className="h-[1.5px] w-24 bg-zinc-200 relative overflow-hidden rounded-full">
            <div className="absolute inset-0 bg-yellow-500 w-1/3 animate-slide-ux" />
          </div>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] italic animate-pulse">
            Swipe to Explore
          </p>
        </footer>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; touch-action: pan-x; }
        
        @keyframes slide-ux {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(350%); }
        }
        .animate-slide-ux {
          animation: slide-ux 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </section>
  );
}