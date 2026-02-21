import { Link } from 'react-router-dom';
import { 
  Instagram, Facebook, Twitter, MapPin, 
  Phone, ChevronRight, CreditCard, 
  ShieldCheck, ArrowUpRight 
} from 'lucide-react';

/**
 * @component Footer
 * @description Rodapé institucional otimizado para SEO de IA, acessibilidade e conversão.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Dados para o Schema.org (IA SEO)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Gold Store Multimarcas",
    "image": "/assets/images/logo.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Centro",
      "addressLocality": "Nova Iguaçu",
      "addressRegion": "RJ",
      "postalCode": "26210-000",
      "addressCountry": "BR"
    },
    "telephone": "+55-21-99999-9999",
    "url": window.location.origin
  };

  return (
    <footer className="relative bg-zinc-950 text-white pt-20 pb-10 overflow-hidden" role="contentinfo">
      {/* Script de Dados Estr Estruturados para IAs */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Detalhe de luz de fundo - Performance via GPU */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" aria-hidden="true" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          
          {/* Branding & Autoridade */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="inline-block group" aria-label="Gold Store - Início">
              <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">
                Gold <span className="text-yellow-500 transition-colors group-hover:text-white">Store</span>
              </h3>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mt-2">Multimarcas Elite</p>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs font-medium italic">
              A maior variedade de calçados premium e mantos tailandeses em Nova Iguaçu. Qualidade 1:1 com envio imediato.
            </p>
            <nav className="flex gap-4" aria-label="Redes Sociais">
              {[
                { icon: <Instagram size={20} />, label: 'Instagram' },
                { icon: <Facebook size={20} />, label: 'Facebook' },
                { icon: <Twitter size={20} />, label: 'Twitter' }
              ].map((social) => (
                <a 
                  key={social.label}
                  href="#" 
                  className="p-3 bg-white/5 rounded-2xl hover:bg-yellow-500 hover:text-black transition-all duration-500 active:scale-90"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </nav>
          </div>

          {/* Navegação Estruturada - SEO Focus */}
          <nav aria-labelledby="footer-links">
            <h4 id="footer-links" className="text-xs font-black uppercase tracking-[0.3em] text-yellow-500 mb-8 italic">Links Úteis</h4>
            <ul className="flex flex-col gap-2">
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
                    className="flex items-center gap-2 py-2 text-zinc-400 hover:text-yellow-500 transition-all text-[13px] font-black uppercase tracking-widest group"
                  >
                    <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Atendimento & Local Business */}
          <address className="not-italic">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-yellow-500 mb-8 italic">Atendimento</h4>
            <ul className="flex flex-col gap-8">
              <li className="flex items-start gap-4 group">
                <div className="p-2.5 bg-white/5 rounded-xl text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-all duration-500">
                  <MapPin size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-200">Localização</span>
                  <span className="text-[11px] text-zinc-500 font-bold uppercase mt-1 leading-relaxed">
                    Nova Iguaçu - Centro, RJ<br />26210-000
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="p-2.5 bg-white/5 rounded-xl text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-all duration-500">
                  <Phone size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-200">WhatsApp</span>
                  <a href="tel:21999999999" className="text-[11px] text-zinc-500 font-bold uppercase mt-1 hover:text-white transition-colors">
                    (21) 99999-9999
                  </a>
                </div>
              </li>
            </ul>
          </address>

          {/* Trust Signals & Payment */}
          <div className="flex flex-col gap-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-yellow-500 italic">Segurança & Pagamento</h4>
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: <CreditCard size={20} />, label: 'Cartão' },
                  { icon: <ShieldCheck size={20} />, label: 'Seguro' }
                ].map((item) => (
                  <div 
                    key={item.label}
                    className="bg-white/5 p-3 rounded-2xl border border-white/5 hover:border-yellow-500/30 transition-all duration-500"
                  >
                    <div className="opacity-40">{item.icon}</div>
                  </div>
                ))}
                <div className="bg-white/5 px-4 py-3 rounded-2xl border border-white/5 flex items-center">
                  <span className="text-[10px] font-black italic tracking-widest">PIX</span>
                </div>
              </div>
              <div className="p-5 bg-zinc-900/40 rounded-[2rem] border border-white/5 backdrop-blur-sm">
                <p className="text-[10px] text-zinc-500 leading-relaxed font-black uppercase italic tracking-tighter">
                  Compra monitorada por protocolos SSL. Garantia total de entrega Gold Store.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">
                &copy; {currentYear} Gold Store Multimarcas. CNPJ: 00.000.000/0001-00.
              </p>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                <div className="h-1 w-1 bg-yellow-500 rounded-full" />
                <p className="text-[8px] text-zinc-700 font-black uppercase tracking-widest">Tecnologia de Elite Gold V3</p>
              </div>
            </div>
            
            <nav className="flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500" aria-label="Legal">
               <Link to="/privacidade" className="hover:text-yellow-500 transition-all hover:-translate-y-0.5 flex items-center gap-1">
                Privacidade <ArrowUpRight size={10} />
               </Link>
               <Link to="/termos" className="hover:text-yellow-500 transition-all hover:-translate-y-0.5 flex items-center gap-1">
                Termos <ArrowUpRight size={10} />
               </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}