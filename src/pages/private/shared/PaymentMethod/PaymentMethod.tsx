import React, { useState, useMemo } from 'react';
import { ArrowLeft, CreditCard, Landmark, QrCode, ShieldCheck, ChevronRight, CheckCircle2, Lock, ShoppingBag, Loader2 } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

import CreditCardModal from '../../../../components/modals/CreditCardModalProps';
import { useCart } from '../../../../context/CartContext';
import { createOrder } from '../../../../services/Orders/orders'; // Certifique-se que o service exporta createOrder

type PaymentMethod = 'credit_card' | 'pix' | 'boleto';

export default function PaymentSelection() {
    const navigate = useNavigate();
    const location = useLocation();

    // 1. DADOS DO CONTEXTO
    const { totalPrice, cart, clearCart } = useCart();

    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('credit_card');
    const [isCardModalOpen, setIsCardModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState<{ brand: string, lastFour: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Recupera o ID do endereço vindo da etapa anterior
    const addressId = location.state?.addressId;

    // Cálculos dinâmicos
    const pixDiscount = useMemo(() => totalPrice * 0.05, [totalPrice]);
    const finalPrice = useMemo(() => {
        return selectedMethod === 'pix' ? totalPrice - pixDiscount : totalPrice;
    }, [selectedMethod, totalPrice, pixDiscount]);

    const handleMethodSelect = (method: PaymentMethod) => {
        setSelectedMethod(method);
        if (method === 'credit_card') {
            setIsCardModalOpen(true);
        }
    };

    const handleCardPick = (card: any) => {
        setSelectedCard({ brand: card.brand, lastFour: card.lastFour });
        setIsCardModalOpen(false);
    };

    // 2. FUNÇÃO DE FINALIZAÇÃO INTEGRADA COM O BANCO
    const handleFinishOrder = async () => {
        if (!addressId) {
            toast.error("Endereço de entrega não selecionado.");
            return navigate('/endereco');
        }

        if (selectedMethod === 'credit_card' && !selectedCard) {
            return toast.error('Por favor, selecione um cartão de crédito.');
        }

        try {
            setIsSubmitting(true);

            // Determina o status com base no método selecionado
            let orderStatus = 'PENDENTE';

            if (selectedMethod === 'credit_card') {
                // No cartão, simulamos uma aprovação imediata (ou enviamos como processando)
                orderStatus = 'PAGO';
            } else if (selectedMethod === 'pix') {
                // No PIX, fica aguardando o pagamento do QR Code
                orderStatus = 'AGUARDANDO_PIX';
            } else if (selectedMethod === 'boleto') {
                // No boleto, aguarda compensação bancária
                orderStatus = 'AGUARDANDO_BOLETO';
            }

            // Prepara o payload para o NestJS
            const orderPayload = {
                address_id: Number(addressId),
                status: orderStatus, // Enviando o status dinâmico
                items: cart.map(item => ({
                    product_id: Number(item.id),
                    variation_id: item.variation_id ? Number(item.variation_id) : null,
                    quantity: item.quantity
                }))
            };

            // Chamada para o seu serviço de API
            const response = await createOrder(orderPayload);

            if (response) {
                // Feedback personalizado baseado no status
                if (orderStatus === 'PAGO') {
                    toast.success("Pagamento aprovado! Seu pedido já está em separação.");
                } else if (orderStatus === 'AGUARDANDO_PIX') {
                    toast.success("Pedido gerado! Pague o PIX para confirmar.");
                } else {
                    toast.success("Pedido realizado! Aguardando compensação do boleto.");
                }

                clearCart(); // Limpa o Context e LocalStorage

                // Redireciona para Meus Pedidos
                navigate('/meus-pedidos');
            }

        } catch (error: any) {
            console.error("Erro ao criar pedido:", error);
            const errorMsg = error.response?.data?.message || "Erro ao processar sua compra.";
            toast.error(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-10 font-sans text-zinc-900 leading-none">
            <header className="max-w-6xl mx-auto mb-10 flex items-center justify-between leading-none">
                <div className="flex items-center gap-4 leading-none">
                    <Link to="/endereco" className="p-3 bg-white border border-zinc-200 rounded-2xl hover:bg-zinc-50 transition-all shadow-sm text-zinc-900 leading-none">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="text-left leading-none">
                        <h1 className="text-2xl font-black uppercase tracking-tight italic leading-none">Checkout <span className="text-yellow-600">Final</span></h1>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic leading-none mt-1">Selecione sua forma de pagamento</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-xl text-white">
                    <Lock size={12} className="text-yellow-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest leading-none">Segurança Total</span>
                </div>
            </header>

            <main className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-12 items-start italic leading-none">
                {/* COLUNA DA ESQUERDA: MÉTODOS */}
                <div className="lg:col-span-7 space-y-4 leading-none">
                    <div
                        onClick={() => !isSubmitting && handleMethodSelect('credit_card')}
                        className={`group relative bg-white p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer leading-none ${selectedMethod === 'credit_card' ? 'border-yellow-500 shadow-xl ring-4 ring-yellow-500/5' : 'border-transparent hover:border-zinc-200 shadow-sm'
                            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <div className="flex items-center justify-between leading-none">
                            <div className="flex items-center gap-6 leading-none">
                                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-colors ${selectedMethod === 'credit_card' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-400'}`}>
                                    <CreditCard size={32} />
                                </div>
                                <div className="text-left leading-none">
                                    <h3 className="font-black uppercase italic text-lg tracking-tight leading-none">Cartão de Crédito</h3>
                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider italic mt-1 leading-none">
                                        {selectedCard ? `${selectedCard.brand} • Final ${selectedCard.lastFour}` : 'Pague em até 12x sem juros'}
                                    </p>
                                </div>
                            </div>
                            {selectedMethod === 'credit_card' && selectedCard && <CheckCircle2 size={24} className="text-yellow-500" fill="currentColor" stroke="white" />}
                        </div>
                    </div>

                    <div
                        onClick={() => !isSubmitting && setSelectedMethod('pix')}
                        className={`group relative bg-white overflow-hidden rounded-[2.5rem] border-2 transition-all cursor-pointer leading-none ${selectedMethod === 'pix' ? 'border-yellow-500 shadow-xl ring-4 ring-yellow-500/5' : 'border-transparent hover:border-zinc-200 shadow-sm'
                            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <div className="p-6 flex items-center justify-between leading-none">
                            <div className="flex items-center gap-6 text-left leading-none">
                                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-colors ${selectedMethod === 'pix' ? 'bg-[#32BCAD] text-white' : 'bg-zinc-100 text-zinc-400'}`}>
                                    <QrCode size={32} />
                                </div>
                                <div className="leading-none">
                                    <h3 className="font-black uppercase italic text-lg tracking-tight leading-none">PIX Instantâneo</h3>
                                    <p className="text-xs font-black text-green-600 uppercase tracking-wider italic mt-1 leading-none">Ganha 5% de desconto automático</p>
                                </div>
                            </div>
                            {selectedMethod === 'pix' && <CheckCircle2 size={24} className="text-yellow-500" fill="currentColor" stroke="white" />}
                        </div>
                    </div>

                    <div
                        onClick={() => !isSubmitting && setSelectedMethod('boleto')}
                        className={`group relative bg-white p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer flex items-center justify-between leading-none ${selectedMethod === 'boleto' ? 'border-yellow-500 shadow-xl ring-4 ring-yellow-500/5' : 'border-transparent hover:border-zinc-200 shadow-sm'
                            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <div className="flex items-center gap-6 text-left leading-none">
                            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-colors ${selectedMethod === 'boleto' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-400'}`}>
                                <Landmark size={32} />
                            </div>
                            <div className="leading-none">
                                <h3 className="font-black uppercase italic text-lg tracking-tight leading-none">Boleto Bancário</h3>
                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider italic mt-1 leading-none">Vencimento em 1 dia útil</p>
                            </div>
                        </div>
                        {selectedMethod === 'boleto' && <CheckCircle2 size={24} className="text-yellow-500" fill="currentColor" stroke="white" />}
                    </div>
                </div>

                {/* COLUNA DA DIREITA: RESUMO DESCRITIVO */}
                <div className="lg:col-span-5 space-y-6 leading-none">
                    <div className="bg-white p-8 rounded-[3rem] border border-zinc-200 shadow-2xl relative overflow-hidden leading-none">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full -mr-16 -mt-16 blur-3xl leading-none" />

                        <div className="flex items-center gap-2 mb-8 border-b pb-4 leading-none">
                            <ShoppingBag size={18} className="text-yellow-600" />
                            <h4 className="font-black uppercase italic text-sm text-zinc-900 tracking-widest leading-none">Resumo do Pedido</h4>
                        </div>

                        {/* LISTA DESCRITIVA DE ITENS */}
                        <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar mb-8 leading-none">
                            {cart.map((item, idx) => (
                                <div key={`${item.id}-${idx}`} className="flex items-center justify-between gap-4 group leading-none">
                                    <div className="flex items-center gap-4 leading-none">
                                        <div className="w-12 h-14 bg-zinc-50 rounded-xl overflow-hidden flex-shrink-0 border border-zinc-100 leading-none">
                                            <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                                        </div>
                                        <div className="text-left leading-none">
                                            <h5 className="font-black uppercase italic text-[11px] text-zinc-800 line-clamp-1 leading-none">{item.name}</h5>
                                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter italic mt-1 leading-none">
                                                Quantidade: {item.quantity} • Tam: {item.size || 'UN'}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="font-black text-[11px] text-zinc-900 italic leading-none">
                                        R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* TOTAIS */}
                        <div className="space-y-4 border-t pt-6 leading-none">
                            <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
                                <span>Subtotal Bruto</span>
                                <span className="text-zinc-900 font-black">R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>

                            {selectedMethod === 'pix' && (
                                <div className="flex justify-between text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 p-2 rounded-lg border border-green-100 leading-none">
                                    <span>Desconto PIX (5%)</span>
                                    <span>- R$ {pixDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
                                <span>Frete Logístico</span>
                                <span className="text-green-500 font-black">GRÁTIS</span>
                            </div>

                            <div className="pt-6 border-t flex justify-between items-end leading-none">
                                <div className="flex flex-col text-left leading-none">
                                    <span className="text-[10px] font-black uppercase text-zinc-400 italic mb-1 leading-none">Valor Total</span>
                                    <span className="text-4xl font-black text-yellow-600 italic tracking-tighter leading-none">
                                        R$ {finalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleFinishOrder}
                            disabled={isSubmitting || cart.length === 0}
                            className="w-full mt-8 bg-zinc-900 text-white py-6 rounded-3xl font-black uppercase italic text-sm hover:bg-yellow-600 transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed leading-none"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="animate-spin" size={18} /> Processando...</>
                            ) : (
                                <>Confirmar Pagamento <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] border border-zinc-200 flex items-center gap-4 shadow-sm leading-none">
                        <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 border border-zinc-100 leading-none"><ShieldCheck size={20} /></div>
                        <div className="text-left leading-tight">
                            <p className="text-[9px] font-black uppercase text-zinc-900 leading-none">Compra Criptografada</p>
                            <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-tighter mt-1 leading-none">Seus dados estão protegidos por SSL de 256 bits</p>
                        </div>
                    </div>
                </div>
            </main>

            <CreditCardModal
                isOpen={isCardModalOpen}
                onClose={() => setIsCardModalOpen(false)}
                onSelectCard={handleCardPick}
            />
        </div>
    );
}