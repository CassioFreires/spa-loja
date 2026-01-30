import React, { useState } from 'react';
// 1. IMPORTAÇÃO CORRETA DO LINK PARA NAVEGAÇÃO
import { Link } from 'react-router-dom'; 
import {
    LayoutDashboard,
    Package,
    Plus,
    Search,
    Edit3,
    Trash2,
    ExternalLink,
    Filter,
    ArrowUpRight,
    TrendingUp,
    Box
    // Removido o Link daqui para não conflitar com o do react-router-dom
} from 'lucide-react';

const MOCK_PRODUCTS = [
    { id: 4, name: "Camiseta Gucci Monogram Black", price: 450.0, stock: 12, category: "Camisetas", brand: "Gucci", sales: 45 },
    { id: 9, name: "Slide Gucci Interlocking G", price: 850.0, stock: 5, category: "Calçados", brand: "Gucci", sales: 12 },
    { id: 12, name: "Jaqueta Puffer LV", price: 1200.0, stock: 0, category: "Inverno", brand: "Louis Vuitton", sales: 8 },
];

export default function AdminDashboard() {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="flex min-h-screen bg-[#F8F9FA] font-sans text-zinc-900">

            {/* SIDEBAR FIXA */}
            <aside className="w-64 bg-white border-r border-zinc-200 hidden lg:flex flex-col p-6 space-y-8">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                        <span className="text-yellow-500 font-black italic">G</span>
                    </div>
                    <span className="font-black uppercase italic tracking-tighter text-xl">Gold Admin</span>
                </div>

                <nav className="flex-1 space-y-1">
                    <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active />
                    <NavItem icon={<Package size={18} />} label="Meus Produtos" />
                    <NavItem icon={<TrendingUp size={18} />} label="Vendas" />
                </nav>

                <div className="bg-zinc-900 rounded-2xl p-4 text-white">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase italic mb-2">Plano Fornecedor</p>
                    <p className="text-sm font-black italic">GOLD PREMIUM</p>
                    <button className="mt-3 w-full bg-yellow-600 text-black text-[10px] font-black uppercase p-2 rounded-lg hover:bg-yellow-500 transition-colors">
                        Upgrade
                    </button>
                </div>
            </aside>

            {/* CONTEÚDO PRINCIPAL */}
            <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto">

                {/* HEADER DO DASHBOARD */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-black uppercase italic tracking-tight leading-none">Gestão de Produtos</h1>
                        <p className="text-zinc-500 text-sm font-medium mt-2">Gerencie seu estoque e catálogo da Gold Store.</p>
                    </div>

                    {/* BOTÃO CORRIGIDO */}
                    <Link
                        to="/admin/produto/adicionar"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-yellow-600 hover:text-black transition-all shadow-lg active:scale-95 group shadow-black/10"
                    >
                        <Plus size={18} className="flex-shrink-0 group-hover:rotate-90 transition-transform" />
                        <span className="text-sm font-black uppercase italic whitespace-nowrap">
                            Cadastrar Produto
                        </span>
                    </Link>
                </header>

                {/* CARDS DE RESUMO RÁPIDO */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard label="Total de Produtos" value="124" icon={<Box />} color="bg-blue-50 text-blue-600" />
                    <StatCard label="Estoque Baixo" value="12" icon={<Package />} color="bg-red-50 text-red-600" />
                    <StatCard label="Mais Vendido" value="Gucci Ghost" icon={<ArrowUpRight />} color="bg-green-50 text-green-600" />
                </div>

                {/* TABELA DE PRODUTOS PROFISSIONAL */}
                <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">

                    {/* BARRA DE FILTROS NA TABELA */}
                    <div className="p-6 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                            <input
                                type="text"
                                placeholder="Pesquisar por nome, ID ou marca..."
                                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:border-black transition-all font-bold"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2.5 border border-zinc-200 rounded-xl text-xs font-black uppercase italic text-zinc-600 hover:bg-zinc-50 transition-colors">
                            <Filter size={16} /> Filtros
                        </button>
                    </div>

                    {/* TABLE HEAD & BODY */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-50/50">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-400 italic">Produto</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-400 italic">Categoria</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-400 italic">Preço</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-400 italic">Estoque</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-400 italic text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {MOCK_PRODUCTS.map((product) => (
                                    <tr key={product.id} className="hover:bg-zinc-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-zinc-100 rounded-lg overflow-hidden flex-shrink-0 border border-zinc-200">
                                                    <div className="w-full h-full bg-zinc-200 animate-pulse" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black uppercase italic leading-none">{product.name}</p>
                                                    <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase">ID: #{product.id} • {product.brand}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="px-3 py-1 bg-zinc-100 text-[9px] font-black uppercase italic rounded-full text-zinc-500 border border-zinc-200">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-black italic text-zinc-900">
                                            R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="w-20 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-1000 ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                        style={{ width: `${Math.min(product.stock * 8, 100)}%` }}
                                                    />
                                                </div>
                                                <span className="text-[9px] font-black uppercase italic text-zinc-400">{product.stock} em estoque</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-end gap-2">
                                                <button title="Editar" className="p-2 text-zinc-400 hover:bg-black hover:text-white rounded-lg transition-all">
                                                    <Edit3 size={16} />
                                                </button>
                                                <button title="Excluir" className="p-2 text-zinc-400 hover:bg-red-500 hover:text-white rounded-lg transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                                <button title="Ver no Site" className="p-2 text-zinc-400 hover:bg-zinc-200 hover:text-black rounded-lg transition-all">
                                                    <ExternalLink size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
    return (
        <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase italic transition-all ${active ? 'bg-black text-white shadow-lg shadow-black/10' : 'text-zinc-500 hover:bg-zinc-100'}`}>
            {icon}
            {label}
        </button>
    );
}

function StatCard({ label, value, icon, color }: any) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
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