import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail, ChevronRight, CreditCard, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black text-white pt-20 pb-10 overflow-hidden">
      {/* Detalhe de luz de fundo para não ficar um preto "morto" */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Branding & Bio */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="inline-block">
              <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">
                Gold <span className="text-yellow-500">Store</span>
              </h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em] mt-1">Multimarcas</p>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs font-medium">
              A maior variedade de calçados e camisas de time em Nova Iguaçu. Qualidade premium 1:1 e envio para todo o Brasil.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-yellow-500 hover:text-black transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-yellow-500 hover:text-black transition-all duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-yellow-500 hover:text-black transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navegação Rápida */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-yellow-500 mb-8 italic">Links Úteis</h4>
            <ul className="space-y-4">
              {[
                { name: 'Início', path: '/' },
                { name: 'Rastreamento', path: '/rastreio' },
                { name: 'Guia de Medidas', path: '/guia-medidas' },
                { name: 'Segurança', path: '/seguranca' },
                { name: 'Trocas & Devoluções', path: '/trocas' }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider group"
                  >
                    <ChevronRight className="w-3 h-3 text-yellow-500 group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato & Localização */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-yellow-500 mb-8 italic">Atendimento</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-yellow-500 shrink-0" />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold uppercase">Endereço</span>
                  <span className="text-xs text-zinc-400">Nova Iguaçu - Centro, RJ<br />Brasil - 26210-000</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-yellow-500 shrink-0" />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold uppercase">WhatsApp</span>
                  <span className="text-xs text-zinc-400">(21) 99999-9999</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-yellow-500 shrink-0" />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold uppercase">E-mail</span>
                  <span className="text-xs text-zinc-400">contato@goldstore.com</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Selos & Segurança */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-yellow-500 mb-8 italic">Segurança</h4>
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap gap-3">
                <div className="bg-white/5 p-2 rounded-lg border border-white/10 hover:border-yellow-500/50 transition-colors">
                  <CreditCard className="w-8 h-8 opacity-60" />
                </div>
                <div className="bg-white/5 p-2 rounded-lg border border-white/10 hover:border-yellow-500/50 transition-colors">
                  <ShieldCheck className="w-8 h-8 opacity-60" />
                </div>
                <div className="bg-white/5 px-3 py-2 rounded-lg border border-white/10 flex items-center justify-center">
                  <span className="text-[10px] font-black italic">PIX</span>
                </div>
              </div>
              <div className="p-4 bg-zinc-900/50 rounded-2xl border border-white/5">
                <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
                  Sua compra está protegida por criptografia de ponta a ponta. Garantimos a entrega ou seu dinheiro de volta.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                &copy; {currentYear} Gold Store Multimarcas. Todos os direitos reservados.
              </p>
              <p className="text-[9px] text-zinc-600 font-bold mt-1 uppercase">Desenvolvido com tecnologia de elite</p>
            </div>
            
            {/* Link de Política de Privacidade */}
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
               <a href="#" className="hover:text-yellow-500 transition-colors">Privacidade</a>
               <a href="#" className="hover:text-yellow-500 transition-colors">Termos</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}