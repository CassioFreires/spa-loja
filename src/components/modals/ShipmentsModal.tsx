import React, { useState } from 'react';
import { X, Truck, Send, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registerShipment } from '../../services/Shipments/shipments';
import toast from 'react-hot-toast';

interface ShipmentData {
  order_id: number;
  tracking_code: string;
  shipping_cost: number;
  carrier: string;
}

export default function ShipmentModal({ order, onClose }: any) {
  const [trackingCode, setTrackingCode] = useState("");
  const [cost, setCost] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: ShipmentData) => registerShipment(data),
    onSuccess: () => {
      toast.success("Logística atualizada!");
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      onClose();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Erro no registro.")
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode || !cost) return toast.error("Preencha todos os campos.");
    
    mutation.mutate({
      order_id: Number(order.id),
      tracking_code: trackingCode.toUpperCase(),
      shipping_cost: Number(cost),
      carrier: 'Correios'
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative animate-in zoom-in duration-300 italic">
        <button onClick={onClose} className="absolute top-6 right-6 text-zinc-400 hover:text-black transition-colors"><X size={20} /></button>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-yellow-500 rounded-2xl flex items-center justify-center text-black shadow-lg shadow-yellow-500/20">
            <Truck size={28} />
          </div>
          <div className="text-left">
            <h3 className="font-black uppercase text-2xl leading-none italic tracking-tighter">Registrar Envio</h3>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Order DRE #{order.id}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase text-zinc-400 ml-2">Código de Rastreio (Alpha-Num)</label>
            <input 
              required
              className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-black uppercase text-sm focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all"
              placeholder="EX: NL123456789BR"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase text-zinc-400 ml-2">Custo Logístico Real (Frete)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-black text-xs">R$</span>
              <input 
                required
                type="number"
                step="0.01"
                className="w-full p-4 pl-12 bg-zinc-50 border border-zinc-100 rounded-2xl font-black text-sm focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all"
                placeholder="0,00"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </div>
          </div>

          <button 
            disabled={mutation.isPending}
            className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-black uppercase text-xs italic hover:bg-yellow-600 hover:text-black transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
          >
            {mutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <><Send size={16} /> Liberar Packing List</>}
          </button>
        </form>
      </div>
    </div>
  );
}