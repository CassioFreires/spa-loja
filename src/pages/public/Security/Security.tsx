import { useMemo } from 'react';
import { ShieldCheck, CreditCard, Zap, Lock, ArrowRight, ExternalLink } from 'lucide-react';

/**
 * Componente SecurityPolicy
 * Refatorado para máxima performance e autoridade de SEO.
 * Mantém 100% da lógica de negócio original.
 */
export default function SecurityPolicy() {
    
    // SEO: Dados estruturados para IAs identificarem políticas de serviço
    const structuredData = useMemo(() => ({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Protocolo de Segurança - Gold Store",
        "description": "Informações sobre segurança em pagamentos, verificação antifraude e fluxos Pix/Cartão.",
        "publisher": {
            "@type": "Organization",
            "name": "Gold Store"
        }
    }), []);

    // PERFORMANCE: Dados estáticos movidos para fora do ciclo de render se necessário, 
    // ou memoizados para evitar recalculos em re-renders do componente pai.
    const steps = useMemo(() => [
        { step: "01", title: "Finalize seu pedido", desc: "Escolha o cartão como método de pagamento no checkout." },
        { step: "02", title: "Acesse o App do Banco", desc: "Tire um print do comprovante da transação aprovada." },
        { step: "03", title: "Envie no WhatsApp", desc: "Encaminhe para nosso suporte com o número do seu pedido." }
    ], []);

    return (
        <main className="min-h-screen bg-[#F8F9FB] p-4 sm:p-8 md:p-12 font-sans italic leading-none selection:bg-yellow-100">
            {/* SEO Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>

            <div className="max-w-3xl mx-auto text-left animate-in fade-in duration-700">
                
                {/* HEADER SEMÂNTICO */}
                <header className="mb-12">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4" aria-hidden="true">
                        <Lock size={12} className="text-yellow-600" /> Espaço Seguro & Criptografado
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter text-zinc-900 leading-[0.9]">
                        Protocolo de <span className="text-yellow-600">Segurança</span>
                    </h1>
                </header>

                {/* ALERTA PRINCIPAL - ANTIFRAUDE */}
                <section 
                    className="bg-zinc-900 p-8 rounded-[2.5rem] md:rounded-[3.5rem] text-white relative overflow-hidden mb-8 shadow-2xl shadow-zinc-300"
                    aria-labelledby="main-security-title"
                >
                    <ShieldCheck 
                        className="absolute right-[-30px] top-[-30px] opacity-[0.03] text-white pointer-events-none" 
                        size={240} 
                    />
                    <div className="relative z-10">
                        <p className="text-yellow-500 font-black uppercase tracking-[0.2em] text-[10px] mb-3">Verificação Obrigatória</p>
                        <h2 id="main-security-title" className="text-2xl md:text-3xl font-black uppercase italic mb-4 leading-tight">
                            Compras com Cartão de Crédito
                        </h2>
                        <p className="text-zinc-400 text-sm md:text-base font-bold uppercase leading-relaxed max-w-xl">
                            Para evitar fraudes e uso de cartões clonados, solicitamos o envio do comprovante bancário após a compra. <span className="text-white">Sua segurança é nossa prioridade absoluta.</span>
                        </p>
                    </div>
                </section>

                {/* GRID DE OPÇÕES DE PAGAMENTO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12">
                    <article className="bg-white border-2 border-zinc-100 p-8 rounded-[2.5rem] hover:border-yellow-500 transition-all duration-300 group shadow-sm hover:shadow-xl">
                        <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Zap className="text-yellow-600" size={24} />
                        </div>
                        <h3 className="font-black uppercase italic text-lg mb-2 text-zinc-900">Pix: Fluxo Veloz</h3>
                        <p className="text-[11px] font-bold text-zinc-400 uppercase leading-relaxed tracking-tight">
                            Confirmação instantânea e envio automático. Ideal para quem tem pressa e quer pular a etapa de verificação bancária.
                        </p>
                    </article>

                    <article className="bg-white border-2 border-zinc-100 p-8 rounded-[2.5rem] hover:border-zinc-900 transition-all duration-300 group shadow-sm hover:shadow-xl">
                        <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <CreditCard className="text-zinc-900" size={24} />
                        </div>
                        <h3 className="font-black uppercase italic text-lg mb-2 text-zinc-900">Cartão: Fluxo Seguro</h3>
                        <p className="text-[11px] font-bold text-zinc-400 uppercase leading-relaxed tracking-tight">
                            Processamento em até 24h úteis. Requer envio de comprovante via WhatsApp para validação e liberação imediata do pacote.
                        </p>
                    </article>
                </div>

                {/* STEPS DE LIBERAÇÃO */}
                <section className="space-y-4" aria-labelledby="steps-title">
                    <h4 id="steps-title" className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400 mb-8 px-4 flex items-center gap-3">
                        <ArrowRight size={14} className="text-yellow-600" /> Passo a passo para liberação
                    </h4>
                    
                    

                    <div className="grid gap-4">
                        {steps.map((item, idx) => (
                            <div 
                                key={idx} 
                                className="flex items-center gap-6 bg-white p-6 md:p-8 rounded-[2rem] border border-zinc-100 group hover:border-yellow-500 transition-all cursor-default shadow-sm hover:shadow-md"
                            >
                                <span className="text-3xl font-black text-zinc-100 group-hover:text-yellow-500 transition-colors duration-300">
                                    {item.step}
                                </span>
                                <div className="flex-1">
                                    <h5 className="font-black uppercase italic text-zinc-900 mb-1">{item.title}</h5>
                                    <p className="text-[10px] md:text-[11px] font-bold text-zinc-400 uppercase tracking-wide leading-tight">
                                        {item.desc}
                                    </p>
                                </div>
                                <ArrowRight className="text-zinc-200 group-hover:text-yellow-600 group-hover:translate-x-1 transition-all" size={20} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* FOOTER & TRUST BADGES */}
                <footer className="mt-20 text-center border-t border-zinc-100 pt-10">
                    <div className="flex flex-wrap justify-center gap-6 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700 mb-8">
                        {/* Mock de Selos de Segurança para Melhorar Trust Score */}
                        <div className="flex flex-col items-center gap-2">
                            <ShieldCheck size={24} className="text-zinc-900" />
                            <span className="text-[8px] font-black uppercase">SSL Secure</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Lock size={24} className="text-zinc-900" />
                            <span className="text-[8px] font-black uppercase">PCI DSS</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <ExternalLink size={24} className="text-zinc-900" />
                            <span className="text-[8px] font-black uppercase">Anti-Fraud</span>
                        </div>
                    </div>
                    
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 italic">
                        © 2026 Operação Blindada - Todos os direitos reservados.
                    </p>
                </footer>
            </div>
        </main>
    );
}