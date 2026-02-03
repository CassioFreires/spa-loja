import React from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ChevronLeft, ShieldCheck, Truck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useCart } from '../../../context/CartContext';

export default function Cart() {
    const navigate = useNavigate();
    
    // Pegando dados reais do Contexto
    const { 
        cart, 
        removeFromCart, 
        updateQuantity, 
        totalPrice, 
        totalItems 
    } = useCart();

    const shipping = 0.00; 
    const totalFinal = totalPrice + shipping;

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-[#F8F9FB] flex flex-col items-center justify-center p-6">
                <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-xl border border-zinc-100 mb-6">
                    <ShoppingBag className="w-10 h-10 text-zinc-200" />
                </div>
                <h2 className="text-3xl font-black uppercase italic text-zinc-900 tracking-tighter mb-2">Seu carrinho está vazio</h2>
                <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-8 text-center italic">Parece que você ainda não escolheu seus produtos premium.</p>
                <Link to="/" className="bg-zinc-900 text-white px-10 py-5 rounded-2xl font-black uppercase italic hover:bg-yellow-600 transition-all shadow-xl active:scale-95">
                    Voltar para a Loja
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FB] px-4 md:px-8 py-12 font-sans">
            <Toaster position="top-center" />
            
            <div className="max-w-[1440px] mx-auto">
                <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 text-left">
                    <div>
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-black uppercase italic text-[10px] tracking-widest text-zinc-400 hover:text-yellow-600 transition-colors mb-4">
                            <ChevronLeft size={16} /> Voltar para a vitrine
                        </button>
                        <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">
                            Meu <span className="text-yellow-500">Carrinho</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Total de Itens</span>
                            <span className="text-xl font-black text-zinc-900 italic uppercase leading-none">{totalItems} Unidades</span>
                        </div>
                    </div>
                </header>

                <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
                    <div className="lg:col-span-8 space-y-4">
                        {cart.map(item => (
                            <div key={`${item.id}-${item.size}`} className="group flex flex-col sm:flex-row gap-6 bg-white p-6 rounded-[2.5rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-500 items-center">
                                <div className="w-32 h-40 md:w-40 md:h-48 rounded-[1.8rem] overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-50 relative">
                                    <img 
                                        src={item.image} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                        alt={item.name} 
                                    />
                                </div>
                                
                                <div className="flex-grow space-y-1 md:space-y-3 text-center sm:text-left">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-600 italic">Premium Selection</span>
                                        {item.size && (
                                            <span className="text-[10px] font-black uppercase bg-zinc-100 px-3 py-1 rounded-full text-zinc-500 italic border border-zinc-200">TAM: {item.size}</span>
                                        )}
                                    </div>
                                    <h3 className="font-black uppercase italic text-zinc-900 text-xl md:text-2xl leading-none">{item.name}</h3>
                                    
                                    <div className="flex items-center justify-center sm:justify-start gap-6 pt-2">
                                        <div className="flex items-center bg-zinc-50 rounded-2xl p-1.5 border border-zinc-100 shadow-inner">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-white rounded-xl hover:text-yellow-600 transition-all"><Minus size={16}/></button>
                                            <span className="w-10 text-center font-black text-lg italic">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-white rounded-xl hover:text-yellow-600 transition-all"><Plus size={16}/></button>
                                        </div>
                                        
                                        <button onClick={() => removeFromCart(item.id)} className="flex items-center gap-2 text-zinc-300 hover:text-red-500 transition-all font-black uppercase italic text-[10px] tracking-widest group/trash">
                                            <Trash2 size={18} className="group-hover/trash:animate-bounce" />
                                            Remover
                                        </button>
                                    </div>
                                </div>

                                <div className="sm:text-right flex flex-col justify-center sm:border-l sm:pl-8 border-zinc-100">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase italic mb-1 tracking-widest">Valor Acumulado</span>
                                    <span className="block text-2xl md:text-3xl font-black text-zinc-900 tracking-tighter italic">
                                        R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <aside className="lg:col-span-4">
                        <div className="bg-zinc-900 rounded-[3rem] p-8 md:p-10 text-white sticky top-24 shadow-2xl border border-zinc-800 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-yellow-500/20 transition-all" />
                            
                            <h3 className="text-2xl font-black uppercase italic mb-10 border-b border-white/5 pb-6 tracking-tighter flex items-center gap-3">
                                Resumo <span className="text-yellow-500">Financeiro</span>
                            </h3>

                            <div className="space-y-6 mb-10 text-left">
                                <div className="flex justify-between font-bold text-zinc-400 uppercase text-[10px] tracking-[0.3em]">
                                    <span>Subtotal Bruto</span>
                                    <span className="text-white">R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between font-bold text-zinc-400 uppercase text-[10px] tracking-[0.3em]">
                                    <span>Logística / Frete</span>
                                    <span className="text-green-400 font-black">Grátis</span>
                                </div>
                                
                                <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <span className="font-black uppercase italic text-xs tracking-widest text-yellow-500 mb-1">Total a pagar</span>
                                        <span className="text-5xl font-black text-white tracking-tighter leading-none italic">
                                            R$ {totalFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button 
                                    onClick={() => navigate('/endereco')}
                                    className="w-full bg-yellow-500 text-black py-7 rounded-2xl font-black uppercase italic text-sm flex items-center justify-center gap-3 hover:bg-white transition-all group active:scale-95 shadow-xl shadow-yellow-500/20"
                                >
                                    Finalizar Pedido
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                </button>
                            </div>

                            <div className="mt-10 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-zinc-500">
                                    <ShieldCheck size={16} />
                                    <span className="text-[8px] font-black uppercase tracking-widest leading-tight">Checkout<br/>Criptografado</span>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-500">
                                    <Truck size={16} />
                                    <span className="text-[8px] font-black uppercase tracking-widest leading-tight">Entrega<br/>Rastreada</span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}