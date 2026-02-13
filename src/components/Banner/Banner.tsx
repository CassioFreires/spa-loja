import { ShoppingBag, ChevronRight, Sparkles, ShieldCheck, Truck } from 'lucide-react';
import CanvasEffect from '../style/Background';

export default function Banner() {
  return (
    <section
      className="relative w-full h-[90vh] md:h-[700px] lg:h-[850px] overflow-hidden flex items-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-black"
      aria-labelledby="banner-heading"
    >


      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0 select-none">
        <img
          src="assets/images/banner-principal.jpg"
          alt="Camisas de Time Qualidade Tailandesa 1:1 - Gold Store Coleção 2026"
          className="w-full h-full object-cover object-center scale-105 hover:scale-100 transition-transform duration-[20s] opacity-70"
          loading="eager"
          fetchPriority="high"
        />

        <CanvasEffect />
        {/* Overlays com gradiente mais dinâmico */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent 
                      md:bg-gradient-to-r md:from-black md:via-black/70 md:to-transparent/80 z-10" />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] z-10" />

        {/* Efeito de luz sutil */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-yellow-500/5 to-transparent z-10" />
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-30 max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-20 text-white">

        {/* Badge com efeito melhorado */}
        <div
          className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-4 py-1.5 rounded-full mb-6 shadow-xl shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-shadow"
          role="status"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-[9px] md:text-xs font-black uppercase tracking-[0.25em]">
            Lançamentos 2026
          </span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
          </span>
        </div>

        {/* Typography - Mantive seu texto exatamente como estava */}
        <div className="animate-fade-in [animation-delay:200ms]">
          <h1
            id="banner-heading"
            className="text-[2.6rem] xs:text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black leading-[0.85] uppercase italic tracking-tighter mb-6 drop-shadow-2xl"
          >
            Gold <br />
            <span className="text-yellow-500 inline-block relative">
              Store
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-yellow-500/30 blur-sm"></span>
            </span>
          </h1>

          <h2 className="text-zinc-300 text-base md:text-xl lg:text-2xl max-w-xl mb-8 leading-relaxed font-medium">
            Camisas de time com <strong className="text-white bg-yellow-500/20 px-2 py-0.5 rounded">qualidade tailandesa 1:1</strong> e tecnologia Dry Fit.
            <span className="block mt-2 md:inline md:mt-0"> O estilo de <span className="text-white border-b-2 border-yellow-500 px-1 font-semibold">Nova Iguaçu</span> para o mundo.</span>
          </h2>
        </div>

        {/* Selos de confiança - Novo elemento sutil */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-xs md:text-sm text-zinc-400 animate-fade-in [animation-delay:300ms]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-yellow-500" />
            <span>Qualidade 1:1 garantida</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-yellow-500" />
            <span>Frete para todo Brasil</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span>Estoque disponível</span>
          </div>
        </div>

        {/* Actions - Botões mais convidativos */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in [animation-delay:400ms]">
          <button
            className="group relative overflow-hidden bg-gradient-to-r from-yellow-500 to-yellow-400 
                     hover:from-yellow-400 hover:to-yellow-500 text-black font-black 
                     py-5 px-10 rounded-2xl flex items-center justify-center gap-3 
                     transition-all duration-300 active:scale-95 shadow-lg 
                     hover:shadow-yellow-500/40 hover:scale-[1.02]"
            aria-label="Comprar camisas de time agora"
          >
            {/* Efeito de brilho */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                           -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>

            <ShoppingBag className="w-5 h-5 group-hover:rotate-12 group-hover:scale-110 transition-all" />
            <span className="tracking-tighter text-base md:text-lg">COMPRAR AGORA</span>
            <span className="hidden sm:inline bg-black/20 px-2 py-0.5 rounded-full text-[10px] ml-1">
              10% OFF
            </span>
          </button>

          <button
            className="group border-2 border-white/30 backdrop-blur-md bg-white/5 
                     hover:border-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-500 
                     text-white font-bold py-5 px-10 rounded-2xl flex items-center justify-center gap-2 
                     transition-all duration-300 active:scale-95 hover:scale-[1.02]"
          >
            VER LANÇAMENTOS
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />

            {/* Badge de novidade */}
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] 
                           font-black px-1.5 py-0.5 rounded-full uppercase animate-pulse">
              Novo
            </span>
          </button>
        </div>
      </div>

      {/* Scroll Indicator - Mais elegante */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 
                   opacity-30 hover:opacity-100 transition-all duration-500 cursor-pointer group"
        aria-hidden="true"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <span className="text-[8px] uppercase tracking-[0.45em] font-bold text-zinc-400 
                       group-hover:text-yellow-500 transition-colors">
          Explore
        </span>
        <div className="relative">
          <div className="w-[1.5px] h-16 bg-gradient-to-b from-yellow-500/0 via-yellow-500 to-yellow-500/0 
                        animate-bounce-slow"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-yellow-500 rounded-full 
                        blur-sm animate-pulse"></div>
        </div>
      </div>

      {/* Animações customizadas */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: scaleY(0.3); opacity: 0; }
          50% { transform: scaleY(1); opacity: 1; }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </section>
  );
}