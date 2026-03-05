import { CheckCircle2, Package, Truck, Home, Clock, AlertCircle } from 'lucide-react';

const steps = [
  { status: 'PENDENTE', label: 'Pedido Realizado', icon: Clock },
  { status: 'PAGO', label: 'Pagamento Confirmado', icon: CheckCircle2 },
  { status: 'PROCESSANDO', label: 'Preparando Pacote', icon: Package },
  { status: 'ENVIADO', label: 'Em Transporte', icon: Truck },
  { status: 'ENTREGUE', label: 'Entregue no Local', icon: Home },
];

export default function TrackingTimeline({ currentStatus }: { currentStatus: string }) {
  // Tratamento de Erros Críticos (Cancelamentos, Roubos, Avarias mapeados no Backend)
  if (currentStatus === 'CANCELADO') {
    return (
      <div className="flex items-center justify-center gap-3 bg-red-50 p-4 rounded-3xl text-red-600 border border-red-100">
        <AlertCircle size={20} />
        <span className="font-black uppercase italic text-[10px] tracking-widest">Problema com a Entrega - Entre em contato</span>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex(s => s.status === currentStatus);

  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between relative">
        {/* Linha de fundo */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-zinc-100 -translate-y-1/2 z-0" />
        
        {/* Linha de progresso com efeito Glow Gold */}
        <div 
          className="absolute top-1/2 left-0 h-[2px] bg-yellow-500 -translate-y-1/2 z-0 transition-all duration-1000 shadow-[0_0_8px_#eab308]" 
          style={{ width: `${currentStepIndex <= 0 ? 0 : (currentStepIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step.status} className="relative z-10 flex flex-col items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-700
                ${isCompleted ? 'bg-yellow-500 text-white' : 'bg-white text-zinc-300 border-2 border-zinc-100'}
                ${isCurrent ? 'ring-[6px] ring-yellow-100 scale-110' : ''}
              `}>
                <Icon size={18} strokeWidth={isCurrent ? 3 : 2} />
              </div>
              <p className={`
                absolute -bottom-8 text-[8px] md:text-[9px] font-black uppercase tracking-widest whitespace-nowrap
                ${isCurrent ? 'text-yellow-600' : isCompleted ? 'text-zinc-900' : 'text-zinc-300'}
              `}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}