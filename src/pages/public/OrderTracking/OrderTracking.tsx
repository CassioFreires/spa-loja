import React, { useState } from 'react';
import { Search, Loader2, ArrowLeft, PackageSearch, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTrackOrder } from '../../../hooks/useTrackOrder';
import OrderDetailModal from '../../../components/modals/OrderDetailsModal';
import toast from 'react-hot-toast';

export default function OrderTracking() {
    const [orderCode, setOrderCode] = useState('');
    const [email, setEmail] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Consumindo o hook
    const { mutate, isPending, data: foundOrder } = useTrackOrder();

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!orderCode.trim() || !email.trim()) {
            return toast.error("Preencha todos os campos.", { 
                id: 'form-validation', // ID fixo para não duplicar
                duration: 3000 
            });
        }

        mutate({ orderCode: orderCode.trim(), email: email.trim() }, {
            onSuccess: () => {
                setIsModalOpen(true);
            },
            // Nota: Se o seu hook 'useTrackOrder' já tem um toast.error, 
            // este bloco abaixo pode ser removido para evitar a duplicidade.
            onError: (error: any) => {
                const message = error.response?.data?.message || "Pedido não localizado.";
                toast.error(message, {
                    id: 'track-error', // O segredo para não aparecer dois
                    duration: 3000,
                    position: 'top-center',
                });
            }
        });
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-10 font-sans text-zinc-900 italic selection:bg-yellow-100 leading-none">
            <header className="max-w-xl mx-auto mb-12">
                <Link to="/" className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest text-zinc-400 hover:text-yellow-600 mb-6 transition-all">
                    <ArrowLeft size={14} /> Voltar para a Home
                </Link>
                <div className="text-left leading-none">
                    <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 leading-none">
                        Rastrear <span className="text-yellow-600">Pedido</span>
                    </h1>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Acompanhe sua entrega sem precisar de login</p>
                </div>
            </header>

            <main className="max-w-xl mx-auto">
                <form onSubmit={handleTrack} className="bg-white p-8 md:p-12 rounded-[3rem] border border-zinc-100 shadow-2xl space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <PackageSearch size={120} />
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2 text-left">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Código do Pedido</label>
                            <input
                                type="text"
                                placeholder="Ex: ORD-2026-X8Y9"
                                value={orderCode}
                                onChange={(e) => setOrderCode(e.target.value.toUpperCase())}
                                className="w-full bg-zinc-50 border-2 border-zinc-100 p-5 rounded-2xl outline-none focus:border-yellow-500 font-black text-lg transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2 text-left">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">E-mail do Comprador</label>
                            <input
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-zinc-50 border-2 border-zinc-100 p-5 rounded-2xl outline-none focus:border-yellow-500 font-bold italic transition-all"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-zinc-900 text-white py-6 rounded-3xl font-black uppercase text-sm hover:bg-yellow-600 hover:text-black transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                        {isPending ? (
                            <><Loader2 className="animate-spin" size={20} /> Buscando...</>
                        ) : (
                            <><Search size={20} /> Localizar Pedido</>
                        )}
                    </button>

                    <div className="flex items-center gap-2 justify-center pt-4 border-t border-zinc-50">
                        <ShieldCheck size={14} className="text-yellow-600" />
                        <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Protocolo de Segurança Ativo</span>
                    </div>
                </form>
            </main>

            {/* Modal de Detalhes - Só abre se foundOrder existir */}
            <OrderDetailModal 
                order={foundOrder} 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </div>
    );
}