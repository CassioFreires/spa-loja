import React, { useState } from 'react';
import { 
  Truck, Search, Loader2, CheckCircle2, ClipboardList, 
  Hash, DollarSign, Package, MapPin, Calendar, Lock, Eye 
} from 'lucide-react';
import { useAdminOrders } from '../../../../hooks/useAdminOrders';
import ShipmentModal from '../../../../components/modals/ShipmentsModal';
import UpdateTrackingModal from '../../../../components/modals/UpdateTrackingModal';
import OrderDetailModal from '../../../../components/modals/OrderDetailsModal';

export default function AdminOrders() {
    const [searchTerm, setSearchTerm] = useState("");
    const { data: orders = [], isLoading } = useAdminOrders();
    
    // Estados para controle de Modais
    const [orderForNewShipment, setOrderForNewShipment] = useState<any>(null);
    const [orderForUpdateTracking, setOrderForUpdateTracking] = useState<any>(null);
    const [orderForDetails, setOrderForDetails] = useState<any>(null);

    // Remove duplicatas por ID
    const uniqueOrders = Array.from(new Map(orders.map((o: any) => [o.id, o])).values());

    const filteredOrders = uniqueOrders.filter((o: any) => 
        o.id.toString().includes(searchTerm) || 
        o.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.tracking_code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 italic text-left">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-zinc-900 leading-none">
                        Fulfillment <span className="text-yellow-500">&</span> Logística
                    </h1>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest leading-none">
                        Painel Administrativo • DRE por Pedido e Gestão de Entregas
                    </p>
                </div>
            </header>

            <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-2xl shadow-zinc-200/50 overflow-hidden">
                <div className="p-8 border-b border-zinc-50 flex items-center justify-between gap-4 bg-zinc-50/30">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar Pedido, Cliente ou Rastreio..." 
                            className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-200 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all shadow-sm"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white">
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest">Identificação</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest">Packing List</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest">Rastreio Atual</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest">Balanço (R$)</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest text-right">Status / Gestão</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {isLoading ? (
                                <tr><td colSpan={5} className="py-24 text-center"><Loader2 className="animate-spin mx-auto text-yellow-500" size={32} /></td></tr>
                            ) : filteredOrders.map((order: any) => (
                                <tr key={order.id} className="hover:bg-zinc-50/50 transition-all group">
                                    
                                    {/* IDENTIFICAÇÃO - CLIQUE ABRE O DOSSIÊ */}
                                    <td 
                                        className="px-8 py-8 cursor-pointer group/item"
                                        onClick={() => setOrderForDetails(order)}
                                    >
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                <span className="bg-zinc-900 text-white text-[10px] px-2 py-0.5 rounded font-black group-hover/item:bg-yellow-500 group-hover/item:text-black transition-colors">#{order.id}</span>
                                                <Calendar size={12} className="text-zinc-400" />
                                                <span className="text-[10px] font-bold text-zinc-400">{new Date(order.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <span className="text-sm font-black uppercase text-zinc-800 underline decoration-zinc-200 underline-offset-4 decoration-2 group-hover/item:text-yellow-600 transition-all">
                                                {order.user_name}
                                            </span>
                                        </div>
                                    </td>

                                    {/* PACKING LIST RÁPIDO */}
                                    <td className="px-8 py-8">
                                        <div className="space-y-1 max-w-[180px]">
                                            {order.items?.map((item: any, idx: number) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <Package size={12} className="text-yellow-500 shrink-0" />
                                                    <span className="text-[10px] font-black text-zinc-600 uppercase truncate">
                                                        {item.quantity}x <span className="text-zinc-900">{item.product_name}</span>
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>

                                    {/* LOGÍSTICA & RASTREIO */}
                                    <td className="px-8 py-8">
                                        {order.shipment_id ? (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Hash size={12} className="text-yellow-600" />
                                                    <span className="text-xs font-black tracking-wider text-zinc-900 uppercase">{order.tracking_code}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400">
                                                    <MapPin size={10} />
                                                    <span className="uppercase truncate max-w-[120px]">{order.shipment_status || 'Postado'}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] font-black uppercase text-zinc-300 italic">Aguardando Envio</span>
                                        )}
                                    </td>

                                    {/* FINANCEIRO DETALHADO */}
                                    <td className="px-8 py-8">
                                        <div className="flex flex-col gap-1 w-32">
                                            <div className="flex justify-between text-xs font-black">
                                                <span className="text-zinc-400 italic">Venda</span>
                                                <span>R$ {Number(order.total_value).toFixed(2)}</span>
                                            </div>
                                            {order.shipping_cost > 0 && (
                                                <div className="flex justify-between text-[10px] font-bold text-red-500">
                                                    <span className="uppercase italic">Frete</span>
                                                    <span>- R$ {Number(order.shipping_cost).toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="pt-1 mt-1 border-t border-zinc-100 flex justify-between text-[10px] font-black text-green-600">
                                                <span className="italic">Líquido</span>
                                                <span className="bg-green-50 px-1 rounded italic">R$ {(Number(order.total_value) - Number(order.shipping_cost || 0)).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* STATUS E AÇÕES */}
                                    <td className="px-8 py-8 text-right">
                                        <div className="flex flex-col items-end gap-3">
                                            <span className={`px-3 py-1 rounded-full font-black text-[9px] uppercase border shadow-sm ${
                                                order.status === 'ENTREGUE' || order.shipment_status === 'ENTREGUE' ? 'bg-zinc-900 text-yellow-500 border-zinc-800' :
                                                order.status === 'ENVIADO' ? 'bg-blue-600 text-white border-blue-700' :
                                                order.status === 'PAGO' ? 'bg-green-500 text-white border-green-600' : 
                                                'bg-zinc-100 text-zinc-400 border-zinc-200'
                                            }`}>
                                                {order.shipment_status || order.status}
                                            </span>

                                            {order.status !== 'PENDENTE' ? (
                                                <div className="flex items-center gap-2">
                                                    {!order.shipment_id ? (
                                                        <button 
                                                            onClick={() => setOrderForNewShipment(order)}
                                                            className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-yellow-500 rounded-2xl font-black uppercase text-[10px] hover:bg-yellow-500 hover:text-black transition-all shadow-xl active:scale-95"
                                                        >
                                                            <Truck size={14} /> Registrar Envio
                                                        </button>
                                                    ) : order.status !== 'ENTREGUE' ? (
                                                        <button 
                                                            onClick={() => setOrderForUpdateTracking(order)}
                                                            className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-zinc-900 text-zinc-900 rounded-2xl font-black uppercase text-[10px] hover:bg-zinc-900 hover:text-white transition-all shadow-lg active:scale-95"
                                                        >
                                                            <ClipboardList size={14} /> Atualizar Status
                                                        </button>
                                                    ) : (
                                                        <CheckCircle2 size={18} className="text-green-500" />
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-zinc-300">
                                                    <Lock size={12} />
                                                    <span className="text-[10px] font-black uppercase italic tracking-tighter">Bloqueado para Envio</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL 1: DETALHES COMPLETOS / DOSSIÊ (Gatilho: Clique no Nome/ID) */}
            {orderForDetails && (
                <OrderDetailModal 
                    order={orderForDetails} 
                    isOpen={!!orderForDetails} 
                    onClose={() => setOrderForDetails(null)} 
                    isAdmin={true} // Habilita visão administrativa (CPF, NSU, Frete)
                />
            )}

            {/* MODAL 2: REGISTRO DE ENVIO (Gatilho: Botão Registrar Envio) */}
            {orderForNewShipment && (
                <ShipmentModal 
                    order={orderForNewShipment} 
                    onClose={() => setOrderForNewShipment(null)} 
                />
            )}

            {/* MODAL 3: ATUALIZAR JORNADA (Gatilho: Botão Atualizar Status) */}
            {orderForUpdateTracking && (
                <UpdateTrackingModal 
                    shipmentId={orderForUpdateTracking.shipment_id} 
                    orderId={orderForUpdateTracking.id} 
                    onClose={() => setOrderForUpdateTracking(null)} 
                />
            )}
        </div>
    );
}