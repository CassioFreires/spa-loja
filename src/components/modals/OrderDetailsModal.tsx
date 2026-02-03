import { X, Package, MapPin, CreditCard, QrCode, FileText, CheckCircle2, Truck, ShieldCheck } from 'lucide-react';

interface OrderDetailModalProps {
    order: any;
    isOpen: boolean;
    onClose: () => void;
}

export default function OrderDetailModal({ order, isOpen, onClose }: OrderDetailModalProps) {
    if (!isOpen || !order) return null;

    const subtotal = order.items?.reduce((acc: number, item: any) => acc + (Number(item.unit_price) * item.quantity), 0);

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl relative flex flex-col italic text-zinc-900 border border-zinc-200">
                
                {/* HEADER FIXO */}
                <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md p-8 border-b border-zinc-100 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-yellow-600 mb-1">
                            <ShieldCheck size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Pedido Autenticado</span>
                        </div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">
                            Detalhes do <span className="text-yellow-600">Pedido</span>
                        </h2>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-2">Protocolo: #{order.id}</p>
                    </div>
                    <button onClick={onClose} className="p-4 bg-zinc-100 rounded-full hover:bg-black hover:text-white transition-all shadow-sm">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 md:p-12 space-y-12">
                    
                    {/* GRID DE INFORMAÇÕES RÁPIDAS */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* ENTREGA */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-zinc-400">
                                <MapPin size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Endereço de Entrega</span>
                            </div>
                            <div className="text-left text-sm leading-relaxed">
                                <p className="font-black text-zinc-800 uppercase">{order.user_name}</p>
                                <p className="text-zinc-500 font-bold">{order.street}, {order.number}</p>
                                <p className="text-zinc-500 font-bold">{order.neighborhood} - {order.city}/{order.state}</p>
                                <p className="text-zinc-400 font-medium text-xs mt-1">CEP: {order.zipcode}</p>
                            </div>
                        </div>

                        {/* PAGAMENTO */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-zinc-400">
                                <CreditCard size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Método de Pagamento</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                                    {order.status === 'PAGO' ? <CheckCircle2 size={18} className="text-green-400" /> : <QrCode size={18} />}
                                </div>
                                <div className="text-left">
                                    <p className="font-black text-zinc-800 uppercase text-sm">{order.status}</p>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Transação via Gateway Seguro</p>
                                </div>
                            </div>
                        </div>

                        {/* STATUS LOGÍSTICO */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-zinc-400">
                                <Truck size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Previsão Logística</span>
                            </div>
                            <div className="text-left">
                                <p className="font-black text-zinc-800 uppercase text-sm">7 a 12 Dias Úteis</p>
                                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">Aguardando Coleta da Transportadora</p>
                            </div>
                        </div>
                    </div>

                    {/* LISTA DE PRODUTOS */}
                    <div className="space-y-6">
                        <h4 className="font-black uppercase text-xs tracking-[0.3em] border-b pb-4 text-zinc-400 flex items-center gap-2">
                            <Package size={14} /> Itens do Pacote
                        </h4>
                        <div className="space-y-4">
                            {order.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between bg-zinc-50/50 p-4 rounded-3xl border border-zinc-100 group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-20 bg-white rounded-2xl overflow-hidden shadow-sm border border-zinc-100">
                                            <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="text-left leading-tight">
                                            <h5 className="font-black uppercase text-sm text-zinc-900">{item.product_name}</h5>
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase mt-1">
                                                Tamanho: {item.variation_value || 'Único'} • Qtd: {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Unitário</p>
                                        <p className="font-black text-zinc-900 italic">R$ {Number(item.unit_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RESUMO FINANCEIRO FINAL */}
                    <div className="bg-zinc-900 text-white rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="space-y-2 text-left">
                                <h5 className="font-black uppercase italic text-yellow-500 tracking-widest text-sm leading-none">Fatura Fechada</h5>
                                <p className="text-[9px] font-medium text-zinc-400 uppercase tracking-widest">Obrigado por escolher a Gold Store Multimarcas.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                                    <span>Subtotal Bruto</span>
                                    <span>R$ {subtotal?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                                    <span>Taxa de Entrega</span>
                                    <span className="text-green-400">GRÁTIS</span>
                                </div>
                                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                                    <span className="font-black uppercase italic text-lg leading-none">Total Geral</span>
                                    <span className="text-4xl font-black text-white italic tracking-tighter leading-none">
                                        R$ {Number(order.total_value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOOTER DO MODAL */}
                <div className="p-8 bg-zinc-50 border-t border-zinc-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-400">
                        <FileText size={16} />
                        <span className="text-[9px] font-black uppercase tracking-widest leading-none">Comprovante gerado em {new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    <button 
                        onClick={() => window.print()}
                        className="w-full md:w-auto bg-white border border-zinc-200 px-8 py-4 rounded-2xl font-black uppercase italic text-[10px] tracking-widest hover:bg-zinc-900 hover:text-white transition-all shadow-sm active:scale-95"
                    >
                        Imprimir Recibo
                    </button>
                </div>
            </div>
        </div>
    );
}