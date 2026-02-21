import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, MessageSquare, Truck, ChevronDown, Filter, X, Tag, DollarSign, Layers } from 'lucide-react';
import ProductDetailModal from '../../../components/modals/productDetailModal';

/** * INTERFACES TÉCNICAS (Mantidas para compatibilidade) */
export interface Product {
  id: number;
  name: string;
  price: number;
  old_price?: number;
  image_url: string;
  category_name?: string;
  subcategory_name?: string;
  brand_id?: number | string;
  brand_name?: string;
  is_free_shipping?: boolean;
  discount_percentage?: number;
  variations?: any[];
}

interface Brand {
  id: number | string;
  name: string;
}

interface ProductPageLayoutProps {
  title: string;
  products: Product[];
  brands: Brand[];
  isLoading: boolean;
  isTransitioning?: boolean;
  pagination?: {
    total: number;
    lastPage: number;
    currentPage: number;
  };
  onPageChange?: (page: number) => void;
  filters: any;
  onFilterChange: (newFilters: any) => void;
}

export default function ProductPageLayout({
  title,
  products,
  brands,
  isLoading,
  filters,
  onFilterChange
}: ProductPageLayoutProps) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  /**
   * LÓGICA DE STATS: Conta produtos por filtro dinamicamente
   * Isso evita que o usuário selecione filtros vazios e melhora a UX.
   */
  const stats = useMemo(() => {
    const extractCounts = (type: string) => {
      const counts: Record<string, number> = {};
      products.forEach(p => {
        p.variations?.filter(v => v?.type === type).forEach(v => {
          counts[v.value] = (counts[v.value] || 0) + 1;
        });
      });
      return counts;
    };

    return {
      sizes: extractCounts('Tamanho'),
      colors: extractCounts('Cor'),
      numbers: extractCounts('Numeração'),
      brandCounts: products.reduce((acc: any, p) => {
        if (p.brand_id) acc[p.brand_id] = (acc[p.brand_id] || 0) + 1;
        return acc;
      }, {})
    };
  }, [products]);

  const toggleMobileFilters = () => setIsMobileFiltersOpen(!isMobileFiltersOpen);

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 min-h-screen font-sans italic">
      
      {/* HEADER DA PÁGINA */}
      <header className="mb-10 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <nav className="text-[10px] font-black text-zinc-400 uppercase flex items-center gap-2 tracking-[0.2em]" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-yellow-500 transition-colors">Início</Link>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-900">{title}</span>
          </nav>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-zinc-900 leading-[0.85]">
            {products.length > 0 ? products[0].category_name : title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={toggleMobileFilters}
            className="md:hidden flex-1 flex items-center justify-center gap-3 bg-zinc-900 text-white p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl active:scale-95 transition-all"
          >
            <Filter size={16} className="text-yellow-500" /> Filtros
          </button>

          <div className="relative group">
            <select
              aria-label="Ordenar produtos"
              className="appearance-none text-[11px] font-black uppercase bg-white border-2 border-zinc-100 pl-6 pr-12 py-4 rounded-2xl outline-none focus:border-yellow-500 cursor-pointer transition-all shadow-sm group-hover:border-zinc-300"
              value={filters.sort || 'name_asc'}
              onChange={(e) => onFilterChange({ sort: e.target.value })}
            >
              <option value="name_asc">A-Z (Alfabético)</option>
              <option value="price_asc">Menor Preço</option>
              <option value="price_desc">Maior Preço</option>
              <option value="newest">Novidades</option>
            </select>
            <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 group-hover:text-zinc-900 transition-colors" />
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-12 relative">
        
        {/* SIDEBAR DE FILTROS PROFISSIONAL */}
        <aside className={`
          fixed inset-0 z-[100] bg-white p-8 md:relative md:inset-auto md:z-0 md:bg-transparent md:p-0
          md:block w-full md:w-72 flex-shrink-0 space-y-10 overflow-y-auto custom-scrollbar
          ${isMobileFiltersOpen ? 'block' : 'hidden'}
        `}>
          <div className="flex justify-between items-center md:hidden mb-10">
            <h2 className="font-black uppercase italic text-2xl tracking-tighter">Refinar por</h2>
            <button onClick={toggleMobileFilters} className="p-3 bg-zinc-100 rounded-full active:scale-90 transition-all"><X size={24}/></button>
          </div>

          {/* FILTRO: MARCAS */}
          <FilterGroup title="Marcas" icon={<Tag size={14}/>}>
            <div className="space-y-1 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {brands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => onFilterChange({ brand_id: filters.brand_id === brand.id ? '' : brand.id })}
                  className={`w-full flex items-center justify-between py-3 px-4 rounded-xl transition-all text-left group
                    ${filters.brand_id === brand.id 
                      ? 'bg-zinc-900 text-white shadow-xl translate-x-2' 
                      : 'hover:bg-zinc-100 text-zinc-500'}`}
                >
                  <span className="text-[11px] font-black uppercase tracking-tight italic">{brand.name}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${filters.brand_id === brand.id ? 'bg-yellow-500 text-black' : 'bg-zinc-100 text-zinc-400'}`}>
                    {stats.brandCounts[brand.id] || 0}
                  </span>
                </button>
              ))}
            </div>
          </FilterGroup>

          {/* FILTRO: TAMANHOS / NUMERAÇÃO */}
          {(Object.keys(stats.sizes).length > 0 || Object.keys(stats.numbers).length > 0) && (
            <FilterGroup title={Object.keys(stats.sizes).length > 0 ? "Tamanhos" : "Numeração"} icon={<Layers size={14}/>}>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(Object.keys(stats.sizes).length > 0 ? stats.sizes : stats.numbers).map(([val, count]) => (
                  <button
                    key={val}
                    onClick={() => onFilterChange({ size: filters.size === val ? '' : val })}
                    className={`aspect-square flex flex-col items-center justify-center border-2 rounded-xl transition-all duration-300
                      ${filters.size === val 
                        ? 'border-yellow-500 bg-yellow-500 text-black font-black shadow-lg scale-105' 
                        : 'border-zinc-100 text-zinc-400 hover:border-zinc-300'}`}
                  >
                    <span className="text-[11px] font-black">{val}</span>
                    <span className="text-[7px] font-bold opacity-60 leading-none mt-1">{count}</span>
                  </button>
                ))}
              </div>
            </FilterGroup>
          )}

          {/* FILTRO: CORES */}
          {Object.keys(stats.colors).length > 0 && (
            <FilterGroup title="Cores" icon={<div className="w-3 h-3 rounded-full bg-gradient-to-tr from-yellow-500 to-zinc-900" />}>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(stats.colors).map(([color, count]) => (
                  <button
                    key={color}
                    onClick={() => onFilterChange({ color: filters.color === color ? '' : color })}
                    className={`flex items-center justify-between p-3 border-2 rounded-xl transition-all
                      ${filters.color === color 
                        ? 'border-zinc-900 bg-zinc-900 text-white shadow-md' 
                        : 'border-zinc-100 text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50'}`}
                  >
                    <span className="text-[10px] font-black uppercase truncate italic">{color}</span>
                    <span className="text-[8px] font-bold opacity-40">{count}</span>
                  </button>
                ))}
              </div>
            </FilterGroup>
          )}

          {/* FILTRO: PREÇO */}
          <FilterGroup title="Preço Máximo" icon={<DollarSign size={14}/>}>
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-400 italic">R$</span>
                <input
                  type="number"
                  placeholder="Até..."
                  className="w-full bg-white border-2 border-zinc-100 rounded-xl py-3.5 pl-10 pr-4 text-[12px] font-black italic focus:border-yellow-500 outline-none transition-all shadow-sm"
                  value={filters.max_price}
                  onChange={(e) => onFilterChange({ max_price: e.target.value })}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {['150', '300', '500'].map(price => (
                  <button 
                    key={price}
                    onClick={() => onFilterChange({ max_price: price })}
                    className={`text-[9px] font-black uppercase px-3 py-2 rounded-lg transition-all
                      ${filters.max_price === price ? 'bg-yellow-500 text-black' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}
                  >
                    Até R$ {price}
                  </button>
                ))}
              </div>
            </div>
          </FilterGroup>

          {/* BOTÃO RESETAR */}
          <button
            onClick={() => {
              onFilterChange({ brand_id: '', size: '', min_price: '', max_price: '', color: '', sort: 'name_asc' });
              setIsMobileFiltersOpen(false);
            }}
            className="w-full py-5 bg-zinc-950 text-white text-[11px] font-black uppercase hover:bg-yellow-500 hover:text-black transition-all rounded-2xl tracking-[0.2em] shadow-2xl active:scale-95 border-b-4 border-yellow-700 hover:border-yellow-600"
          >
            Limpar Todos Filtros
          </button>
        </aside>

        {/* VITRINE DE PRODUTOS */}
        <section className="flex-1" aria-busy={isLoading}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40 bg-zinc-50/50 rounded-[3rem] border-2 border-dashed border-zinc-200">
              <Loader2 className="w-12 h-12 animate-spin text-yellow-600 mb-6" />
              <span className="font-black uppercase text-[11px] tracking-[0.3em] text-zinc-400 italic">Autenticando Mantos...</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {products.length === 0 && (
                <div className="text-center py-40 border-2 border-dashed border-zinc-100 rounded-[3rem] bg-zinc-50/30">
                  <MessageSquare className="w-16 h-16 text-zinc-200 mx-auto mb-6" />
                  <p className="font-black uppercase text-zinc-400 text-sm tracking-widest italic">Nenhum item exclusivo por aqui hoje.</p>
                  <button 
                    onClick={() => onFilterChange({ brand_id: '', size: '', color: '', max_price: '' })}
                    className="mt-6 text-yellow-600 font-black text-[10px] uppercase underline underline-offset-4"
                  >
                    Remover Filtros
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

/** COMPONENTES DE APOIO (UI INTERNA) */
function FilterGroup({ title, children, icon }: { title: string, children: React.ReactNode, icon?: React.ReactNode }) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 border-b-2 border-zinc-100 pb-3">
        <span className="text-yellow-600">{icon}</span>
        <h4 className="font-black uppercase text-[12px] tracking-[0.15em] text-zinc-900 italic">
          {title}
        </h4>
      </div>
      {children}
    </section>
  );
}

/** CARD DE PRODUTO OTIMIZADO (Original mantido com melhorias de UI) */
function ProductCard({ product }: { product: Product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const allSpecs = useMemo(() => 
    product.variations ? [...new Set(product.variations.map(v => v.value))] : [],
    [product.variations]
  );

  return (
    <article 
      onClick={() => setIsModalOpen(true)} 
      className="group flex flex-col bg-transparent relative cursor-pointer"
    >
      <div className="relative aspect-[3/4] bg-zinc-100 overflow-hidden rounded-[2rem] border border-zinc-50 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 items-end">
          {product.discount_percentage && (
            <span className="bg-zinc-950 text-white text-[9px] font-black px-3 py-1.5 uppercase italic tracking-widest">
              -{product.discount_percentage}%
            </span>
          )}
          {product.is_free_shipping && (
            <span className="bg-yellow-500 text-black text-[9px] font-black px-3 py-1.5 uppercase italic flex items-center gap-1.5 shadow-xl">
              <Truck size={10} /> FRETE GRÁTIS
            </span>
          )}
        </div>

        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
        />

        {/* Reveal Variations on Hover */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 hidden md:flex gap-2 justify-center flex-wrap border-t border-zinc-100">
          {allSpecs.slice(0, 4).map(s => (
            <span key={s} className="text-[8px] font-black border-2 border-zinc-100 px-2 py-1 rounded-lg text-zinc-800 uppercase italic">{s}</span>
          ))}
          {allSpecs.length > 4 && <span className="text-[8px] font-black text-zinc-400">+{allSpecs.length - 4}</span>}
        </div>
      </div>

      <div className="py-6 space-y-2 px-2">
        <span className="text-[10px] font-black text-yellow-600 uppercase tracking-widest italic">
          {product.brand_name || 'Gold Store'}
        </span>
        <h3 className="text-[13px] font-black uppercase text-zinc-900 line-clamp-2 leading-snug tracking-tight italic">
          {product.name}
        </h3>

        <div className="flex flex-col gap-0.5 pt-2">
          {product.old_price && (
            <span className="text-[11px] text-zinc-400 line-through font-bold decoration-red-500/50">
              R${Number(product.old_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          )}
          <span className="text-2xl font-black text-zinc-950 italic tracking-tighter">
            R${Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {isModalOpen && (
        <ProductDetailModal
          product={product}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </article>
  );
}