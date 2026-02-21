import React, { useState, useCallback } from 'react';
import { X, MapPin, ClipboardList, Send, Loader2, Navigation } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addTrackingEvent } from '../../services/Shipments/shipments';
import toast from 'react-hot-toast';

// --- Interfaces Estritas ---
interface TrackingPayload {
  shipmentId: number;
  status: string;
  location: string;
  description: string;
}

interface UpdateTrackingModalProps {
  shipmentId: number;
  orderId: number;
  onClose: () => void;
}

/**
 * UpdateTrackingModal - Gestão de Linha do Tempo Logística
 * Foco em UX de preenchimento rápido e feedback instantâneo.
 */
export default function UpdateTrackingModal({ shipmentId, orderId, onClose }: UpdateTrackingModalProps) {
  const [status, setStatus] = useState("Em trânsito");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const queryClient = useQueryClient();

  // Mutation com tipagem explícita para segurança e performance
  const mutation = useMutation({
    mutationFn: (data: Omit<TrackingPayload, 'shipmentId'>) => 
      addTrackingEvent({ shipmentId, ...data }),
    onSuccess: () => {
      toast.success("Evento registrado na timeline!");
      // Invalidação otimizada: atualiza apenas o contexto de ordens
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      onClose();
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erro na comunicação com o servidor.";
      toast.error(message);
    }
  });

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação robusta de UI
    if (!location.trim() || !description.trim()) {
      return toast.error("Por favor, detalhe a localização e o evento.");
    }

    mutation.mutate({ status, location, description });
  }, [status, location, description, mutation]);

  return (
    <div 
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-md animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white w-full max-w-lg rounded-[3rem] p-6 md:p-10 shadow-2xl relative animate-in zoom-in-95 duration-300 italic text-left border border-zinc-100">
        
        {/* BOTÃO FECHAR: Hit-target ampliado para Mobile */}
        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 p-2 text-zinc-400 hover:text-black hover:bg-zinc-50 rounded-full transition-all"
          aria-label="Fechar modal"
        >
          <X size={24} />
        </button>
        
        {/* HEADER SEMÂNTICO */}
        <header className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 bg-zinc-900 text-yellow-500 rounded-[1.2rem] flex items-center justify-center shadow-xl shadow-zinc-900/20 rotate-3">
            <Navigation size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="font-black uppercase text-2xl tracking-tighter leading-none">Novo Evento</h2>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-2 flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              Tracking ID: Pedido #{orderId}
            </p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* SELECTOR: Custom styling para evitar visual 'default' de browser */}
          <section>
            <label className="block text-[10px] font-black uppercase text-zinc-400 mb-3 ml-2 tracking-widest">
              Status da Movimentação
            </label>
            <div className="relative">
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-5 bg-zinc-50 border border-zinc-100 rounded-[1.5rem] font-black uppercase text-xs outline-none focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 appearance-none cursor-pointer transition-all"
              >
                <option value="Em trânsito">🚚 Em trânsito</option>
                <option value="Saiu para entrega">🛵 Saiu para entrega</option>
                <option value="Aguardando Retirada">📦 Aguardando Retirada</option>
                <option value="Entregue">✅ Entregue (Finaliza Pedido)</option>
                <option value="Problema na Entrega">⚠️ Problema na Entrega</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                <ClipboardList size={18} />
              </div>
            </div>
          </section>

          {/* GRID DE INPUTS: Responsivo */}
          <div className="grid grid-cols-1 gap-6">
            <section>
              <label className="block text-[10px] font-black uppercase text-zinc-400 mb-3 ml-2 tracking-widest">
                Unidade / Localização
              </label>
              <div className="relative group">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-yellow-600 transition-colors" size={20} />
                <input 
                  required
                  autoFocus
                  className="w-full p-5 pl-14 bg-zinc-50 border border-zinc-100 rounded-[1.5rem] font-bold text-sm outline-none focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all placeholder:text-zinc-300"
                  placeholder="Ex: CTE CURITIBA - PINHAIS/PR"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </section>

            <section>
              <label className="block text-[10px] font-black uppercase text-zinc-400 mb-3 ml-2 tracking-widest">
                Descrição do Objeto
              </label>
              <textarea 
                required
                rows={3}
                className="w-full p-5 bg-zinc-50 border border-zinc-100 rounded-[1.5rem] font-medium text-sm outline-none resize-none focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all placeholder:text-zinc-300"
                placeholder="Detalhe o status atual para o cliente..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </section>
          </div>

          {/* BOTÃO DE AÇÃO: Feedback tátil e visual */}
          <footer className="pt-4">
            <button 
              disabled={mutation.isPending}
              className="w-full py-6 bg-zinc-900 text-white rounded-[1.8rem] font-black uppercase text-xs tracking-widest italic hover:bg-yellow-500 hover:text-black transition-all flex items-center justify-center gap-3 shadow-2xl shadow-zinc-900/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {mutation.isPending ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  Salvar Atualização
                </>
              )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}