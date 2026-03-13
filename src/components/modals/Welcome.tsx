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
      title: "Que bom ter você!",
      message: "A Gold Store nasceu em Nova Iguaçu para trazer o melhor do futebol até você."
    },
    {
      emoji: "⭐",
      title: "Qualidade Premium",
      message: "Selecionamos cada manto com carinho, focando na emoção de vestir seu time."
    },
    {
      emoji: "🏠",
      title: "Loja Familiar",
      message: "Somos apaixonados por futebol e por fazer novos amigos como você."
    }
  ];

  const checkWelcomeSeen = () => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    return !hasSeenWelcome;
  };

  useEffect(() => {
    if (controlledIsOpen !== undefined) {
      setIsOpen(controlledIsOpen);
    } else if (checkWelcomeSeen()) {
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
    document.body.style.overflow = isOpen && !isExiting ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, isExiting]);

  const handleClose = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setIsExiting(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsExiting(false);
      if (onClose) onClose();
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className={`absolute inset-0 transition-all duration-1000 ease-out
                   ${isExiting ? 'opacity-0' : 'opacity-100'}`}
        style={{
          backgroundColor: `rgba(0, 0, 0, ${0.7 + mousePosition.y * 0.1})`,
          backdropFilter: isExiting ? 'blur(0px)' : 'blur(10px)',
        }}
        onClick={handleClose}
      />

      {/* Modal Container Compacto */}
      <div
        className={`relative w-full max-w-lg max-h-[90vh] flex flex-col
                   bg-gradient-to-br from-zinc-900 via-zinc-950 to-black
                   border border-white/10 rounded-[2.5rem] shadow-2xl
                   transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
                   ${isExiting 
                     ? 'opacity-0 scale-95 translate-y-8' 
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
          className="absolute inset-0 bg-yellow-500/5 pointer-events-none opacity-50 overflow-hidden rounded-[inherit]"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(234, 179, 8, 0.1), transparent 50%)`
          }}
        />

        <button
          onClick={handleClose}
          className="absolute top-5 right-5 z-50 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all active:scale-90"
        >
          <X className="w-4 h-4 text-zinc-400" />
        </button>

        <div className="relative p-6 sm:p-10 overflow-y-auto custom-scrollbar">
          
          {/* Heart Decor */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-yellow-500/20"></div>
            <Heart className="w-4 h-4 text-yellow-500 animate-pulse" />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-yellow-500/20"></div>
          </div>

          {/* Carousel Section - Altura reduzida */}
          <div className="relative min-h-[140px] sm:min-h-[160px] mb-4">
            {welcomeMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 flex flex-col items-center text-center transition-all duration-1000
                          ${currentMessage === idx 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 translate-y-4 pointer-events-none'
                          }`}
              >
                <span className="text-4xl md:text-5xl mb-3 block drop-shadow-lg">{msg.emoji}</span>
                <h2 className="text-xl md:text-2xl font-black text-white mb-2 tracking-tighter uppercase italic">
                  {msg.title}
                </h2>
                <p className="text-zinc-400 text-xs md:text-sm leading-relaxed max-w-xs italic px-2">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 mb-8">
            {welcomeMessages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentMessage(idx)}
                className={`h-1 rounded-full transition-all duration-500 
                          ${currentMessage === idx ? 'w-6 bg-yellow-500' : 'w-1 bg-white/20'}`}
              />
            ))}
          </div>

          {/* Footer Card Compacto */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 group hover:border-yellow-500/20 transition-colors">
            <div className="flex items-center gap-4 text-left">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-white font-bold text-sm">Raiz em Nova Iguaçu</h3>
                <div className="flex gap-3">
                  <span className="flex items-center gap-1 text-[9px] text-yellow-500/80 font-black uppercase">
                    <Star className="w-2.5 h-2.5 fill-yellow-500" /> +500 Vendas
                  </span>
                  <span className="flex items-center gap-1 text-[9px] text-yellow-500/80 font-black uppercase">
                    <Smile className="w-2.5 h-2.5" /> 98% de Aprovação
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleClose}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-3.5 rounded-xl 
                         transition-all active:scale-95 shadow-lg shadow-yellow-500/10
                         flex items-center justify-center gap-2 text-xs md:text-sm tracking-widest"
            >
              <Coffee className="w-4 h-4" />
              <span>EXPLORAR AGORA</span>
            </button>
            <button
              onClick={handleClose}
              className="w-full py-3 text-zinc-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest"
            >
              Depois eu vejo
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(234, 179, 8, 0.1); }
      `}</style>
    </div>
  );
}