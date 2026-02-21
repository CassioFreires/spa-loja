import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
    ArrowLeft, Image as ImageIcon, Plus, Save, Upload,
    ListTree, Trash2, Layers, Wand2, Shirt, ShieldCheck,
} from 'lucide-react';
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
import { getTeams } from '../../../../services/Teams/teams';

const MySwal = withReactContent(Swal);

const productSchema = z.object({
    name: z.string().min(3, "Nome muito curto").max(150),
    description: z.string().min(10, "Descrição muito curta"),
    price: z.coerce.number().positive("O preço deve ser maior que zero"),
    brand_id: z.string().min(1, "Selecione uma marca"),
    category_id: z.string().min(1, "Selecione uma categoria"),
    stock: z.coerce.number().min(0),
    product_type: z.enum(['Time', 'Casual']),
    team_id: z.string().optional().nullable(),
    version_name: z.string().optional(),
    region: z.string().optional(),
    season: z.string().optional(),
    active: z.boolean().default(true),
    has_customization: z.boolean().default(false),
    customization_price: z.coerce.number().min(0).default(0),
});

// UX MELHORADA: A linha agora foca na COMBINAÇÃO de atributos
interface VariationRow {
    selected_options: Record<string, string>; // { "ID_TIPO_TAMANHO": "ID_OPCAO_G", "ID_TIPO_COR": "ID_OPCAO_PRETO" }
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
    const [, setTeams] = useState<any[]>([]);

    const [mainImage, setMainImage] = useState<File | null>(null);
    const [gallery, setGallery] = useState<File[]>([]);
    const [hasVariations, setHasVariations] = useState(false);
    const [variations, setVariations] = useState<VariationRow[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '', description: '', price: '', stock: 0,
        brand_id: '', category_id: '', subcategory_id: '',
        active: true, product_type: 'Casual' as 'Time' | 'Casual',
        team_id: '', version_name: '', has_customization: false,
        customization_price: 0, region: 'Nacional', season: ''
    });

    useEffect(() => {
        async function loadInitialData() {
            try {
                const [cats, brs, types, opts, tms] = await Promise.all([
                    getSubcategories(), getBrands(), getVariationTypes(), getVariantOptions(), getTeams()
                ]);
                setCategories(cats);
                setBrands(brs);
                setDbVariationTypes(types.filter((t: any) => t.active));
                setDbOptions(opts);
                setTeams(tms);
            } catch (error) {
                toast.error("Erro ao carregar dependências.");
            }
        }
        loadInitialData();
    }, []);

    const brandOptions = useMemo(() => brands.map(b => ({ value: String(b.id), label: b.name })), [brands]);
    const categoryOptions = useMemo(() => categories.map(c => ({ value: String(c.id), label: c.name })), [categories]);
    const subcategoryOptions = useMemo(() => {
        const selectedCat = categories.find(c => String(c.id) === formData.category_id);
        return selectedCat?.subcategories?.map((s: any) => ({ value: String(s.id), label: s.name })) || [];
    }, [categories, formData.category_id]);

    const totalVariationStock = useMemo(() => {
        return variations.reduce((acc, curr) => acc + Number(curr.stock || 0), 0);
    }, [variations]);

    const updateFormField = useCallback((field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    // Adiciona uma linha com estrutura de objeto para múltiplos atributos
    const addVariationRow = useCallback(() => {
        setVariations(prev => [...prev, {
            selected_options: {},
            stock: 0,
            extra_price: 0,
            sku: ''
        }]);
    }, []);

    const updateVariationAttribute = (index: number, typeId: string, optionId: string) => {
        setVariations(prev => {
            const upd = [...prev];
            upd[index].selected_options[typeId] = optionId;
            return upd;
        });
    };

    const updateVariation = useCallback((index: number, field: keyof VariationRow, val: any) => {
        setVariations(prev => {
            const upd = [...prev];
            (upd[index] as any)[field] = val;
            return upd;
        });
    }, []);

    const generateSKU = (index: number) => {
        const row = variations[index];
        const firstOptionId = Object.values(row.selected_options)[0];
        const option = dbOptions.find(o => String(o.id) === String(firstOptionId));

        if (!formData.name || !option) {
            toast.error("Preencha o nome e ao menos um atributo.");
            return;
        }

        const namePart = formData.name.trim().substring(0, 3).toUpperCase();
        const valPart = String(option.value).toUpperCase().replace(/\s/g, '');
        const randomPart = Math.floor(1000 + Math.random() * 9000);
        updateVariation(index, 'sku', `${namePart}-${valPart}-${randomPart}`);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validation = productSchema.safeParse(formData);
        if (!validation.success) return toast.error(validation.error.issues[0].message);
        if (!mainImage) return toast.error("A foto principal é obrigatória.");

        if (hasVariations) {
            if (variations.length === 0) return toast.error("Adicione ao menos uma variação.");
            const isIncomplete = variations.some(v => Object.keys(v.selected_options).length === 0 || !v.sku);
            if (isIncomplete) return toast.error("Existem variações incompletas na grade.");
        }

        const finalConfirm = await MySwal.fire({
            title: 'Publicar Produto?',
            text: `Estoque Total: ${hasVariations ? totalVariationStock : formData.stock}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#ca8a04',
            confirmButtonText: 'Sim, Publicar'
        });

        if (!finalConfirm.isConfirmed) return;

        setIsSaving(true);
        const loadingToast = toast.loading("Salvando produto...");

        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => data.append(key, String(value ?? '')));
            data.set('stock', String(hasVariations ? totalVariationStock : formData.stock));
            data.append('image_1', mainImage);
            gallery.forEach((file, i) => data.append(`image_${i + 2}`, file));

            const productRes = await createProduct(data);
            const productId = productRes.id;

            if (hasVariations && productId) {
                await Promise.all(variations.map(v => {
                    // Mapeamos os IDs de volta para as colunas específicas da nossa nova Migration
                    //selected_options: { "ID_TIPO_COR": "ID_OPCAO_AZUL", "ID_TIPO_TAMANHO": "ID_OPCAO_G" }

                    // Identificamos qual ID pertence a qual tipo para mandar pro back correto
                    const colorTypeId = dbVariationTypes.find(t => t.name === 'Cor')?.id;
                    const sizeTypeId = dbVariationTypes.find(t => t.name === 'Tamanho' || t.name === 'Numeração')?.id;
                    const modelTypeId = dbVariationTypes.find(t => t.name === 'Modelo')?.id;

                    return createProductVariation({
                        product_id: Number(productId),
                        // Enviamos os IDs para as colunas corretas que criamos na migration 015
                        color_option_id: v.selected_options[String(colorTypeId)] ? Number(v.selected_options[String(colorTypeId)]) : null,
                        size_option_id: v.selected_options[String(sizeTypeId)] ? Number(v.selected_options[String(sizeTypeId)]) : null,
                        model_option_id: v.selected_options[String(modelTypeId)] ? Number(v.selected_options[String(modelTypeId)]) : null,
                        stock: Number(v.stock),
                        extra_price: Number(v.extra_price),
                        sku: v.sku.trim().toUpperCase()
                    });
                }));
            }

            toast.success("Produto criado!", { id: loadingToast });
            navigate('/admin/dashboard');
        } catch (error: any) {
            toast.error("Erro ao salvar.", { id: loadingToast });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-8 font-sans text-zinc-900">
            <Toaster position="top-center" />

            <header className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/admin/dashboard" className="p-2.5 bg-white border border-zinc-200 rounded-2xl hover:bg-zinc-50 shadow-sm transition-all">
                        <ArrowLeft size={20} className="text-zinc-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black uppercase italic tracking-tighter">Novo <span className="text-yellow-600">Produto</span></h1>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Gestão de Inventário</p>
                    </div>
                </div>

                <button
                    form="product-form"
                    type="submit"
                    disabled={isSaving}
                    className="bg-zinc-900 text-white px-8 py-4 rounded-2xl font-black uppercase italic text-xs flex items-center gap-3 hover:bg-yellow-600 transition-all disabled:opacity-50"
                >
                    {isSaving ? "Salvando..." : <><Save size={18} /> Publicar</>}
                </button>
            </header>

            <form id="product-form" onSubmit={handleSubmit} className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8">

                {/* COLUNA LATERAL: IMAGENS */}
                <div className="lg:col-span-4 space-y-6">
                    <section className="bg-white p-6 rounded-[32px] border border-zinc-200 shadow-sm">
                        <h4 className="text-[10px] font-black uppercase text-zinc-400 mb-4 tracking-widest flex items-center gap-2">
                            <ImageIcon size={14} className="text-yellow-600" /> Capa do Produto
                        </h4>
                        <label className="group relative aspect-[3/4] bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:border-yellow-500 transition-all">
                            {mainImage ? (
                                <img src={URL.createObjectURL(mainImage)} className="w-full h-full object-cover" alt="Preview" />
                            ) : (
                                <div className="text-center p-6 text-zinc-400">
                                    <Upload size={24} className="mx-auto mb-2" />
                                    <span className="text-[11px] font-black uppercase">Upload Foto</span>
                                </div>
                            )}
                            <input type="file" className="hidden" accept="image/*" onChange={e => setMainImage(e.target.files?.[0] || null)} />
                        </label>
                    </section>

                    <section className="bg-white p-6 rounded-[32px] border border-zinc-200 shadow-sm">
                        <h4 className="text-[10px] font-black uppercase text-zinc-400 mb-4 tracking-widest flex items-center gap-2">
                            <Layers size={14} className="text-yellow-600" /> Galeria (Até 5)
                        </h4>
                        <div className="grid grid-cols-3 gap-2">
                            {gallery.map((file, i) => (
                                <div key={i} className="aspect-square rounded-xl border relative overflow-hidden group">
                                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="" />
                                    <button type="button" onClick={() => setGallery(gallery.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {gallery.length < 5 && (
                                <label className="aspect-square bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-xl flex items-center justify-center text-zinc-300 cursor-pointer hover:border-yellow-500 transition-all">
                                    <Plus size={20} />
                                    <input type="file" multiple className="hidden" onChange={e => setGallery([...gallery, ...Array.from(e.target.files || [])].slice(0, 5))} />
                                </label>
                            )}
                        </div>
                    </section>
                </div>

                {/* COLUNA PRINCIPAL */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white p-6 md:p-10 rounded-[40px] border border-zinc-200 shadow-sm space-y-8">

                        {/* TIPO DE PRODUTO */}
                        <div className="bg-zinc-100 p-1.5 rounded-[24px] flex gap-2">
                            {['Casual', 'Time'].map((type) => (
                                <button
                                    key={type} type="button"
                                    onClick={() => updateFormField('product_type', type)}
                                    className={`flex-1 py-4 rounded-[20px] font-black uppercase italic text-[11px] tracking-widest transition-all ${formData.product_type === type ? 'bg-white text-zinc-900 shadow-md' : 'text-zinc-400'
                                        }`}
                                >
                                    <Shirt size={14} className="inline mr-2" /> {type}
                                </button>
                            ))}
                        </div>

                        {/* INFO BÁSICA */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-black uppercase text-zinc-400 ml-4 tracking-wider">Nome do Produto</label>
                                <input
                                    required placeholder="Ex: Camisa Nike Jordan"
                                    className="w-full bg-zinc-50 p-5 rounded-2xl font-black text-lg outline-none focus:ring-2 ring-yellow-500/30 transition-all"
                                    value={formData.name}
                                    onChange={e => updateFormField('name', e.target.value)}
                                />
                            </div>

                            <SelectSearch label="Marca" options={brandOptions} value={formData.brand_id} onChange={id => updateFormField('brand_id', id)} />

                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-zinc-400 ml-4 tracking-wider">Preço (R$)</label>
                                <input
                                    type="number" step="0.01"
                                    className="w-full bg-zinc-50 p-5 rounded-2xl font-black text-2xl outline-none focus:ring-2 ring-yellow-500/30"
                                    value={formData.price}
                                    onChange={e => updateFormField('price', e.target.value)}
                                />
                            </div>

                            <SelectSearch label="Categoria" options={categoryOptions} value={formData.category_id} onChange={id => { updateFormField('category_id', id); updateFormField('subcategory_id', ''); }} />
                            <SelectSearch label="Subcategoria" options={subcategoryOptions} value={formData.subcategory_id} disabled={!formData.category_id} onChange={id => updateFormField('subcategory_id', id)} />
                        </div>

                        {/* ENGINE DE GRADE (UX MELHORADA) */}
                        <div className="pt-8 border-t border-zinc-100">
                            <header className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="font-black text-sm uppercase flex items-center gap-2">
                                        <ListTree size={18} className="text-yellow-600" /> Grade de Variações
                                    </h3>
                                    <p className="text-[9px] text-zinc-400 font-bold uppercase italic">Defina as combinações de estoque</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setHasVariations(!hasVariations)}
                                    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${hasVariations ? 'bg-red-50 text-red-500' : 'bg-zinc-900 text-white'
                                        }`}
                                >
                                    {hasVariations ? 'Desativar Grade' : 'Ativar Grade'}
                                </button>
                            </header>

                            {hasVariations ? (
                                <div className="space-y-4">
                                    {variations.map((v, i) => (
                                        <div key={i} className="bg-zinc-50 p-4 rounded-[24px] border border-zinc-100 animate-in fade-in slide-in-from-top-2">
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

                                                {/* Seleção de múltiplos atributos na mesma linha */}
                                                <div className="md:col-span-2 grid grid-cols-2 gap-2">
                                                    {dbVariationTypes.map(type => (
                                                        <div key={type.id}>
                                                            <p className="text-[8px] font-black uppercase text-zinc-400 mb-1 ml-1">{type.name}</p>
                                                            <select
                                                                className="w-full bg-white border border-zinc-200 p-3 rounded-xl text-[10px] font-bold outline-none focus:ring-2 ring-yellow-500/20"
                                                                value={v.selected_options[type.id] || ''}
                                                                onChange={(e) => updateVariationAttribute(i, String(type.id), e.target.value)}
                                                            >
                                                                <option value="">Selecione...</option>
                                                                {dbOptions
                                                                    .filter(o => String(o.variation_type_id) === String(type.id))
                                                                    .map(o => <option key={o.id} value={o.id}>{o.value}</option>)
                                                                }
                                                            </select>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div>
                                                    <p className="text-[8px] font-black uppercase text-zinc-400 mb-1 ml-1">SKU / Identificador</p>
                                                    <div className="relative">
                                                        <input
                                                            className="w-full bg-white border border-zinc-200 p-3 rounded-xl text-[10px] font-mono font-bold uppercase"
                                                            value={v.sku}
                                                            onChange={e => updateVariation(i, 'sku', e.target.value.toUpperCase())}
                                                        />
                                                        <button type="button" onClick={() => generateSKU(i)} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-yellow-600">
                                                            <Wand2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <div className="flex-1">
                                                        <p className="text-[8px] font-black uppercase text-zinc-400 mb-1 ml-1">Estoque</p>
                                                        <input
                                                            type="number"
                                                            className="w-full bg-zinc-900 text-white p-3 rounded-xl text-center text-xs font-black"
                                                            value={v.stock}
                                                            onChange={e => updateVariation(i, 'stock', Number(e.target.value))}
                                                        />
                                                    </div>
                                                    <button type="button" onClick={() => setVariations(variations.filter((_, idx) => idx !== i))} className="p-3 text-red-400 hover:bg-red-50 rounded-xl">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={addVariationRow}
                                        className="w-full p-4 border-2 border-dashed border-zinc-200 rounded-2xl text-[10px] font-black uppercase text-zinc-400 hover:text-yellow-600 hover:border-yellow-600 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus size={16} /> Adicionar Nova Combinação
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-zinc-50 border border-zinc-100 rounded-[32px] p-8 flex flex-col items-center">
                                    <ShieldCheck size={32} className="text-zinc-200 mb-2" />
                                    <span className="text-[10px] font-black text-zinc-400 uppercase mb-4">Estoque Único do Produto</span>
                                    <input
                                        type="number"
                                        className="w-32 bg-white border border-zinc-200 p-4 rounded-2xl font-black text-center text-xl shadow-sm outline-none focus:ring-2 ring-yellow-500/20"
                                        value={formData.stock}
                                        onChange={e => updateFormField('stock', Number(e.target.value))}
                                    />
                                </div>
                            )}
                        </div>

                        {/* DESCRIÇÃO */}
                        <div className="pt-8 border-t border-zinc-100">
                            <label className="text-[10px] font-black uppercase text-zinc-400 ml-4 tracking-wider">Descrição Detalhada</label>
                            <textarea
                                rows={5}
                                className="w-full bg-zinc-50 p-6 rounded-[24px] font-bold outline-none focus:ring-2 ring-yellow-500/30"
                                value={formData.description}
                                onChange={e => updateFormField('description', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}