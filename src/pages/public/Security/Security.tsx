import { ShieldCheck, CreditCard, Zap, Lock, ArrowRight } from 'lucide-react';

export default function SecurityPolicy() {
    return (
        <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-12 font-sans italic">
            <div className="max-w-3xl mx-auto text-left">
                
                <header className="mb-12">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">
                        <Lock size={12} /> Espaço Seguro & Criptografado
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">
                        Protocolo de <span className="text-yellow-600">Segurança</span>
                    </h1>
                </header>

                {/* MAIN ALERT */}
                <div className="bg-zinc-900 p-8 rounded-[3rem] text-white relative overflow-hidden mb-8">
                    <ShieldCheck className="absolute right-[-20px] top-[-20px] opacity-10" size={180} />
                    <div className="relative z-10">
                        <p className="text-yellow-500 font-black uppercase tracking-[0.2em] text-[10px] mb-2">Verificação Obrigatória</p>
                        <h2 className="text-2xl font-black uppercase italic mb-4 leading-tight">Compras com Cartão de Crédito</h2>
                        <p className="text-zinc-400 text-sm font-bold uppercase leading-relaxed">
                            Para evitar fraudes e uso de cartões clonados, solicitamos o envio do comprovante bancário após a compra. Sua segurança é nossa prioridade.
                        </p>
                    </div>
                </div>

                {/* GRID OPTIONS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-white border-2 border-zinc-100 p-8 rounded-[2.5rem]">
                        <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center mb-4">
                            <Zap className="text-yellow-600" size={24} />
                        </div>
                        <h3 className="font-black uppercase italic text-lg mb-2">Pix: Fluxo Veloz</h3>
                        <p className="text-[11px] font-bold text-zinc-400 uppercase leading-relaxed">
                            Confirmação instantânea e envio automático. Ideal para quem tem pressa e quer pular a etapa de verificação.
                        </p>
                    </div>

                    <div className="bg-white border-2 border-zinc-100 p-8 rounded-[2.5rem]">
                        <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center mb-4">
                            <CreditCard className="text-zinc-900" size={24} />
                        </div>
                        <h3 className="font-black uppercase italic text-lg mb-2">Cartão: Fluxo Seguro</h3>
                        <p className="text-[11px] font-bold text-zinc-400 uppercase leading-relaxed">
                            Processamento em até 24h. Requer envio de comprovante via WhatsApp para liberação do pacote.
                        </p>
                    </div>
                </div>

                {/* STEPS */}
                <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400 mb-6 px-4">Passo a passo para liberação</h4>
                    {[
                        { step: "01", title: "Finalize seu pedido", desc: "Escolha o cartão como método de pagamento." },
                        { step: "02", title: "Acesse o App do Banco", desc: "Tire um print do comprovante da transação aprovada." },
                        { step: "03", title: "Envie no WhatsApp", desc: "Encaminhe para nosso suporte com o número do pedido." }
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-6 bg-white p-6 rounded-[2rem] border border-zinc-100 group hover:border-yellow-500 transition-colors">
                            <span className="text-2xl font-black text-zinc-100 group-hover:text-yellow-500 transition-colors">{item.step}</span>
                            <div>
                                <h5 className="font-black uppercase italic text-zinc-900">{item.title}</h5>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">{item.desc}</p>
                            </div>
                            <ArrowRight className="ml-auto text-zinc-200" size={20} />
                        </div>
                    ))}
                </div>

                <footer className="mt-16 text-center border-t border-zinc-100 pt-8">
                    <div className="flex justify-center gap-4 opacity-30 grayscale mb-4">
                        {/* Aqui você pode colocar ícones de bandeiras de cartão ou selos de segurança */}
                        <div className="w-10 h-6 bg-zinc-400 rounded-sm" />
                        <div className="w-10 h-6 bg-zinc-400 rounded-sm" />
                        <div className="w-10 h-6 bg-zinc-400 rounded-sm" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">
                        © 2026 Operação Blindada - Todos os direitos reservados.
                    </p>
                </footer>

            </div>
        </div>
    );
}