import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Edit3, Trash2, Plus, Loader2, Filter, Package2 } from 'lucide-react';
import { useAdminProducts } from '../../../../hooks/useAdminProducts';

// --- Interfaces para Tipagem Estrita (Manutenção) ---
interface Product {
  id: string | number;
  name: string;
  brand_name: string;
  image_1: string;
  stock: number;
  price: number | string;
}

/**
 * MyProducts - Gerenciamento de Inventário
 * Otimizado para SEO, IA Crawlers e Performance React.
 */
export default function MyProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page] = useState(1);

  // Debounce para performance: evita excesso de chamadas à API
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { products, isLoading } = useAdminProducts(page, debouncedSearch);

  return (
    <main className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER: Adaptativo e SEO Friendly */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">
            Meus Produtos
          </h1>
          <p className="text-zinc-500 text-sm font-medium">
            Painel de controle de inventário e precificação dinâmica.
          </p>
        </div>
        
        <Link 
          to="/admin/produto/adicionar" 
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-zinc-900 text-white rounded-2xl hover:bg-yellow-500 hover:text-black transition-all font-black uppercase italic text-xs shadow-lg active:scale-95"
          aria-label="Cadastrar um novo produto no sistema"
        >
          <Plus size={18} strokeWidth={3} /> Cadastrar Novo
        </Link>
      </header>

      {/* ÁREA DE FILTROS E BUSCA */}
      <section className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-zinc-50 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              value={searchTerm}
              placeholder="Buscar por nome ou marca..." 
              className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-yellow-500/20 transition-all placeholder:text-zinc-400"
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Campo de busca de produtos"
            />
          </div>
          <button 
            className="p-4 bg-zinc-50 rounded-2xl text-zinc-500 hover:bg-zinc-100 hover:text-black transition-all"
            title="Filtros Avançados"
          >
            <Filter size={20}/>
          </button>
        </div>

        {/* CONTAINER DA LISTAGEM - Otimizado para Mobile */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-32 flex flex-col items-center justify-center gap-4 text-zinc-400" aria-busy="true">
              <Loader2 className="animate-spin text-yellow-600" size={40} />
              <p className="text-[10px] font-black uppercase italic tracking-widest">Sincronizando Banco de Dados...</p>
            </div>
          ) : (
            <>
              {/* Layout Desktop (Oculto em Mobile) */}
              <table className="hidden md:table w-full text-left">
                <thead>
                  <tr className="bg-zinc-50/50">
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-400 italic">Produto</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-400 italic text-center">Estoque</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-400 italic">Preço</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-400 italic text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {products.map((product: Product) => (
                    <ProductRow key={product.id} product={product} />
                  ))}
                </tbody>
              </table>

              {/* Layout Mobile (Oculto em Desktop) */}
              <div className="md:hidden divide-y divide-zinc-50">
                {products.map((product: Product) => (
                  <ProductCardMobile key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

// --- Subcomponentes Otimizados ---

/**
 * Linha da Tabela (Desktop)
 * Performance: Uso de memoização implícita via mapeamento.
 */
const ProductRow = ({ product }: { product: Product }) => (
  <tr className="hover:bg-zinc-50/50 transition-colors group">
    <td className="px-8 py-6">
      <div className="flex items-center gap-4">
        <div className="relative w-14 h-14 overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50">
          <img 
            src={product.image_1} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
            loading="lazy"
          />
        </div>
        <div>
          <h4 className="text-sm font-black uppercase italic leading-none text-zinc-900">{product.name}</h4>
          <span className="text-[10px] font-bold text-zinc-400 mt-1.5 inline-block uppercase tracking-wider">{product.brand_name}</span>
        </div>
      </div>
    </td>
    <td className="px-8 py-6 text-center">
      <BadgeStock stock={product.stock} />
    </td>
    <td className="px-8 py-6">
      <p className="font-black text-sm italic text-zinc-900">
        R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </p>
    </td>
    <td className="px-8 py-6 text-right">
      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-3 text-zinc-400 hover:bg-zinc-900 hover:text-white rounded-xl transition-all shadow-sm" title="Editar">
          <Edit3 size={16} />
        </button>
        <button className="p-3 text-zinc-400 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm" title="Excluir">
          <Trash2 size={16} />
        </button>
      </div>
    </td>
  </tr>
);

/**
 * Card Mobile
 * UX: Transforma a linha da tabela em um card legível em celulares.
 */
const ProductCardMobile = ({ product }: { product: Product }) => (
  <article className="p-6 flex items-start justify-between gap-4">
    <div className="flex gap-4">
      <img src={product.image_1} className="w-16 h-16 rounded-2xl object-cover border border-zinc-100" alt="" />
      <div className="space-y-1">
        <h4 className="text-xs font-black uppercase italic leading-tight">{product.name}</h4>
        <p className="text-[9px] font-bold text-zinc-400 uppercase">{product.brand_name}</p>
        <div className="flex items-center gap-2 pt-1">
          <BadgeStock stock={product.stock} />
          <span className="text-xs font-black italic">R$ {Number(product.price).toFixed(2)}</span>
        </div>
      </div>
    </div>
    <div className="flex flex-col gap-2">
      <button className="p-3 bg-zinc-50 text-zinc-500 rounded-xl"><Edit3 size={16} /></button>
      <button className="p-3 bg-red-50 text-red-500 rounded-xl"><Trash2 size={16} /></button>
    </div>
  </article>
);

/**
 * Badge de Estoque
 * UX: Feedback visual imediato.
 */
const BadgeStock = ({ stock }: { stock: number }) => {
  const isLow = stock <= 5;
  return (
    <span className={`px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-tighter ${
      isLow ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-zinc-100 text-zinc-600'
    }`}>
      {stock === 0 ? 'Esgotado' : `${stock} UN`}
    </span>
  );
};