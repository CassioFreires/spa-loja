import React, { useState, useEffect } from 'react';
import { X, Save, MapPin, Loader2, Home, Briefcase, Map, Search, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { z } from 'zod';

const MySwal = withReactContent(Swal);

// --- SCHEMA DE VALIDAÇÃO (ZOD) ---
const addressSchema = z.object({
    street: z.string().trim().min(3, "A rua deve ter pelo menos 3 caracteres"),
    number: z.string().trim().min(1, "O número é obrigatório"),
    neighborhood: z.string().trim().min(2, "O bairro deve ter pelo menos 2 caracteres"),
    city: z.string().trim().min(2, "A cidade é obrigatória"),
    state: z.string().trim().length(2, "UF deve ter exatamente 2 caracteres"),
    zip_code: z.string().trim().min(8, "O CEP deve ser preenchido corretamente"),
    type: z.enum(['Casa', 'Trabalho', 'Outro']),
});

export interface Address {
    id?: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
    type: 'Casa' | 'Trabalho' | 'Outro';
    is_default: boolean;
}

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (address: Address) => void;
    initialData?: Address | null;
}

export default function AddressModal({ isOpen, onClose, onSave, initialData }: AddressModalProps) {
    const [isSearchingCep, setIsSearchingCep] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // Inicialização segura para evitar 'undefined'
    const [formData, setFormData] = useState<Address>({
        street: '', number: '', complement: '', neighborhood: '',
        city: '', state: '', zip_code: '', type: 'Casa', is_default: false
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                street: initialData.street || '',
                number: initialData.number || '',
                neighborhood: initialData.neighborhood || '',
                city: initialData.city || '',
                state: initialData.state || '',
                zip_code: initialData.zip_code || '',
                complement: initialData.complement || '',
                type: initialData.type || 'Casa'
            });
        } else {
            setFormData({
                street: '', number: '', complement: '', neighborhood: '',
                city: '', state: '', zip_code: '', type: 'Casa', is_default: false
            });
        }
    }, [initialData, isOpen]);

    const handleSearchCep = async () => {
        const cleanCep = (formData.zip_code || '').replace(/\D/g, '');
        
        if (!cleanCep) return toast.error("Por favor, digite o CEP primeiro");
        if (cleanCep.length !== 8) return toast.error("CEP incompleto");

        setIsSearchingCep(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data = await response.json();
            
            if (data.erro) {
                toast.error("Não encontramos este CEP");
                return;
            }

            setFormData(prev => ({
                ...prev,
                street: data.logradouro || '',
                neighborhood: data.bairro || '',
                city: data.localidade || '',
                state: data.uf || ''
            }));
            toast.success("Endereço localizado!", { icon: '📍' });
        } catch (error) {
            toast.error("Erro na busca do CEP");
        } finally {
            setIsSearchingCep(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Limpeza de dados para evitar o erro 'undefined'
        const dataToValidate = {
            ...formData,
            street: formData.street || "",
            number: formData.number || "",
            neighborhood: formData.neighborhood || "",
            city: formData.city || "",
            state: formData.state || "",
            zip_code: formData.zip_code || "",
            type: formData.type || "Casa"
        };

        // 2. Validação Zod
        const result = addressSchema.safeParse(dataToValidate);
        if (!result.success) {
            return toast.error(result.error.issues[0].message, {
                icon: <MessageSquare size={16} />,
                className: "font-black uppercase italic text-[10px] tracking-widest"
            });
        }

        // 3. Confirmação
        const finalConfirm = await MySwal.fire({
            title: initialData?.id ? 'Atualizar Local?' : 'Confirmar Endereço?',
            text: `Destino: ${formData.street}, ${formData.number}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#ca8a04',
            cancelButtonColor: '#18181b',
            confirmButtonText: 'Sim, Salvar!',
            cancelButtonText: 'Revisar'
        });

        if (!finalConfirm.isConfirmed) return;

        setIsSaving(true);
        try {
            await onSave(formData);
        } catch (error) {
            toast.error("Houve um erro ao processar os dados.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-zinc-200 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                    <div className="flex items-center gap-4 text-zinc-900 text-left">
                        <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black uppercase italic tracking-tight">
                                {initialData?.id ? 'Editar' : 'Novo'} <span className="text-yellow-600">Endereço</span>
                            </h2>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic">Informações de Entrega</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-zinc-200 rounded-2xl transition-colors text-zinc-400">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto italic custom-scrollbar text-left">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-zinc-400 ml-2">CEP</label>
                            <div className="relative flex items-center">
                                <input
                                    className="w-full bg-zinc-50 border border-zinc-100 p-4 pr-14 rounded-2xl font-bold focus:ring-4 ring-yellow-500/10 outline-none text-zinc-900"
                                    value={formData.zip_code || ''}
                                    onChange={e => setFormData({ ...formData, zip_code: e.target.value })}
                                    placeholder="00000-000"
                                />
                                <button type="button" disabled={isSearchingCep} onClick={handleSearchCep} className="absolute right-2 bg-yellow-500 text-white p-2.5 rounded-xl hover:bg-yellow-600">
                                    {isSearchingCep ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-zinc-400 ml-2">Tipo de Residência</label>
                            <div className="flex gap-2">
                                {(['Casa', 'Trabalho', 'Outro'] as const).map((t) => (
                                    <button key={t} type="button" onClick={() => setFormData({ ...formData, type: t })} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase border transition-all ${formData.type === t ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-400 border-zinc-200'}`}>{t}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-zinc-400 ml-2">Rua / Avenida</label>
                        <input className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-2xl font-bold outline-none focus:bg-white text-zinc-900" value={formData.street || ''} onChange={e => setFormData({ ...formData, street: e.target.value })} placeholder="Ex: Av. Brasil" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-zinc-400 ml-2">Número</label>
                            <input className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-2xl font-bold outline-none text-zinc-900" value={formData.number || ''} onChange={e => setFormData({ ...formData, number: e.target.value })} placeholder="123" />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-[10px] font-black uppercase text-zinc-400 ml-2">Complemento</label>
                            <input className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-2xl font-bold outline-none text-zinc-900" value={formData.complement || ''} onChange={e => setFormData({ ...formData, complement: e.target.value })} placeholder="Apto, Bloco..." />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 text-zinc-900">
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-[10px] font-black uppercase text-zinc-400 ml-2">Bairro</label>
                            <input className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-2xl font-bold outline-none" value={formData.neighborhood || ''} onChange={e => setFormData({ ...formData, neighborhood: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-zinc-400 ml-2">Cidade</label>
                            <input className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-2xl font-bold outline-none" value={formData.city || ''} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                        </div>
                        <div className="space-y-1 text-center">
                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">UF</label>
                            <input maxLength={2} className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-2xl font-bold text-center uppercase outline-none" value={formData.state || ''} onChange={e => setFormData({ ...formData, state: e.target.value })} />
                        </div>
                    </div>
                </form>

                <div className="p-8 bg-zinc-50 border-t border-zinc-100">
                    <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="w-full bg-zinc-900 text-white py-6 rounded-3xl font-black uppercase italic hover:bg-yellow-600 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {initialData?.id ? 'Atualizar Endereço' : 'Confirmar e Salvar Endereço'}
                    </button>
                </div>
            </div>
        </div>
    );
}