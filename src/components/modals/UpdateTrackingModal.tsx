import React, { useState } from 'react';
import { X, MapPin, ClipboardList, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addTrackingEvent } from '../../services/Shipments/shipments';
import toast from 'react-hot-toast';

interface UpdateTrackingModalProps {
  shipmentId: number; // ID da tabela 'shipments'
  orderId: number;    // ID da tabela 'orders'
  onClose: () => void;
}

export default function UpdateTrackingModal({ shipmentId, orderId, onClose }: UpdateTrackingModalProps) {
  const [status, setStatus] = useState("Em trânsito");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: any) => addTrackingEvent({ shipmentId, ...data }),
    onSuccess: () => {
      toast.dismiss();
      toast.success("Linha do tempo atualizada!");
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao atualizar rastreio.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !description) return toast.error("Preencha todos os campos.");
    mutation.mutate({ status, location, description });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm italic text-left">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative animate-in zoom-in duration-300">
        
        <button onClick={onClose} className="absolute top-6 right-6 text-zinc-400 hover:text-black">
          <X size={20} />
        </button>
        
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-yellow-500 shadow-lg">
            <ClipboardList size={24} />
          </div>
          <div>
            <h3 className="font-black uppercase text-xl leading-none italic">Novo Evento</h3>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Pedido #{orderId}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* SELETOR DE STATUS */}
          <div>
            <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2 ml-2 tracking-widest">Status da Movimentação</label>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-black uppercase text-xs outline-none focus:ring-2 focus:ring-yellow-500 appearance-none cursor-pointer"
            >
              <option value="Em trânsito">🚚 Em trânsito</option>
              <option value="Saiu para entrega">🛵 Saiu para entrega</option>
              <option value="Aguardando Retirada">📦 Aguardando Retirada</option>
              <option value="Entregue">✅ Entregue (Finaliza Pedido)</option>
              <option value="Problema na Entrega">⚠️ Problema na Entrega</option>
            </select>
          </div>

          {/* LOCALIZAÇÃO */}
          <div>
            <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2 ml-2 tracking-widest">Localização Atual</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input 
                required
                className="w-full p-4 pl-12 bg-zinc-50 border border-zinc-100 rounded-2xl font-black text-xs outline-none focus:ring-2 focus:ring-yellow-500/20"
                placeholder="Ex: Curitiba/PR"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          {/* DESCRIÇÃO */}
          <div>
            <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2 ml-2 tracking-widest">Descrição</label>
            <textarea 
              required
              rows={3}
              className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold text-xs outline-none resize-none focus:ring-2 focus:ring-yellow-500/20"
              placeholder="Ex: O objeto foi encaminhado para a unidade de tratamento."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button 
            disabled={mutation.isPending}
            className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase text-xs italic hover:bg-yellow-600 hover:text-black transition-all flex items-center justify-center gap-2 shadow-xl"
          >
            {mutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <><CheckCircle2 size={16} /> Salvar Atualização</>}
          </button>
        </form>
      </div>
    </div>
  );
}