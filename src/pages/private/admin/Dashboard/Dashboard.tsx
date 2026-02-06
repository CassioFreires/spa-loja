import React from 'react';
import { TrendingUp, Package, Box, ShoppingBag, ArrowUpRight, Clock, Percent, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminProducts } from '../../../../hooks/useAdminProducts';

export default function AdminDashboard() {
    const { stats, products, isLoading } = useAdminProducts(1, "");

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black uppercase italic tracking-tight">Visão Geral</h1>
                    <p className="text-zinc-500 text-sm font-medium mt-2">Performance da Gold Store hoje.</p>
                </div>
            </header>

            {/* MÉTRICAS REAIS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Produtos" value={stats.total} icon={<Box />} color="bg-blue-50 text-blue-600" />
                <StatCard label="Estoque Crítico" value={stats.lowStock} icon={<Package />} color="bg-orange-50 text-orange-600" />
                <StatCard label="Esgotados" value={stats.outOfStock} icon={<TrendingUp />} color="bg-red-50 text-red-600" />
                <StatCard label="Vendas Hoje" value="0" icon={<ShoppingBag />} color="bg-green-50 text-green-600" />
            </div>

            {/* AÇÕES RÁPIDAS - NOVOS BOTÕES */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link 
                    to="/admin/products/add" 
                    className="group bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm hover:border-zinc-900 transition-all flex items-center justify-between"
                >
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-zinc-900 text-white rounded-2xl flex items-center justify-center group-hover:bg-yellow-600 transition-colors">
                            <Plus size={28} />
                        </div>
                        <div>
                            <h3 className="font-black uppercase italic text-lg leading-none">Novo Produto</h3>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase mt-1">Cadastro de inventário base</p>
                        </div>
                    </div>
                    <ArrowUpRight className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                </Link>

                <Link 
                    to="/admin/produto/desconto" 
                    className="group bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm hover:border-yellow-600 transition-all flex items-center justify-between"
                >
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center group-hover:bg-yellow-600 group-hover:text-white transition-colors">
                            <Percent size={28} />
                        </div>
                        <div>
                            <h3 className="font-black uppercase italic text-lg leading-none text-yellow-600">Criar Desconto</h3>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase mt-1">Gerenciar Top 5 e % OFF</p>
                        </div>
                    </div>
                    <ArrowUpRight className="text-zinc-300 group-hover:text-yellow-600 transition-colors" />
                </Link>
            </section>

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

                {/* HISTÓRICO DE VENDAS */}
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

// Subcomponente de Card de Métricas
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