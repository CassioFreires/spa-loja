import { ShoppingBag, ChevronRight } from 'lucide-react';

export default function Banner() {
  return (
    <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-black">
      {/* Imagem de Fundo com Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/images/banner-principal.jpg" // Use uma imagem estilo a do arquivo image_7d6c51.jpg
          alt="Destaque Gold Store"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
      </div>

      {/* Conteúdo do Banner */}
      <div className="relative z-10 max-w-[1440px] mx-auto h-full px-6 md:px-12 flex flex-col justify-center items-start text-white">
        <span className="bg-yellow-500 text-black px-3 py-1 text-xs md:text-sm font-black uppercase tracking-widest rounded-sm mb-4 animate-bounce">
          Nova Coleção 2026
        </span>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight max-w-2xl mb-6 uppercase italic tracking-tighter">
          O Manto do seu <span className="text-yellow-500">Time</span> está aqui
        </h1>
        
        <p className="text-gray-300 text-sm md:text-lg max-w-lg mb-8 font-light">
          Camisas Dry Fit, Modelos Jogador e Torcedor com a qualidade que você busca em Nova Iguaçu.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-black py-4 px-8 rounded-full flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-yellow-500/20">
            <ShoppingBag className="w-5 h-5" />
            COMPRAR AGORA
          </button>
          
          <button className="border-2 border-white/30 hover:border-yellow-500 hover:text-yellow-500 text-white font-bold py-4 px-8 rounded-full flex items-center justify-center gap-2 transition-all backdrop-blur-sm">
            VER LANÇAMENTOS
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Indicadores Laterais ou Detalhes Decorativos */}
      <div className="absolute bottom-8 right-8 hidden lg:flex flex-col items-end gap-2">
        <div className="w-24 h-[2px] bg-yellow-500" />
        <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-50">Gold Store Multimarcas</span>
      </div>
    </section>
  );
}