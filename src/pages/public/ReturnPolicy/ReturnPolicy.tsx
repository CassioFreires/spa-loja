import { useMemo } from 'react';
import { RefreshCcw, Truck, MessageCircle, AlertTriangle, CheckCircle2, PackageSearch, ArrowUpRight } from 'lucide-react';

/**
 * Componente ReturnsPolicy
 * Refatorado para máxima performance, SEO e Acessibilidade.
 * Guia de manutenção: Estilos baseados em Tailwind CSS, ícones via Lucide-React.
 */
export default function ReturnsPolicy() {
    
    // SEO: Metadados estruturados para buscadores e IA (Schema.org)
    const structuredData = useMemo(() => ({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Política de Trocas e Devoluções - Gold Store",
        "description": "Informações oficiais sobre prazos de 7 dias para trocas, processos de estorno e logística de devolução.",
        "mainEntity": {
            "@type": "ReturnPolicy",
            "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnPeriod",
            "merchantReturnDays": 7,
            "returnMethod": "https://schema.org/ReturnByMail",
            "returnFees": "https://schema.org/FreeReturn"
        }
    }), []);

    // PERFORMANCE: Dados estáticos movidos para constante memoizada
    const quickSteps = useMemo(() => [
        { icon: <MessageCircle size={20}/>, t: "Solicite", d: "Via WhatsApp oficial" },
        { icon: <PackageSearch size={20}/>, t: "Análise", d: "Resposta em até 72h úteis" },
        { icon: <RefreshCcw size={20}/>, t: "Resolução", d: "Troca, Vale ou Estorno" }
    ], []);

    return (
        <main className="min-h-screen bg-[#F8F9FB] p-4 sm:p-8 md:p-12 font-sans italic leading-none selection:bg-yellow-100">
            {/* SEO Data Injection */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>

            <div className="max-w-4xl mx-auto text-left animate-in fade-in duration-700">
                
                {/* HEADER SEMÂNTICO */}
                <header className="mb-12">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-3" aria-hidden="true">
                        Gold Store Service
                    </p>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter text-zinc-900 leading-[0.9]">
                        Trocas e <span className="text-yellow-600">Devoluções</span>
                    </h1>
                </header>

                {/* QUICK STEPS - Grid Responsivo */}
                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12" aria-label="Resumo do processo">
                    {quickSteps.map((item, i) => (
                        <article key={i} className="bg-white p-6 rounded-[2rem] border border-zinc-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-yellow-600 shrink-0" aria-hidden="true">{item.icon}</div>
                            <div>
                                <h2 className="font-black uppercase italic text-sm text-zinc-900">{item.t}</h2>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">{item.d}</p>
                            </div>
                        </article>
                    ))}
                </section>

                {/* CONTENT SECTIONS */}
                <div className="space-y-8">
                    
                    {/* CRITICAL INFO CARD - UX Alert */}
                    <section className="bg-zinc-900 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl">
                        <div className="relative z-10">
                            <header className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-yellow-500/10 rounded-lg">
                                    <AlertTriangle className="text-yellow-500" size={24} />
                                </div>
                                <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tight">Atenção aos Prazos</h2>
                            </header>
                            
                            <p className="text-sm md:text-base font-bold text-zinc-400 uppercase leading-relaxed mb-8">
                                Você tem até <span className="text-white decoration-yellow-500 decoration-2 underline underline-offset-4">7 dias corridos</span> para manifestar o desejo de troca ou devolução. A peça não pode conter sinais de uso, perfumes ou lavagem.
                            </p>
                            
                            <div className="flex flex-wrap gap-3">
                                <span className="bg-white/5 border border-white/10 px-5 py-2.5 rounded-full text-[10px] font-black uppercase italic tracking-widest flex items-center gap-2">
                                    <CheckCircle2 size={12} className="text-yellow-500"/> Etiqueta Fixada
                                </span>
                                <span className="bg-white/5 border border-white/10 px-5 py-2.5 rounded-full text-[10px] font-black uppercase italic tracking-widest flex items-center gap-2">
                                    <CheckCircle2 size={12} className="text-yellow-500"/> Embalagem Original
                                </span>
                            </div>
                        </div>
                        {/* Background Decor - Performance optimized with no images */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                    </section>

                    {/* TWO COLUMN DETAILS - Layout Flexível */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Reembolsos */}
                        <section className="space-y-6">
                            <h3 className="text-lg font-black uppercase italic text-zinc-900 border-l-4 border-yellow-600 pl-4">Reembolsos</h3>
                            <p className="text-[11px] font-bold text-zinc-500 uppercase leading-relaxed text-justify">
                                O estorno é processado rigorosamente pelo mesmo método de pagamento utilizado na compra. Em caso de devolução por arrependimento, o valor referente ao frete não é restituído, uma vez que o serviço de logística original foi efetivamente prestado e concluído.
                            </p>
                            <article className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm">
                                <h4 className="font-black uppercase italic text-zinc-900 text-sm mb-4">Prazos Médios de Estorno</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-center justify-between text-[10px] font-black text-zinc-500 uppercase border-b border-zinc-50 pb-2">
                                        <span className="flex items-center gap-2"><CheckCircle2 size={12} className="text-yellow-600"/> Cartão de Crédito</span>
                                        <span className="text-zinc-900">Até 2 faturas</span>
                                    </li>
                                    <li className="flex items-center justify-between text-[10px] font-black text-zinc-500 uppercase">
                                        <span className="flex items-center gap-2"><CheckCircle2 size={12} className="text-yellow-600"/> Pagamentos via Pix</span>
                                        <span className="text-zinc-900">Até 10 dias úteis</span>
                                    </li>
                                </ul>
                            </article>
                        </section>

                        {/* Logística */}
                        <section className="space-y-6">
                            <h3 className="text-lg font-black uppercase italic text-zinc-900 border-l-4 border-yellow-600 pl-4">Logística Reversa</h3>
                            <p className="text-[11px] font-bold text-zinc-500 uppercase leading-relaxed text-justify">
                                Toda devolução deve ser obrigatoriamente realizada via Correios (modalidade PAC). A Gold Store não se responsabiliza por extravios ou danos em envios realizados sem a utilização do nosso código de postagem oficial ou fora dos nossos protocolos.
                            </p>
                            <article className="bg-yellow-600 p-6 rounded-[2rem] text-white shadow-lg shadow-yellow-600/20 group cursor-default">
                                <header className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <Truck size={20} />
                                        <h4 className="font-black uppercase italic text-sm">Desacordo?</h4>
                                    </div>
                                    <ArrowUpRight size={16} className="opacity-50 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </header>
                                <p className="text-[10px] font-bold uppercase leading-tight opacity-90 italic">
                                    Se a embalagem estiver violada ou o produto for divergente do solicitado, recuse o recebimento no ato ou entre em contato em até 72h.
                                </p>
                            </article>
                        </section>
                    </div>
                </div>

                {/* FOOTER */}
                <footer className="mt-20 py-10 border-t border-zinc-100 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 italic">
                        Gold Store Multimarcas LTDA © 2026 • Operação Blindada
                    </p>
                </footer>
            </div>
        </main>
    );
}