import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, MessageSquare, Truck, ChevronDown, Filter, X } from 'lucide-react';
import ProductDetailModal from '../../../components/modals/productDetailModal';

/** * INTERFACES TÉCNICAS
 * Documentação clara para indexação e manutenção.
 */
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
  pagination,
  onPageChange,
  filters,
  onFilterChange
}: ProductPageLayoutProps) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // PERFORMANCE: Memoização da extração de variações para evitar loops desnecessários
  const specs = useMemo(() => {
    const extract = (type: string) => Array.from(new Set(
      products.flatMap(p => p.variations?.filter(v => v?.type === type).map(v => v.value) || [])
    )).sort();

    return {
      sizes: extract('Tamanho'),
      colors: extract('Cor'),
      numbers: extract('Numeração')
    };
  }, [products]);

  const toggleMobileFilters = () => setIsMobileFiltersOpen(!isMobileFiltersOpen);

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 min-h-screen font-sans italic">
      {/* HEADER DA PÁGINA: SEO & BREADCRUMBS */}
      <header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <nav className="text-[10px] font-bold text-zinc-400 uppercase flex items-center gap-2 tracking-widest" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-yellow-600 transition-colors">Início</Link>
            <span className="text-zinc-300">/</span>
            <span className="text-zinc-600">{title}</span>
          </nav>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-900 leading-[0.9]">
            {products.length > 0 ? products[0].category_name : title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Botão de Filtros Mobile */}
          <button 
            onClick={toggleMobileFilters}
            className="md:hidden flex-1 flex items-center justify-center gap-2 bg-zinc-100 p-4 rounded-xl font-black text-[10px] uppercase"
          >
            <Filter size={16} /> Filtros
          </button>

          <select
            aria-label="Ordenar produtos"
            className="text-[11px] font-black uppercase bg-white border-2 border-zinc-100 px-6 py-3 rounded-full outline-none focus:border-yellow-500 cursor-pointer transition-all"
            value={filters.sort || 'name_asc'}
            onChange={(e) => onFilterChange({ sort: e.target.value })}
          >
            <option value="name_asc">A-Z</option>
            <option value="price_asc">Menor Preço</option>
            <option value="price_desc">Maior Preço</option>
            <option value="newest">Novidades</option>
          </select>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-12 relative">
        
        {/* SIDEBAR DE FILTROS: Otimizada para Mobile/Desktop */}
        <aside className={`
          fixed inset-0 z-50 bg-white p-8 md:relative md:inset-auto md:z-0 md:bg-transparent md:p-0
          md:block w-full md:w-64 flex-shrink-0 space-y-8 overflow-y-auto
          ${isMobileFiltersOpen ? 'block' : 'hidden'}
        `}>
          <div className="flex justify-between items-center md:hidden mb-8">
            <h2 className="font-black uppercase italic text-xl">Filtros</h2>
            <button onClick={toggleMobileFilters} className="p-2 bg-zinc-100 rounded-full"><X size={24}/></button>
          </div>

          <section aria-labelledby="filter-brand">
            <h4 id="filter-brand" className="font-black uppercase text-[12px] tracking-widest mb-4 border-b-2 border-zinc-100 pb-2 text-zinc-800">Marca</h4>
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {brands.map((brand) => (
                <label key={brand.id} className="group flex items-center gap-3 text-[11px] font-bold uppercase cursor-pointer hover:text-yellow-600 transition-colors">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-zinc-900 cursor-pointer rounded-none"
                    checked={filters.brand_id === brand.id}
                    onChange={() => onFilterChange({ brand_id: filters.brand_id === brand.id ? '' : brand.id })}
                  />
                  <span className={filters.brand_id === brand.id ? "text-black font-black" : "text-zinc-500"}>
                    {brand.name}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Filtros Dinâmicos (Cor, Tamanho, Numeração) */}
          {[
            { label: 'Cor', data: specs.colors, key: 'color' },
            { label: 'Tamanho', data: specs.sizes, key: 'size' },
            { label: 'Numeração', data: specs.numbers, key: 'size' }
          ].map((filterGroup) => filterGroup.data.length > 0 && (
            <section key={filterGroup.label} aria-labelledby={`filter-${filterGroup.label}`}>
              <h4 id={`filter-${filterGroup.label}`} className="font-black uppercase text-[12px] tracking-widest mb-4 border-b-2 border-zinc-100 pb-2 text-zinc-800">
                {filterGroup.label}
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {filterGroup.data.map((val: string) => (
                  <button
                    key={val}
                    onClick={() => onFilterChange({ [filterGroup.key]: filters[filterGroup.key] === val ? '' : val })}
                    className={`py-2 text-[9px] font-black border-2 transition-all duration-300 ${
                      filters[filterGroup.key] === val
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-lg'
                        : 'border-zinc-100 text-zinc-400 hover:border-zinc-300'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </section>
          ))}

          <section aria-labelledby="filter-price">
            <h4 id="filter-price" className="font-black uppercase text-[12px] tracking-widest mb-4 border-b-2 border-zinc-100 pb-2 text-zinc-800">Faixa de Preço</h4>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Mín"
                aria-label="Preço Mínimo"
                className="w-full border-2 border-zinc-100 rounded-lg p-3 text-[11px] focus:border-yellow-500 outline-none font-bold italic transition-all"
                value={filters.min_price}
                onChange={(e) => onFilterChange({ min_price: e.target.value })}
              />
              <input
                type="number"
                placeholder="Máx"
                aria-label="Preço Máximo"
                className="w-full border-2 border-zinc-100 rounded-lg p-3 text-[11px] focus:border-yellow-500 outline-none font-bold italic transition-all"
                value={filters.max_price}
                onChange={(e) => onFilterChange({ max_price: e.target.value })}
              />
            </div>
          </section>

          <button
            onClick={() => {
              onFilterChange({ brand_id: '', size: '', min_price: '', max_price: '', color: '', sort: 'name_asc' });
              setIsMobileFiltersOpen(false);
            }}
            className="w-full py-4 bg-zinc-950 text-white text-[10px] font-black uppercase hover:bg-yellow-500 hover:text-black transition-all rounded-xl tracking-widest shadow-xl active:scale-95"
          >
            Resetar Filtros
          </button>
        </aside>

        {/* VITRINE DE PRODUTOS */}
        <section className="flex-1" aria-busy={isLoading}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40 bg-zinc-50/50 rounded-[3rem] border-2 border-dashed border-zinc-200 animate-pulse">
              <Loader2 className="w-12 h-12 animate-spin text-yellow-600 mb-4" />
              <span className="font-black uppercase text-[10px] tracking-widest text-zinc-400 italic">Curando as melhores peças...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!isLoading && products.length === 0 && (
            <div className="text-center py-40 border-2 border-dashed border-zinc-100 rounded-[3rem] bg-zinc-50/30">
              <MessageSquare className="w-16 h-16 text-zinc-200 mx-auto mb-6" />
              <p className="font-black uppercase text-zinc-400 text-sm tracking-widest italic">Nenhuma raridade encontrada com esses filtros.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/**
 * CARD DE PRODUTO OTIMIZADO
 */
function ProductCard({ product }: { product: Product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const allSpecs = useMemo(() => 
    product.variations ? [...new Set(product.variations.map(v => v.value))] : [],
    [product.variations]
  );

  const handleOpenModal = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  }, []);

  return (
    <article 
      onClick={handleOpenModal} 
      className="group flex flex-col bg-transparent overflow-hidden relative cursor-pointer transition-all duration-300"
    >
      {/* IMAGEM COM ASPECTO FIXO (PREVINE CLS) */}
      <div className="relative aspect-[3/4] bg-zinc-100 overflow-hidden rounded-2xl border border-zinc-50 shadow-sm">
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 items-end">
          {product.discount_percentage && (
            <span className="bg-zinc-950 text-white text-[9px] font-black px-2.5 py-1.5 uppercase italic tracking-widest shadow-2xl">
              -{product.discount_percentage}%
            </span>
          )}
          {product.is_free_shipping && (
            <span className="bg-yellow-500 text-black text-[9px] font-black px-2.5 py-1.5 uppercase italic flex items-center gap-1.5 shadow-2xl">
              <Truck size={10} /> FRETE GRÁTIS
            </span>
          )}
        </div>

        <img
          src={product.image_url}
          alt={`Peça Premium ${product.name}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />

        {/* Hover Variations - Mobile amigável via pointer-events-none no desktop */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 hidden md:flex gap-2 justify-center flex-wrap border-t border-zinc-100">
          {allSpecs.slice(0, 6).map(s => (
            <span key={s} className="text-[8px] font-black border border-zinc-200 px-2 py-1 rounded bg-white text-zinc-800 uppercase shadow-sm">{s}</span>
          ))}
          {allSpecs.length > 6 && <span className="text-[8px] font-black text-zinc-400">+{allSpecs.length - 6}</span>}
        </div>
      </div>

      <div className="py-5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-black text-yellow-600 uppercase tracking-widest italic">
            {product.brand_name || 'Gold Store'} • {product.category_name}
          </span>
        </div>
        
        <h3 className="text-xs font-black uppercase text-zinc-900 line-clamp-2 leading-snug tracking-tight">
          {product.name}
        </h3>

        <div className="flex flex-col gap-0.5 pt-1">
          {product.old_price && (
            <span className="text-[10px] text-zinc-400 line-through font-bold decoration-red-500/50">
              R${Number(product.old_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          )}
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-zinc-950 italic tracking-tighter">
              R${Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
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