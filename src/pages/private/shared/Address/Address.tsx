import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, CheckCircle2, Home, Briefcase, Map, ChevronRight, Edit2, Trash2, MapPin, Loader2, MessageSquare, Truck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import AddressModal from '../../../../components/modals/AddressModal';
import type { Address } from '../../../../components/modals/AddressModal';
import { getMyAddresses, createAddressAPI, deleteAddressAPI, updateAddressAPI } from '../../../../services/Address/address';
import { useAuth } from '../../../../context/AuthContext';

const MySwal = withReactContent(Swal);

export default function CheckoutAddress() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const token = String(localStorage.getItem('authToken'));

    // Estados de Endereço
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    
    // Estados de Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAddress, setCurrentAddress] = useState<Address | null>(null);

    // 1. CARREGAR ENDEREÇOS
    const loadAddresses = async () => {
        setLoading(true);
        try {
            if (isAuthenticated && token) {
                const data = await getMyAddresses(token);
                setAddresses(data);
                if (data.length > 0 && !selectedAddressId) {
                    setSelectedAddressId(data[0].id);
                }
            } else {
                const saved = localStorage.getItem('@app:guest_address');
                if (saved) {
                    const addr = JSON.parse(saved);
                    setAddresses([addr]);
                    setSelectedAddressId(addr.id);
                }
            }
        } catch (e) {
            console.error("Erro ao carregar endereços:", e);
            toast.error("Erro ao sincronizar endereços");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadAddresses(); }, [isAuthenticated, token]);

    // AÇÕES DE ENDEREÇO
    const handleOpenModal = (address: Address | null = null) => {
        setCurrentAddress(address);
        setIsModalOpen(true);
    };

    const handleSaveAddress = async (data: Address) => {
        try {
            if (isAuthenticated && token) {
                if (data.id) await updateAddressAPI(token, data.id, data);
                else await createAddressAPI(token, data);
            } else {
                localStorage.setItem('@app:guest_address', JSON.stringify(data));
            }
            await loadAddresses();
            setIsModalOpen(false);
            toast.success("Endereço salvo!");
        } catch (e) {
            toast.error("Erro ao salvar endereço");
        }
    };

    const handleDelete = async (id: string) => {
        const result = await MySwal.fire({
            title: 'Excluir?',
            text: "Remover este endereço?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#000',
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não'
        });

        if (result.isConfirmed) {
            try {
                if (isAuthenticated && token) await deleteAddressAPI(token, id);
                else localStorage.removeItem('@app:guest_address');
                await loadAddresses();
                if (selectedAddressId === id) setSelectedAddressId('');
                toast.success("Removido!");
            } catch (e) { toast.error("Erro ao deletar"); }
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FB]">
            <Loader2 className="animate-spin text-yellow-600 mb-4" size={40} />
            <span className="font-black uppercase italic text-[10px] tracking-widest text-zinc-400">Sincronizando...</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-10 font-sans text-zinc-900 text-left italic">
            <Toaster position="top-center" />
            
            <header className="max-w-4xl mx-auto mb-10 flex items-center justify-between">
                <div className="flex items-center gap-4 text-left">
                    <Link to="/cart" className="p-3 bg-white border border-zinc-200 rounded-2xl hover:bg-zinc-50 transition-all shadow-sm">
                        <ArrowLeft size={20} className="text-zinc-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tight italic">Onde <span className="text-yellow-600">Entregamos?</span></h1>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Selecione o local de destino</p>
                    </div>
                </div>
                <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-zinc-900 text-white px-5 py-3 rounded-xl font-black uppercase italic text-[10px] hover:bg-yellow-600 transition-all shadow-lg active:scale-95">
                    <Plus size={14} /> Novo Local
                </button>
            </header>

            <main className="max-w-4xl mx-auto space-y-6">
                <div className="grid gap-4">
                    {addresses.map((address) => (
                        <div
                            key={address.id}
                            onClick={() => setSelectedAddressId(address.id!)}
                            className={`group relative bg-white p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer flex items-center justify-between ${selectedAddressId === address.id ? 'border-yellow-500 shadow-xl ring-4 ring-yellow-500/5' : 'border-transparent hover:border-zinc-200 shadow-sm'}`}
                        >
                            <div className="flex items-start gap-5">
                                <div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center transition-colors ${selectedAddressId === address.id ? 'bg-yellow-500 text-white' : 'bg-zinc-100 text-zinc-400'}`}>
                                    {address.type === 'Casa' ? <Home size={24} /> : address.type === 'Trabalho' ? <Briefcase size={24} /> : <Map size={24} />}
                                </div>
                                <div className="text-left">
                                    <span className="font-black uppercase italic text-sm tracking-tight">{address.type}</span>
                                    <p className="font-bold text-zinc-800 text-lg leading-tight">{address.street}, {address.number}</p>
                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mt-1">{address.zip_code} • {address.city}, {address.state}</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={(e) => { e.stopPropagation(); handleOpenModal(address); }} className="p-3 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all"><Edit2 size={18} /></button>
                                <button onClick={(e) => { e.stopPropagation(); handleDelete(address.id!); }} className="p-3 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                            </div>

                            {selectedAddressId === address.id && (
                                <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full p-1 shadow-lg border-4 border-[#F8F9FB]">
                                    <CheckCircle2 size={20} fill="currentColor" className="text-yellow-500 stroke-white" />
                                </div>
                            )}
                        </div>
                    ))}

                    {addresses.length === 0 && (
                        <div className="bg-white border-2 border-dashed border-zinc-200 rounded-[3rem] p-16 text-center">
                            <MessageSquare size={40} className="text-zinc-200 mx-auto mb-4" />
                            <h3 className="text-xl font-black uppercase italic mb-2">Sem endereços</h3>
                            <button onClick={() => handleOpenModal()} className="bg-zinc-900 text-white px-8 py-4 rounded-2xl font-black uppercase italic text-xs">Cadastrar Novo</button>
                        </div>
                    )}
                </div>

                {/* PAINEL DE PROSSEGUIR (SEM FRETE) */}
                {selectedAddressId && (
                    <div className="mt-12 bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-6 text-left">
                            <div className="w-16 h-16 bg-zinc-900 rounded-3xl flex items-center justify-center text-yellow-500 shadow-lg">
                                <MapPin size={32} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 italic">Endereço Selecionado</p>
                                <h4 className="font-black text-lg italic uppercase leading-none text-zinc-900">
                                    Pronto para entrega
                                </h4>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase mt-1">Frete a combinar ou via plataforma</p>
                            </div>
                        </div>

                        <button 
                            onClick={() => {
                                navigate('/pagamento', { 
                                    state: { 
                                        addressId: selectedAddressId,
                                        shippingPrice: 0 // Frete enviado como 0 para ser definido depois ou via lógica interna
                                    } 
                                });
                            }} 
                            className="w-full md:w-auto flex items-center justify-center gap-3 bg-zinc-900 text-white px-12 py-6 rounded-3xl font-black uppercase italic hover:bg-yellow-600 transition-all shadow-2xl group"
                        >
                            Ir para Pagamento <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}
            </main>

            <AddressModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSaveAddress} 
                initialData={currentAddress} 
            />
        </div>
    );
}