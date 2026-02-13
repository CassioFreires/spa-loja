import { ShoppingBag, ChevronRight } from 'lucide-react';
import CanvasEffect from '../style/Background';

export default function Banner() {
  return (
    <section 
      className="relative w-full h-[90vh] md:h-[700px] lg:h-[850px] overflow-hidden flex items-center bg-zinc-950"
      aria-labelledby="banner-heading"
    >
      
      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0 select-none">
        <img
          src="assets/images/banner-principal.jpg" 
          alt="Camisas de Time Qualidade Tailandesa 1:1 - Gold Store Coleção 2026"
          className="w-full h-full object-cover object-center animate-subtle-zoom opacity-70"
          loading="eager"
          fetchPriority="high"
        />
        
        {/* Overlays Otimizados: Gradiente mais profundo na base para legibilidade e SEO de contraste */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent md:bg-gradient-to-r md:from-black md:via-black/60 md:to-transparent z-10" />
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px] z-20" />
      </div>
    <CanvasEffect />

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-30 max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-20 text-white">
        
        {/* Badge SEO-Friendly */}
        <div 
          className="inline-flex items-center gap-2 bg-yellow-500 text-black px-4 py-1.5 rounded-full mb-6 shadow-xl shadow-yellow-500/20 animate-fade-in"
          role="status"
        >
          <span className="text-[9px] md:text-xs font-black uppercase tracking-[0.25em]">
            Lançamentos 2026
          </span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
          </span>
        </div>
        
        {/* Typography com foco em SEO Semântico */}
        <div className="animate-fade-in [animation-delay:200ms]">
          <h1 
            id="banner-heading"
            className="text-[2.6rem] xs:text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black leading-[0.85] uppercase italic tracking-tighter mb-6 drop-shadow-2xl"
          >
            O Manto do seu <br />
            <span className="text-yellow-500 inline-block">Time</span> está aqui
          </h1>
          
          <h2 className="text-zinc-300 text-base md:text-xl lg:text-2xl max-w-xl mb-10 leading-relaxed font-medium text-balance">
            Camisas de time com <strong className="text-white">qualidade tailandesa 1:1</strong> e tecnologia Dry Fit. 
            <span className="block mt-2 md:inline md:mt-0"> O estilo de <span className="text-white border-b-2 border-yellow-500 px-1">Nova Iguaçu</span> para o mundo.</span>
          </h2>
        </div>

        {/* Actions - Otimização de Target para Mobile */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in [animation-delay:400ms]">
          <button 
            className="group relative overflow-hidden bg-yellow-500 hover:bg-yellow-400 text-black font-black py-5 px-10 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg hover:shadow-yellow-500/40"
            aria-label="Comprar camisas de time agora"
          >
            <ShoppingBag className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="tracking-tighter">COMPRAR AGORA</span>
          </button>
          
          <button 
            className="group border-2 border-white/30 backdrop-blur-md bg-white/5 hover:border-yellow-500 hover:text-yellow-500 text-white font-bold py-5 px-10 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 hover:bg-white/10"
          >
            VER LANÇAMENTOS
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Scroll Indicator Otimizado para UX (Aparece apenas em telas altas) */}
      <div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-3 opacity-40 hover:opacity-100 transition-opacity cursor-default"
        aria-hidden="true"
      >
        <span className="text-[9px] uppercase tracking-[0.4em] font-bold italic">Explore</span>
        <div className="w-[1px] h-20 bg-gradient-to-b from-yellow-500 via-yellow-500/50 to-transparent" />
      </div>

    </section>
  );
}