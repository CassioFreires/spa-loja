import { CheckCircle2, Package, Truck, Home, Clock, AlertCircle } from 'lucide-react';

const steps = [
  { status: 'PENDENTE', label: 'Pedido Realizado', icon: Clock },
  { status: 'PAGO', label: 'Pagamento Confirmado', icon: CheckCircle2 },
  { status: 'PROCESSANDO', label: 'Preparando Pacote', icon: Package },
  { status: 'ENVIADO', label: 'Em Transporte', icon: Truck },
  { status: 'ENTREGUE', label: 'Entregue', icon: Home },
];

export default function TrackingTimeline({ currentStatus }: { currentStatus: string }) {
  // Tratamento para cancelamento
  if (currentStatus === 'CANCELADO') {
    return (
      <div className="flex items-center justify-center gap-3 bg-red-50 p-4 rounded-3xl text-red-600 border border-red-100 animate-pulse">
        <AlertCircle size={20} />
        <span className="font-black uppercase italic text-[10px] tracking-widest">Pedido Cancelado</span>
      </div>
    );
  }

  // Encontra onde o pacote está na jornada
  const currentStepIndex = steps.findIndex(s => s.status === currentStatus);

  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between relative">
        {/* Linha Cinza de Fundo */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-100 -translate-y-1/2 z-0" />
        
        {/* Linha Amarela de Progresso */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-yellow-500 -translate-y-1/2 z-0 transition-all duration-1000 ease-in-out shadow-[0_0_10px_rgba(234,179,8,0.5)]" 
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
                ${isCurrent ? 'ring-8 ring-yellow-50 scale-110' : ''}
              `}>
                <Icon size={18} />
              </div>
              <p className={`
                absolute -bottom-8 text-[8px] md:text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-colors duration-500
                ${isCompleted ? 'text-zinc-900' : 'text-zinc-300'}
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