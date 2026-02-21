import { useState, useMemo, useRef, useEffect } from 'react';
import { Trash2, ArrowLeft, Loader2, Percent, Star, Search, ChevronDown, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFeaturedProducts } from '../../../../hooks/useFeaturedProducts';
import toast from 'react-hot-toast';

export default function AdminFeaturedProducts() {
    const { products, featured, loading, addFeatured, removeFeatured } = useFeaturedProducts();
    const [selectedProductId, setSelectedProductId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false); // Controla o dropdown customizado
    const [discount, setDiscount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fecha o dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    const selectedProduct = useMemo(() => 
        products.find(p => String(p.id) === selectedProductId),
    [products, selectedProductId]);

    const handleConfirmAdd = async () => {
        if (!selectedProductId) return toast.error("Selecione um produto");
        if (discount <= 0 || discount > 100) return toast.error("Desconto inválido");

        setIsSubmitting(true);
        const ok = await addFeatured(selectedProductId, discount);
        if (ok) {
            setSelectedProductId('');
            setSearchTerm('');
            setDiscount(0);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500 font-sans">
            <header className="flex items-center gap-4 mb-10 leading-none">
                <Link to="/admin/dashboard" className="p-3 bg-white border border-zinc-100 rounded-2xl hover:bg-zinc-50 transition-all shadow-sm">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-900">
                        Gestão de <span className="text-yellow-600">Ofertas</span>
                    </h1>
                    <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest mt-1">Configuração do Top 5 Vitrine</p>
                </div>
            </header>

            {/* FORMULÁRIO DE ADIÇÃO */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm mb-10 grid md:grid-cols-12 gap-6 items-end leading-none">

                {/* SELECT CUSTOMIZADO COM BUSCA */}
                <div className="md:col-span-6 space-y-3 relative" ref={dropdownRef}>
                    <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 tracking-widest block">Selecionar Produto</label>
                    
                    {/* Gatilho do Dropdown */}
                    <div 
                        onClick={() => setIsOpen(!isOpen)}
                        className={`w-full bg-zinc-50 border ${isOpen ? 'border-yellow-500 ring-4 ring-yellow-500/5' : 'border-zinc-100'} p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-all hover:bg-zinc-100/50`}
                    >
                        <span className={`text-sm font-bold ${!selectedProduct ? 'text-zinc-400' : 'text-zinc-900'}`}>
                            {selectedProduct ? selectedProduct.name : "Selecione um produto..."}
                        </span>
                        <ChevronDown size={18} className={`text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Lista do Dropdown */}
                    {isOpen && (
                        <div className="absolute z-50 w-full mt-2 bg-white border border-zinc-100 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 origin-top">
                            <div className="p-3 border-b border-zinc-50 bg-zinc-50/50">
                                <div className="relative">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    <input
                                        type="text"
                                        autoFocus
                                        placeholder="Filtrar por nome..."
                                        className="w-full bg-white border border-zinc-200 p-3 pl-10 rounded-xl text-xs font-bold outline-none focus:border-yellow-500 transition-all"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((p) => (
                                        <div
                                            key={p.id}
                                            onClick={() => {
                                                setSelectedProductId(String(p.id));
                                                setIsOpen(false);
                                                setSearchTerm('');
                                            }}
                                            className="flex items-center justify-between p-4 hover:bg-zinc-50 cursor-pointer group transition-colors border-b border-zinc-50 last:border-none"
                                        >
                                            <div className="flex items-center gap-3">
                                                <img src={p.image_1} className="w-8 h-8 rounded-lg object-cover border border-zinc-100" alt="" />
                                                <div>
                                                    <p className="text-xs font-black uppercase text-zinc-800 group-hover:text-yellow-600 transition-colors">{p.name}</p>
                                                    <p className="text-[10px] font-bold text-zinc-400">R$ {Number(p.price).toFixed(2)}</p>
                                                </div>
                                            </div>
                                            {String(p.id) === selectedProductId && <Check size={16} className="text-yellow-600" />}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-10 text-center">
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Nenhum produto encontrado</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* DESCONTO */}
                <div className="md:col-span-3 space-y-3">
                    <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 tracking-widest block">Desconto %</label>
                    <div className="relative">
                        <input
                            type="number"
                            value={discount || ''}
                            placeholder="Ex: 20"
                            className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-2xl font-black outline-none focus:ring-4 ring-yellow-500/10 text-sm"
                            onChange={(e) => setDiscount(Number(e.target.value))}
                        />
                        <Percent size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300" />
                    </div>
                </div>

                {/* BOTÃO */}
                <button
                    onClick={handleConfirmAdd}
                    disabled={isSubmitting || loading || !selectedProductId}
                    className="md:col-span-3 bg-zinc-900 text-white h-[58px] rounded-2xl font-black uppercase italic hover:bg-yellow-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg active:scale-95"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Star size={18} /> Fixar Oferta</>}
                </button>
            </div>

            {/* LISTAGEM DOS DESTAQUES ATUAIS */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-4">
                    <h3 className="font-black uppercase text-[10px] text-zinc-400 tracking-[0.2em] italic">Ofertas Ativas na Vitrine ({featured.length})</h3>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-yellow-600" size={40} /></div>
                ) : (
                    <div className="grid gap-4 leading-none">
                        {featured.map((item) => (
                            <div key={item.featured_id} className="bg-white p-5 rounded-[2rem] border border-zinc-100 flex items-center justify-between group hover:border-yellow-500 transition-all shadow-sm">
                                <div className="flex items-center gap-6 text-left">
                                    <div className="w-16 h-16 bg-zinc-50 rounded-2xl overflow-hidden border border-zinc-100 p-1 flex-shrink-0">
                                        <img src={item.image_1} className="w-full h-full object-cover rounded-xl" alt={item.name} />
                                    </div>
                                    <div>
                                        <p className="font-black text-zinc-900 uppercase italic text-sm mb-1">{item.name}</p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-zinc-400 line-through text-[10px] font-bold">R$ {Number(item.price).toFixed(2)}</span>
                                            <span className="text-green-600 text-xs font-black italic">R$ {Number(item.sale_price).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="bg-yellow-50 text-yellow-600 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-tighter italic border border-yellow-100">
                                        -{item.discount_percentage}% OFF
                                    </div>
                                    <button
                                        onClick={() => removeFeatured(item.featured_id)}
                                        className="p-3 text-zinc-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                                        title="Remover destaque"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {featured.length === 0 && (
                            <div className="text-center py-20 bg-zinc-50 rounded-[3rem] border-2 border-dashed border-zinc-200">
                                <p className="text-zinc-400 font-bold uppercase italic text-xs tracking-widest">Nenhum produto em oferta no momento.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}