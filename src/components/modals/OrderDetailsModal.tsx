import { X, Package, MapPin, CreditCard, FileText, Truck, ShieldCheck, User, Hash, ExternalLink, XCircle, Loader2, Calendar, CheckCircle2 } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { cancelOrder, cancelOrderGuest, getOrderTrackingEvents } from '../../services/Orders/orders';
import toast from 'react-hot-toast';
import TrackingTimeline from '../TrackingTimeLine/TrakingTimeLine';

interface OrderDetailModalProps {
    order: any;
    isOpen: boolean;
    onClose: () => void;
    isAdmin?: boolean;
}

export default function OrderDetailModal({ order: initialOrder, isOpen, onClose, isAdmin = false }: OrderDetailModalProps) {
    const queryClient = useQueryClient();

    // 1. Buscamos os dados de rastreio (Status da Remessa + Histórico)
    const { data: trackingData, refetch } = useQuery({
        queryKey: ['order-tracking', initialOrder?.id],
        queryFn: () => getOrderTrackingEvents(initialOrder?.id),
        enabled: !!initialOrder?.id && isOpen,
        staleTime: 0
    });

    // 2. Sincronização: Se houver dados de rastreio, usamos o status da remessa, caso contrário, o status da ordem
    const events = trackingData?.history || [];
    const currentTrackingStatus = trackingData?.status || initialOrder?.status;

    useEffect(() => {
        if (isOpen) refetch();
    }, [isOpen, refetch]);

    // --- CAMADA DE COMPATIBILIDADE E NORMALIZAÇÃO (MANTIDA) ---
    const customerName = initialOrder?.user_name || initialOrder?.display_name || initialOrder?.guest_name || "Visitante";
    const customerEmail = initialOrder?.user_email || initialOrder?.display_email || initialOrder?.guest_email || "";
    const guestAddr = typeof initialOrder?.guest_address === 'string' ? JSON.parse(initialOrder.guest_address) : initialOrder?.guest_address;

    const address = {
        street: initialOrder?.street || guestAddr?.street || "Rua não informada",
        number: initialOrder?.number || guestAddr?.number || "S/N",
        neighborhood: initialOrder?.neighborhood || guestAddr?.neighborhood || "",
        city: initialOrder?.city || guestAddr?.city || "",
        state: initialOrder?.state || guestAddr?.state || "",
        zipcode: initialOrder?.zip_code || initialOrder?.zipcode || guestAddr?.zipcode || guestAddr?.zip_code || ""
    };

    const mutationCancel = useMutation({
        mutationFn: async () => {
            const token = localStorage.getItem('authToken');
            if (token) return cancelOrder(initialOrder.id);
            if (!initialOrder.order_code) throw new Error("Código do pedido não localizado.");
            return cancelOrderGuest(initialOrder.order_code, customerEmail);
        },
        onSuccess: () => {
            toast.success("Pedido cancelado!", { id: 'cancel-action' });
            queryClient.invalidateQueries({ queryKey: ['my-orders'] });
            onClose();
        }
    });

    if (!isOpen || !initialOrder) return null;

    const subtotal = initialOrder.items?.reduce((acc: number, item: any) => acc + (Number(item.unit_price) * item.quantity), 0);

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 md:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-[2rem] md:rounded-[3rem] shadow-2xl relative flex flex-col italic text-zinc-900 border border-zinc-200 no-scrollbar">

                {/* HEADER FIXO */}
                <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md p-6 md:p-8 border-b border-zinc-100 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-yellow-600 mb-1">
                            <ShieldCheck size={16} />
                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest leading-none">
                                {isAdmin ? 'Dossiê Administrativo' : 'Pedido Autenticado'}
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none">
                            Detalhes do <span className="text-yellow-600">Pedido</span>
                        </h2>
                        <p className="text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-2">
                            Código: {initialOrder.order_code || `#${initialOrder.id}`}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-zinc-100 rounded-full hover:bg-black hover:text-white transition-all active:scale-90">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 md:p-12 space-y-10 md:space-y-12">
                    {/* TIMELINE HORIZONTAL - AGORA USA O STATUS DINÂMICO */}
                    <div className="bg-zinc-50 rounded-[2rem] p-6 md:p-8 border border-zinc-100 overflow-hidden shadow-inner">
                        <h3 className="font-black uppercase text-[10px] md:text-xs tracking-widest mb-8 md:mb-10 flex items-center gap-2 text-zinc-400">
                            <Truck size={14} className="text-yellow-600" /> Progresso Geral
                        </h3>
                        <div className="px-2 md:px-6">
                            <TrackingTimeline currentStatus={currentTrackingStatus} />
                        </div>
                    </div>

                    {/* JORNADA DETALHADA */}
                    <div className="space-y-8">
                        <h3 className="font-black uppercase text-[10px] md:text-xs tracking-[0.3em] text-zinc-400 flex items-center gap-2">
                            <Calendar size={14} /> Histórico de Movimentação
                        </h3>

                        <div className="relative space-y-8 before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-100 ml-2">
                            {events.length > 0 ? (
                                events.map((event: any, idx: number) => {
                                    const isLatest = idx === 0;
                                    return (
                                        <div key={idx} className="relative flex gap-6 pl-12 group animate-in slide-in-from-left-4 duration-500">
                                            <div className={`
                                                absolute left-0 w-[36px] h-[36px] rounded-xl flex items-center justify-center z-10 transition-all border-4 border-white
                                                ${isLatest ? 'bg-zinc-900 text-yellow-500 shadow-lg scale-110' : 'bg-white border-zinc-100 text-zinc-300'}
                                            `}>
                                                {isLatest ? (
                                                    currentTrackingStatus === 'ENTREGUE' ? <CheckCircle2 size={16} /> : <Loader2 size={16} className="animate-spin" />
                                                ) : (
                                                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
                                                )}
                                            </div>
                                            <div className="flex flex-col text-left">
                                                <p className={`text-[11px] font-black uppercase italic tracking-tighter leading-none ${isLatest ? 'text-zinc-900' : 'text-zinc-400'}`}>
                                                    {event.message}
                                                </p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${isLatest ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 'bg-zinc-50 text-zinc-400 border-zinc-100'}`}>
                                                        {new Date(event.date).toLocaleDateString('pt-BR')} • {new Date(event.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${isLatest ? 'text-yellow-600' : 'text-zinc-300'}`}>
                                                        <MapPin size={10} /> {event.location}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="pl-12 py-4 text-left font-bold text-[10px] text-zinc-300 uppercase tracking-widest italic">Aguardando percurso...</div>
                            )}
                        </div>
                    </div>

                    {/* GRID DE INFORMAÇÕES (IDENTIFICAÇÃO / ENTREGA / PAGAMENTO) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 border-t border-zinc-50 pt-10 text-left">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-zinc-400"><User size={14} /><span className="text-[10px] font-black uppercase tracking-widest">Identificação</span></div>
                            <div><p className="font-black text-zinc-800 uppercase leading-tight">{customerName}</p><p className="text-zinc-500 font-bold break-all leading-tight">{customerEmail}</p></div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-zinc-400"><MapPin size={14} /><span className="text-[10px] font-black uppercase tracking-widest">Destino</span></div>
                            <div>
                                <p className="text-zinc-800 font-black uppercase leading-tight">{address.street}, {address.number}</p>
                                <p className="text-zinc-500 font-bold uppercase leading-tight">{address.city}/{address.state}</p>
                                <p className="text-zinc-900 font-black text-xs mt-1 leading-none">CEP: {address.zipcode}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-zinc-400"><CreditCard size={14} /><span className="text-[10px] font-black uppercase tracking-widest">Pagamento</span></div>
                            <div>
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border mb-3 inline-block ${currentTrackingStatus === 'PAGO' || currentTrackingStatus === 'ENTREGUE' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'}`}>{currentTrackingStatus}</span>
                                {initialOrder.tracking_code && <div className="flex items-center gap-2 bg-zinc-900 text-yellow-500 px-2 py-1 rounded-lg w-fit"><Hash size={12} /><span className="text-[11px] font-black uppercase">{initialOrder.tracking_code}</span></div>}
                            </div>
                        </div>
                    </div>

                    {/* LISTA DE PRODUTOS */}
                    <div className="space-y-6">
                        <h4 className="font-black uppercase text-[10px] md:text-xs tracking-[0.3em] border-b pb-4 text-zinc-400 flex items-center gap-2"><Package size={14} /> Itens do Pedido</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {initialOrder.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between bg-zinc-50/50 p-4 rounded-3xl border border-zinc-100 group hover:bg-zinc-50 transition-all text-left">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-white rounded-xl overflow-hidden shadow-sm border border-zinc-100 shrink-0"><img src={item.image} className="w-full h-full object-cover" alt={item.product_name} /></div>
                                        <div className="text-xs"><h5 className="font-black uppercase text-zinc-900 line-clamp-1 leading-tight">{item.product_name}</h5><p className="text-[9px] font-bold text-zinc-400 uppercase mt-1 leading-none">Qtd: {item.quantity}</p></div>
                                    </div>
                                    <p className="font-black text-zinc-900 text-xs tracking-tighter">R$ {Number(item.unit_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CARD FINANCEIRO */}
                    <div className="bg-zinc-900 text-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                            <div className="order-2 md:order-1 text-left">
                                {currentTrackingStatus === 'PENDENTE' ? (
                                    <div className="flex flex-col gap-3">
                                        <h5 className="font-black uppercase italic text-yellow-500 tracking-widest text-[10px] mb-2">Ações Disponíveis</h5>
                                        {initialOrder.payment_url && (
                                            <button onClick={() => window.open(initialOrder.payment_url, '_blank')} className="bg-yellow-500 text-black w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all shadow-lg active:scale-95"><ExternalLink size={14} /> Pagar Agora</button>
                                        )}
                                        <button disabled={mutationCancel.isPending} onClick={() => mutationCancel.mutate()} className="bg-white/5 border border-white/10 text-red-400 w-full py-3 rounded-2xl font-black uppercase text-[9px] tracking-widest hover:bg-red-500/10 hover:text-red-500 transition-all active:scale-95 disabled:opacity-50">{mutationCancel.isPending ? <Loader2 className="animate-spin" size={14} /> : <XCircle size={14} />} Cancelar Pedido</button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-yellow-500"><CreditCard size={18} /></div>
                                        <div><p className="text-[9px] font-medium text-zinc-400 uppercase tracking-widest mb-1">Meio de Captura</p><p className="text-sm font-black uppercase tracking-tight">{initialOrder.capture_method || 'InfinitePay'}</p></div>
                                    </div>
                                )}
                            </div>
                            <div className="order-1 md:order-2 space-y-3">
                                <div className="flex justify-between text-[10px] font-black uppercase text-zinc-400 tracking-[0.1em]"><span>Subtotal</span><span className="text-white">R$ {subtotal?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                                <div className="flex justify-between text-[10px] font-black uppercase text-zinc-400 tracking-[0.1em]"><span>Frete Loggi</span><span className="text-white">R$ {Number(initialOrder.amount_paid_shipping || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                                <div className="pt-4 border-t border-white/10 flex justify-between items-end"><span className="font-black uppercase italic text-lg leading-none">Total</span><div className="text-right leading-none"><span className="text-3xl md:text-4xl font-black text-white italic tracking-tighter leading-none">R$ {Number(initialOrder.total_value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="p-6 md:p-8 bg-zinc-50 border-t border-zinc-100 flex flex-col md:flex-row gap-6 items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-zinc-400 text-left leading-tight">
                        <FileText size={16} />
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest italic">Certificado Gold Store • Realizado em {new Date(initialOrder.created_at).toLocaleDateString('pt-BR')} • {new Date(initialOrder.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <button onClick={() => window.print()} className="w-full md:w-auto bg-white border border-zinc-200 px-8 py-4 rounded-2xl font-black uppercase italic text-[10px] tracking-widest hover:bg-zinc-900 hover:text-white transition-all shadow-sm active:scale-95">Imprimir Dossiê</button>
                </div>
            </div>
        </div>
    );
}