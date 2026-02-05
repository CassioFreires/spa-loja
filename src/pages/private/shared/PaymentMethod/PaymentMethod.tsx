import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Lock, ShoppingBag, Loader2, ExternalLink } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../../../../context/CartContext';
import { createOrder } from '../../../../services/Orders/orders';

export default function PaymentSelection() {
    const navigate = useNavigate();
    const location = useLocation();
    const { totalPrice, cart, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const addressId = location.state?.addressId;

    const handleFinishOrder = async () => {
        if (!addressId) {
            toast.error("Endereço de entrega não selecionado.");
            return navigate('/endereco');
        }

        try {
            setIsSubmitting(true);
            const orderPayload = {
                address_id: Number(addressId),
                items: cart.map(item => ({
                    product_id: Number(item.id),
                    variation_id: item.variation_id ? Number(item.variation_id) : null,
                    quantity: item.quantity
                }))
            };

            const response = await createOrder(orderPayload);
            const paymentUrl = response?.payment_url || response?.order?.payment_url;

            if (paymentUrl) {
                clearCart();
                // Navegamos DIRETAMENTE para a ponte, sem tentar abrir abas aqui.
                navigate('/checkout/redirect', {
                    state: { url: paymentUrl },
                    replace: true
                });
            } else {
                toast.error("Erro ao gerar link de pagamento.");
                navigate('/meus-pedidos');
            }
        } catch (error: any) {
            toast.error("Erro ao processar sua compra.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-10 font-sans text-zinc-900 leading-none">
            <header className="max-w-6xl mx-auto mb-10 flex items-center justify-between leading-none">
                <div className="flex items-center gap-4 leading-none">
                    <Link to="/endereco" className="p-3 bg-white border border-zinc-200 rounded-2xl hover:bg-zinc-50 shadow-sm"><ArrowLeft size={20} /></Link>
                    <div className="text-left">
                        <h1 className="text-2xl font-black uppercase tracking-tight italic">Checkout <span className="text-yellow-600">Final</span></h1>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic mt-1">Ambiente Seguro InfinitePay</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-xl text-white border border-zinc-700">
                    <Lock size={12} className="text-yellow-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest leading-none">Proteção de Dados SSL</span>
                </div>
            </header>

            <main className="max-w-4xl mx-auto italic leading-none">
                <div className="bg-white p-8 rounded-[3rem] border border-zinc-200 shadow-2xl relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-8 border-b pb-4">
                        <ShoppingBag size={18} className="text-yellow-600" />
                        <h4 className="font-black uppercase italic text-sm text-zinc-900 tracking-widest">Resumo do Carrinho</h4>
                    </div>

                    <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 mb-8 custom-scrollbar">
                        {cart.map((item, idx) => (
                            <div key={`${item.id}-${idx}`} className="flex items-center justify-between gap-4 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-14 bg-zinc-50 rounded-xl overflow-hidden flex-shrink-0 border border-zinc-100">
                                        <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                                    </div>
                                    <div className="text-left">
                                        <h5 className="font-black uppercase italic text-[11px] text-zinc-800 line-clamp-1">{item.name}</h5>
                                        <p className="text-[9px] font-bold text-zinc-400 uppercase mt-1">QTD: {item.quantity} • {item.size || 'UN'}</p>
                                    </div>
                                </div>
                                <span className="font-black text-[11px]">R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4 border-t pt-6">
                        <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            <span>Subtotal</span>
                            <span className="text-zinc-900 font-black">R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            <span>Frete</span>
                            <span className="text-green-500 font-black">GRÁTIS</span>
                        </div>
                        <div className="pt-6 border-t flex flex-col text-left">
                            <span className="text-[10px] font-black uppercase text-zinc-400 italic mb-1">Total a Pagar</span>
                            <span className="text-4xl font-black text-yellow-600 italic tracking-tighter">
                                R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleFinishOrder}
                        disabled={isSubmitting || cart.length === 0}
                        className="w-full mt-8 bg-zinc-900 text-white py-6 rounded-3xl font-black uppercase italic text-sm hover:bg-yellow-600 transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                        {isSubmitting ? <><Loader2 className="animate-spin" size={18} /> Gerando Link...</> : <>Confirmar e Pagar <ExternalLink size={18} /></>}
                    </button>
                </div>

                <div className="mt-6 bg-white p-6 rounded-[2rem] border border-zinc-200 flex items-center gap-4 shadow-sm">
                    <ShieldCheck size={24} className="text-yellow-600" />
                    <div className="text-left leading-tight">
                        <p className="text-[9px] font-black uppercase text-zinc-900 leading-none">Checkout Criptografado</p>
                        <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-tighter mt-1">Você escolherá Pix ou Cartão na próxima página</p>
                    </div>
                </div>
            </main>
        </div>
    );
}