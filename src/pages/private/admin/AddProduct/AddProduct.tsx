import React, { useState, useEffect } from 'react';
import {Image as ImageIcon, Save, ArrowLeft, Plus, X, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- DADOS MOCKADOS PARA TESTE DE UI ---
const MOCK_CATEGORIES = [
    { id: 1, name: 'Camisetas Premium' },
    { id: 2, name: 'Calçados' },
    { id: 3, name: 'Inverno até 50% OFF' }
];

const MOCK_BRANDS = [
    { id: 1, name: 'Gucci' },
    { id: 2, name: 'Nike' },
    { id: 13, name: 'Nike Essential' }, // Exemplo baseado no seu banco
    { id: 19, name: 'North Face' }
];

const MOCK_SUBCATEGORIES = [
    { id: 1, category_id: 1, name: 'Corta-Vento' },
    { id: 7, category_id: 2, name: 'Camisetas' },
    { id: 55, category_id: 9, name: 'Slides Premium' } // Exemplo real do seu banco
];

export default function AdminAddProduct() {
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [filteredSubcategories, setFilteredSubcategories] = useState<any[]>([]);
    const [currentGalleryUrl, setCurrentGalleryUrl] = useState("");

    // O formData agora reflete exatamente as colunas do seu banco
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: 0,
        category_id: '',
        subcategory_id: '',
        brand_id: '',
        image_url: '', // Campo para a imagem principal
        images: [] as string[], // Galeria (será salva em tabela separada ou JSON no banco)
        active: true
    });

    // Filtro de subcategorias baseado na categoria pai
    useEffect(() => {
        if (selectedCategory) {
            const filtered = MOCK_SUBCATEGORIES.filter(
                sub => sub.category_id === Number(selectedCategory)
            );
            setFilteredSubcategories(filtered);
            setFormData(prev => ({ ...prev, category_id: selectedCategory }));
        }
    }, [selectedCategory]);

    const addImageToGallery = () => {
        if (currentGalleryUrl.trim() !== "") {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, currentGalleryUrl]
            }));
            setCurrentGalleryUrl("");
        }
    };

    const removeImageFromGallery = (indexToRemove: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Objeto final formatado para o seu Repository do NestJS
        const payload = {
            ...formData,
            price: parseFloat(formData.price.replace(',', '.')),
            category_id: Number(formData.category_id),
            subcategory_id: Number(formData.subcategory_id),
            brand_id: Number(formData.brand_id),
            stock: Number(formData.stock),
            active: true,
            created_at: new Date().toISOString()
        };

        console.log("Payload para o backend:", payload);
        alert("Modo Mock: Produto pronto para envio! Veja o console.");
    };

    return (
        <div className="min-h-screen bg-zinc-50 p-6 md:p-12 font-sans">
            <header className="max-w-6xl mx-auto mb-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/admin/dashboard" className="p-2 hover:bg-zinc-200 rounded-full transition-all text-zinc-900">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900">
                        ADMIN <span className="text-yellow-600">/ NOVO PRODUTO</span>
                    </h1>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LADO ESQUERDO: GESTÃO DE IMAGENS */}
                <div className="lg:col-span-4 space-y-6">
                    {/* IMAGEM PRINCIPAL (CAPA) */}
                    <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
                        <h4 className="text-[10px] font-black uppercase mb-4 text-zinc-400 italic flex items-center gap-2">
                            <ImageIcon size={14} /> Capa do Produto
                        </h4>
                        <div className="aspect-[3/4] bg-zinc-100 rounded-2xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center overflow-hidden relative">
                            {formData.image_url ? (
                                <img src={formData.image_url} className="w-full h-full object-cover" alt="Preview" />
                            ) : (
                                <div className="text-center p-6 text-zinc-300">
                                    <ImageIcon size={40} className="mx-auto mb-2 opacity-20" />
                                    <p className="text-[9px] font-bold uppercase italic">Aguardando URL...</p>
                                </div>
                            )}
                        </div>
                        <input 
                            required
                            placeholder="URL da Imagem de Capa"
                            className="w-full mt-4 bg-zinc-50 border border-zinc-200 p-3 rounded-xl text-xs font-bold outline-none focus:border-yellow-600 transition-all"
                            value={formData.image_url}
                            onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                        />
                    </div>

                    {/* GALERIA (MÚLTIPLAS IMAGENS) */}
                    <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
                        <h4 className="text-[10px] font-black uppercase mb-4 text-zinc-400 italic flex items-center gap-2">
                            <Layers size={14} /> Galeria ({formData.images.length})
                        </h4>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {formData.images.map((url, index) => (
                                <div key={index} className="aspect-square bg-zinc-100 rounded-lg relative group overflow-hidden border border-zinc-200">
                                    <img src={url} className="w-full h-full object-cover" alt="Galeria" />
                                    <button 
                                        type="button"
                                        onClick={() => removeImageFromGallery(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={10} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input 
                                placeholder="URL foto extra"
                                className="flex-1 bg-zinc-50 border border-zinc-200 p-3 rounded-xl text-xs font-bold outline-none"
                                value={currentGalleryUrl}
                                onChange={(e) => setCurrentGalleryUrl(e.target.value)}
                            />
                            <button 
                                type="button" 
                                onClick={addImageToGallery}
                                className="bg-black text-white p-3 rounded-xl hover:bg-yellow-600 transition-colors"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* LADO DIREITO: DADOS TÉCNICOS */}
                <div className="lg:col-span-8">
                    <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-8">
                        
                        {/* LINHA 1: NOME E MARCA */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase italic text-zinc-500">Nome do Produto</label>
                                <input 
                                    required
                                    className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl text-sm font-bold focus:border-yellow-600 outline-none transition-all"
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase italic text-zinc-500">Marca Parceira</label>
                                <select 
                                    required
                                    className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl text-sm font-bold focus:border-yellow-600 outline-none"
                                    onChange={(e) => setFormData({...formData, brand_id: e.target.value})}
                                >
                                    <option value="">Selecione</option>
                                    {MOCK_BRANDS.map(brand => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* LINHA 2: CATEGORIAS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase italic text-zinc-500">Departamento Principal</label>
                                <select 
                                    required
                                    className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl text-sm font-bold focus:border-yellow-600 outline-none"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="">Selecione</option>
                                    {MOCK_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase italic text-zinc-500">Subcategoria (Nicho)</label>
                                <select 
                                    required
                                    disabled={!selectedCategory}
                                    className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl text-sm font-bold focus:border-yellow-600 outline-none disabled:opacity-30"
                                    onChange={(e) => setFormData({...formData, subcategory_id: e.target.value})}
                                >
                                    <option value="">{selectedCategory ? "Escolha a Sub" : "Aguardando Dept..."}</option>
                                    {filteredSubcategories.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* LINHA 3: PREÇO E ESTOQUE */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase italic text-zinc-500">Preço Sugerido (R$)</label>
                                <input 
                                    type="number" step="0.01" required
                                    className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl text-sm font-bold focus:border-yellow-600 outline-none"
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase italic text-zinc-500">Quantidade Disponível (Estoque)</label>
                                <input 
                                    type="number" required
                                    className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl text-sm font-bold focus:border-yellow-600 outline-none"
                                    onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                                />
                            </div>
                        </div>

                        {/* DESCRIÇÃO */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase italic text-zinc-500">Descrição Detalhada</label>
                            <textarea 
                                rows={4}
                                className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl text-sm font-bold focus:border-yellow-600 outline-none resize-none"
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            />
                        </div>

                        {/* BOTÃO FINAL */}
                        <button 
                            type="submit"
                            className="w-full bg-black text-white py-5 rounded-3xl font-black uppercase italic hover:bg-yellow-600 hover:text-black transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 group"
                        >
                            <Save size={20} className="group-hover:animate-pulse" />
                            Publicar Produto na Gold Store
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}