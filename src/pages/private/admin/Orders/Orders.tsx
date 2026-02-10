import React, { useState, useMemo } from 'react';
import { 
  Truck, Search, Loader2, CheckCircle2, ClipboardList, 
  Hash, Package, MapPin, Calendar, Lock 
} from 'lucide-react';
import { useAdminOrders } from '../../../../hooks/useAdminOrders';
import ShipmentModal from '../../../../components/modals/ShipmentsModal';
import UpdateTrackingModal from '../../../../components/modals/UpdateTrackingModal';
import OrderDetailModal from '../../../../components/modals/OrderDetailsModal';

/**
 * AdminOrders - Gestão de Fulfillment e DRE por Pedido
 * @description Interface administrativa para controle logístico e financeiro.
 */
export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: orders = [], isLoading } = useAdminOrders();
  
  // Controle de Modais com Tipagem Implícita Otimizada
  const [orderForNewShipment, setOrderForNewShipment] = useState<any | null>(null);
  const [orderForUpdateTracking, setOrderForUpdateTracking] = useState<any | null>(null);
  const [orderForDetails, setOrderForDetails] = useState<any | null>(null);

  // Performance: Memoização da filtragem e limpeza de duplicatas
  const filteredOrders = useMemo(() => {
    const unique = Array.from(new Map(orders.map((o: any) => [o.id, o])).values());
    if (!searchTerm) return unique;
    
    const term = searchTerm.toLowerCase();
    return unique.filter((o: any) => 
      o.id.toString().includes(term) || 
      o.user_name?.toLowerCase().includes(term) ||
      o.tracking_code?.toLowerCase().includes(term)
    );
  }, [orders, searchTerm]);

  return (
    <main className="space-y-6 md:space-y-8 animate-in fade-in duration-700 italic text-left p-4 md:p-0">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 pb-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-zinc-900 leading-none">
            Fulfillment <span className="text-yellow-500">&</span> Logística
          </h1>
          <p className="text-zinc-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] leading-none">
            DRE Real-time • Gestão de Cadeia de Suprimentos
          </p>
        </div>
      </header>

      {/* SEARCH ENGINE OPTIMIZED BAR */}
      <section className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-zinc-200/40 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-zinc-50 bg-zinc-50/30">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Localizar ID, Cliente ou Rastreio..." 
              className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-32 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-yellow-500" size={40} />
              <span className="text-[10px] font-black uppercase text-zinc-400">Sincronizando Logística...</span>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <table className="hidden lg:table w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-zinc-50">
                    <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest">Identificação</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest">Packing List</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest">Rastreio</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest">Balanço (R$)</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {filteredOrders.map((order: any) => (
                    <OrderRow 
                      key={order.id} 
                      order={order} 
                      onDetail={() => setOrderForDetails(order)}
                      onShip={() => setOrderForNewShipment(order)}
                      onUpdate={() => setOrderForUpdateTracking(order)}
                    />
                  ))}
                </tbody>
              </table>

              {/* MOBILE ADAPTIVE CARDS */}
              <div className="lg:hidden divide-y divide-zinc-100">
                {filteredOrders.map((order: any) => (
                  <OrderCardMobile 
                    key={order.id} 
                    order={order} 
                    onDetail={() => setOrderForDetails(order)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* MODALS RENDERER */}
      <OrderModals 
        orderForDetails={orderForDetails}
        setOrderForDetails={setOrderForDetails}
        orderForNewShipment={orderForNewShipment}
        setOrderForNewShipment={setOrderForNewShipment}
        orderForUpdateTracking={orderForUpdateTracking}
        setOrderForUpdateTracking={setOrderForUpdateTracking}
      />
    </main>
  );
}

/**
 * Componente de Linha de Tabela Otimizado
 */
function OrderRow({ order, onDetail, onShip, onUpdate }: any) {
  const liquid = Number(order.total_value) - Number(order.shipping_cost || 0);

  return (
    <tr className="hover:bg-zinc-50/50 transition-all group">
      <td className="px-8 py-8 cursor-pointer" onClick={onDetail}>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="bg-zinc-900 text-white text-[10px] px-2 py-0.5 rounded font-black group-hover:bg-yellow-500 group-hover:text-black transition-colors">#{order.id}</span>
            <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
              <Calendar size={12} /> {new Date(order.created_at).toLocaleDateString()}
            </span>
          </div>
          <span className="text-sm font-black uppercase text-zinc-800 underline decoration-zinc-200 underline-offset-4 decoration-2 group-hover:text-yellow-600 transition-all truncate max-w-[150px]">
            {order.user_name}
          </span>
        </div>
      </td>
      <td className="px-8 py-8">
        <div className="space-y-1">
          {order.items?.slice(0, 2).map((item: any, idx: number) => (
            <div key={idx} className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase truncate max-w-[180px]">
              <Package size={12} className="text-yellow-500 shrink-0" />
              <span>{item.quantity}x {item.product_name}</span>
            </div>
          ))}
          {order.items?.length > 2 && <span className="text-[9px] text-zinc-400 font-bold">+ {order.items.length - 2} itens</span>}
        </div>
      </td>
      <td className="px-8 py-8">
        {order.shipment_id ? (
          <div className="flex flex-col gap-1">
            <span className="text-xs font-black tracking-wider text-zinc-900 uppercase flex items-center gap-1">
              <Hash size={12} className="text-yellow-600" /> {order.tracking_code}
            </span>
            <span className="text-[9px] font-bold text-zinc-400 uppercase flex items-center gap-1">
              <MapPin size={10} /> {order.shipment_status || 'Postado'}
            </span>
          </div>
        ) : (
          <span className="text-[10px] font-black uppercase text-zinc-300 italic">Aguardando Envio</span>
        )}
      </td>
      <td className="px-8 py-8">
        <div className="flex flex-col gap-1 text-[11px]">
          <div className="flex justify-between w-24">
            <span className="text-zinc-400 font-bold italic">Venda</span>
            <span className="font-black">R$ {Number(order.total_value).toFixed(2)}</span>
          </div>
          <div className="flex justify-between w-24 pt-1 border-t border-zinc-100 text-green-600">
            <span className="font-bold italic text-[9px] uppercase">Lucro</span>
            <span className="font-black">R$ {liquid.toFixed(2)}</span>
          </div>
        </div>
      </td>
      <td className="px-8 py-8 text-right">
        <ActionButtons order={order} onShip={onShip} onUpdate={onUpdate} />
      </td>
    </tr>
  );
}

/** * Layout para Mobile
 */
function OrderCardMobile({ order, onDetail }: any) {
  return (
    <article className="p-6 bg-white space-y-4" onClick={onDetail}>
      <div className="flex justify-between items-start">
        <span className="bg-zinc-100 text-zinc-900 text-[10px] px-2 py-1 rounded-lg font-black italic">#{order.id}</span>
        <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase ${order.status === 'PAGO' ? 'bg-green-100 text-green-600' : 'bg-zinc-100 text-zinc-500'}`}>
          {order.status}
        </span>
      </div>
      <div>
        <h4 className="font-black text-sm uppercase italic leading-none">{order.user_name}</h4>
        <p className="text-[10px] text-zinc-400 font-bold mt-1 uppercase tracking-tight">Postagem: {order.tracking_code || 'Não registrada'}</p>
      </div>
      <div className="pt-2 flex justify-between items-center border-t border-zinc-50">
        <span className="font-black text-xs italic text-zinc-900">R$ {Number(order.total_value).toFixed(2)}</span>
        <button className="text-[10px] font-black text-yellow-600 uppercase italic">Ver Dossiê</button>
      </div>
    </article>
  );
}

/**
 * Abstração de Botões de Ação
 */
function ActionButtons({ order, onShip, onUpdate }: any) {
  if (order.status === 'PENDENTE') {
    return (
      <div className="flex items-center justify-end gap-1.5 text-zinc-300 italic">
        <Lock size={12} /> <span className="text-[9px] font-black uppercase">Bloqueado</span>
      </div>
    );
  }

  return (
    <div className="flex justify-end gap-2">
      {!order.shipment_id ? (
        <button onClick={onShip} className="px-4 py-2 bg-zinc-900 text-yellow-500 rounded-xl font-black uppercase text-[9px] hover:bg-yellow-500 hover:text-black transition-all flex items-center gap-2">
          <Truck size={12} /> Enviar
        </button>
      ) : order.status !== 'ENTREGUE' ? (
        <button onClick={onUpdate} className="px-4 py-2 border-2 border-zinc-900 text-zinc-900 rounded-xl font-black uppercase text-[9px] hover:bg-zinc-900 hover:text-white transition-all flex items-center gap-2">
          <ClipboardList size={12} /> Status
        </button>
      ) : (
        <CheckCircle2 size={20} className="text-green-500" />
      )}
    </div>
  );
}

/**
 * Gerenciador de Modais (Separado para evitar re-renders do componente pai)
 */
const OrderModals = React.memo(({ 
  orderForDetails, setOrderForDetails, 
  orderForNewShipment, setOrderForNewShipment,
  orderForUpdateTracking, setOrderForUpdateTracking 
}: any) => (
  <>
    {orderForDetails && (
      <OrderDetailModal order={orderForDetails} isOpen={!!orderForDetails} onClose={() => setOrderForDetails(null)} isAdmin={true} />
    )}
    {orderForNewShipment && (
      <ShipmentModal order={orderForNewShipment} onClose={() => setOrderForNewShipment(null)} />
    )}
    {orderForUpdateTracking && (
      <UpdateTrackingModal shipmentId={orderForUpdateTracking.shipment_id} orderId={orderForUpdateTracking.id} onClose={() => setOrderForUpdateTracking(null)} />
    )}
  </>
));