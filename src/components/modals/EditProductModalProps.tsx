import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    X, Save, Loader2, Shirt, ListTree, ShieldCheck,
    AlertCircle, Hash, Box, Palette, Ruler, User,
    Image as ImageIcon, Upload, Trash2
} from 'lucide-react';
import { useEditProduct } from '../../hooks/useEditProduct';
import {
    findOneWithVariations,
    getVariationTypes,
    getVariantOptions
} from '../../services/Products/products';
import { getSubcategories } from '../../services/Subcategories/subcategories';
import { getBrands } from '../../services/Brands/brands';
import { getTeams } from '../../services/Teams/teams';
import { SelectSearch } from '../Selects/SelectSearch/SelectSearch';

interface EditProductModalProps {
    productId: number | string | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function EditProductModal({ productId, isOpen, onClose }: EditProductModalProps) {
    const mutation = useEditProduct();

    const [isLoadingData, setIsLoadingData] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);
    const [dbVariationTypes, setDbVariationTypes] = useState<any[]>([]);
    const [dbOptions, setDbOptions] = useState<any[]>([]);

    const [formData, setFormData] = useState<any>(null);
    const [variations, setVariations] = useState<any[]>([]);
    const [newImages, setNewImages] = useState<Record<string, File | null>>({});

    useEffect(() => {
        async function loadProductFullData() {
            if (!productId || !isOpen) return;
            setIsLoadingData(true);
            try {
                const [productDetail, cats, brs, tms, vTypes, vOpts] = await Promise.all([
                    findOneWithVariations(Number(productId)),
                    getSubcategories(),
                    getBrands(),
                    getTeams(),
                    getVariationTypes(),
                    getVariantOptions()
                ]);

                setCategories(cats);
                setBrands(brs);
                setTeams(tms);
                setDbVariationTypes(vTypes.filter((t: any) => t.active));
                setDbOptions(vOpts);

                // IMPORTANTE: Inicializamos apenas os campos que o DTO aceita
                setFormData({
                    name: productDetail.name,
                    description: productDetail.description,
                    price: productDetail.price,
                    brand_id: String(productDetail.brand_id),
                    category_id: String(productDetail.category_id),
                    subcategory_id: productDetail.subcategory_id ? String(productDetail.subcategory_id) : '',
                    product_type: productDetail.product_type || 'Casual',
                    team_id: productDetail.team_id ? String(productDetail.team_id) : '',
                    stock: productDetail.stock || 0,
                    active: productDetail.active,
                    version_name: productDetail.version_name || '',
                    season: productDetail.season || '',
                    region: productDetail.region || 'Nacional',
                    // Mantemos as referências das imagens atuais
                    image_1: productDetail.image_1,
                    image_2: productDetail.image_2,
                    image_3: productDetail.image_3,
                    image_4: productDetail.image_4,
                    image_5: productDetail.image_5,
                    image_6: productDetail.image_6,
                });

                setVariations(productDetail.variations || []);
            } catch (error) {
                console.error("Erro ao carregar dados do produto:", error);
            } finally {
                setIsLoadingData(false);
            }
        }
        loadProductFullData();
    }, [productId, isOpen]);

    const getOptionsForType = useCallback((typeName: string) => {
        const type = dbVariationTypes.find(t => t.name === typeName);
        if (!type) return [];
        return dbOptions
            .filter(o => String(o.variation_type_id) === String(type.id))
            .map(o => ({ value: String(o.id), label: o.value }));
    }, [dbVariationTypes, dbOptions]);

    const updateFormField = useCallback((field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    }, []);

    const handleVariationChange = (vId: number, field: string, value: any) => {
        setVariations(prev => prev.map(v =>
            (v.id === vId || v.variation_id === vId) ? { ...v, [field]: value } : v
        ));
    };

    const handleImageChange = (key: string, file: File | null) => {
        setNewImages(prev => ({ ...prev, [key]: file }));
    };

    const handleSave = async () => {
        if (!productId) return;

        const submitData = new FormData();

        // 1. Limpeza de Dados: Definimos exatamente o que o DTO do Backend espera
        const allowedFields = [
            'name', 'description', 'price', 'brand_id', 'category_id', 
            'subcategory_id', 'product_type', 'team_id', 'stock', 
            'active', 'version_name', 'season', 'region'
        ];

        allowedFields.forEach(field => {
            if (formData[field] !== undefined && formData[field] !== null) {
                submitData.append(field, String(formData[field]));
            }
        });

        // 2. Cálculo de estoque total
        const totalStock = variations.length > 0
            ? variations.reduce((acc, v) => acc + Number(v.stock || 0), 0)
            : Number(formData.stock || 0);
        submitData.set('stock', String(totalStock));

        // 3. Imagens (Novas)
        Object.entries(newImages).forEach(([key, file]) => {
            if (file) submitData.append(key, file);
        });

        try {
            await mutation.mutateAsync({
                id: Number(productId),
                data: submitData,
                variations: variations,
                hasVariations: variations.length > 0
            });
            onClose();
        } catch (error) { }
    };

    const brandOptions = useMemo(() => brands.map(b => ({ value: String(b.id), label: b.name })), [brands]);
    const categoryOptions = useMemo(() => categories.map(c => ({ value: String(c.id), label: c.name })), [categories]);
    const teamOptions = useMemo(() => teams.map(t => ({ value: String(t.id), label: t.name })), [teams]);
    const subcategoryOptions = useMemo(() => {
        const selectedCat = categories.find(c => String(c.id) === formData?.category_id);
        return selectedCat?.subcategories?.map((s: any) => ({ value: String(s.id), label: s.name })) || [];
    }, [categories, formData?.category_id]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-950/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-[98vw] xl:max-w-7xl max-h-[95vh] overflow-hidden rounded-[40px] shadow-2xl flex flex-col border border-zinc-200">

                {isLoadingData ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 gap-4">
                        <Loader2 className="animate-spin text-yellow-600" size={48} />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 italic">Sincronizando Master Data...</p>
                    </div>
                ) : formData ? (
                    <>
                        <header className="p-6 md:p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-yellow-500 shadow-xl shadow-zinc-200">
                                    <Shirt size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">Editor Master</h2>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2 italic">ID #{productId} • Gestão Multivariável</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-3 hover:bg-zinc-200 rounded-2xl transition-all"><X size={20} /></button>
                        </header>

                        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col lg:flex-row">
                            {/* COLUNA ESQUERDA: GESTÃO DE 6 IMAGENS */}
                            <aside className="w-full lg:w-80 p-6 bg-zinc-50/50 border-r border-zinc-100 space-y-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <ImageIcon size={16} className="text-yellow-600" />
                                    <h3 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Galeria (Máx 6)</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {[1, 2, 3, 4, 5, 6].map((num) => {
                                        const key = `image_${num}`;
                                        const currentImg = formData[key];
                                        const preview = newImages[key]
                                            ? URL.createObjectURL(newImages[key]!)
                                            : (currentImg ? `${import.meta.env.VITE_API_URL}/uploads/${currentImg}` : null);

                                        return (
                                            <div key={key} className="group relative aspect-[3/4] bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:border-yellow-500 transition-all">
                                                {preview ? (
                                                    <img src={preview} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-300">
                                                        <Upload size={16} />
                                                        <span className="text-[8px] font-black mt-1 uppercase tracking-tighter">Slot {num}</span>
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                    onChange={(e) => handleImageChange(key, e.target.files?.[0] || null)}
                                                />
                                                {preview && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleImageChange(key, null); }}
                                                        className="absolute top-1 right-1 z-20 opacity-0 group-hover:opacity-100 p-1.5 bg-red-600 text-white rounded-lg transition-opacity"
                                                    >
                                                        <Trash2 size={10} />
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <p className="text-[8px] text-zinc-400 leading-tight italic uppercase text-center">Clique para substituir as fotos.</p>
                            </aside>

                            <main className="flex-1 p-6 md:p-10 space-y-10 text-left italic">
                                {/* INFO BÁSICA */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                    <div className="md:col-span-8">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 mb-2 block tracking-widest">Nome do Produto</label>
                                        <input value={formData.name} onChange={(e) => updateFormField('name', e.target.value)} className="w-full bg-zinc-50 border-2 border-transparent p-4 rounded-2xl font-black text-lg focus:bg-white focus:border-yellow-500/50 outline-none transition-all" />
                                    </div>
                                    <div className="md:col-span-4">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 mb-2 block tracking-widest">Preço Base (R$)</label>
                                        <input type="number" step="0.01" value={formData.price} onChange={(e) => updateFormField('price', e.target.value)} className="w-full bg-zinc-50 border-2 border-transparent p-4 rounded-2xl font-black text-xl text-yellow-600 focus:bg-white focus:border-yellow-500/50 outline-none transition-all" />
                                    </div>

                                    <div className="md:col-span-3"><SelectSearch label="Fabricante" options={brandOptions} value={formData.brand_id} onChange={(id) => updateFormField('brand_id', id)} /></div>
                                    <div className="md:col-span-3"><SelectSearch label="Categoria" options={categoryOptions} value={formData.category_id} onChange={(id) => { updateFormField('category_id', id); updateFormField('subcategory_id', ''); }} /></div>
                                    <div className="md:col-span-3"><SelectSearch label="Subcategoria" options={subcategoryOptions} value={formData.subcategory_id} disabled={!formData.category_id} onChange={(id) => updateFormField('subcategory_id', id)} /></div>
                                    <div className="md:col-span-3">
                                        <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 mb-2 block tracking-widest italic">Origem</label>
                                        <select value={formData.region} onChange={(e) => updateFormField('region', e.target.value)} className="w-full bg-zinc-50 p-4 rounded-2xl font-bold text-xs outline-none border-2 border-transparent focus:border-yellow-500/50">
                                            <option value="Nacional">Nacional</option>
                                            <option value="Internacional">Internacional</option>
                                        </select>
                                    </div>
                                </div>

                                {/* GRADE MASTER */}
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3 px-2">
                                        <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-yellow-500 shadow-md"><ListTree size={18} /></div>
                                        <h3 className="font-black text-sm uppercase tracking-tighter text-zinc-900">Grade de Atributos</h3>
                                    </div>

                                    {variations.length > 0 ? (
                                        <div className="border border-zinc-200 rounded-[32px] overflow-hidden bg-white shadow-sm italic">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left min-w-[1000px]">
                                                    <tbody className="divide-y divide-zinc-100">
                                                        {variations.map((v) => {
                                                            const vId = v.id || v.variation_id;
                                                            return (
                                                                <tr key={vId} className="hover:bg-zinc-50/80 transition-colors">
                                                                    <td className="p-2.5">
                                                                        <select value={v.color_option_id || ''} onChange={(e) => handleVariationChange(vId, 'color_option_id', e.target.value)} className="w-full bg-zinc-50 border-none p-2 rounded-xl font-bold text-[10px] outline-none">
                                                                            <option value="">Sem Cor</option>
                                                                            {getOptionsForType('Cor').map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                                                        </select>
                                                                    </td>
                                                                    <td className="p-2.5">
                                                                        <select value={v.size_option_id || ''} onChange={(e) => handleVariationChange(vId, 'size_option_id', e.target.value)} className="w-full bg-zinc-50 border-none p-2 rounded-xl font-bold text-[10px] outline-none">
                                                                            <option value="">Sem Tam.</option>
                                                                            {[...getOptionsForType('Tamanho'), ...getOptionsForType('Numeração')].map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                                                        </select>
                                                                    </td>
                                                                    <td className="p-2.5">
                                                                        <select value={v.model_option_id || ''} onChange={(e) => handleVariationChange(vId, 'model_option_id', e.target.value)} className="w-full bg-zinc-50 border-none p-2 rounded-xl font-bold text-[10px] outline-none">
                                                                            <option value="">Padrão</option>
                                                                            {getOptionsForType('Modelo').map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                                                        </select>
                                                                    </td>
                                                                    <td className="p-2.5">
                                                                        <select value={v.gender_option_id || ''} onChange={(e) => handleVariationChange(vId, 'gender_option_id', e.target.value)} className="w-full bg-zinc-50 border-none p-2 rounded-xl font-bold text-[10px] outline-none">
                                                                            <option value="">Unissex</option>
                                                                            {getOptionsForType('Genero').map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                                                        </select>
                                                                    </td>
                                                                    <td className="p-2.5"><input value={v.sku || ''} onChange={(e) => handleVariationChange(vId, 'sku', e.target.value.toUpperCase())} className="w-full bg-transparent border-b border-zinc-200 p-2 font-mono text-[10px] font-black focus:border-yellow-500 outline-none" placeholder="SKU" /></td>
                                                                    <td className="p-2.5 text-center"><input type="number" value={v.stock} onChange={(e) => handleVariationChange(vId, 'stock', Number(e.target.value))} className="w-20 bg-zinc-900 text-white p-2 rounded-xl text-center font-black text-xs" /></td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-zinc-50 p-10 rounded-[40px] flex flex-col items-center border-2 border-dashed border-zinc-200">
                                            <ShieldCheck size={40} className="text-zinc-300 mb-4" />
                                            <p className="text-[10px] font-black uppercase text-zinc-400 mb-6 italic text-center">Produto Único</p>
                                            <input type="number" value={formData.stock} onChange={(e) => updateFormField('stock', Number(e.target.value))} className="w-32 bg-white border border-zinc-200 p-4 rounded-3xl font-black text-center text-3xl shadow-sm outline-none" />
                                        </div>
                                    )}
                                </section>

                                {/* DESCRIÇÃO */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 block tracking-widest italic">Descrição do Produto</label>
                                    <textarea rows={4} value={formData.description} onChange={(e) => updateFormField('description', e.target.value)} className="w-full bg-zinc-50 border-2 border-transparent p-6 rounded-[32px] font-bold text-xs italic outline-none focus:bg-white focus:border-yellow-500/50 transition-all leading-relaxed" />
                                </div>
                            </main>
                        </div>

                        {/* RODAPÉ */}
                        <footer className="p-6 md:p-8 border-t border-zinc-100 bg-white flex flex-col md:flex-row justify-between items-center gap-4">
                             <button type="button" onClick={() => updateFormField('active', !formData.active)} className={`px-6 py-3 rounded-full text-[9px] font-black uppercase italic transition-all flex items-center gap-3 ${formData.active ? 'bg-emerald-50 text-emerald-600 shadow-sm' : 'bg-zinc-100 text-zinc-400'}`}>
                                <div className={`w-2 h-2 rounded-full ${formData.active ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`} />
                                {formData.active ? 'Ativo na Vitrine' : 'Pausado / Offline'}
                            </button>

                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <button onClick={onClose} className="flex-1 md:flex-none px-8 py-4 text-[10px] font-black uppercase italic text-zinc-400 hover:text-zinc-900 tracking-widest transition-colors">Descartar</button>
                                <button onClick={handleSave} disabled={mutation.isPending} className="flex-1 md:flex-none bg-zinc-950 text-white px-12 py-4 rounded-2xl font-black uppercase italic text-xs flex items-center justify-center gap-3 hover:bg-yellow-600 hover:text-black transition-all shadow-xl disabled:opacity-50">
                                    {mutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    Salvar Alterações
                                </button>
                            </div>
                        </footer>
                    </>
                ) : (
                    <div className="p-20 text-center flex flex-col items-center gap-4">
                        <AlertCircle className="text-red-500" size={48} />
                        <p className="font-black uppercase italic text-zinc-900 tracking-tighter">Falha na sincronização.</p>
                        <button onClick={onClose} className="text-xs underline font-bold uppercase italic">Tentar Novamente</button>
                    </div>
                )}
            </div>
        </div>
    );
}