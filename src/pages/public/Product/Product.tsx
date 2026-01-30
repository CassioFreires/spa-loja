import { Link } from 'react-router-dom';
import { Loader2, MessageSquare, Truck, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import ProductDetailModal from '../../../components/modals/productDetailModal';

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

  // Extração dinâmica de tamanhos baseada nos produtos carregados
  const availableSizes = Array.from(new Set(
    products.flatMap(p => p.variations?.filter(v => v?.type === 'Tamanho').map(v => v.value) || [])
  )).sort();

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 min-h-screen">
      <div className="flex flex-col md:flex-row gap-10">

        {/* SIDEBAR DE FILTROS */}
        <aside className="hidden md:block w-64 flex-shrink-0 space-y-8">
          {/* FILTRO DE MARCA */}
          <section>
            <h4 className="font-black uppercase text-[13px] tracking-widest mb-4 border-b pb-2 italic text-zinc-800">Marca</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {brands.length > 0 ? (
                brands.map((brand) => (
                  <label key={brand.id} className="flex items-center gap-3 text-[11px] font-bold uppercase cursor-pointer hover:text-yellow-600 transition-colors">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-black cursor-pointer"
                      checked={filters.brand_id === brand.id}
                      onChange={() => onFilterChange({ brand_id: filters.brand_id === brand.id ? '' : brand.id })}
                    />
                    <span className={filters.brand_id === brand.id ? "text-black" : "text-zinc-500"}>
                      {brand.name}
                    </span>
                  </label>
                ))
              ) : (
                <span className="text-[10px] text-zinc-400 italic font-bold">Carregando marcas...</span>
              )}
            </div>
          </section>

          {/* FILTRO DE TAMANHO */}
          <section>
            <h4 className="font-black uppercase text-[13px] tracking-widest mb-4 border-b pb-2 italic text-zinc-800">Tamanho</h4>
            <div className="grid grid-cols-3 gap-2">
              {availableSizes.length > 0 ? availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => onFilterChange({ size: filters.size === size ? '' : size })}
                  className={`py-2 text-[10px] font-black border transition-all ${filters.size === size
                    ? 'bg-black text-white border-black'
                    : 'border-zinc-200 text-zinc-500 hover:border-black'
                    }`}
                >
                  {size}
                </button>
              )) : <span className="text-[10px] text-zinc-400 font-bold italic col-span-3 text-center py-4 bg-zinc-50 rounded">Selecione uma categoria</span>}
            </div>
          </section>

          {/* FILTRO DE PREÇO */}
          <section>
            <h4 className="font-black uppercase text-[13px] tracking-widest mb-4 border-b pb-2 italic text-zinc-800">Preço</h4>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="De"
                className="w-full border border-zinc-200 rounded p-2 text-[11px] focus:outline-none focus:border-yellow-600 font-bold"
                value={filters.min_price}
                onChange={(e) => onFilterChange({ min_price: e.target.value })}
              />
              <input
                type="number"
                placeholder="Até"
                className="w-full border border-zinc-200 rounded p-2 text-[11px] focus:outline-none focus:border-yellow-600 font-bold"
                value={filters.max_price}
                onChange={(e) => onFilterChange({ max_price: e.target.value })}
              />
            </div>
          </section>

          {/* BOTÃO LIMPAR */}
          <button
            onClick={() => onFilterChange({ brand_id: '', size: '', min_price: '', max_price: '', color: '', sort: 'name_asc' })}
            className="w-full py-3 bg-zinc-900 text-white text-[10px] font-black uppercase hover:bg-yellow-600 hover:text-black transition-all rounded italic tracking-widest"
          >
            Limpar Filtros
          </button>
        </aside>

        {/* ÁREA DE PRODUTOS */}
        <div className="flex-1">
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <nav className="text-[10px] font-bold text-zinc-400 uppercase flex gap-2 mb-2 italic">
                <Link to="/" className="hover:text-yellow-600 transition-colors">Início</Link>
                <span>/</span>
                <span className="text-zinc-600">{title}</span>
              </nav>
              <h1 className="text-4xl font-black uppercase tracking-tighter text-zinc-900 italic leading-none">
                {products.map((p) => p.category_name).find(Boolean) || title}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <select
                className="text-[11px] font-black uppercase bg-white border border-zinc-200 px-4 py-2.5 rounded-full outline-none focus:border-yellow-600 cursor-pointer italic"
                value={filters.sort}
                onChange={(e) => onFilterChange({ sort: e.target.value })}
              >
                <option value="name_asc">Organizar: A-Z</option>
                <option value="price_asc">Menor Preço</option>
                <option value="price_desc">Maior Preço</option>
                <option value="newest">Novidades</option>
              </select>

              {pagination && (
                <div className="text-[11px] font-black uppercase text-zinc-500 bg-zinc-50 px-4 py-2.5 rounded-full border border-zinc-100 italic">
                  {pagination.total} Itens
                </div>
              )}
            </div>
          </header>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 bg-zinc-50/50 rounded-3xl border border-dashed border-zinc-200">
              <Loader2 className="w-10 h-10 animate-spin text-yellow-600" />
              <span className="mt-4 font-black uppercase text-[10px] tracking-widest text-zinc-400 italic">Atualizando vitrine...</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {pagination && pagination.lastPage > 1 && (
                <div className="mt-12 flex justify-center gap-2 border-t pt-8">
                  {Array.from({ length: pagination.lastPage }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => onPageChange?.(page)}
                      className={`w-10 h-10 text-[11px] font-black rounded-full transition-all border ${pagination.currentPage === page
                        ? 'bg-black text-white border-black shadow-lg shadow-black/20 scale-110'
                        : 'bg-white text-zinc-400 border-zinc-200 hover:border-black hover:text-black'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {!isLoading && products.length === 0 && (
            <div className="text-center py-32 border-2 border-dashed border-zinc-100 rounded-3xl bg-zinc-50/30">
              <MessageSquare className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
              <p className="font-black uppercase text-zinc-400 text-xs italic">Ops! Nenhum produto encontrado com esses filtros.</p>
              <button
                onClick={() => onFilterChange({ brand_id: '', size: '', min_price: '', max_price: '' })}
                className="mt-4 text-[10px] font-black uppercase text-yellow-600 underline underline-offset-4"
              >
                Resetar Filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const sizes = product.variations
    ? [...new Set(product.variations.filter(v => v?.type === 'Tamanho').map(v => v.value))]
    : [];

  // Função para abrir o modal sem navegar para a página de produto (opcional)
  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault(); // Impede a navegação do <Link>
    setIsModalOpen(true);
  };

  return (
    <>
      <div 
        onClick={handleOpenModal} 
        className="group flex flex-col bg-white overflow-hidden relative cursor-pointer"
      >
        <div className="relative aspect-[3/4] bg-zinc-100 overflow-hidden rounded-sm border border-zinc-100">
          <div className="absolute top-2 right-2 flex flex-col gap-1 z-10 items-end">
            {product.discount_percentage && (
              <span className="bg-black text-white text-[9px] font-black px-2 py-1 uppercase italic tracking-widest">
                {product.discount_percentage}% OFF
              </span>
            )}
            {product.is_free_shipping && (
              <span className="bg-yellow-500 text-black text-[9px] font-black px-2 py-1 uppercase italic flex items-center gap-1.5 shadow-xl">
                FRETE GRÁTIS
              </span>
            )}
          </div>

          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-3 translate-y-full group-hover:translate-y-0 transition-all duration-300 hidden md:flex gap-1.5 justify-center flex-wrap border-t border-zinc-100">
            {sizes.map(s => (
              <span key={s} className="text-[9px] font-black border border-zinc-200 px-2 py-0.5 rounded bg-white text-zinc-800">{s}</span>
            ))}
          </div>
        </div>

        <div className="py-4 space-y-1.5">
          <span className="text-[9px] font-bold text-yellow-600 uppercase tracking-tighter italic block">
            {product.brand_name || 'Premium'} • {product.category_name}
          </span>
          <h3 className="text-[11px] font-black uppercase text-zinc-800 line-clamp-2 leading-tight group-hover:text-yellow-600 transition-colors h-8">
            {product.name}
          </h3>

          <div className="flex flex-col">
            {product.old_price && (
              <span className="text-[10px] text-zinc-400 line-through font-bold">
                R${Number(product.old_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            )}
            <span className="text-lg font-black text-zinc-900 italic leading-none">
              R${Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* MODAL RENDERIZADO FORA DO LINK PARA EVITAR CONFLITOS */}
      {isModalOpen && (
        <ProductDetailModal
          product={product}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}