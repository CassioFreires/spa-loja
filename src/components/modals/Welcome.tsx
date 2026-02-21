import { X, Heart, Coffee, Smile, MapPin, Star } from 'lucide-react';
import { useState, useEffect } from 'react';

interface WelcomeModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function WelcomeModal({ isOpen: controlledIsOpen, onClose }: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  const welcomeMessages = [
    {
      emoji: "👋",
      title: "Que bom ter você aqui!",
      message: "A Gold Store nasceu em Nova Iguaçu com um sonho: trazer o melhor do futebol para perto de você."
    },
    {
      emoji: "⭐",
      title: "Qualidade que você merece",
      message: "Selecionamos cada camisa com carinho, para você sentir a emoção de vestir seu time."
    },
    {
      emoji: "🏠",
      title: "Feito com amor no RJ",
      message: "Somos uma loja familiar, apaixonada por futebol e por fazer novos amigos como você."
    }
  ];

  useEffect(() => {
    if (controlledIsOpen !== undefined) {
      setIsOpen(controlledIsOpen);
    } else {
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [controlledIsOpen]);

  useEffect(() => {
    if (!isOpen || isExiting) return;
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % welcomeMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isOpen, isExiting]);

  useEffect(() => {
    if (isOpen && !isExiting) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, isExiting]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsExiting(false);
      onClose?.();
    }, 600);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6">
      {/* Overlay */}
      <div 
        className={`absolute inset-0 transition-all duration-1000 ease-out
                   ${isExiting ? 'opacity-0' : 'opacity-100'}`}
        style={{
          backgroundColor: `rgba(0, 0, 0, ${0.6 + mousePosition.y * 0.1})`,
          backdropFilter: isExiting ? 'blur(0px)' : 'blur(12px)',
        }}
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar
                   bg-gradient-to-br from-zinc-900 via-zinc-950 to-black
                   border border-white/10 rounded-[2rem] md:rounded-[3rem] shadow-2xl
                   transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
                   ${isExiting 
                     ? 'opacity-0 scale-90 translate-y-12' 
                     : 'opacity-100 scale-100 translate-y-0'
                   }`}
        style={{
          boxShadow: `0 30px 100px -20px rgba(234, 179, 8, 0.2)`,
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseMove={handleMouseMove}
      >
        {/* Glow Effect */}
        <div 
          className="absolute inset-0 bg-yellow-500/5 pointer-events-none opacity-50"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(234, 179, 8, 0.15), transparent 50%)`
          }}
        />

        <button
          onClick={handleClose}
          className="absolute top-5 right-5 z-20 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all active:scale-90"
        >
          <X className="w-5 h-5 text-zinc-400" />
        </button>

        <div className="relative p-6 md:p-12">
          {/* Heart Decor */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-yellow-500/20"></div>
            <Heart className="w-5 h-5 text-yellow-500 animate-pulse" />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-yellow-500/20"></div>
          </div>

          {/* Carousel Section */}
          <div className="relative min-h-[180px] md:min-h-[220px] mb-8">
            {welcomeMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 flex flex-col items-center text-center transition-all duration-1000
                          ${currentMessage === idx 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 translate-y-8 pointer-events-none'
                          }`}
              >
                <span className="text-5xl md:text-7xl mb-6 block drop-shadow-lg">{msg.emoji}</span>
                <h2 className="text-2xl md:text-4xl font-black text-white mb-4 tracking-tighter leading-tight">
                  {msg.title}
                </h2>
                <p className="text-zinc-400 text-sm md:text-lg leading-relaxed max-w-md italic">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mb-10">
            {welcomeMessages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentMessage(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 
                          ${currentMessage === idx ? 'w-8 bg-yellow-500' : 'w-1.5 bg-white/20'}`}
              />
            ))}
          </div>

          {/* Footer Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-8 mb-8 group hover:border-yellow-500/30 transition-colors">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-5 text-center md:text-left">
              <div className="w-14 h-14 bg-yellow-500/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-7 h-7 text-yellow-500" />
              </div>
              <div className="space-y-3">
                <h3 className="text-white font-bold text-lg md:text-xl">Nossa Raiz em Nova Iguaçu</h3>
                <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                  Trabalhamos duro para entregar raridades tailandesas com tecnologia Dry Fit para todo o Brasil.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <span className="flex items-center gap-1.5 text-[10px] md:text-xs text-yellow-500/80 font-black uppercase">
                    <Star className="w-3 h-3 fill-yellow-500" /> +500 Avaliações
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] md:text-xs text-yellow-500/80 font-black uppercase">
                    <Smile className="w-3 h-3" /> 98% de Aprovação
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleClose}
              className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded-xl 
                         transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-yellow-500/10
                         flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <Coffee className="w-5 h-5" />
              <span>EXPLORAR COLEÇÃO</span>
            </button>
            <button
              onClick={handleClose}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white 
                         rounded-xl transition-all text-xs md:text-sm font-bold border border-white/5"
            >
              DEPOIS EU VEJO
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(234, 179, 8, 0.2); border-radius: 10px; }
        
        @keyframes gentle-float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, -10px); }
        }
      `}</style>
    </div>
  );
}