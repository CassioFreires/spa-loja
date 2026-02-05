import { X, Package, MapPin, CreditCard, QrCode, FileText, CheckCircle2, Truck, ShieldCheck, User, Info, DollarSign, Hash } from 'lucide-react';

interface OrderDetailModalProps {
    order: any;
    isOpen: boolean;
    onClose: () => void;
    isAdmin?: boolean; // Prop para diferenciar visão Cliente vs Fornecedor
}

export default function OrderDetailModal({ order, isOpen, onClose, isAdmin = false }: OrderDetailModalProps) {
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
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                                {isAdmin ? 'Dossiê Administrativo' : 'Pedido Autenticado'}
                            </span>
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
                    <div className="grid md:grid-cols-3 gap-8 border-b border-zinc-50 pb-12">
                        
                        {/* DADOS DO CLIENTE (Visível apenas se isAdmin) */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-zinc-400">
                                <User size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Identificação do Cliente</span>
                            </div>
                            <div className="text-left text-sm leading-relaxed">
                                <p className="font-black text-zinc-800 uppercase">{order.user_name}</p>
                                {isAdmin && (
                                    <>
                                        <p className="text-zinc-500 font-bold">{order.user_email}</p>
                                        <p className="text-[10px] font-black text-yellow-600 uppercase mt-1">Doc: {order.user_document || 'N/A'}</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* ENTREGA / ETIQUETA */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-zinc-400">
                                <MapPin size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Endereço de Entrega</span>
                            </div>
                            <div className="text-left text-sm leading-relaxed">
                                <p className="text-zinc-500 font-bold">{order.street}, {order.number}</p>
                                <p className="text-zinc-500 font-bold">{order.complement && `${order.complement} - `}{order.neighborhood}</p>
                                <p className="text-zinc-500 font-bold">{order.city}/{order.state}</p>
                                <p className="text-zinc-900 font-black text-xs mt-1">CEP: {order.zip_code || order.zipcode}</p>
                            </div>
                        </div>

                        {/* LOGÍSTICA ATUAL */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-zinc-400">
                                <Truck size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Status Logístico</span>
                            </div>
                            <div className="text-left">
                                {order.tracking_code ? (
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 bg-zinc-900 text-yellow-500 px-2 py-1 rounded-lg w-fit">
                                            <Hash size={12} />
                                            <span className="text-[11px] font-black uppercase">{order.tracking_code}</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-blue-500 uppercase mt-1">
                                            {order.shipment_status || order.status}
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <p className="font-black text-zinc-800 uppercase text-sm">Aguardando Coleta</p>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase">Previsão: 7 a 12 Dias Úteis</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* LISTA DE PRODUTOS (PACKING LIST) */}
                    <div className="space-y-6">
                        <h4 className="font-black uppercase text-xs tracking-[0.3em] border-b pb-4 text-zinc-400 flex items-center gap-2">
                            <Package size={14} /> Packing List (Itens do Pacote)
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                            {order.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between bg-zinc-50/50 p-4 rounded-3xl border border-zinc-100 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-white rounded-xl overflow-hidden shadow-sm border border-zinc-100">
                                            <img src={item.image} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="text-left leading-tight">
                                            <h5 className="font-black uppercase text-xs text-zinc-900">{item.product_name}</h5>
                                            <p className="text-[9px] font-bold text-zinc-400 uppercase mt-1">
                                                Tam: {item.variation_value || 'Único'} • Qtd: {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-zinc-900 text-xs">R$ {Number(item.unit_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RESUMO FINANCEIRO (BALANÇO PARA ADMIN) */}
                    <div className="bg-zinc-900 text-white rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />
                        <div className="grid md:grid-cols-2 gap-10 items-end">
                            <div className="space-y-4 text-left">
                                <h5 className="font-black uppercase italic text-yellow-500 tracking-widest text-sm leading-none">Resumo Financeiro</h5>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                                            <CreditCard size={14} className="text-yellow-500" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-medium text-zinc-400 uppercase tracking-widest">Gateway</p>
                                            <p className="text-xs font-black uppercase">{order.capture_method || 'InfinitePay'}</p>
                                        </div>
                                    </div>
                                    {isAdmin && order.transaction_nsu && (
                                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-tighter">NSU: {order.transaction_nsu}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                                    <span>Subtotal Itens</span>
                                    <span>R$ {subtotal?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                                {isAdmin && order.shipping_cost > 0 && (
                                    <div className="flex justify-between text-[10px] font-black uppercase text-red-400 tracking-widest">
                                        <span>Custo Operacional Frete</span>
                                        <span>- R$ {Number(order.shipping_cost).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                )}
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

                {/* FOOTER - COMPROVANTE */}
                <div className="p-8 bg-zinc-50 border-t border-zinc-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-400">
                        <FileText size={16} />
                        <span className="text-[9px] font-black uppercase tracking-widest leading-none">Documento gerado em {new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    <button 
                        onClick={() => window.print()}
                        className="w-full md:w-auto bg-white border border-zinc-200 px-8 py-4 rounded-2xl font-black uppercase italic text-[10px] tracking-widest hover:bg-zinc-900 hover:text-white transition-all shadow-sm"
                    >
                        Imprimir Dossiê / Etiqueta
                    </button>
                </div>
            </div>
        </div>
    );
}