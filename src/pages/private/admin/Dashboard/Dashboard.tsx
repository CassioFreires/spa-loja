import React from 'react';
import { TrendingUp, Package, Box, ShoppingBag, ArrowUpRight, Clock } from 'lucide-react';
import { useAdminProducts } from '../../../../hooks/useAdminProducts';

export default function AdminDashboard() {
    const { stats, products, isLoading } = useAdminProducts(1, "");

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <header>
                <h1 className="text-3xl font-black uppercase italic tracking-tight">Visão Geral</h1>
                <p className="text-zinc-500 text-sm font-medium mt-2">Performance da Gold Store hoje.</p>
            </header>

            {/* MÉTRICAS REAIS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Produtos" value={stats.total} icon={<Box />} color="bg-blue-50 text-blue-600" />
                <StatCard label="Estoque Crítico" value={stats.lowStock} icon={<Package />} color="bg-orange-50 text-orange-600" />
                <StatCard label="Esgotados" value={stats.outOfStock} icon={<TrendingUp />} color="bg-red-50 text-red-600" />
                <StatCard label="Vendas Hoje" value="0" icon={<ShoppingBag />} color="bg-green-50 text-green-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* ALERTA DE ESTOQUE BAIXO */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-black uppercase italic flex items-center gap-2">
                            <Clock size={18} className="text-orange-500" /> Atenção ao Estoque
                        </h3>
                    </div>
                    <div className="space-y-3">
                        {products.filter((p:any) => p.stock <= 5).slice(0, 5).map((p:any) => (
                            <div key={p.id} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                                <span className="text-[10px] font-black uppercase italic text-zinc-600">{p.name}</span>
                                <span className={`font-black text-xs ${p.stock === 0 ? 'text-red-500' : 'text-orange-500'}`}>
                                    {p.stock} UN
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* HISTÓRICO DE VENDAS (MOCADO POR ENQUANTO) */}
                <div className="bg-zinc-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                    <h3 className="font-black uppercase italic mb-6 text-yellow-600 flex items-center gap-2">
                        <TrendingUp size={18} /> Últimas Vendas
                    </h3>
                    <div className="flex flex-col items-center justify-center py-10 opacity-20">
                        <ShoppingBag size={48} />
                        <p className="text-[10px] font-black uppercase mt-4">Aguardando novos pedidos</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Subcomponente de Card
function StatCard({ label, value, icon, color }: any) {
    return (
        <div className="bg-white p-6 rounded-[2rem] border border-zinc-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
            <div>
                <p className="text-[9px] font-black uppercase text-zinc-400 italic mb-1 tracking-widest">{label}</p>
                <p className="text-2xl font-black italic text-zinc-900">{value}</p>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${color}`}>
                {React.cloneElement(icon, { size: 20 })}
            </div>
        </div>
    );
}