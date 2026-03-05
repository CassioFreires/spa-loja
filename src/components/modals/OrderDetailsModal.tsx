import { X, Package, MapPin, CreditCard, FileText, Truck, ShieldCheck, User, Hash, ExternalLink, XCircle, Loader2, Calendar } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { cancelOrder, cancelOrderGuest, getOrderTrackingEvents } from '../../services/Orders/orders';
import toast from 'react-hot-toast';
import TrackingTimeline from '../TrackingTimeLine/TrakingTimeLine';

interface OrderDetailModalProps {
    order: any;
    isOpen: boolean;
    onClose: () => void;
    isAdmin?: boolean;
}

export default function OrderDetailModal({ order, isOpen, onClose, isAdmin = false }: OrderDetailModalProps) {
    const queryClient = useQueryClient();

    const { data: events = [] } = useQuery({
        queryKey: ['order-tracking', order?.id],
        queryFn: () => getOrderTrackingEvents(order?.id),
        enabled: !!order?.id
    });

    // --- CAMADA DE COMPATIBILIDADE E NORMALIZAÇÃO (MANTIDA) ---
    const customerName = order?.user_name || order?.display_name || order?.guest_name || "Visitante";
    const customerEmail = order?.user_email || order?.display_email || order?.guest_email || "";

    const guestAddr = typeof order?.guest_address === 'string' ? JSON.parse(order.guest_address) : order?.guest_address;

    const address = {
        street: order?.street || guestAddr?.street || "Rua não informada",
        number: order?.number || guestAddr?.number || "S/N",
        neighborhood: order?.neighborhood || guestAddr?.neighborhood || "",
        city: order?.city || guestAddr?.city || "",
        state: order?.state || guestAddr?.state || "",
        zipcode: order?.zip_code || order?.zipcode || guestAddr?.zipcode || guestAddr?.zip_code || ""
    };

    const mutationCancel = useMutation({
        mutationFn: async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                return cancelOrder(order.id);
            } else {
                if (!order.order_code) throw new Error("Código do pedido não localizado.");
                return cancelOrderGuest(order.order_code, customerEmail);
            }
        },
        onSuccess: () => {
            toast.success("Pedido cancelado com sucesso!", { id: 'cancel-action' });
            queryClient.invalidateQueries({ queryKey: ['my-orders'] });
            queryClient.invalidateQueries({ queryKey: ['track-order'] });
            onClose();
        },
        onError: (err: any) => {
            const errorMsg = err.response?.data?.message || "Erro ao processar cancelamento.";
            toast.error(errorMsg, { id: 'cancel-action', duration: 3000 });
        }
    });

    if (!isOpen || !order) return null;

    const subtotal = order.items?.reduce((acc: number, item: any) => acc + (Number(item.unit_price) * item.quantity), 0);

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 md:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            
            <div className="bg-white w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-[2rem] md:rounded-[3rem] shadow-2xl relative flex flex-col italic text-zinc-900 border border-zinc-200 no-scrollbar">

                {/* HEADER FIXO (MANTIDO) */}
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
                        <p className="text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-2 leading-none">
                            Código: {order.order_code || `#${order.id}`}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-3 md:p-4 bg-zinc-100 rounded-full hover:bg-black hover:text-white transition-all shadow-sm active:scale-90">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 md:p-12 space-y-10 md:space-y-12">

                    {/* STATUS DE ENTREGA / TIMELINE HORIZONTAL (MANTIDO) */}
                    <div className="bg-zinc-50 rounded-[2rem] p-6 md:p-8 border border-zinc-100 overflow-hidden shadow-inner">
                        <h3 className="font-black uppercase text-[10px] md:text-xs tracking-widest mb-8 md:mb-10 flex items-center gap-2 text-zinc-400">
                            <Truck size={14} className="text-yellow-600" /> Progresso Geral
                        </h3>
                        
                        <div className="px-2 md:px-6">
                            <TrackingTimeline currentStatus={order?.status} />
                        </div>
                    </div>

                    {/* AJUSTE PEDIDO: HISTÓRICO DE JORNADA PROFISSIONAL */}
                    <div className="space-y-8">
                        <h3 className="font-black uppercase text-[10px] md:text-xs tracking-[0.3em] text-zinc-400 flex items-center gap-2">
                            <Calendar size={14} /> Jornada Detalhada do Pacote
                        </h3>

                        <div className="relative space-y-8 before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-100 ml-2">
                            {events.length > 0 ? (
                                [...events].reverse().map((event: any, idx: number) => (
                                    <div key={idx} className="relative flex gap-6 pl-12 group animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                                        {/* Indicador Visual da Timeline Vertical */}
                                        <div className={`
                                            absolute left-0 w-[36px] h-[36px] rounded-xl flex items-center justify-center z-10 transition-all border-4 border-white
                                            ${idx === 0 ? 'bg-zinc-900 text-yellow-500 shadow-lg scale-110' : 'bg-white border-zinc-100 text-zinc-300'}
                                        `}>
                                            {idx === 0 ? <Loader2 size={16} className="animate-spin" /> : <div className="w-1.5 h-1.5 rounded-full bg-zinc-200" />}
                                        </div>

                                        <div className="flex flex-col text-left">
                                            <p className={`text-[11px] font-black uppercase italic tracking-tighter leading-none ${idx === 0 ? 'text-zinc-900' : 'text-zinc-400'}`}>
                                                {event.message}
                                            </p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 px-2 py-1 rounded-md border border-zinc-100">
                                                    {new Date(event.date).toLocaleDateString('pt-BR')} • {new Date(event.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <span className="text-[9px] font-black text-yellow-600 uppercase tracking-widest flex items-center gap-1">
                                                    <MapPin size={10} /> {event.location}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="pl-12 py-4 text-left">
                                    <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest italic">Aguardando atualização da transportadora...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* GRID DE INFORMAÇÕES (LÓGICA MANTIDA) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 border-t border-zinc-50 pt-10">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-zinc-400">
                                <User size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Identificação</span>
                            </div>
                            <div className="text-left text-sm leading-relaxed">
                                <p className="font-black text-zinc-800 uppercase">{customerName}</p>
                                <p className="text-zinc-500 font-bold break-all">{customerEmail}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-zinc-400">
                                <MapPin size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Destino</span>
                            </div>
                            <div className="text-left text-sm leading-relaxed">
                                <p className="text-zinc-800 font-black uppercase">{address.street}, {address.number}</p>
                                <p className="text-zinc-500 font-bold uppercase">{address.city}/{address.state}</p>
                                <p className="text-zinc-900 font-black text-xs mt-1">CEP: {address.zipcode}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-zinc-400">
                                <CreditCard size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Pagamento</span>
                            </div>
                            <div className="text-left">
                                <div className="mb-3">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
                                        order.status === 'PAGO' ? 'bg-green-50 text-green-600 border-green-100' :
                                        order.status === 'CANCELADO' ? 'bg-red-50 text-red-600 border-red-100' :
                                        'bg-yellow-50 text-yellow-600 border-yellow-100'
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>
                                {order.tracking_code && (
                                    <div className="flex items-center gap-2 bg-zinc-900 text-yellow-500 px-2 py-1 rounded-lg w-fit">
                                        <Hash size={12} />
                                        <span className="text-[11px] font-black uppercase">{order.tracking_code}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* LISTA DE PRODUTOS (LÓGICA MANTIDA) */}
                    <div className="space-y-6">
                        <h4 className="font-black uppercase text-[10px] md:text-xs tracking-[0.3em] border-b pb-4 text-zinc-400 flex items-center gap-2">
                            <Package size={14} /> Itens do Pedido
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {order.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between bg-zinc-50/50 p-4 rounded-3xl border border-zinc-100 group transition-colors hover:bg-zinc-50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-white rounded-xl overflow-hidden shadow-sm border border-zinc-100 shrink-0">
                                            <img src={item.image} className="w-full h-full object-cover" alt={item.product_name} />
                                        </div>
                                        <div className="text-left">
                                            <h5 className="font-black uppercase text-[10px] md:text-[11px] text-zinc-900 line-clamp-1">{item.product_name}</h5>
                                            <p className="text-[9px] font-bold text-zinc-400 uppercase mt-1">Qtd: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-black text-zinc-900 text-xs tracking-tighter shrink-0 ml-2">
                                        R$ {Number(item.unit_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RESUMO FINANCEIRO E AÇÕES (LÓGICA MANTIDA) */}
                    <div className="bg-zinc-900 text-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                            <div className="order-2 md:order-1">
                                {order.status === 'PENDENTE' ? (
                                    <div className="flex flex-col gap-3">
                                        <h5 className="font-black uppercase italic text-yellow-500 tracking-widest text-[10px] mb-2 text-left">Ações Disponíveis</h5>
                                        {order.payment_url && (
                                            <button
                                                onClick={() => window.open(order.payment_url, '_blank')}
                                                className="bg-yellow-500 text-black w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
                                            >
                                                <ExternalLink size={14} /> Pagar Agora
                                            </button>
                                        )}
                                        <button
                                            disabled={mutationCancel.isPending}
                                            onClick={() => mutationCancel.mutate()}
                                            className="bg-white/5 border border-white/10 text-red-400 w-full py-3 rounded-2xl font-black uppercase text-[9px] tracking-widest hover:bg-red-500/10 hover:text-red-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                                        >
                                            {mutationCancel.isPending ? <Loader2 className="animate-spin" size={14} /> : <XCircle size={14} />}
                                            Cancelar Pedido
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                            <CreditCard size={16} className="text-yellow-500" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[9px] font-medium text-zinc-400 uppercase tracking-widest mb-1">Meio de Captura</p>
                                            <p className="text-sm font-black uppercase tracking-tight">{order.capture_method || 'InfinitePay'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="order-1 md:order-2 space-y-3">
                                <div className="flex justify-between text-[10px] font-black uppercase text-zinc-400 tracking-[0.1em]">
                                    <span>Subtotal</span>
                                    <span className="text-white">R$ {subtotal?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase text-zinc-400 tracking-[0.1em]">
                                    <span>Frete</span>
                                    <span className="text-white">R$ {Number(order.amount_paid_shipping || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                                    <span className="font-black uppercase italic text-lg leading-none">Total</span>
                                    <div className="text-right leading-none">
                                        <span className="text-3xl md:text-4xl font-black text-white italic tracking-tighter leading-none">
                                            R$ {Number(order.total_value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOOTER (LÓGICA MANTIDA) */}
                <div className="p-6 md:p-8 bg-zinc-50 border-t border-zinc-100 flex flex-col md:flex-row gap-6 items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-zinc-400">
                        <FileText size={16} />
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-center md:text-left leading-tight">
                            Realizado em {new Date(order.created_at).toLocaleDateString('pt-BR')} • {new Date(order.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <button
                        onClick={() => window.print()}
                        className="w-full md:w-auto bg-white border border-zinc-200 px-8 py-4 rounded-2xl font-black uppercase italic text-[10px] tracking-widest hover:bg-zinc-900 hover:text-white transition-all shadow-sm active:scale-95"
                    >
                        Imprimir Dossiê
                    </button>
                </div>
            </div>
        </div>
    );
}