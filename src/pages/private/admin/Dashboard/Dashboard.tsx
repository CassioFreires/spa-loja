import React, { useMemo } from 'react';
// Importação separada: Componentes (valores) vs LucideIcon (tipo)
import { 
  TrendingUp, Package, Box, ShoppingBag, 
  ArrowUpRight, Clock, Percent, Plus 
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react'; 

import { Link } from 'react-router-dom';
import { useAdminProducts } from '../../../../hooks/useAdminProducts';

/** * DOCUMENTAÇÃO TÉCNICA:
 * - SEO: Uso de tags semânticas (main, section, article) para indexação e IA.
 * - UX: Layout responsivo adaptável (Mobile-First) com Tailwind CSS.
 * - Performance: Memoização de listas pesadas e componentes puros.
 */

interface Product {
  id: string | number;
  name: string;
  stock: number;
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  description: string;
}

export default function AdminDashboard() {
  const { stats, products, isLoading } = useAdminProducts(1, "");

  // Performance: Filtra produtos apenas quando a lista original 'products' mudar
  const criticalStockItems = useMemo(() => 
    products.filter((p: Product) => p.stock <= 5).slice(0, 5),
    [products]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" aria-busy="true">
        <div className="w-10 h-10 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Header com Hierarquia Visual para SEO */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-6">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tight text-zinc-900">
            Visão Geral
          </h1>
          <p className="text-zinc-500 text-sm font-medium mt-1">
            Performance e inventário Gold Store.
          </p>
        </div>
      </header>

      {/* Grid de Métricas - Flexibilidade Total de Dispositivo */}
      <section 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        aria-label="Estatísticas do dia"
      >
        <StatCard 
          label="Total Produtos" 
          value={stats.total} 
          icon={Box} 
          color="bg-blue-50 text-blue-600"
          description="Total de itens no banco"
        />
        <StatCard 
          label="Estoque Crítico" 
          value={stats.lowStock} 
          icon={Package} 
          color="bg-orange-50 text-orange-600"
          description="Itens abaixo de 5 unidades"
        />
        <StatCard 
          label="Esgotados" 
          value={stats.outOfStock} 
          icon={TrendingUp} 
          color="bg-red-50 text-red-600"
          description="Itens com estoque zero"
        />
        <StatCard 
          label="Vendas Hoje" 
          value="0" 
          icon={ShoppingBag} 
          color="bg-green-50 text-green-600"
          description="Pedidos faturados hoje"
        />
      </section>

      {/* Navegação de Ações Rápidas - UX intuitiva */}
      <nav className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-label="Ações administrativas">
        <QuickActionLink 
          to="/admin/products/add"
          title="Novo Produto"
          subtitle="Cadastro de inventário base"
          icon={Plus}
          variant="dark"
        />
        <QuickActionLink 
          to="/admin/produto/desconto"
          title="Criar Desconto"
          subtitle="Gerenciar Top 5 e % OFF"
          icon={Percent}
          variant="yellow"
        />
      </nav>

      {/* Seção de Análise e Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Alerta de Estoque: Micro-interações de Hover */}
        <section className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm">
          <h3 className="font-black uppercase italic flex items-center gap-2 mb-6 text-zinc-800">
            <Clock size={18} className="text-orange-500" /> Atenção ao Estoque
          </h3>
          <div className="space-y-3">
            {criticalStockItems.length > 0 ? (
              criticalStockItems.map((p: Product) => (
                <article key={p.id} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100 hover:bg-zinc-100 transition-colors cursor-default">
                  <span className="text-[11px] font-black uppercase italic text-zinc-600">{p.name}</span>
                  <span className={`font-black text-xs px-2 py-1 rounded-md ${p.stock === 0 ? 'bg-red-100 text-red-500' : 'bg-orange-100 text-orange-500'}`}>
                    {p.stock} UN
                  </span>
                </article>
              ))
            ) : (
              <p className="text-zinc-400 text-sm italic">Tudo sob controle no estoque.</p>
            )}
          </div>
        </section>

        {/* Card de Vendas: UI Minimalista */}
        <section className="bg-zinc-900 p-6 md:p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
          <h3 className="font-black uppercase italic mb-6 text-yellow-600 flex items-center gap-2">
            <TrendingUp size={18} /> Últimas Vendas
          </h3>
          <div className="flex flex-col items-center justify-center py-10 opacity-20 group-hover:opacity-40 transition-opacity">
            <ShoppingBag size={48} />
            <p className="text-[10px] font-black uppercase mt-4 tracking-widest">Aguardando novos pedidos</p>
          </div>
        </section>
      </div>
    </main>
  );
}

// --- Subcomponentes com Otimização de Performance ---

const StatCard = React.memo(({ label, value, icon: Icon, color, description }: StatCardProps) => (
  <div 
    className="bg-white p-6 rounded-[2rem] border border-zinc-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all group"
    title={description}
  >
    <div className="space-y-1">
      <p className="text-[9px] font-black uppercase text-zinc-400 italic tracking-widest">{label}</p>
      <p className="text-2xl font-black italic text-zinc-900">{value}</p>
    </div>
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 ${color}`}>
      <Icon size={22} strokeWidth={2.5} />
    </div>
  </div>
));

function QuickActionLink({ to, title, subtitle, icon: Icon, variant }: any) {
  const isDark = variant === 'dark';
  return (
    <Link 
      to={to} 
      className={`group p-6 md:p-8 rounded-[2.5rem] border transition-all flex items-center justify-between bg-white ${
        isDark ? 'hover:border-zinc-900' : 'hover:border-yellow-600'
      }`}
    >
      <div className="flex items-center gap-5">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
          isDark 
            ? 'bg-zinc-900 text-white group-hover:bg-yellow-600' 
            : 'bg-yellow-50 text-yellow-600 group-hover:bg-yellow-600 group-hover:text-white'
        }`}>
          <Icon size={28} />
        </div>
        <div>
          <h3 className={`font-black uppercase italic text-lg leading-none ${!isDark && 'text-yellow-600'}`}>
            {title}
          </h3>
          <p className="text-[10px] font-bold text-zinc-400 uppercase mt-1 tracking-tight">
            {subtitle}
          </p>
        </div>
      </div>
      <ArrowUpRight className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />
    </Link>
  );
}