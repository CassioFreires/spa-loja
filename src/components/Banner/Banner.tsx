import { ShoppingBag, ChevronRight } from 'lucide-react';

export default function Banner() {
  return (
    <section className="relative w-full h-[85vh] md:h-[650px] lg:h-[750px] overflow-hidden flex items-center bg-transparent">
      
      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0">
        <img
          src="assets/images/banner-principal.jpg" 
          alt="Gold Store"
          className="w-full h-full object-cover object-center animate-subtle-zoom opacity-80"
        />
        {/* Overlays combinados em uma estrutura clara */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] z-20" />
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-30 max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-20 text-white">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-yellow-500 text-black px-4 py-1.5 rounded-full mb-6 shadow-xl shadow-yellow-500/30 animate-fade-in">
          <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
            Coleção 2026
          </span>
          <div className="w-1.5 h-1.5 bg-black rounded-full animate-ping" />
        </div>
        
        {/* Typography */}
        <div className="animate-fade-in [animation-delay:200ms]">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black leading-[0.9] uppercase italic tracking-tighter mb-6 drop-shadow-2xl">
            O Manto do seu <br />
            <span className="text-yellow-500">Time</span> está aqui
          </h1>
          
          <p className="text-zinc-300 text-sm md:text-lg lg:text-xl max-w-lg mb-10 leading-relaxed font-medium">
            Qualidade tailandesa 1:1 com tecnologia Dry Fit. <br className="hidden md:block" />
            O estilo de <span className="text-white border-b-2 border-yellow-500">Nova Iguaçu</span> para o mundo.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in [animation-delay:400ms]">
          <button className="group bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 px-10 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95">
            <ShoppingBag className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            COMPRAR AGORA
          </button>
          
          <button className="group border-2 border-white/20 backdrop-blur-md bg-white/5 hover:border-yellow-500 hover:text-yellow-500 text-white font-bold py-4 px-10 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95">
            LANÇAMENTOS
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-3 opacity-30">
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Scroll</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-yellow-500 to-transparent" />
      </div>

    </section>
  );
}