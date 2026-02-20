import { ShoppingCart, Star, Tag, ShieldCheck, Zap, Trophy, Calendar } from 'lucide-react';

interface ProductCardProps {
  product: any;
  index?: number;
  isOffer?: boolean;
  onOpenModal: (product: any) => void;
}

export default function ProductCard({ product, index, onOpenModal }: ProductCardProps) {
  // Lógica de Desconto
  const discount = product.old_price > product.price 
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100) 
    : null;

  // Identificação da Versão para Badge Visual
  const isPlayerVersion = product.version_name?.toLowerCase().includes('player') || 
                         product.version_name?.toLowerCase().includes('jogador');

  return (
    <article 
      className="group relative flex flex-col h-full bg-zinc-950/40 backdrop-blur-xl rounded-[2.8rem] overflow-hidden border border-white/5 ring-1 ring-white/10 hover:ring-yellow-500/30 transition-all duration-700 hover:-translate-y-2 shadow-2xl hover:shadow-yellow-500/5 cursor-pointer select-none active:scale-[0.97]"
      onClick={() => onOpenModal(product)}
    >
      {/* --- CONTAINER DE MÍDIA --- */}
      <div className="relative aspect-[1/1.2] overflow-hidden bg-zinc-900/50">
        
        {/* Badges Superiores */}
        <div className="absolute top-5 inset-x-5 flex justify-between items-start z-30 pointer-events-none">
          <div className="flex flex-col gap-2">
            {index !== undefined && (
              <div className="bg-zinc-950/80 backdrop-blur-md text-yellow-500 font-black text-[9px] px-4 py-1.5 rounded-full border border-white/10 shadow-2xl tracking-[0.2em] italic uppercase w-fit">
                RANK {index + 1}
              </div>
            )}
            
            {/* TAG DINÂMICA DE VERSÃO (NOVO) */}
            {product.version_name && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-widest shadow-2xl backdrop-blur-md w-fit ${
                isPlayerVersion 
                ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' 
                : 'bg-white/5 border-white/10 text-zinc-300'
              }`}>
                {isPlayerVersion ? <Zap size={10} className="fill-current" /> : <Trophy size={10} />}
                {product.version_name}
              </div>
            )}
          </div>

          {discount && (
            <div className="bg-red-600 text-white font-black text-[10px] px-3.5 py-2 rounded-[1rem] flex items-center gap-1.5 shadow-2xl animate-in fade-in zoom-in duration-500">
              <Tag size={12} className="fill-current" />
              {discount}% OFF
            </div>
          )}
        </div>

        {/* Imagem do Produto */}
        <img 
          src={product.image_url || product.image_1} 
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
        />
        
        {/* Overlays Visuais */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-90 transition-opacity group-hover:opacity-70" />

        {/* Botão Flutuante (Desktop) */}
        <div className="absolute inset-x-5 bottom-5 z-40 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hidden md:block">
           <div className="w-full bg-yellow-500 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(234,179,8,0.3)] hover:bg-white transition-colors">
             <ShoppingCart size={18} />
             COMPRAR AGORA
           </div>
        </div>
      </div>

      {/* --- ÁREA DE CONTEÚDO --- */}
      <div className="p-7 md:p-8 flex flex-col flex-grow italic">
        <header className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" />
            <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.1em]">
              {product.brand_name || 'Manto Premium'}
            </span>
            
            {/* TEMPORADA (NOVO) */}
            {product.season && (
              <div className="flex items-center gap-1 ml-2 text-zinc-600">
                <Calendar size={10} />
                <span className="text-[9px] font-bold uppercase">{product.season}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1 bg-zinc-900/50 px-2.5 py-1 rounded-full border border-white/5">
            <Star size={10} className="fill-yellow-500 text-yellow-500" />
            <span className="text-[10px] font-black text-white/80 tracking-tighter">5.0</span>
          </div>
        </header>

        {/* Título com line-clamp para manter o grid alinhado */}
        <h3 
          className="text-white font-black text-xl lg:text-2xl leading-[1.1] group-hover:text-yellow-500 transition-colors uppercase mb-6 line-clamp-2 min-h-[2.2em] tracking-tighter"
          style={{ textWrap: 'balance' } as any}
        >
          {product.name}
        </h3>

        {/* --- PRICING & CONVERSION --- */}
        <div className="mt-auto pt-5 border-t border-white/5 flex items-end justify-between leading-none">
          <div className="flex flex-col gap-1.5">
            {product.old_price && (
              <span className="text-zinc-500 line-through font-bold text-[10px] tracking-tight">
                R$ {Number(product.old_price).toFixed(2)}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-black text-yellow-600 tracking-tight">R$</span>
              <span className="text-4xl lg:text-5xl font-black text-white tracking-tighter">
                {Number(product.price).toFixed(2).split('.')[0]}
                <span className="text-xl">.{Number(product.price).toFixed(2).split('.')[1]}</span>
              </span>
            </div>
          </div>
          
          {/* Mobile Cart Button */}
          <div className="md:hidden bg-white text-zinc-950 p-3.5 rounded-2xl shadow-xl active:bg-yellow-500 active:scale-90 transition-all">
            <ShoppingCart size={20} strokeWidth={2.5} />
          </div>
          
          {/* Trust Badge (Desktop) */}
          <div className="hidden md:flex items-center gap-1 text-[8px] font-black text-zinc-600 tracking-widest uppercase mb-1">
             <ShieldCheck size={10} />
             Envio Imediato
          </div>
        </div>
      </div>
    </article>
  );
}