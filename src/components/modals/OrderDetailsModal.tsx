import { X, Package, MapPin, CreditCard, FileText, Truck, ShieldCheck, User, Hash, ExternalLink, XCircle, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelOrder, cancelOrderGuest } from '../../services/Orders/orders'; 
import toast from 'react-hot-toast';

interface OrderDetailModalProps {
    order: any;
    isOpen: boolean;
    onClose: () => void;
    isAdmin?: boolean;
}

export default function OrderDetailModal({ order, isOpen, onClose, isAdmin = false }: OrderDetailModalProps) {
    const queryClient = useQueryClient();

    // --- CAMADA DE COMPATIBILIDADE E NORMALIZAÇÃO ---
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

    // --- MUTAÇÃO DE CANCELAMENTO HÍBRIDA ---
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
            
            // O segredo está aqui: o 'id' impede que apareçam dois toasts ao mesmo tempo
            toast.error(errorMsg, { 
                id: 'cancel-action', 
                duration: 3000 
            });
        }
    });

    if (!isOpen || !order) return null;

    const subtotal = order.items?.reduce((acc: number, item: any) => acc + (Number(item.unit_price) * item.quantity), 0);

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300 leading-none">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl relative flex flex-col italic text-zinc-900 border border-zinc-200">
                
                {/* HEADER FIXO */}
                <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md p-8 border-b border-zinc-100 flex items-center justify-between leading-none">
                    <div>
                        <div className="flex items-center gap-2 text-yellow-600 mb-1 leading-none">
                            <ShieldCheck size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                                {isAdmin ? 'Dossiê Administrativo' : 'Pedido Autenticado'}
                            </span>
                        </div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">
                            Detalhes do <span className="text-yellow-600">Pedido</span>
                        </h2>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-2 leading-none">
                            Código: {order.order_code || `#${order.id}`}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-4 bg-zinc-100 rounded-full hover:bg-black hover:text-white transition-all shadow-sm active:scale-90 leading-none">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 md:p-12 space-y-12 leading-none">
                    
                    {/* GRID DE INFORMAÇÕES RÁPIDAS */}
                    <div className="grid md:grid-cols-3 gap-8 border-b border-zinc-50 pb-12 leading-none">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-zinc-400 leading-none">
                                <User size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Identificação</span>
                            </div>
                            <div className="text-left text-sm leading-relaxed">
                                <p className="font-black text-zinc-800 uppercase leading-tight">{customerName}</p>
                                <p className="text-zinc-500 font-bold break-all leading-tight">{customerEmail}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-zinc-400 leading-none">
                                <MapPin size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Entrega</span>
                            </div>
                            <div className="text-left text-sm leading-relaxed">
                                <p className="text-zinc-500 font-bold leading-tight">{address.street}, {address.number}</p>
                                <p className="text-zinc-500 font-bold leading-tight">{address.neighborhood}</p>
                                <p className="text-zinc-500 font-bold leading-tight">{address.city}/{address.state}</p>
                                <p className="text-zinc-900 font-black text-xs mt-1 leading-none">CEP: {address.zipcode}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-zinc-400 leading-none">
                                <Truck size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Status Logístico</span>
                            </div>
                            <div className="text-left leading-none">
                                <div className="mb-2 leading-none">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border leading-none ${
                                        order.status === 'PAGO' ? 'bg-green-50 text-green-600 border-green-100' :
                                        order.status === 'CANCELADO' ? 'bg-red-50 text-red-600 border-red-100' :
                                        'bg-yellow-50 text-yellow-600 border-yellow-100'
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>
                                {order.tracking_code && (
                                    <div className="flex items-center gap-2 bg-zinc-900 text-yellow-500 px-2 py-1 rounded-lg w-fit mt-2 leading-none">
                                        <Hash size={12} />
                                        <span className="text-[11px] font-black uppercase leading-none">{order.tracking_code}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* LISTA DE PRODUTOS */}
                    <div className="space-y-6 leading-none">
                        <h4 className="font-black uppercase text-xs tracking-[0.3em] border-b pb-4 text-zinc-400 flex items-center gap-2 leading-none">
                            <Package size={14} /> Itens do Pedido
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                            {order.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between bg-zinc-50/50 p-4 rounded-3xl border border-zinc-100 group leading-none transition-colors hover:bg-zinc-50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-white rounded-xl overflow-hidden shadow-sm border border-zinc-100 flex-shrink-0">
                                            <img src={item.image} className="w-full h-full object-cover" alt={item.product_name} />
                                        </div>
                                        <div className="text-left leading-tight">
                                            <h5 className="font-black uppercase text-[11px] text-zinc-900 line-clamp-1">{item.product_name}</h5>
                                            <p className="text-[9px] font-bold text-zinc-400 uppercase mt-1 leading-none">Qtd: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-black text-zinc-900 text-xs tracking-tighter leading-none">
                                        R$ {Number(item.unit_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RESUMO FINANCEIRO E AÇÕES DINÂMICAS */}
                    <div className="bg-zinc-900 text-white rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden shadow-xl leading-none">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
                        
                        <div className="grid md:grid-cols-2 gap-10 items-center">
                            <div className="space-y-4">
                                {order.status === 'PENDENTE' ? (
                                    <div className="flex flex-col gap-3">
                                        <h5 className="font-black uppercase italic text-yellow-500 tracking-widest text-[10px] leading-none mb-2">Ações Disponíveis</h5>
                                        {order.payment_url && (
                                            <button 
                                                onClick={() => window.open(order.payment_url, '_blank')} 
                                                className="bg-yellow-50 text-black px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 leading-none"
                                            >
                                                <ExternalLink size={14} /> Pagar Agora
                                            </button>
                                        )}
                                        <button 
                                            disabled={mutationCancel.isPending} 
                                            onClick={() => mutationCancel.mutate()} 
                                            className="bg-white/5 border border-white/10 text-red-400 px-6 py-3 rounded-2xl font-black uppercase text-[9px] tracking-widest hover:bg-red-500/10 hover:text-red-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 leading-none"
                                        >
                                            {mutationCancel.isPending ? <Loader2 className="animate-spin" size={14} /> : <XCircle size={14} />}
                                            Cancelar Pedido
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                                            <CreditCard size={14} className="text-yellow-500" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-medium text-zinc-400 uppercase tracking-widest leading-none mb-1">Gateway</p>
                                            <p className="text-xs font-black uppercase leading-none">{order.capture_method || 'InfinitePay'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3 leading-none">
                                <div className="flex justify-between text-[10px] font-black uppercase text-zinc-400 tracking-[0.1em] leading-none">
                                    <span>Subtotal</span>
                                    <span className="text-white font-bold leading-none">R$ {subtotal?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase text-zinc-400 tracking-[0.1em] leading-none">
                                    <span>Frete</span>
                                    <span className="text-white font-bold leading-none">R$ {Number(order.amount_paid_shipping || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="pt-4 border-t border-white/10 flex justify-between items-end leading-none">
                                    <span className="font-black uppercase italic text-lg leading-none">Total</span>
                                    <span className="text-4xl font-black text-white italic tracking-tighter leading-none">
                                        R$ {Number(order.total_value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="p-8 bg-zinc-50 border-t border-zinc-100 flex flex-col md:flex-row gap-4 items-center justify-between leading-none">
                    <div className="flex items-center gap-2 text-zinc-400 leading-none">
                        <FileText size={16} />
                        <span className="text-[9px] font-black uppercase tracking-widest leading-none">
                            Realizado em {new Date(order.created_at).toLocaleDateString('pt-BR')} às {new Date(order.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <button 
                        onClick={() => window.print()} 
                        className="w-full md:w-auto bg-white border border-zinc-200 px-8 py-4 rounded-2xl font-black uppercase italic text-[10px] tracking-widest hover:bg-zinc-900 hover:text-white transition-all shadow-sm active:scale-95 leading-none"
                    >
                        Imprimir Dossiê
                    </button>
                </div>
            </div>
        </div>
    );
}