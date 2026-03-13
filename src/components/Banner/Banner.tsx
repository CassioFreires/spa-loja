import { ShoppingBag, ChevronRight, Sparkles, ShieldCheck, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { memo } from "react";

function Banner() {
  return (
    <section
      className="relative w-full min-h-[70vh] sm:min-h-[80vh] md:h-[700px] lg:h-[820px] overflow-hidden flex items-center bg-zinc-950"
      aria-labelledby="banner-heading"
    >
      {/* BACKGROUND LAYER */}

      <div className="absolute inset-0 z-0 select-none pointer-events-none">

        {/* Gradiente principal (GPU friendly) */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black" />

        {/* Glow amarelo leve */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(234,179,8,0.06),transparent_55%)]" />

        {/* Vinheta inferior */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />

      </div>

      {/* CONTENT */}

      <div className="relative z-30 max-w-[1440px] mx-auto w-full px-6 md:px-12 lg:px-20 text-white">

        {/* Badge */}

        <div
          className="inline-flex items-center gap-2 bg-yellow-500 text-black px-4 py-1.5 rounded-full mb-8 shadow-xl fade-in"
          style={{ animationDelay: "100ms" }}
        >
          <Sparkles className="w-3.5 h-3.5" />

          <span className="text-[9px] md:text-xs font-black uppercase tracking-[0.2em]">
            Lançamentos 2026
          </span>
        </div>

        {/* TITLES */}

        <div className="fade-in" style={{ animationDelay: "250ms" }}>

          <h1
            id="banner-heading"
            className="text-[2.7rem] xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.9] uppercase italic tracking-tighter mb-6 drop-shadow-2xl"
          >
            Gold <br />

            <span className="text-yellow-500">
              Store
            </span>

          </h1>

          <h2 className="text-zinc-400 text-sm sm:text-base md:text-xl lg:text-2xl max-w-xl mb-10 leading-relaxed font-medium italic">

            O padrão{" "}
            <span className="text-white font-bold not-italic">
              tailandês 1:1
            </span>{" "}
            que você buscava.  
            Direto de Nova Iguaçu para o seu guarda-roupa.

          </h2>

        </div>

        {/* TRUST BADGES */}

        <div
          className="flex flex-wrap items-center gap-6 mb-10 text-[10px] md:text-sm text-zinc-500 font-bold uppercase fade-in"
          style={{ animationDelay: "400ms" }}
        >

          <div className="flex items-center gap-2">

            <ShieldCheck className="w-4 h-4 text-yellow-500" />

            <span>Qualidade Premium</span>

          </div>

          <div className="flex items-center gap-2 border-l border-white/10 pl-6">

            <Truck className="w-4 h-4 text-yellow-500" />

            <span>Envio Imediato</span>

          </div>

        </div>

        {/* BUTTONS */}

        <div
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto fade-in"
          style={{ animationDelay: "550ms" }}
        >

          <Link
            to="/categoria/1"
            prefetch="intent"
            className="w-full sm:w-auto"
          >

            <button
              className="w-full bg-yellow-500 text-black font-black py-4 md:py-5 px-10 rounded-2xl flex items-center justify-center gap-3 transition-all duration-200 active:scale-95 shadow-lg hover:bg-white touch-manipulation"
            >

              <ShoppingBag className="w-5 h-5" />

              <span className="tracking-tighter text-base md:text-lg uppercase">
                Comprar Agora
              </span>

            </button>

          </Link>

          <button
            className="w-full sm:w-auto border-2 border-white/10 bg-white/5 hover:border-yellow-500 hover:text-yellow-500 text-white font-black py-4 md:py-5 px-10 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 touch-manipulation"
          >

            LANÇAMENTOS

            <ChevronRight className="w-5 h-5" />

          </button>

        </div>

      </div>

      {/* CSS ANIMATION OTIMIZADA */}

      <style>{`

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0,12px,0);
          }
          to {
            opacity: 1;
            transform: translate3d(0,0,0);
          }
        }

        .fade-in {
          opacity: 0;
          animation: fadeInUp .7s cubic-bezier(.22,.61,.36,1) forwards;
          will-change: transform, opacity;
        }

      `}</style>

    </section>
  );
}

export default memo(Banner);