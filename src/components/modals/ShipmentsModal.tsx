import React, { useState } from 'react';
import { X, Truck, DollarSign, Send, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registerShipment } from '../../services/Shipments/shipments';
import toast from 'react-hot-toast';

// Definimos a interface para resolver o erro de tipagem
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

  // Ajuste do useMutation com tipagem explícita
  const mutation = useMutation({
    mutationFn: (data: ShipmentData) => registerShipment(data),
    onSuccess: () => {
      toast.dismiss();
      toast.success("Logística atualizada com sucesso!");
      // Invalida as queries de pedidos para atualizar a lista do admin
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao registrar envio.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!trackingCode) return toast.error("Insira o código de rastreio.");
    if (!cost) return toast.error("Insira o custo do envio.");

    // Agora o .mutate recebe exatamente o que a ShipmentData descreve
    mutation.mutate({
      order_id: Number(order.id),
      tracking_code: trackingCode.toUpperCase(),
      shipping_cost: Number(cost),
      carrier: 'Correios'
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm italic">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative animate-in zoom-in duration-300">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-zinc-400 hover:text-black transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/20 text-black">
            <Truck size={24} />
          </div>
          <div className="text-left">
            <h3 className="font-black uppercase text-xl leading-none italic">Logística</h3>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1 leading-none">Pedido #{order.id}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div>
            <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2 ml-2">Código de Rastreio</label>
            <input 
              required
              className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-black uppercase text-xs focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
              placeholder="Ex: AA123456789BR"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2 ml-2">Custo do Frete (Taxa)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">R$</span>
              <input 
                required
                type="number"
                step="0.01"
                className="w-full p-4 pl-10 bg-zinc-50 border border-zinc-100 rounded-2xl font-black text-xs focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                placeholder="0,00"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </div>
          </div>

          <button 
            disabled={mutation.isPending}
            className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-black uppercase text-xs italic hover:bg-yellow-600 hover:text-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/10 disabled:opacity-50"
          >
            {mutation.isPending ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <><Send size={16} /> Confirmar Envio</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}