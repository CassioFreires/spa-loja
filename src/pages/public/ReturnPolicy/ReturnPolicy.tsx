import { RefreshCcw, Truck, MessageCircle, AlertTriangle, CheckCircle2, PackageSearch } from 'lucide-react';

export default function ReturnsPolicy() {
    return (
        <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-12 font-sans italic">
            <div className="max-w-4xl mx-auto text-left">
                
                {/* HEADER */}
                <header className="mb-12">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Gold Store Service</p>
                    <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">
                        Trocas e <span className="text-yellow-600">Devoluções</span>
                    </h1>
                </header>

                {/* QUICK STEPS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                    {[
                        { icon: <MessageCircle size={20}/>, t: "Solicite", d: "Via WhatsApp oficial" },
                        { icon: <PackageSearch size={20}/>, t: "Análise", d: "Resposta em até 72h úteis" },
                        { icon: <RefreshCcw size={20}/>, t: "Resolução", d: "Troca, Vale ou Estorno" }
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2rem] border border-zinc-100 flex items-center gap-4">
                            <div className="text-yellow-600">{item.icon}</div>
                            <div>
                                <p className="font-black uppercase italic text-sm text-zinc-900">{item.t}</p>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase">{item.d}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CONTENT SECTIONS */}
                <div className="space-y-8">
                    {/* CRITICAL INFO CARD */}
                    <div className="bg-zinc-900 p-8 rounded-[3rem] text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-xl font-black uppercase italic mb-4 flex items-center gap-2">
                                <AlertTriangle className="text-yellow-500" size={20} /> Atenção aos Prazos
                            </h2>
                            <p className="text-sm font-bold text-zinc-400 uppercase leading-relaxed mb-4">
                                Você tem até <span className="text-white">7 dias corridos</span> para manifestar o desejo de troca ou devolução. A peça não pode conter sinais de uso, perfumes ou lavagem.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <span className="bg-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase italic tracking-widest">Etiqueta Fixada</span>
                                <span className="bg-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase italic tracking-widest">Embalagem Original</span>
                            </div>
                        </div>
                    </div>

                    {/* TWO COLUMN DETAILS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-lg font-black uppercase italic text-zinc-900 border-l-4 border-yellow-600 pl-4">Reembolsos</h3>
                            <p className="text-[11px] font-bold text-zinc-400 uppercase leading-relaxed">
                                O estorno é feito pelo mesmo método de pagamento. Em caso de devolução, o valor do frete não é restituído, pois o serviço de logística foi concluído.
                            </p>
                            <div className="bg-white p-6 rounded-[2rem] border border-zinc-100">
                                <h4 className="font-black uppercase italic text-zinc-900 text-sm mb-2">Prazos de Estorno</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase"><CheckCircle2 size={12} className="text-yellow-600"/> Cartão: Até 2 faturas</li>
                                    <li className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase"><CheckCircle2 size={12} className="text-yellow-600"/> Pix: Até 10 dias úteis</li>
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-lg font-black uppercase italic text-zinc-900 border-l-4 border-yellow-600 pl-4">Logística</h3>
                            <p className="text-[11px] font-bold text-zinc-400 uppercase leading-relaxed">
                                A devolução deve ser feita via Correios (PAC). Não nos responsabilizamos por extravios em envios feitos sem nosso código de postagem oficial.
                            </p>
                            <div className="bg-yellow-600 p-6 rounded-[2rem] text-white">
                                <div className="flex items-center gap-3 mb-2">
                                    <Truck size={20} />
                                    <h4 className="font-black uppercase italic text-sm">Pedido em Desacordo?</h4>
                                </div>
                                <p className="text-[10px] font-bold uppercase leading-tight opacity-90">
                                    Se a embalagem estiver violada ou o produto for diferente do pedido, recuse o recebimento na hora ou nos contate em até 72h.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="mt-16 py-8 border-t border-zinc-100 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">
                        Gold Store Multimarcas LTDA © 2026
                    </p>
                </footer>
            </div>
        </div>
    );
}