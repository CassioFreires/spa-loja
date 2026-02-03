import React, { useState } from 'react';
import { Search, Package, Truck, MapPin, Loader2, ArrowLeft, Calendar, Clock, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// 1. DADOS FAKES PARA SIMULAÇÃO
const FAKE_TRACKING_DATA = {
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
    const [orderData, setOrderData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchCode) return toast.error("Digite o código de rastreio!");

        setIsLoading(true);

        // Simulando delay de rede
        setTimeout(() => {
            if (searchCode.toUpperCase() === "ERRO") {
                toast.error("Código não encontrado.");
                setOrderData(null);
            } else {
                setOrderData(FAKE_TRACKING_DATA);
            }
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-12 font-sans italic leading-none">
            <div className="max-w-3xl mx-auto">
                
                {/* HEADER */}
                <header className="mb-12 flex items-center justify-between">
                    <div className="text-left">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-yellow-600 transition-colors mb-4"
                        >
                            <ArrowLeft size={14} /> Voltar
                        </button>
                        <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">
                            Rastrear <span className="text-yellow-600">Pedido</span>
                        </h1>
                    </div>
                    <div className="hidden md:block">
                        <Package size={48} className="text-zinc-100" />
                    </div>
                </header>

                {/* BARRA DE PESQUISA */}
                <form onSubmit={handleTrack} className="relative mb-16">
                    <input 
                        type="text" 
                        placeholder="DIGITE SEU CÓDIGO (EX: BR9928...)"
                        value={searchCode}
                        onChange={(e) => setSearchCode(e.target.value)}
                        className="w-full bg-white border-2 border-zinc-100 p-6 md:p-8 rounded-[2.5rem] text-sm md:text-base font-black uppercase outline-none focus:border-yellow-500 shadow-2xl shadow-zinc-200/50 transition-all pr-20 italic"
                    />
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="absolute right-3 top-3 bottom-3 aspect-square bg-zinc-900 text-white rounded-[1.8rem] flex items-center justify-center hover:bg-yellow-600 transition-all active:scale-90 shadow-lg"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : <Search size={24} />}
                    </button>
                </form>

                {/* RESULTADO (FAKE DATA) */}
                {orderData ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        
                        {/* CARD DE STATUS PRINCIPAL */}
                        <div className="bg-white p-8 md:p-10 rounded-[3.5rem] shadow-xl border border-zinc-50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                            
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b pb-8 border-zinc-50">
                                <div className="text-left">
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">Status Atual</span>
                                    <h2 className="text-3xl font-black uppercase italic text-zinc-900 mt-2">{orderData.status}</h2>
                                </div>
                                <div className="text-left md:text-right bg-zinc-50 md:bg-transparent p-4 md:p-0 rounded-2xl w-full md:w-auto">
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none block mb-2">Previsão de Entrega</span>
                                    <div className="flex items-center md:justify-end gap-2 text-yellow-600">
                                        <Calendar size={16} />
                                        <span className="text-lg font-black italic">{orderData.previsao}</span>
                                    </div>
                                </div>
                            </div>

                            {/* TIMELINE DE EVENTOS */}
                            <div className="space-y-10">
                                {orderData.eventos.map((evento: any, idx: number) => (
                                    <div key={idx} className="flex gap-6 md:gap-10 relative group">
                                        
                                        {/* Linha Conectora */}
                                        {idx !== orderData.eventos.length - 1 && (
                                            <div className="absolute left-4 top-10 bottom-[-2.5rem] w-0.5 bg-zinc-100 group-hover:bg-yellow-500/30 transition-colors" />
                                        )}
                                        
                                        {/* Marcador */}
                                        <div className={`w-8 h-8 rounded-full flex-shrink-0 z-10 flex items-center justify-center border-4 border-white shadow-md transition-transform duration-500 group-hover:scale-125 ${
                                            idx === 0 ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-400'
                                        }`}>
                                            {idx === 0 ? <Truck size={14} /> : <MapPin size={12} />}
                                        </div>

                                        {/* Detalhes do Evento */}
                                        <div className="text-left pb-2">
                                            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                                                <span className="text-[10px] font-black text-yellow-600 uppercase tracking-widest flex items-center gap-1">
                                                    <Clock size={10} /> {evento.data} às {evento.hora}
                                                </span>
                                                <span className="hidden md:block text-zinc-200">•</span>
                                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{evento.local}</span>
                                            </div>
                                            <h4 className="text-base md:text-lg font-black uppercase italic text-zinc-900 leading-tight mb-2">
                                                {evento.status}
                                            </h4>
                                            <p className="text-[11px] font-bold text-zinc-400 uppercase leading-relaxed tracking-wide">
                                                {evento.detalhes}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CARD DE SEGURANÇA */}
                        <div className="bg-zinc-900 p-8 rounded-[2.5rem] flex items-center justify-between text-white overflow-hidden relative">
                            <div className="flex items-center gap-4 z-10">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-yellow-500">
                                    <ShieldCheck size={24} />
                                </div>
                                <div className="text-left leading-tight">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Transporte Seguro</p>
                                    <p className="text-sm font-black uppercase italic">Sua carga está protegida e segurada</p>
                                </div>
                            </div>
                            <div className="absolute right-[-20px] opacity-10 rotate-12">
                                <Truck size={120} />
                            </div>
                        </div>

                    </div>
                ) : (
                    /* ESTADO VAZIO / INSTRUTIVO */
                    <div className="py-20 text-center border-2 border-dashed border-zinc-200 rounded-[3rem] opacity-50">
                        <Package size={40} className="mx-auto mb-4 text-zinc-300" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 italic">
                            Aguardando código para localizar seu pacote
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}