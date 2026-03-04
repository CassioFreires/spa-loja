import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Plus, CheckCircle2, Home, Briefcase, Map, ChevronRight, Edit2, Trash2, MapPin, Loader2, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import AddressModal from '../../../../components/modals/AddressModal';
import type { Address } from '../../../../components/modals/AddressModal';
import { getMyAddresses, createAddressAPI, deleteAddressAPI, updateAddressAPI } from '../../../../services/Address/address';
import { useAuth } from '../../../../context/AuthContext';
import { calculateFreightAPI, type FreightResponse } from '../../../../services/Shipments/shipments';

const MySwal = withReactContent(Swal);

// Constante para identificar o endereço do visitante sem ID de banco
const GUEST_ID = 'guest_temp_id';

/**
 * PAGE: CheckoutAddress
 * Expertise: Performance Web, UX/UI Responsivo e SEO Semântico para IA.
 * Suporta fluxo Autenticado e Visitante.
 */
export default function CheckoutAddress() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const token = localStorage.getItem('authToken');

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
    const [freightOptions, setFreightOptions] = useState<FreightResponse[]>([]);
    const [isCalculating, setIsCalculating] = useState(false);

    // checkout-address.tsx

    useEffect(() => {
        const fetchFreight = async () => {
            const selected = addresses.find(a => a.id === selectedAddressId);
            if (!selected) return;

            const tempFreight = localStorage.getItem('@app:temp_freight');
            if (tempFreight) {
                setFreightOptions(JSON.parse(tempFreight));
                return;
            }

            setIsCalculating(true);
            try {
                const cartTotal = 150;
                const data = await calculateFreightAPI(selected.zip_code, cartTotal);
                setFreightOptions(data);
            } catch (e) {
                // MOCK DE TESTE: Se a API falhar, injetamos um frete de R$ 0,01 para teste
                console.warn("Loggi Offline: Injetando frete de teste.");
                const mockFreight: FreightResponse[] = [{
                    id: 'mock-service-id',
                    servico: 'Loggi Teste (Simulado)',
                    valor: 'R$ 0,01',
                    valorNumerico: 0.01,
                    prazo: 1
                }];
                setFreightOptions(mockFreight);
                toast.error("Loggi Offline: Usando modo de teste (R$ 0,01)");
            } finally {
                setIsCalculating(false);
            }
        };

        if (selectedAddressId) fetchFreight();
    }, [selectedAddressId, addresses]);

    // useEffect(() => {
    //     const fetchFreight = async () => {
    //         const selected = addresses.find(a => a.id === selectedAddressId);
    //         if (!selected) return;

    //         // 1. Tenta recuperar o frete que o Modal acabou de calcular
    //         const tempFreight = localStorage.getItem('@app:temp_freight');

    //         if (tempFreight) {
    //             setFreightOptions(JSON.parse(tempFreight));
    //             // Opcional: Limpa o temporário após usar para não ficar lixo
    //             // localStorage.removeItem('@app:temp_freight'); 
    //             return;
    //         }

    //         // 2. Fallback: Se não tiver no localStorage (ex: endereço já estava cadastrado), chama a API
    //         setIsCalculating(true);
    //         try {
    //             const cartTotal = 150;
    //             const data = await calculateFreightAPI(selected.zip_code, cartTotal);
    //             setFreightOptions(data);
    //         } catch (e) {
    //             toast.error("Loggi: Erro ao calcular frete para este local.");
    //             setFreightOptions([]);
    //         } finally {
    //             setIsCalculating(false);
    //         }
    //     };

    //     if (selectedAddressId) fetchFreight();
    // }, [selectedAddressId, addresses]);

    /**
     * FUNÇÃO CORRIGIDA: handleOpenModal
     * Prepara o estado para abrir o modal de cadastro/edição
     */
    const handleOpenModal = (address: Address | null = null) => {
        setCurrentAddress(address);
        setIsModalOpen(true);
    };

    /**
     * CARREGAR ENDEREÇOS
     * Lógica híbrida: Prioriza API para logados e LocalStorage para visitantes.
     */
    const loadAddresses = useCallback(async () => {
        setLoading(true);
        try {
            if (isAuthenticated && token) {
                const data = await getMyAddresses(token);
                const addressList = Array.isArray(data) ? data : [];
                setAddresses(addressList);

                if (addressList.length > 0 && !selectedAddressId) {
                    setSelectedAddressId(addressList[0].id!);
                }
            } else {
                const saved = localStorage.getItem('@app:guest_address');
                if (saved) {
                    const addr = JSON.parse(saved);
                    // Injetamos um ID estático para o visitante para que a lógica de seleção funcione
                    const guestAddr = { ...addr, id: GUEST_ID };
                    setAddresses([guestAddr]);
                    setSelectedAddressId(GUEST_ID);
                } else {
                    setAddresses([]);
                }
            }
        } catch (e: any) {
            if (e.response?.status !== 404) {
                toast.error("Erro ao sincronizar endereços");
            } else {
                setAddresses([]);
            }
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, token, selectedAddressId]);

    useEffect(() => {
        loadAddresses();
    }, [loadAddresses]);

    /**
     * SALVAR ENDEREÇO
     */
    const handleSaveAddress = async (data: Address) => {
        try {
            if (isAuthenticated && token) {
                if (data.id && data.id !== GUEST_ID) {
                    await updateAddressAPI(token, data.id, data);
                } else {
                    await createAddressAPI(token, data);
                }
            } else {
                // Fluxo Visitante: Persistência local
                localStorage.setItem('@app:guest_address', JSON.stringify(data));
            }

            await loadAddresses();
            setIsModalOpen(false);
            toast.success("Local de entrega atualizado!");
        } catch (e) {
            toast.error("Erro ao salvar endereço");
        }
    };

    /**
     * EXCLUIR ENDEREÇO
     */
    const handleDelete = async (id: string) => {
        const result = await MySwal.fire({
            title: 'Excluir?',
            text: "Deseja remover este endereço de entrega?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#000',
            confirmButtonText: 'Sim, excluir',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                if (isAuthenticated && token && id !== GUEST_ID) {
                    await deleteAddressAPI(token, id);
                } else {
                    localStorage.removeItem('@app:guest_address');
                }

                await loadAddresses();
                if (selectedAddressId === id) setSelectedAddressId('');
                toast.success("Endereço removido!");
            } catch (e) {
                toast.error("Erro ao deletar");
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FB]">
            <Loader2 className="animate-spin text-yellow-600 mb-4" size={40} />
            <span className="font-black uppercase italic text-[10px] tracking-widest text-zinc-400">Calculando rotas de entrega...</span>
        </div>
    );

    return (
        <main className="min-h-screen bg-[#F8F9FB] p-4 md:p-10 font-sans text-zinc-900 text-left italic leading-none selection:bg-yellow-100">
            <Toaster position="top-center" reverseOrder={false} />

            <header className="max-w-4xl mx-auto mb-10 flex items-center justify-between">
                <div className="flex items-center gap-4 text-left">
                    <button onClick={() => navigate(-1)} className="p-3 bg-white border border-zinc-200 rounded-2xl hover:bg-zinc-50 transition-all shadow-sm group">
                        <ArrowLeft size={20} className="text-zinc-600 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tight italic">Onde <span className="text-yellow-600">Entregamos?</span></h1>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Defina o destino do seu pedido Gold</p>
                    </div>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-zinc-900 text-white px-5 py-3 rounded-xl font-black uppercase italic text-[10px] hover:bg-yellow-600 hover:text-black transition-all shadow-lg active:scale-95"
                >
                    <Plus size={14} /> Novo Local
                </button>
            </header>

            <section className="max-w-4xl mx-auto space-y-6">
                <div className="grid gap-4" role="radiogroup" aria-label="Opções de endereço">
                    {addresses.length > 0 ? (
                        addresses.map((address) => (
                            <article
                                key={address.id}
                                onClick={() => setSelectedAddressId(address.id!)}
                                className={`group relative bg-white p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer flex items-center justify-between ${selectedAddressId === address.id ? 'border-yellow-500 shadow-xl ring-4 ring-yellow-500/5' : 'border-transparent hover:border-zinc-200 shadow-sm'}`}
                            >
                                <div className="flex items-start gap-5">
                                    <div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center transition-colors ${selectedAddressId === address.id ? 'bg-yellow-500 text-white' : 'bg-zinc-100 text-zinc-400'}`}>
                                        {address.type === 'Casa' ? <Home size={24} /> : address.type === 'Trabalho' ? <Briefcase size={24} /> : <Map size={24} />}
                                    </div>
                                    <div className="text-left">
                                        <span className="font-black uppercase italic text-sm tracking-tight">{address.type || 'Endereço'}</span>
                                        <p className="font-bold text-zinc-800 text-lg leading-tight mt-1">{address.street}, {address.number}</p>
                                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mt-1">{address.zip_code} • {address.city}, {address.state}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleOpenModal(address); }}
                                        className="p-3 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all"
                                        aria-label="Editar endereço"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(address.id!); }}
                                        className="p-3 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        aria-label="Remover endereço"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                {selectedAddressId === address.id && (
                                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full p-1 shadow-lg border-4 border-[#F8F9FB] animate-in zoom-in duration-300">
                                        <CheckCircle2 size={20} fill="currentColor" className="text-yellow-500 stroke-white" />
                                    </div>
                                )}
                            </article>
                        ))
                    ) : (
                        <div className="bg-white border-2 border-dashed border-zinc-200 rounded-[3rem] p-16 text-center animate-in fade-in zoom-in-95 duration-500 shadow-sm">
                            <MessageSquare size={40} className="text-zinc-200 mx-auto mb-4" />
                            <h3 className="text-xl font-black uppercase italic mb-2 tracking-tighter text-zinc-900">Nenhum local <span className="text-yellow-600">cadastrado</span></h3>
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-8">Precisamos do seu endereço para processar o envio.</p>
                            <button onClick={() => handleOpenModal()} className="bg-zinc-900 text-white px-8 py-4 rounded-2xl font-black uppercase italic text-xs hover:bg-yellow-600 hover:text-black transition-all shadow-xl">Cadastrar Novo</button>
                        </div>
                    )}
                </div>

                {/* PAINEL DE PROSSEGUIR: Habilitado dinamicamente para User ou Guest */}
                {selectedAddressId && (
                    <footer className="mt-12 bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-2xl flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6 text-left">
                                <div className="w-16 h-16 bg-zinc-900 rounded-3xl flex items-center justify-center text-yellow-500">
                                    {isCalculating ? <Loader2 className="animate-spin" /> : <MapPin size={32} />}
                                </div>
                                <div>
                                    <h4 className="font-black text-lg italic uppercase leading-none text-zinc-900">
                                        {isCalculating ? "Calculando Frete..." : "Entrega Loggi Gold"}
                                    </h4>
                                    {freightOptions.length > 0 && (
                                        <p className="text-sm font-black text-yellow-600 uppercase mt-1">
                                            {freightOptions[0].valor} • Chega em {freightOptions[0].prazo} dias
                                        </p>
                                    )}
                                </div>
                            </div>

                            <button
                                disabled={isCalculating || freightOptions.length === 0}
                                onClick={() => {
                                    navigate('/pagamento', {
                                        state: {
                                            addressId: selectedAddressId,
                                            shippingPrice: freightOptions[0].valorNumerico,
                                            serviceId: freightOptions[0].id
                                        }
                                    });
                                }}
                                className="w-full md:w-auto flex items-center justify-center gap-3 bg-zinc-900 text-white px-12 py-6 rounded-3xl font-black uppercase italic hover:bg-yellow-600 transition-all disabled:opacity-50"
                            >
                                Ir para Pagamento <ChevronRight size={20} />
                            </button>
                        </div>
                    </footer>
                )}
            </section>

            <AddressModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveAddress}
                initialData={currentAddress}
            />
        </main>
    );
}