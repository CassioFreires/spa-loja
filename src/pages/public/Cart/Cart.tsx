import { useMemo } from 'react';
import {
    Trash2, Plus, Minus, ArrowRight, ShoppingBag,
    ChevronLeft, ShieldCheck, Truck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';

/**
 * Componente de Carrinho de Compras
 * Focado em alta performance, SEO semântico e acessibilidade.
 * Mantém integridade total com CartContext e AuthContext.
 */
export default function Cart() {
    const navigate = useNavigate();
    const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
    const { isAuthenticated } = useAuth();

    // Regra de negócio preservada: Logística gratuita
    const shipping = 0.00;
    const totalFinal = useMemo(() => totalPrice + shipping, [totalPrice, shipping]);

    // SEO: JSON-LD para auxiliar IAs e Buscadores a entenderem o contexto da página
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CheckoutPage",
        "name": "Carrinho de Compras - Gold Store",
        "description": "Finalize sua compra de itens Premium Selection.",
        "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "BRL",
            "offerCount": totalItems
        }
    };

    /**
     * Lógica de Direcionamento de Checkout
     * Se autenticado -> Endereço
     * Se não autenticado -> Identificação de Visitante
     */
    const handleCheckoutClick = () => {
        if (isAuthenticated) {
            navigate('/endereco');
        } else {
            navigate('/identificacao');
        }
    };

    // View: Carrinho Vazio
    if (cart.length === 0) {
        return (
            <main className="min-h-screen bg-[#F8F9FB] flex flex-col items-center justify-center p-6 text-center">
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-xl border border-zinc-100 mb-6 mx-auto">
                        <ShoppingBag className="w-10 h-10 text-zinc-200" aria-hidden="true" />
                    </div>
                    <h1 className="text-3xl font-black uppercase italic text-zinc-900 tracking-tighter mb-2">
                        Seu carrinho está vazio
                    </h1>
                    <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-8 italic">
                        Escolha produtos com qualidade Gold Store.
                    </p>
                    <Link
                        to="/"
                        className="inline-block bg-zinc-900 text-white px-10 py-5 rounded-2xl font-black uppercase italic hover:bg-yellow-600 transition-all shadow-xl active:scale-95 focus:ring-4 focus:ring-yellow-500/20 outline-none"
                    >
                        Voltar para a Loja
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F8F9FB] px-4 md:px-8 py-12 font-sans italic leading-none">
            {/* SEO Structured Data */}
            <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

            <Toaster position="top-center" />

            <div className="max-w-[1440px] mx-auto">
                {/* Header Semântico */}
                <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="text-left">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 font-black uppercase italic text-[10px] tracking-widest text-zinc-400 hover:text-yellow-600 transition-colors mb-4 group outline-none"
                            aria-label="Voltar para a vitrine de produtos"
                        >
                            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Voltar para a vitrine
                        </button>
                        <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">
                            Meu <span className="text-yellow-500">Carrinho</span>
                        </h1>
                    </div>
                    <div className="flex flex-col items-start md:items-end bg-zinc-100/50 p-4 rounded-2xl md:bg-transparent md:p-0">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Total de Itens</span>
                        <span className="text-xl font-black text-zinc-900 italic uppercase">{totalItems} Unidades</span>
                    </div>
                </header>

                <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
                    {/* Lista de Produtos */}
                    <section className="lg:col-span-8 space-y-4" aria-label="Itens no carrinho">
                        {cart.map((item) => (
                            <article
                                key={`${item.id}-${item.variation_id}`}
                                className="group flex flex-col sm:flex-row gap-6 bg-white p-6 rounded-[2.5rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-500 items-center relative"
                            >
                                {item.discount > 0 && (
                                    <div className="absolute top-6 left-6 z-10 bg-yellow-500 text-black text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter shadow-lg animate-pulse">
                                        -{item.discount}%
                                    </div>
                                )}

                                <div className="w-32 h-40 md:w-40 md:h-48 rounded-[1.8rem] overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-50 shadow-inner">
                                    <img
                                        src={item.image}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        alt={`Produto: ${item.name}`}
                                        loading="lazy"
                                    />
                                </div>

                                <div className="flex-grow space-y-1 md:space-y-3 text-center sm:text-left">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-600 italic">Premium Selection</span>
                                        {item.size && (
                                            <span className="text-[10px] font-black uppercase bg-zinc-100 px-3 py-1 rounded-full text-zinc-500 italic border border-zinc-200">
                                                TAM: {item.size}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-black uppercase italic text-zinc-900 text-xl md:text-2xl leading-none">{item.name}</h3>

                                    <div className="flex items-center justify-center sm:justify-start gap-6 pt-2">
                                        <div className="flex items-center bg-zinc-50 rounded-2xl p-1.5 border border-zinc-100 shadow-inner">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.variation_id, -1)}
                                                className="p-2 hover:bg-white rounded-xl hover:text-yellow-600 transition-all focus:ring-2 focus:ring-yellow-500/20"
                                                aria-label="Diminuir quantidade"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="w-10 text-center font-black text-lg italic" aria-label={`Quantidade: ${item.quantity}`}>
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.variation_id, 1)}
                                                className="p-2 hover:bg-white rounded-xl hover:text-yellow-600 transition-all focus:ring-2 focus:ring-yellow-500/20"
                                                aria-label="Aumentar quantidade"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.id, item.variation_id)}
                                            className="flex items-center gap-2 text-zinc-300 hover:text-red-500 transition-all font-black uppercase italic text-[10px] tracking-widest group/trash outline-none"
                                        >
                                            <Trash2 size={18} className="group-hover/trash:animate-bounce" />
                                            <span className="hidden sm:inline">Remover</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="sm:text-right flex flex-col justify-center sm:border-l sm:pl-8 border-zinc-100 min-w-[140px]">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase italic mb-1 tracking-widest">Subtotal</span>
                                    {item.discount > 0 && (
                                        <span className="text-[11px] font-bold text-zinc-300 line-through mb-1">
                                            R$ {(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    )}
                                    <span className="block text-2xl md:text-3xl font-black text-zinc-900 tracking-tighter italic">
                                        R$ {(item.sale_price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </article>
                        ))}
                    </section>

                    {/* Resumo Financeiro (Sidebar) */}
                    <aside className="lg:col-span-4">
                        <div className="bg-zinc-900 rounded-[3rem] p-8 md:p-10 text-white sticky top-12 md:top-24 shadow-2xl border border-zinc-800 overflow-hidden relative group transition-transform duration-500">
                            <h2 className="text-2xl font-black uppercase italic mb-10 border-b border-white/5 pb-6 tracking-tighter text-left">
                                Checkout <span className="text-yellow-500">Financeiro</span>
                            </h2>

                            <div className="space-y-6 mb-10 text-left">
                                <div className="flex justify-between font-bold text-zinc-400 uppercase text-[10px] tracking-[0.3em]">
                                    <span>Total Bruto</span>
                                    <span className="text-white">R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between font-bold text-zinc-400 uppercase text-[10px] tracking-[0.3em]">
                                    <span>Logística</span>
                                    <span className="text-green-400 font-black uppercase">Grátis</span>
                                </div>

                                <div className="pt-8 border-t border-white/10 flex flex-col text-left">
                                    <span className="font-black uppercase italic text-xs tracking-widest text-yellow-500 mb-1">Valor Final</span>
                                    <span className="text-5xl font-black text-white tracking-tighter leading-none italic">
                                        R$ {totalFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>

                            {/* CORREÇÃO DO BOTÃO: Chamada direta da função */}
                            <button
                                onClick={handleCheckoutClick}
                                className="w-full bg-yellow-500 text-black py-7 rounded-2xl font-black uppercase italic text-sm flex items-center justify-center gap-3 hover:bg-white transition-all group active:scale-95 shadow-xl shadow-yellow-500/20 outline-none focus:ring-4 focus:ring-yellow-500/40"
                            >
                                Finalizar Pedido
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" aria-hidden="true" />
                            </button>

                            <footer className="mt-10 pt-8 border-t border-white/5 grid grid-cols-2 gap-4 opacity-50">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={16} className="text-yellow-500" />
                                    <span className="text-[8px] font-black uppercase tracking-widest leading-tight">Pagamento<br />Criptografado</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Truck size={16} className="text-yellow-500" />
                                    <span className="text-[8px] font-black uppercase tracking-widest leading-tight">Envio<br />Rastreado</span>
                                </div>
                            </footer>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}