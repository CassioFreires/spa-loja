import React from 'react';
import { Package, ChevronRight, Clock, MapPin, CheckCircle2, Truck, Box, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMyOrders } from '../../../services/Orders/orders'; // Ajuste o caminho
import OrderDetailModal from '../../../components/modals/OrderDetailsModal';

const statusStyles: any = {
    'PENDENTE': "bg-yellow-50 text-yellow-600 border-yellow-100",
    'PAGO': "bg-green-50 text-green-600 border-green-100",
    'CANCELADO': "bg-red-50 text-red-600 border-red-100",
    'ENVIADO': "bg-blue-50 text-blue-600 border-blue-100",
};

export default function MyOrders() {
    const [selectedOrder, setSelectedOrder] = React.useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleOpenDetails = (order: any) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    // BUSCA OS DADOS REAIS DO BACKEND
    const { data: orders = [], isLoading } = useQuery({
        queryKey: ['my-orders'],
        queryFn: getMyOrders,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
                <Loader2 className="w-10 h-10 animate-spin text-yellow-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-10 font-sans text-zinc-900 text-left italic">
            <header className="max-w-5xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 leading-none">
                <div>
                    <Link to="/" className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest text-zinc-400 hover:text-yellow-600 transition-colors mb-4">
                        <ArrowLeft size={14} /> Voltar para a loja
                    </Link>
                    <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-zinc-900 leading-none">
                        Meus <span className="text-yellow-600">Pedidos</span>
                    </h1>
                </div>
                <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-3xl border border-zinc-100 shadow-sm text-zinc-900">
                    <Clock size={18} className="text-yellow-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Histórico Real</span>
                </div>
            </header>

            <main className="max-w-5xl mx-auto space-y-8">
                {orders.map((order: any) => (
                    <div key={order.id} className="bg-white rounded-[2.5rem] border border-zinc-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group">
                        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
                            {/* Preview da Imagem vinda do JOIN do backend */}
                            <div className="w-24 h-24 bg-zinc-50 rounded-2xl overflow-hidden flex-shrink-0 border border-zinc-100 relative">
                                <img
                                    src={order.items[0]?.image || 'assets/images/placeholder.png'}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    alt="Produto"
                                />
                            </div>

                            <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                                <div>
                                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">ID do Pedido</p>
                                    <h4 className="font-black text-sm uppercase">#{order.id}</h4>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Data</p>
                                    <h4 className="font-bold text-sm text-zinc-600">
                                        {new Date(order.created_at).toLocaleDateString('pt-BR')}
                                    </h4>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Total</p>
                                    <h4 className="font-black text-sm">
                                        R$ {Number(order.total_value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </h4>
                                </div>
                                <div className="text-right md:text-left">
                                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Status</p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase border ${statusStyles[order.status]}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleOpenDetails(order)} // <--- AQUI
                                className="w-full md:w-auto bg-zinc-900 text-white p-4 px-6 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-yellow-600 hover:text-black transition-all"
                            >
                                Detalhes
                            </button>
                        </div>

                        {/* LISTA REAL DE ITENS DO BANCO */}
                        <div className="bg-zinc-50/50 border-t border-zinc-100 px-8 py-6">
                            <div className="flex flex-wrap gap-4">
                                {order.items?.map((item: any) => (
                                    <div key={item.id} className="flex items-center gap-3 bg-white p-2 pr-4 rounded-xl border border-zinc-200 shadow-sm">
                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-100">
                                            <img src={item.image || 'assets/images/placeholder.png'} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="text-left leading-none">
                                            <p className="text-[10px] font-black uppercase italic line-clamp-1 max-w-[120px]">{item.product_name}</p>
                                            <p className="text-[8px] font-bold text-zinc-400 uppercase mt-1">
                                                QTD: {item.quantity} • {item.variation_value || 'Padrão'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ENDEREÇO REAL VINCULADO */}
                        <div className="px-8 pb-8 flex items-center gap-2 text-zinc-400">
                            <MapPin size={12} className="text-yellow-600" />
                            <p className="text-[9px] font-bold uppercase tracking-wider">
                                Enviar para: {order.street}, {order.number} - {order.city}/{order.state}
                            </p>
                        </div>
                    </div>
                ))}

                {orders.length === 0 && (
                    <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-zinc-200">
                        <Box size={48} className="mx-auto text-zinc-200 mb-4" />
                        <h3 className="font-black uppercase text-zinc-400 tracking-widest">Nenhum pedido realizado no banco de dados.</h3>
                        <Link to="/" className="inline-block mt-6 bg-zinc-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] hover:bg-yellow-600 transition-all">
                            Ir para as compras
                        </Link>
                    </div>
                )}
                <OrderDetailModal
                    order={selectedOrder}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </main>
        </div>
    );
}