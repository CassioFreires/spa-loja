import { useState, useEffect } from 'react';
import { X, Save, Layers, Loader2 } from 'lucide-react';
import { useEditProduct } from '../../hooks/useEditProduct';

interface EditProductModalProps {
    product: any;
    isOpen: boolean;
    onClose: () => void;
}

export default function EditProductModal({ product, isOpen, onClose }: EditProductModalProps) {
    const mutation = useEditProduct();
    const [formData, setFormData] = useState<any>(null);
    const [variations, setVariations] = useState<any[]>([]);

    // Inicializa os dados quando o modal abre
    useEffect(() => {
        if (product && isOpen) {
            setFormData({
                name: product.name,
                price: product.price,
                description: product.description,
                stock: product.stock || 0
            });
            setVariations(product.variations || []);
        }
    }, [product, isOpen]);

    if (!isOpen || !formData) return null;

    const handleVariationChange = (id: number, field: string, value: any) => {
        setVariations(prev => prev.map(v => {
            const vId = v.id || v.variation_id;
            // A comparação estrita garante que apenas a linha correta mude
            if (Number(vId) === Number(id)) {
                return { ...v, [field]: value };
            }
            return v;
        }));
    };

    const handleSave = async () => {
        try {
            await mutation.mutateAsync({
                id: product.id,
                data: formData,
                variations: variations
            });
            onClose();
        } catch (error) {
            // Erro tratado no Hook useEditProduct
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col border border-zinc-200">

                {/* HEADER */}
                <header className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                    <div>
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900">Editar Produto</h2>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">ID: #{product.id} • {product.brand_name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </header>

                {/* FORMULÁRIO */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">

                    {/* DADOS PRINCIPAIS */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 mb-2 block">Nome do Produto</label>
                            <input
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-2xl font-bold focus:ring-2 ring-yellow-500/20 outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 mb-2 block">Preço Base (R$)</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-2xl font-black italic outline-none"
                            />
                        </div>
                        {!product.hasVariations && (
                            <div>
                                <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 mb-2 block">Estoque Total</label>
                                <input
                                    type="number"
                                    value={formData.stock}
                                    onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                    className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-2xl font-black italic outline-none"
                                />
                            </div>
                        )}
                    </section>

                    {/* GRADE DE VARIAÇÕES */}
                    {product.hasVariations && (
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Layers size={18} className="text-yellow-600" />
                                <h3 className="font-black text-xs uppercase tracking-widest">Gestão da Grade (Estoque por Item)</h3>
                            </div>

                            <div className="border border-zinc-100 rounded-3xl overflow-hidden bg-white">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-zinc-50 text-zinc-400 font-black uppercase">
                                        <tr>
                                            <th className="p-4">Variação</th>
                                            <th className="p-4">SKU</th>
                                            <th className="p-4 text-center">Estoque</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-50">
                                        {variations.map((v) => {
                                            const variationId = v.id || v.variation_id;
                                            {/* Removido qualquer espaço entre tags para evitar erro de Hydration */}
                                            return (
                                                <tr key={variationId}>
                                                    <td className="p-4 font-bold text-zinc-900 uppercase">
                                                        {v.type}: {v.value}
                                                    </td>
                                                    <td className="p-4">
                                                        <input
                                                            value={v.sku || ''}
                                                            onChange={e => handleVariationChange(variationId, 'sku', e.target.value)}
                                                            className="w-full bg-zinc-50 border-none p-2 rounded-lg font-mono text-[10px]"
                                                        />
                                                    </td>
                                                    <td className="p-4 w-24">
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            value={v.stock}
                                                            onChange={e => handleVariationChange(variationId, 'stock', Number(e.target.value))}
                                                            className="w-full bg-zinc-900 text-white p-2 rounded-lg text-center font-black"
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}
                </div>

                {/* FOOTER */}
                <footer className="p-8 border-t border-zinc-100 bg-white flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-4 text-xs font-black uppercase italic text-zinc-400 hover:text-zinc-900 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={mutation.isPending}
                        className="bg-zinc-950 text-white px-10 py-4 rounded-2xl font-black uppercase italic text-xs flex items-center gap-2 hover:bg-yellow-500 hover:text-black transition-all disabled:opacity-50 shadow-xl"
                    >
                        {mutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        Salvar Alterações
                    </button>
                </footer>
            </div>
        </div>
    );
}