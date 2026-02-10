import React, { useState, useMemo, useCallback } from 'react';
import { Search, Package, Truck, MapPin, Loader2, ArrowLeft, Calendar, Clock, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

/**
 * INTERFACES TÉCNICAS
 */
interface TrackingEvent {
    data: string;
    hora: string;
    status: string;
    local: string;
    detalhes: string;
}

interface TrackingData {
    id: string;
    status: string;
    previsao: string;
    origem: string;
    destino: string;
    eventos: TrackingEvent[];
}

// 1. DADOS FAKES (Regra de Negócio Preservada)
const FAKE_TRACKING_DATA: TrackingData = {
    id: "BR99283741J",
    status: "EM TRÂNSITO",
    previsao: "08/02/2026",
    origem: "São Paulo, SP",
    destino: "Rio de Janeiro, RJ",
    eventos: [
        {
            data: "03/02/2026",
            hora: "14:20",
            status: "Objeto saiu para entrega ao destinatário",
            local: "CDD Copacabana - Rio de Janeiro, RJ",
            detalhes: "Certifique-se de que haverá alguém para receber o pacote."
        },
        {
            data: "02/02/2026",
            hora: "09:45",
            status: "Objeto em trânsito - por favor aguarde",
            local: "CTE Benfica - Rio de Janeiro, RJ",
            detalhes: "Enviado para a unidade de distribuição local."
        },
        {
            data: "01/02/2026",
            hora: "18:10",
            status: "Objeto postado",
            local: "Agência Central - São Paulo, SP",
            detalhes: "O remetente entregou o objeto na transportadora."
        }
    ]
};

export default function TrackingPage() {
    const navigate = useNavigate();
    const [searchCode, setSearchCode] = useState('');
    const [orderData, setOrderData] = useState<TrackingData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // SEO: Metadados Estruturados (JSON-LD) para IAs
    const structuredData = useMemo(() => ({
        "@context": "https://schema.org",
        "@type": "ParcelDelivery",
        "deliveryAddress": { "@type": "PostalAddress", "addressLocality": "Rio de Janeiro, RJ" },
        "expectedArrivalUntil": "2026-02-08",
        "trackingNumber": searchCode || "CÓDIGO_RASTREIO"
    }), [searchCode]);

    const handleTrack = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const code = searchCode.trim().toUpperCase();
        
        if (!code) return toast.error("Digite o código de rastreio!");

        setIsLoading(true);

        // Simulando delay de rede (Regra de Negócio Preservada)
        setTimeout(() => {
            if (code === "ERRO") {
                toast.error("Código não encontrado.");
                setOrderData(null);
            } else {
                setOrderData(FAKE_TRACKING_DATA);
            }
            setIsLoading(false);
        }, 800);
    }, [searchCode]);

    return (
        <main className="min-h-screen bg-[#F8F9FB] p-4 sm:p-6 md:p-12 font-sans italic leading-none selection:bg-yellow-100">
            {/* SEO Data */}
            <script type="application/ld+json">{JSON.stringify(structuredData)}</script>

            <div className="max-w-3xl mx-auto">
                
                {/* HEADER */}
                <header className="mb-12 flex items-center justify-between animate-in fade-in duration-500">
                    <div className="text-left">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-yellow-600 transition-all mb-4 outline-none"
                            aria-label="Voltar para a página anterior"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Voltar
                        </button>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter text-zinc-900 leading-[0.9]">
                            Rastrear <span className="text-yellow-600">Pedido</span>
                        </h1>
                    </div>
                    <div className="hidden md:block transition-transform hover:rotate-12 duration-500">
                        <Package size={56} className="text-zinc-200" aria-hidden="true" />
                    </div>
                </header>

                {/* BARRA DE PESQUISA - UX Otimizada */}
                <form 
                    onSubmit={handleTrack} 
                    className="relative mb-16 shadow-2xl shadow-zinc-200/60 rounded-[2.5rem]"
                    aria-label="Formulário de Rastreio"
                >
                    <input 
                        type="text" 
                        placeholder="DIGITE SEU CÓDIGO (EX: BR9928...)"
                        value={searchCode}
                        onChange={(e) => setSearchCode(e.target.value)}
                        spellCheck={false}
                        className="w-full bg-white border-2 border-zinc-100 p-6 md:p-8 rounded-[2.5rem] text-sm md:text-base font-black uppercase outline-none focus:border-yellow-500 transition-all pr-20 italic placeholder:text-zinc-300"
                    />
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="absolute right-3 top-3 bottom-3 aspect-square bg-zinc-900 text-white rounded-[1.8rem] flex items-center justify-center hover:bg-yellow-600 hover:text-black transition-all active:scale-90 shadow-lg disabled:opacity-50"
                        aria-label="Pesquisar código"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : <Search size={24} />}
                    </button>
                </form>

                {/* RESULTADO (RASTREIO DINÂMICO) */}
                <div role="region" aria-live="polite">
                    {orderData ? (
                        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            
                            {/* CARD DE STATUS PRINCIPAL */}
                            <article className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-xl border border-zinc-50 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-yellow-500/10 transition-colors" />
                                
                                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b pb-10 border-zinc-50">
                                    <div className="text-left">
                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">Status do Objeto</span>
                                        <h2 className="text-3xl sm:text-4xl font-black uppercase italic text-zinc-900 mt-2 tracking-tighter">
                                            {orderData.status}
                                        </h2>
                                    </div>
                                    <div className="text-left md:text-right bg-zinc-50 md:bg-transparent p-5 md:p-0 rounded-[2rem] w-full md:w-auto border border-zinc-100 md:border-0">
                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none block mb-2">Previsão de Entrega</span>
                                        <div className="flex items-center md:justify-end gap-2 text-yellow-600">
                                            <Calendar size={18} />
                                            <span className="text-xl font-black italic tracking-tight">{orderData.previsao}</span>
                                        </div>
                                    </div>
                                </header>

                                

                                {/* TIMELINE DE EVENTOS */}
                                <div className="space-y-12 ml-2 md:ml-4">
                                    {orderData.eventos.map((evento, idx) => (
                                        <div key={idx} className="flex gap-8 md:gap-12 relative group/item">
                                            
                                            {/* Linha Conectora com Gradiente Otimizado */}
                                            {idx !== orderData.eventos.length - 1 && (
                                                <div className="absolute left-[15px] top-10 bottom-[-3rem] w-0.5 bg-zinc-100 group-hover/item:bg-yellow-500/30 transition-colors" />
                                            )}
                                            
                                            {/* Marcador Dinâmico */}
                                            <div className={`w-8 h-8 rounded-full flex-shrink-0 z-10 flex items-center justify-center border-4 border-white shadow-xl transition-all duration-500 group-hover/item:scale-125 ${
                                                idx === 0 ? 'bg-zinc-950 text-white scale-110 shadow-zinc-300' : 'bg-zinc-100 text-zinc-400'
                                            }`}>
                                                {idx === 0 ? <Truck size={14} /> : <MapPin size={12} />}
                                            </div>

                                            {/* Detalhes do Evento com Hierarquia Visual */}
                                            <div className="text-left pb-4">
                                                <div className="flex flex-col md:flex-row md:items-center gap-y-1 gap-x-3 mb-2">
                                                    <span className="text-[10px] font-black text-yellow-600 uppercase tracking-widest flex items-center gap-1.5">
                                                        <Clock size={12} /> {evento.data} • {evento.hora}
                                                    </span>
                                                    <span className="hidden md:block text-zinc-200" aria-hidden="true">|</span>
                                                    <address className="not-italic text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                                        {evento.local}
                                                    </address>
                                                </div>
                                                <h3 className="text-lg md:text-xl font-black uppercase italic text-zinc-900 leading-tight mb-3 tracking-tight">
                                                    {evento.status}
                                                </h3>
                                                <p className="text-[11px] font-bold text-zinc-400 uppercase leading-relaxed tracking-wide max-w-lg">
                                                    {evento.detalhes}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </article>

                            {/* CARD DE SEGURANÇA - Trust Signal */}
                            <section className="bg-zinc-950 p-8 rounded-[2.5rem] flex flex-col sm:flex-row items-center justify-between text-white overflow-hidden relative group">
                                <div className="flex items-center gap-5 z-10">
                                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-yellow-500 shadow-inner">
                                        <ShieldCheck size={28} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Logística Premium</p>
                                        <p className="text-sm md:text-base font-black uppercase italic leading-none tracking-tight">Sua carga está protegida e segurada</p>
                                    </div>
                                </div>
                                <Truck size={140} className="absolute right-[-30px] opacity-10 rotate-12 group-hover:translate-x-4 transition-transform duration-700" aria-hidden="true" />
                            </section>

                        </section>
                    ) : (
                        /* ESTADO VAZIO / INSTRUTIVO */
                        <section className="py-24 text-center border-2 border-dashed border-zinc-200 rounded-[3.5rem] animate-in fade-in duration-700">
                            <div className="bg-zinc-100 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                <Package size={40} className="text-zinc-300" />
                            </div>
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400 italic mb-2">
                                Central de Rastreamento
                            </h2>
                            <p className="text-[10px] font-bold uppercase text-zinc-300 tracking-widest">
                                Aguardando código para localizar sua remessa
                            </p>
                        </section>
                    )}
                </div>
            </div>
        </main>
    );
}