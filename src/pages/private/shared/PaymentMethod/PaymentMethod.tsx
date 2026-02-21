import { useState } from 'react';
import { ArrowLeft, ShieldCheck, Lock, ShoppingBag, Loader2, ExternalLink } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../../../../context/CartContext';
import { createOrder } from '../../../../services/Orders/orders';

/**
 * PAGE: PaymentSelection
 * Objetivo: Finalizar a estrutura do pedido e redirecionar para o Gateway.
 * Suporta: Fluxo Híbrido (Usuário Logado e Visitante).
 */
export default function PaymentSelection() {
    const navigate = useNavigate();
    const location = useLocation();
    const { totalPrice, cart, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Captura o ID do endereço (pode ser um número ou 'guest_temp_id')
    const addressId = location.state?.addressId;

    const handleFinishOrder = async () => {
        if (!addressId) {
            toast.error("Endereço de entrega não selecionado.");
            return navigate('/endereco');
        }

        try {
            setIsSubmitting(true);

            // Verificamos se é um visitante para ajustar o payload
            const isGuest = addressId === 'guest_temp_id';
            
            // Recuperamos os dados persistidos no LocalStorage (se for visitante)
            const guestUser = isGuest ? JSON.parse(localStorage.getItem('@app:guest_user') || 'null') : null;
            const guestAddress = isGuest ? JSON.parse(localStorage.getItem('@app:guest_address') || 'null') : null;

            // Montagem do Payload Profissional
            const orderPayload = {
                // Se for visitante, enviamos null no ID (o backend criará o registro)
                ...(isGuest ? {} : { address_id: Number(addressId) }),
                
                amount_paid_shipping: 0,
                items: cart.map(item => ({
                    product_id: Number(item.id),
                    variation_id: item.variation_id ? Number(item.variation_id) : null,
                    quantity: item.quantity,
                    unit_price: Number(item.price)
                })),
                // Injetamos guest_info apenas se for um visitante
                ...(isGuest && {
                    guest_info: {
                        name: guestUser?.name,
                        email: guestUser?.email
                    },
                    guest_address: guestAddress // Dados completos do endereço para o backend salvar
                })
            };

            const response = await createOrder(orderPayload);
            const paymentUrl = response?.payment_url || response?.order?.payment_url;

            if (paymentUrl) {
                // Limpeza de cache pós-sucesso
                clearCart();
                if (isGuest) {
                    localStorage.removeItem('@app:guest_user');
                    localStorage.removeItem('@app:guest_address');
                }

                navigate('/checkout/redirect', {
                    state: { url: paymentUrl },
                    replace: true
                });
            } else {
                toast.error("Erro ao gerar link de pagamento.");
                navigate('/meus-pedidos');
            }
        } catch (error: any) {
            console.error("Erro ao criar pedido:", error.response?.data);
            const errorMessage = error.response?.data?.message;
            
            // Tratamento amigável de erros de validação do NestJS
            toast.error(Array.isArray(errorMessage) ? errorMessage[0] : "Erro ao processar sua compra.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-10 font-sans text-zinc-900 leading-none italic selection:bg-yellow-100">
            <header className="max-w-6xl mx-auto mb-10 flex items-center justify-between leading-none">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/endereco')} 
                        className="p-3 bg-white border border-zinc-200 rounded-2xl hover:bg-zinc-50 shadow-sm transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="text-left">
                        <h1 className="text-2xl font-black uppercase tracking-tight">Checkout <span className="text-yellow-600">Final</span></h1>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Ambiente Seguro & Criptografado</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-xl text-white border border-zinc-700">
                    <Lock size={12} className="text-yellow-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest leading-none">Proteção SSL Ativa</span>
                </div>
            </header>

            <main className="max-w-4xl mx-auto">
                <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-zinc-200 shadow-2xl relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-8 border-b pb-6">
                        <ShoppingBag size={18} className="text-yellow-600" />
                        <h4 className="font-black uppercase text-sm text-zinc-900 tracking-widest">Resumo do Pedido</h4>
                    </div>

                    <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 mb-8 custom-scrollbar">
                        {cart.map((item, idx) => (
                            <div key={`${item.id}-${idx}`} className="flex items-center justify-between gap-4 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-14 bg-zinc-50 rounded-xl overflow-hidden flex-shrink-0 border border-zinc-100">
                                        <img src={item.image} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" alt={item.name} />
                                    </div>
                                    <div className="text-left">
                                        <h5 className="font-black uppercase text-[11px] text-zinc-800 line-clamp-1">{item.name}</h5>
                                        <p className="text-[9px] font-bold text-zinc-400 uppercase mt-1">QTD: {item.quantity} • {item.size || 'UN'}</p>
                                    </div>
                                </div>
                                <span className="font-black text-[11px] text-zinc-900">R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4 border-t pt-8">
                        <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                            <span>Subtotal Bruto</span>
                            <span className="text-zinc-900 font-black">R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                            <span>Logística Premium</span>
                            <span className="text-green-500 font-black uppercase tracking-widest text-[9px] bg-green-50 px-2 py-1 rounded-md">Grátis</span>
                        </div>
                        <div className="pt-6 border-t flex flex-col text-left">
                            <span className="text-[10px] font-black uppercase text-zinc-400 mb-1">Total a Confirmar</span>
                            <span className="text-5xl font-black text-zinc-950 tracking-tighter leading-none">
                                R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleFinishOrder}
                        disabled={isSubmitting || cart.length === 0}
                        className="w-full mt-10 bg-zinc-950 text-white py-7 rounded-3xl font-black uppercase text-sm hover:bg-yellow-600 hover:text-black transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {isSubmitting ? (
                            <><Loader2 className="animate-spin" size={20} /> Processando...</>
                        ) : (
                            <>Confirmar e Pagar <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                        )}
                    </button>
                </div>

                <div className="mt-8 bg-zinc-900 p-8 rounded-[2.5rem] flex items-center gap-6 shadow-sm border border-zinc-800">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-yellow-500">
                        <ShieldCheck size={28} />
                    </div>
                    <div className="text-left leading-tight">
                        <p className="text-[10px] font-black uppercase text-white tracking-widest leading-none">Checkout Blindado</p>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-tight mt-2 italic">
                            Seus dados estão seguros. Você será redirecionado para a plataforma de pagamento InfinitePay.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}