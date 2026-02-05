import React from 'react';
import { Package, Clock, MapPin, Loader2, ExternalLink, XCircle, ArrowLeft, ShieldCheck, Box } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyOrders, cancelOrder } from '../../../services/Orders/orders';
import OrderDetailModal from '../../../components/modals/OrderDetailsModal';
import toast from 'react-hot-toast';

const statusStyles: any = {
    'PENDENTE': "bg-yellow-50 text-yellow-600 border-yellow-100",
    'PAGO': "bg-green-50 text-green-600 border-green-100",
    'CANCELADO': "bg-red-50 text-red-600 border-red-100",
    'ENVIADO': "bg-blue-50 text-blue-600 border-blue-100",
};

export default function MyOrders() {
    const queryClient = useQueryClient();
    const [selectedOrder, setSelectedOrder] = React.useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const { data: orders = [], isLoading } = useQuery({
        queryKey: ['my-orders'],
        queryFn: getMyOrders,
    });

    const mutationCancel = useMutation({
        mutationFn: (orderId: number) => cancelOrder(orderId),
        onSuccess: () => {
            toast.success("Pedido cancelado e estoque devolvido!");
            queryClient.invalidateQueries({ queryKey: ['my-orders'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Erro ao cancelar.");
        }
    });

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
            <Loader2 className="w-10 h-10 animate-spin text-yellow-600" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-10 font-sans text-zinc-900 italic text-left leading-none">
            <header className="max-w-5xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <Link to="/" className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest text-zinc-400 hover:text-yellow-600 mb-4 transition-all">
                        <ArrowLeft size={14} /> Retornar à loja
                    </Link>
                    <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-zinc-900 leading-none">
                        Meus <span className="text-yellow-600">Pedidos</span>
                    </h1>
                </div>
                <div className="bg-white px-6 py-4 rounded-3xl border border-zinc-100 flex items-center gap-3">
                    <ShieldCheck size={18} className="text-yellow-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Histórico Seguro</span>
                </div>
            </header>

            <main className="max-w-5xl mx-auto space-y-6">
                {orders.map((order: any) => (
                    <div key={order.id} className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-500 p-6 md:p-8">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="w-24 h-24 bg-zinc-50 rounded-2xl overflow-hidden border border-zinc-100">
                                <img src={order.items[0]?.image || 'placeholder.png'} className="w-full h-full object-cover" alt="Item" />
                            </div>

                            <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                                <div>
                                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1 leading-none">Pedido</p>
                                    <h4 className="font-black text-sm uppercase">#{order.id}</h4>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1 leading-none">Valor</p>
                                    <h4 className="font-black text-sm">R$ {Number(order.total_value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h4>
                                </div>
                                <div className="text-right md:text-left leading-none">
                                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Status</p>
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${statusStyles[order.status]}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="flex justify-end md:justify-start">
                                    <button onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }} className="p-3 bg-zinc-100 text-zinc-600 rounded-xl hover:bg-zinc-200 transition-all">
                                        <Package size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 w-full md:w-auto">
                                {order.status === 'PENDENTE' && order.payment_url ? (
                                    <>
                                        <button 
                                            onClick={() => window.open(order.payment_url, '_blank', 'noopener,noreferrer')}
                                            className="bg-zinc-900 text-white p-4 px-6 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-yellow-600 hover:text-black transition-all flex items-center justify-center gap-2"
                                        >
                                            <ExternalLink size={14} /> Pagar Agora
                                        </button>
                                        <button 
                                            disabled={mutationCancel.isPending}
                                            onClick={() => mutationCancel.mutate(order.id)}
                                            className="text-red-500 p-2 font-black uppercase text-[9px] tracking-widest hover:underline flex items-center justify-center gap-1"
                                        >
                                            <XCircle size={12} /> Cancelar
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }} className="bg-zinc-100 text-zinc-900 p-4 px-6 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-zinc-200 transition-all">
                                        Detalhes
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {orders.length === 0 && (
                    <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-zinc-200">
                        <Box size={48} className="mx-auto text-zinc-200 mb-4" />
                        <h3 className="font-black uppercase text-zinc-400 tracking-widest">Nenhum pedido encontrado.</h3>
                        <Link to="/" className="inline-block mt-6 bg-zinc-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] hover:bg-yellow-600">Comprar agora</Link>
                    </div>
                )}
            </main>

            <OrderDetailModal order={selectedOrder} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}