import React, { useState } from 'react';
import { Trash2, ArrowLeft, Loader2, Percent, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFeaturedProducts } from '../../../../hooks/useFeaturedProducts';

export default function AdminFeaturedProducts() {
    const { products, featured, loading, addFeatured, removeFeatured } = useFeaturedProducts();
    const [selectedProductId, setSelectedProductId] = useState('');
    const [discount, setDiscount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleConfirmAdd = async () => {
        if (!selectedProductId || discount <= 0) return;
        setIsSubmitting(true);
        const ok = await addFeatured(selectedProductId, discount);
        if (ok) {
            setSelectedProductId('');
            setDiscount(0);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
            <header className="flex items-center gap-4 mb-10">
                <Link to="/admin/dashboard" className="p-3 bg-white border border-zinc-100 rounded-2xl hover:bg-zinc-50 transition-all shadow-sm">
                    <ArrowLeft size={20}/>
                </Link>
                <div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter">
                        Gestão de <span className="text-yellow-600">Ofertas</span>
                    </h1>
                    <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Configuração do Top 5 Vitrine</p>
                </div>
            </header>

            {/* FORMULÁRIO */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm mb-10 grid md:grid-cols-12 gap-6 items-end">
                <div className="md:col-span-6">
                    <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 tracking-widest mb-2 block">Selecionar Produto</label>
                    <select 
                        value={selectedProductId}
                        className="w-full bg-zinc-50 border-zinc-100 p-4 rounded-2xl font-bold outline-none focus:ring-4 ring-yellow-500/10 transition-all"
                        onChange={(e) => setSelectedProductId(e.target.value)}
                    >
                        <option value="">Selecione um produto cadastrado...</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                <div className="md:col-span-3">
                    <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 tracking-widest mb-2 block">Desconto %</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            value={discount || ''}
                            className="w-full bg-zinc-50 border-zinc-100 p-4 rounded-2xl font-black outline-none focus:ring-4 ring-yellow-500/10"
                            onChange={(e) => setDiscount(Number(e.target.value))}
                        />
                        <Percent size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300" />
                    </div>
                </div>
                <button 
                    onClick={handleConfirmAdd}
                    disabled={isSubmitting || loading}
                    className="md:col-span-3 bg-zinc-900 text-white p-4 rounded-2xl font-black uppercase italic hover:bg-yellow-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Star size={18} /> Fixar Destaque</>}
                </button>
            </div>

            {/* LISTAGEM */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-4">
                    <h3 className="font-black uppercase text-xs text-zinc-400 tracking-widest">Produtos na Vitrine ({featured.length}/5)</h3>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-yellow-600" size={40} /></div>
                ) : (
                    <div className="grid gap-4">
                        {featured.map((item) => (
                            <div key={item.featured_id} className="bg-white p-5 rounded-[2rem] border border-zinc-100 flex items-center justify-between group hover:border-yellow-500 transition-all shadow-sm">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-zinc-50 rounded-2xl overflow-hidden border border-zinc-100 p-1">
                                        <img src={item.image_1} className="w-full h-full object-cover rounded-xl" alt={item.name} />
                                    </div>
                                    <div>
                                        <p className="font-black text-zinc-900 uppercase italic leading-none mb-1">{item.name}</p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-zinc-400 line-through text-[10px] font-bold">R$ {Number(item.price).toFixed(2)}</span>
                                            <span className="text-green-600 text-xs font-black italic">R$ {Number(item.sale_price).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="bg-yellow-50 text-yellow-600 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter italic">
                                        -{item.discount_percentage}% OFF
                                    </div>
                                    <button 
                                        onClick={() => removeFeatured(item.featured_id)}
                                        className="p-3 text-zinc-200 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}