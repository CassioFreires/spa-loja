import { CheckCircle2, Package, Truck, Home, Clock } from 'lucide-react';

const steps = [
  { status: 'PENDENTE', label: 'Pedido Realizado', icon: Clock },
  { status: 'PAGO', label: 'Pagamento Confirmado', icon: CheckCircle2 },
  { status: 'PROCESSANDO', label: 'Preparando Pacote', icon: Package },
  { status: 'ENVIADO', label: 'Em Transporte', icon: Truck },
  { status: 'ENTREGUE', label: 'Entregue', icon: Home },
];

export default function TrackingTimeline({ currentStatus }: { currentStatus: string }) {
  // Encontra o índice do status atual para pintar a linha do tempo
  const currentStepIndex = steps.findIndex(s => s.status === currentStatus);

  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between relative">
        {/* Linha de fundo */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-100 -translate-y-1/2 z-0" />
        
        {/* Linha de progresso ativa */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-yellow-500 -translate-y-1/2 z-0 transition-all duration-1000" 
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step.status} className="relative z-10 flex flex-col items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500
                ${isCompleted ? 'bg-yellow-500 text-white' : 'bg-white text-zinc-300 border-2 border-zinc-100'}
                ${isCurrent ? 'ring-4 ring-yellow-100 scale-110' : ''}
              `}>
                <Icon size={20} />
              </div>
              <p className={`
                absolute -bottom-8 text-[9px] font-black uppercase tracking-widest whitespace-nowrap
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