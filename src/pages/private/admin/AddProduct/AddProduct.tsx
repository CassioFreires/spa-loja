import React, { useEffect, useState, useMemo } from 'react';
import { ArrowLeft, Image as ImageIcon, Plus, Save, Upload, ListTree, Trash2, Layers, Wand2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { z } from 'zod';

import { getSubcategories } from '../../../../services/Subcategories/subcategories';
import { getBrands } from '../../../../services/Brands/brands';
import { SelectSearch } from '../../../../components/Selects/SelectSearch/SelectSearch';
import {
    createProduct,
    createProductVariation,
    getVariantOptions,
    getVariationTypes
} from '../../../../services/Products/products';

const MySwal = withReactContent(Swal);

// --- SCHEMAS DE VALIDAÇÃO ---
const productSchema = z.object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
    price: z.coerce.number().positive("O preço deve ser maior que zero"),
    brand_id: z.string().min(1, "Selecione uma marca"),
    category_id: z.string().min(1, "Selecione uma categoria"),
    stock: z.coerce.number().min(0),
});

interface VariationRow {
    variation_type_id: string;
    variant_option_id: string;
    stock: number;
    extra_price: number;
    sku: string;
}

export default function AdminAddProduct() {
    const navigate = useNavigate();

    const [categories, setCategories] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [dbVariationTypes, setDbVariationTypes] = useState<any[]>([]);
    const [dbOptions, setDbOptions] = useState<any[]>([]);

    const [mainImage, setMainImage] = useState<File | null>(null);
    const [gallery, setGallery] = useState<File[]>([]);
    const [hasVariations, setHasVariations] = useState(false);
    const [variations, setVariations] = useState<VariationRow[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '', description: '', price: '', stock: 0,
        brand_id: '', category_id: '', subcategory_id: '', active: true
    });

    useEffect(() => {
        async function loadInitialData() {
            try {
                const [cats, brs, types, opts] = await Promise.all([
                    getSubcategories(), getBrands(), getVariationTypes(), getVariantOptions()
                ]);
                setCategories(cats); setBrands(brs); setDbVariationTypes(types); setDbOptions(opts);
            } catch (error) { toast.error("Erro ao carregar dados de suporte."); }
        }
        loadInitialData();
    }, []);

    const brandOptions = useMemo(() => brands.map(b => ({ value: String(b.id), label: b.name })), [brands]);
    const categoryOptions = useMemo(() => categories.map(c => ({ value: String(c.id), label: c.name })), [categories]);
    const variationTypeOptions = useMemo(() => dbVariationTypes.map(t => ({ value: String(t.id), label: t.name })), [dbVariationTypes]);

    const subcategoryOptions = useMemo(() => {
        const selectedCat = categories.find(c => String(c.id) === formData.category_id);
        return selectedCat?.subcategories?.map((s: any) => ({ value: String(s.id), label: s.name })) || [];
    }, [categories, formData.category_id]);

    const addVariationRow = () => {
        setVariations([...variations, { variation_type_id: '', variant_option_id: '', stock: 0, extra_price: 0, sku: '' }]);
    };

    const updateVariation = (index: number, field: keyof VariationRow, val: any) => {
        const upd = [...variations];
        upd[index] = { ...upd[index], [field]: val };
        if (field === 'variation_type_id') upd[index].variant_option_id = '';
        setVariations(upd);
    };

    const generateSKU = (index: number) => {
        const row = variations[index];
        const option = dbOptions.find(o => String(o.id) === row.variant_option_id);
        if (!formData.name || !option) return toast.error("Preencha o nome e o valor da variação.");
        const newSku = `${formData.name.substring(0, 3).toUpperCase()}-${option.value.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
        updateVariation(index, 'sku', newSku);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Validação do Produto
        const result = productSchema.safeParse(formData);
        if (!result.success) return toast.error(result.error.issues[0].message);
        if (!mainImage) return toast.error("A foto principal é obrigatória.");

        // 2. Validação Rigorosa da Grade
        if (hasVariations) {
            if (variations.length === 0) return toast.error("A grade está ativada, mas não há variações adicionadas.");
            
            const invalidRow = variations.find(v => !v.variation_type_id || !v.variant_option_id || v.stock <= 0 || !v.sku);
            if (invalidRow) {
                return MySwal.fire({
                    title: 'Dados Incompletos na Grade',
                    text: 'Todas as variações devem ter Atributo, Valor, SKU e uma Quantidade maior que 0.',
                    icon: 'error',
                    confirmButtonColor: '#000'
                });
            }
        } else {
            if (formData.stock <= 0) {
                const confirmZeroStock = await MySwal.fire({
                    title: 'Estoque Zerado?',
                    text: "Você está enviando um produto com estoque 0. Continuar?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sim, enviar zerado',
                    cancelButtonText: 'Não, vou ajustar'
                });
                if (!confirmZeroStock.isConfirmed) return;
            } else {
                const confirmNoVariation = await MySwal.fire({
                    title: 'Enviar sem Grade?',
                    text: `O produto será criado com estoque fixo de ${formData.stock} unidades.`,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Sim, publicar',
                    cancelButtonText: 'Cancelar'
                });
                if (!confirmNoVariation.isConfirmed) return;
            }
        }

        // 3. Confirmação Final
        const finalConfirm = await MySwal.fire({
            title: 'Tudo pronto?',
            text: `Confirmar a publicação de "${formData.name}"?`,
            icon: 'success',
            showCancelButton: true,
            confirmButtonColor: '#ca8a04',
            confirmButtonText: 'Sim, Publicar Agora!'
        });

        if (!finalConfirm.isConfirmed) return;

        setIsSaving(true);
        const loadingToast = toast.loading("Salvando produto...");

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description || '');
            data.append('price', String(formData.price || 0));
            data.append('category_id', String(formData.category_id));
            data.append('subcategory_id', String(formData.subcategory_id || ''));
            data.append('brand_id', String(formData.brand_id));
            data.append('stock', String(hasVariations ? 0 : (formData.stock || 0)));
            data.append('active', String(formData.active));

            if (mainImage) data.append('image_1', mainImage);
            gallery.forEach((file, i) => { if (i < 5) data.append(`image_${i + 2}`, file); });

            const productRes = await createProduct(data);
            const productId = productRes.id || (Array.isArray(productRes) ? productRes[0]?.id : productRes?.id);

            if (hasVariations && productId && variations.length > 0) {
                await Promise.all(variations.map(v =>
                    createProductVariation({
                        product_id: Number(productId),
                        variant_option_id: Number(v.variant_option_id),
                        stock: Number(v.stock),
                        extra_price: Number(v.extra_price),
                        sku: v.sku
                    })
                ));
            }

            toast.success("Produto publicado com sucesso!", { id: loadingToast });
            setTimeout(() => navigate('/admin/dashboard'), 1000);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Erro no servidor", { id: loadingToast });
        } finally { setIsSaving(false); }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-8 font-sans text-zinc-900">
            <Toaster position="top-center" />
            <header className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link to="/admin/dashboard" className="p-2 bg-white border rounded-xl hover:bg-zinc-100 shadow-sm">
                        <ArrowLeft size={18} />
                    </Link>
                    <h1 className="text-xl font-black uppercase italic tracking-tight">Novo <span className="text-yellow-600">Produto</span></h1>
                </div>
                <button form="product-form" type="submit" disabled={isSaving} className="bg-zinc-900 text-white px-6 py-3 rounded-xl font-black uppercase italic text-xs flex items-center gap-2 hover:bg-yellow-600 transition-all disabled:opacity-50">
                    {isSaving ? "Salvando..." : <><Save size={16} /> Publicar</>}
                </button>
            </header>

            <form id="product-form" onSubmit={handleSubmit} className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-6">

                {/* IMAGENS */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm">
                        <h4 className="text-[10px] font-black uppercase text-zinc-400 mb-4 tracking-widest flex items-center gap-2"><ImageIcon size={14} /> Foto Principal</h4>
                        <label className="group relative aspect-[3/4] bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:border-yellow-500 transition-all">
                            {mainImage ? <img src={URL.createObjectURL(mainImage)} className="w-full h-full object-cover" /> : <div className="text-center text-zinc-300"><Upload size={32} /><span className="text-[10px] font-bold uppercase mt-2">Upload</span></div>}
                            <input type="file" className="hidden" accept="image/*" onChange={e => setMainImage(e.target.files?.[0] || null)} />
                        </label>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm">
                        <h4 className="text-[10px] font-black uppercase text-zinc-400 mb-4 tracking-widest flex items-center gap-2"><Layers size={14} /> Galeria</h4>
                        <div className="grid grid-cols-3 gap-2">
                            {gallery.map((file, i) => (
                                <div key={i} className="aspect-square rounded-lg border relative overflow-hidden group">
                                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => setGallery(gallery.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                                </div>
                            ))}
                            {gallery.length < 5 && <label className="aspect-square bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-lg flex items-center justify-center text-zinc-300 cursor-pointer hover:border-yellow-500 transition-all"><Plus size={20} /><input type="file" multiple className="hidden" accept="image/*" onChange={e => setGallery([...gallery, ...Array.from(e.target.files || [])].slice(0, 5))} /></label>}
                        </div>
                    </div>
                </div>

                {/* DADOS */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white p-6 md:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-8">
                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 tracking-wider">Nome do Item</label>
                                <input required placeholder="Ex: Tênis Adidas Forum Low" className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-xl font-bold focus:ring-2 ring-yellow-500/20 outline-none text-zinc-900" onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <SelectSearch label="Marca" options={brandOptions} value={formData.brand_id} onChange={id => setFormData({ ...formData, brand_id: id })} />
                            <div>
                                <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 tracking-wider">Preço (R$)</label>
                                <input type="number" step="0.01" className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-xl font-black text-lg outline-none focus:border-yellow-500 text-zinc-900" onChange={e => setFormData({ ...formData, price: e.target.value })} />
                            </div>
                            <SelectSearch label="Categoria" options={categoryOptions} value={formData.category_id} onChange={id => setFormData({ ...formData, category_id: id, subcategory_id: '' })} />
                            <SelectSearch label="Subcategoria" options={subcategoryOptions} value={formData.subcategory_id} disabled={!formData.category_id} onChange={id => setFormData({ ...formData, subcategory_id: id })} />
                        </div>

                        {/* GRADE DE INVENTÁRIO */}
                        <div className="pt-6 border-t border-zinc-100">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <ListTree size={18} className="text-yellow-600" />
                                    <h3 className="font-black text-xs uppercase tracking-widest">Grade de Tamanhos / Cores</h3>
                                </div>
                                <button type="button" onClick={() => setHasVariations(!hasVariations)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all shadow-sm ${hasVariations ? 'bg-red-50 text-red-500' : 'bg-zinc-900 text-white hover:bg-yellow-600'}`}>
                                    {hasVariations ? 'Remover Grade' : 'Ativar Grade'}
                                </button>
                            </div>

                            {hasVariations ? (
                                <div className="border border-zinc-200 rounded-2xl bg-white overflow-hidden">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-zinc-50 border-b border-zinc-200">
                                                <th className="p-4 text-[9px] font-black uppercase text-zinc-400 tracking-widest">Atributo</th>
                                                <th className="p-4 text-[9px] font-black uppercase text-zinc-400 tracking-widest">Valor</th>
                                                <th className="p-4 text-[9px] font-black uppercase text-zinc-400 tracking-widest">SKU</th>
                                                <th className="p-4 text-[9px] font-black uppercase text-zinc-400 tracking-widest text-center">Qtd</th>
                                                <th className="p-4 w-12 text-center"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {variations.map((v, i) => (
                                                <tr key={i} className="hover:bg-zinc-50/50 transition-colors">
                                                    <td className="p-2 min-w-[140px]">
                                                        <SelectSearch label="" options={variationTypeOptions} value={v.variation_type_id} onChange={id => updateVariation(i, 'variation_type_id', id)} />
                                                    </td>
                                                    <td className="p-2 min-w-[140px]">
                                                        <SelectSearch
                                                            label=""
                                                            options={dbOptions.filter(o => String(o.variation_type_id) === v.variation_type_id).map(o => ({ value: String(o.id), label: o.value }))}
                                                            value={v.variant_option_id}
                                                            disabled={!v.variation_type_id}
                                                            onChange={id => updateVariation(i, 'variant_option_id', id)}
                                                        />
                                                    </td>
                                                    <td className="p-2">
                                                        <div className="relative group">
                                                            <input placeholder="SKU..." className="w-full bg-white border border-zinc-200 p-3 pr-10 rounded-xl text-[10px] font-mono font-bold uppercase outline-none focus:border-yellow-500 text-zinc-900" value={v.sku} onChange={e => updateVariation(i, 'sku', e.target.value.toUpperCase())} />
                                                            <button type="button" onClick={() => generateSKU(i)} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-yellow-600 transition-colors"><Wand2 size={14} /></button>
                                                        </div>
                                                    </td>
                                                    <td className="p-2 w-24">
                                                        <input type="number" className={`w-full p-3 rounded-xl text-xs font-black text-center outline-none focus:ring-2 ring-yellow-500 ${v.stock <= 0 ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-zinc-900 text-white'}`} value={v.stock} onChange={e => updateVariation(i, 'stock', Number(e.target.value))} />
                                                    </td>
                                                    <td className="p-2 text-center">
                                                        <button type="button" onClick={() => setVariations(variations.filter((_, idx) => idx !== i))} className="p-2 text-zinc-300 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <button type="button" onClick={addVariationRow} className="w-full p-4 bg-zinc-50 text-[10px] font-black uppercase text-zinc-400 hover:bg-yellow-50 hover:text-yellow-600 transition-all border-t flex items-center justify-center gap-2">
                                        <Plus size={14} /> Adicionar Nova Linha à Grade
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-zinc-50 border border-zinc-100 rounded-3xl p-8 flex flex-col items-center justify-center">
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">Estoque Central</span>
                                    <input type="number" value={formData.stock} placeholder="Definir Qtd" className="max-w-[180px] w-full bg-white border border-zinc-200 p-4 rounded-xl font-black text-center text-lg outline-none focus:border-yellow-500 shadow-sm text-zinc-900" onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })} />
                                </div>
                            )}
                        </div>

                        <div className="pt-6">
                            <label className="text-[10px] font-black uppercase text-zinc-400 ml-4 tracking-wider">Descrição Detalhada</label>
                            <textarea value={formData.description} rows={4} placeholder="Características..." className="w-full bg-zinc-50 border border-zinc-100 p-5 rounded-2xl font-bold italic outline-none focus:bg-white focus:border-yellow-500 text-zinc-900" onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}