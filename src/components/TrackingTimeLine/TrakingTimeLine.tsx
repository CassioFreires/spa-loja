import { CheckCircle2, Package, Truck, Home, Clock, AlertCircle } from 'lucide-react';

const steps = [
  { status: 'PENDENTE', label: 'Pedido Realizado', icon: Clock },
  { status: 'PAGO', label: 'Pagamento Aprovado', icon: CheckCircle2 },
  { status: 'PROCESSANDO', label: 'Preparando Pacote', icon: Package },
  { status: 'ENVIADO', label: 'Em Transporte', icon: Truck },
  { status: 'ENTREGUE', label: 'Entregue no Local', icon: Home },
];

export default function TrackingTimeline({ currentStatus }: { currentStatus: string }) {
  const isCancelled = currentStatus === 'CANCELADO';
  const currentStepIndex = steps.findIndex(s => s.status === currentStatus);

  return (
    <div className="w-full py-12 px-2">
      <div className="flex items-center justify-between relative">
        {/* Linha Cinza de Fundo */}
        <div className="absolute top-1/2 left-0 w-full h-[3px] bg-zinc-100 -translate-y-1/2 z-0 rounded-full" />
        
        {/* Linha de progresso Amarela Gold */}
        {!isCancelled && (
          <div 
            className="absolute top-1/2 left-0 h-[3px] bg-yellow-500 -translate-y-1/2 z-0 transition-all duration-1000 ease-in-out shadow-[0_0_15px_#eab308]" 
            style={{ width: `${currentStepIndex <= 0 ? 0 : (currentStepIndex / (steps.length - 1)) * 100}%` }}
          />
        )}

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = !isCancelled && index <= currentStepIndex;
          const isCurrent = !isCancelled && index === currentStepIndex;

          return (
            <div key={step.status} className="relative z-10 flex flex-col items-center">
              <div className={`
                w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-700
                ${isCompleted ? 'bg-zinc-900 text-yellow-500 shadow-xl' : 'bg-white text-zinc-200 border-2 border-zinc-100'}
                ${isCurrent ? 'ring-[6px] ring-yellow-500/20 scale-110' : ''}
                ${isCancelled && index <= 1 ? 'bg-zinc-900 text-zinc-500' : ''}
              `}>
                <Icon size={22} strokeWidth={isCurrent ? 2.5 : 2} />
              </div>
              <div className="absolute -bottom-10 flex flex-col items-center">
                <p className={`
                  text-[9px] font-black uppercase tracking-[0.15em] whitespace-nowrap
                  ${isCurrent ? 'text-zinc-900' : isCompleted ? 'text-zinc-500' : 'text-zinc-300'}
                `}>
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {isCancelled && (
        <div className="mt-16 flex items-center gap-4 bg-red-50 border border-red-100 p-5 rounded-[2rem] animate-in zoom-in duration-300">
          <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white shrink-0">
            <AlertCircle size={24} />
          </div>
          <div>
            <h4 className="font-black text-red-600 uppercase italic text-xs tracking-tighter">Entrega Interrompida</h4>
            <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest leading-tight mt-1">
              Houve um problema no percurso. Verifique o histórico detalhado abaixo.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}