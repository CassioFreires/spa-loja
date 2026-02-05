import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, ExternalLink, CheckCircle2 } from 'lucide-react';

export default function PaymentRedirect() {
    const location = useLocation();
    const navigate = useNavigate();
    const paymentUrl = location.state?.url;

    // Se não houver URL, manda para os pedidos
    if (!paymentUrl) {
        // Usamos useEffect aqui apenas para o redirecionamento de segurança caso o state suma
        React.useEffect(() => {
            navigate('/meus-pedidos');
        }, [navigate]);
        return null;
    }

    return (
        <div className="min-h-screen bg-[#F8F9FB] flex flex-col items-center justify-center p-6 text-center font-sans italic">
            <div className="max-w-md w-full bg-white p-10 rounded-[3rem] border border-zinc-100 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                
                <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-sm">
                    <CheckCircle2 size={40} className="text-green-600" />
                </div>

                <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 leading-none mb-4">
                    Pedido <span className="text-green-600">Gerado!</span>
                </h1>
                
                <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-8 leading-relaxed">
                    Seu pedido foi registrado com sucesso. <br/> 
                    Clique abaixo para realizar o pagamento seguro.
                </p>

                <div className="flex flex-col gap-3">
                    {/* Botão de Ação Manual: Única forma de ir para a InfinitePay */}
                    <a 
                        href={paymentUrl}
                        className="w-full bg-zinc-900 text-white py-6 rounded-2xl font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-2 hover:bg-yellow-600 hover:text-black transition-all shadow-lg active:scale-95"
                    >
                        Ir para Pagamento <ExternalLink size={16} />
                    </a>

                    <Link 
                        to="/meus-pedidos"
                        className="w-full bg-zinc-100 text-zinc-500 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all mt-4"
                    >
                        <ArrowLeft size={14} /> Ver Meus Pedidos
                    </Link>
                </div>

                <div className="mt-10 pt-6 border-t border-zinc-50 flex items-center justify-center gap-2 opacity-50">
                    <ShieldCheck size={14} className="text-zinc-400" />
                    <span className="text-[8px] font-black uppercase tracking-tighter text-zinc-400">Ambiente Criptografado InfinitePay</span>
                </div>
            </div>
            
            <p className="mt-8 text-[9px] font-bold text-zinc-400 uppercase tracking-widest max-w-xs leading-loose">
                Ao clicar em "Ir para Pagamento", você será levado ao checkout seguro da InfinitePay.
            </p>
        </div>
    );
}