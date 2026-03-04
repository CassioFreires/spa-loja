import { useState, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Lock, ShoppingBag, Loader2, ExternalLink, Truck, CalendarDays } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../../../../context/CartContext';
import { createOrder } from '../../../../services/Orders/orders';

export default function PaymentSelection() {
    const navigate = useNavigate();
    const location = useLocation();
    const { totalPrice, cart, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. TENTATIVA DE RECUPERAÇÃO HÍBRIDA
    // Prioriza o State (mais rápido), mas se falhar, busca no LocalStorage (mais seguro)
    const state = location.state || {};
    
    // Busca no LocalStorage o que foi salvo pelo Modal
    const cachedFreight = JSON.parse(localStorage.getItem('@app:temp_freight') || 'null');
    const firstFreightOption = Array.isArray(cachedFreight) ? cachedFreight[0] : cachedFreight;

    // Definição final das variáveis (Lógica Fallback)
    const shippingPrice = Number(state.shippingPrice || firstFreightOption?.valorNumerico || 0);
    const deadline = state.deadline || firstFreightOption?.prazo;
    const serviceId = state.serviceId || firstFreightOption?.id;
    const addressId = state.addressId;

    const grandTotal = totalPrice + shippingPrice;

    const handleFinishOrder = async () => {
        if (!addressId && !localStorage.getItem('@app:guest_address')) {
            toast.error("Selecione o endereço para calcular o frete.");
            return navigate('/endereco');
        }

        try {
            setIsSubmitting(true);
            const isGuest = addressId === 'guest_temp_id' || !localStorage.getItem('authToken');
            const guestUser = JSON.parse(localStorage.getItem('@app:guest_user') || 'null');
            const guestAddress = JSON.parse(localStorage.getItem('@app:guest_address') || 'null');

            const orderPayload = {
                ...(!isGuest ? { address_id: Number(addressId) } : {}),
                amount_paid_shipping: shippingPrice,
                external_service_id: serviceId,
                items: cart.map(item => ({
                    product_id: Number(item.id),
                    variation_id: item.variation_id ? Number(item.variation_id) : null,
                    quantity: item.quantity,
                    unit_price: Number(item.price)
                })),
                ...(isGuest && {
                    guest_info: { name: guestUser?.name, email: guestUser?.email },
                    guest_address: guestAddress
                })
            };

            const response = await createOrder(orderPayload);
            const paymentUrl = response?.payment_url || response?.order?.payment_url;

            if (paymentUrl) {
                clearCart();
                localStorage.removeItem('@app:temp_freight'); // Limpa após o sucesso
                if (isGuest) {
                    localStorage.removeItem('@app:guest_user');
                    localStorage.removeItem('@app:guest_address');
                }
                navigate('/checkout/redirect', { state: { url: paymentUrl }, replace: true });
            }
        } catch (error: any) {
            toast.error("Erro ao processar sua compra.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-10 font-sans text-zinc-900 italic selection:bg-yellow-100">
            {/* ... (Header mantido igual) ... */}
            <header className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4 text-left">
                    <button onClick={() => navigate('/endereco')} className="p-3 bg-white border border-zinc-200 rounded-2xl hover:bg-zinc-50 shadow-sm transition-all group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tight italic">Pagamento <span className="text-yellow-600">&</span> Resumo</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Criptografia ativa</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto grid md:grid-cols-5 gap-8 leading-none">
                {/* COLUNA DA ESQUERDA (Carrinho) mantida... */}
                <div className="md:col-span-3 space-y-6">
                    <section className="bg-white p-6 rounded-[2.5rem] border border-zinc-200 shadow-xl overflow-hidden text-left">
                        <div className="flex items-center gap-2 mb-6 opacity-60">
                            <ShoppingBag size={14} className="text-zinc-900" />
                            <h4 className="font-black uppercase text-[10px] tracking-[0.2em]">Seu Carrinho</h4>
                        </div>
                        <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {cart.map((item, idx) => (
                                <div key={`${item.id}-${idx}`} className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-16 bg-zinc-50 rounded-2xl overflow-hidden border border-zinc-100 flex-shrink-0">
                                            <img src={item.image} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt={item.name} />
                                        </div>
                                        <div className="text-left">
                                            <h5 className="font-black uppercase text-[11px] text-zinc-800 tracking-tight leading-tight">{item.name}</h5>
                                            <p className="text-[9px] font-bold text-zinc-400 uppercase mt-1">Tam: {item.size} • Qtd: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <span className="font-black text-[11px] text-zinc-900">R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* COLUNA DA DIREITA: VALORES CORRIGIDOS */}
                <div className="md:col-span-2 space-y-6">
                    <section className="bg-white p-8 rounded-[2.5rem] border-2 border-zinc-100 shadow-2xl text-left flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-8 opacity-60">
                            <Truck size={14} className="text-zinc-900" />
                            <h4 className="font-black uppercase text-[10px] tracking-[0.2em]">Entrega & Taxas</h4>
                        </div>

                        <div className="space-y-5 flex-grow">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-50 pb-4">
                                <span>Subtotal</span>
                                <span className="text-zinc-900 font-black">R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>

                            <div className="flex justify-between items-start py-2 border-b border-zinc-50 pb-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">Frete Loggi Gold</span>
                                    <div className="flex items-center gap-1.5 text-yellow-600">
                                        <CalendarDays size={12} />
                                        <span className="text-[10px] font-black uppercase tracking-tighter">
                                            {/* EXIBIÇÃO CORRIGIDA DO PRAZO */}
                                            {deadline ? `${deadline} Dias Úteis` : 'A calcular'}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-[11px] font-black text-zinc-950">
                                    {shippingPrice === 0 ? 'GRÁTIS' : `R$ ${shippingPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                </span>
                            </div>

                            <div className="pt-6">
                                <span className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.3em]">Total Final</span>
                                <div className="flex items-baseline gap-1 mt-2">
                                    <span className="text-lg font-black text-zinc-950">R$</span>
                                    <span className="text-5xl font-black text-zinc-950 tracking-tighter">
                                        {grandTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleFinishOrder}
                            disabled={isSubmitting || cart.length === 0}
                            className="w-full mt-10 bg-zinc-950 text-white py-7 rounded-[2rem] font-black uppercase text-xs hover:bg-yellow-600 hover:text-black transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="animate-spin" size={18} /> Validando...</>
                            ) : (
                                <>Confirmar Pedido <ExternalLink size={14} /></>
                            )}
                        </button>
                    </section>
                </div>
            </main>
        </div>
    );
}