import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const phoneNumber = "5521999999999"; // 👈 COLOQUE O NÚMERO AQUI
  const message = encodeURIComponent("Olá! Vim pelo site da Gold Store e gostaria de um atendimento exclusivo.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end gap-3 group">
      
      {/* Tooltip / Balão de Mensagem (Aparece no Hover) */}
      <div className="bg-white text-zinc-900 px-4 py-2 rounded-2xl shadow-2xl border border-zinc-100 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 pointer-events-none">
        <p className="text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Suporte Online
        </p>
      </div>

      {/* Botão de WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#25D366] text-white rounded-2xl shadow-[0_10px_30px_rgba(37,211,102,0.3)] hover:shadow-[0_15px_40px_rgba(37,211,102,0.5)] transition-all duration-300 hover:scale-110 active:scale-95 group"
        aria-label="Conversar no WhatsApp"
      >
        {/* Efeito de Pulso Externo */}
        <div className="absolute inset-0 rounded-2xl bg-[#25D366] animate-ping opacity-20 group-hover:opacity-0 transition-opacity"></div>
        
        {/* Ícone */}
        <MessageCircle size={28} className="relative z-10 group-hover:rotate-12 transition-transform duration-300" />
        
        {/* Detalhe de Luz Superior */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-2xl"></div>
      </a>
    </div>
  );
}