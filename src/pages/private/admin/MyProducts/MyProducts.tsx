import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Edit3, Trash2, Plus, Loader2, Layers } from 'lucide-react';
import { useAdminProducts } from '../../../../hooks/useAdminProducts';
import EditProductModal from '../../../../components/modals/EditProductModalProps';
import { useDeleteProduct } from '../../../../hooks/useDeleteProduct';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface Product {
  id: string | number;
  name: string;
  brand_name: string;
  image_1: string;
  displayStock: number;
  stockStatus: 'out' | 'low' | 'ok';
  price: number | string;
  hasVariations: boolean;
  variations?: any[];
}

export default function MyProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);


  // --- ESTADOS ---
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // --- HOOKS ---
  const { products, isLoading, pagination } = useAdminProducts(currentPage, debouncedSearch);
  const deleteMutation = useDeleteProduct();
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Volta para pag 1 ao pesquisar
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // --- AÇÕES ---
  const handleDelete = async (product: Product) => {
    const result = await MySwal.fire({
      title: <span className="uppercase font-black italic text-zinc-900">Excluir Produto?</span>,
      html: (
        <p className="text-sm text-zinc-500 font-medium leading-relaxed">
          Você está prestes a remover <strong className="text-zinc-900">{product.name}</strong>.<br />
          Esta ação é <span className="text-red-600 font-bold underline">irreversível</span> e removerá todas as variações e SKUs associados.
        </p>
      ),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#000000', // Black profissional
      cancelButtonColor: '#d4d4d8', // Zinc 300
      confirmButtonText: 'SIM, EXCLUIR AGORA',
      cancelButtonText: 'CANCELAR',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-[2.5rem] border-none shadow-2xl p-10',
        confirmButton: 'rounded-xl font-black uppercase italic text-[10px] px-8 py-4 tracking-widest',
        cancelButton: 'rounded-xl font-black uppercase italic text-[10px] px-8 py-4 tracking-widest text-zinc-600'
      }
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(product.id);
    }
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  return (
    <main className="max-w-7xl mx-auto space-y-8 p-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-yellow-600 font-bold text-xs uppercase tracking-widest">
            <div className="w-8 h-[2px] bg-yellow-600" /> Gestão de Inventário
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">
            Meus <span className="text-zinc-400">Produtos</span>
          </h1>
        </div>

        <Link
          to="/admin/produto/adicionar"
          className="group inline-flex items-center gap-3 px-8 py-4 bg-zinc-950 text-white rounded-2xl hover:bg-yellow-500 hover:text-black transition-all duration-300 font-black uppercase italic text-xs shadow-xl active:scale-95"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          Novo Lançamento
        </Link>
      </header>

      <section className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 bg-zinc-50/50 flex flex-wrap items-center gap-4 border-b border-zinc-100">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              placeholder="Pesquisar por nome ou marca..."
              className="w-full pl-14 pr-6 py-4 bg-white border border-zinc-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-32 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-yellow-500" size={48} />
              <p className="text-[10px] font-black uppercase italic tracking-widest text-zinc-400">Sincronizando Base de Dados</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100">
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest italic">Produto & Variações</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest text-center italic">Disponibilidade</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest italic">Preço</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-zinc-400 tracking-widest text-right italic">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {products.map((product: Product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    onEdit={() => handleEditClick(product)}
                    onDelete={() => handleDelete(product)}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!isLoading && pagination && pagination.lastPage > 1 && (
          <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-zinc-400 italic">
              Página {pagination.currentPage} de {pagination.lastPage}
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => { setCurrentPage(prev => prev - 1); window.scrollTo(0, 0); }}
                className="px-4 py-2 bg-white border border-zinc-200 rounded-xl text-[10px] font-black uppercase disabled:opacity-30"
              >
                Anterior
              </button>
              <button
                disabled={currentPage === pagination.lastPage}
                onClick={() => { setCurrentPage(prev => prev + 1); window.scrollTo(0, 0); }}
                className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-[10px] font-black uppercase disabled:opacity-30"
              >
                Próximo
              </button>
            </div>
          </div>
        )}
      </section>

      {selectedProduct && (
        <EditProductModal
          productId={selectedProduct.id} 
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </main>
  );
}

// --- SUBCOMPONENTE ROW ---

const ProductRow = ({ product, onEdit, onDelete }: { product: Product, onEdit: () => void, onDelete: () => void }) => {
  const variationSummary = useMemo(() => {
    if (!product.variations) return null;
    return product.variations.reduce((acc: any, v: any) => {
      if (!acc[v.type]) acc[v.type] = new Set();
      acc[v.type].add(v.value);
      return acc;
    }, {});
  }, [product.variations]);

  return (
    <tr className="group hover:bg-zinc-50/80 transition-all duration-300">
      <td className="px-8 py-6">
        <div className="flex items-start gap-5">
          <div className="relative mt-1">
            <img src={product.image_1} alt={product.name} className="w-16 h-16 rounded-2xl object-cover border border-zinc-200 shadow-sm group-hover:scale-105 transition-all duration-500" />
            {product.hasVariations && (
              <div className="absolute -top-2 -right-2 bg-zinc-950 text-white p-1.5 rounded-lg shadow-lg border border-white/20">
                <Layers size={10} />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div>
              <h4 className="text-sm font-black uppercase italic text-zinc-900 leading-tight group-hover:text-yellow-600 transition-colors">{product.name}</h4>
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter">{product.brand_name} • ID #{product.id}</span>
            </div>
            {product.hasVariations && variationSummary && (
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(variationSummary).map(([type, values]: [string, any]) => (
                  <div key={type} className="flex items-center gap-1 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-md">
                    <span className="text-[8px] font-black uppercase text-zinc-400 italic">{type}:</span>
                    <span className="text-[9px] font-bold text-zinc-700 uppercase">{Array.from(values).join(', ')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-8 py-6 text-center">
        <div className="group/stock relative inline-block">
          <BadgeStock stock={product.displayStock} status={product.stockStatus} hasVariations={product.hasVariations} />
          {product.hasVariations && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 bg-zinc-900 text-white p-4 rounded-2xl opacity-0 group-hover/stock:opacity-100 pointer-events-none transition-all z-50 shadow-2xl scale-95 group-hover/stock:scale-100">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] border-b border-white/10 pb-2 mb-2 text-zinc-500 italic">Estoque por Grade</p>
              <div className="space-y-2">
                {product.variations?.map((v: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-[10px]">
                    <span className="text-zinc-400 italic">{v.type} <strong className="text-white not-italic">{v.value}</strong></span>
                    <span className={`font-black ${v.stock <= 2 ? 'text-red-500' : 'text-yellow-500'}`}>{v.stock} un</span>
                  </div>
                ))}
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-zinc-900" />
            </div>
          )}
        </div>
      </td>
      <td className="px-8 py-6">
        <div className="space-y-0.5">
          <p className="font-black text-base italic text-zinc-900 tracking-tighter">R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest italic">Preço de Venda</p>
        </div>
      </td>
      <td className="px-8 py-6 text-right">
        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
          <button
            onClick={onEdit}
            className="p-3 bg-white border border-zinc-200 text-zinc-400 hover:border-zinc-900 hover:text-zinc-900 rounded-xl transition-all shadow-sm active:scale-90"
            title="Editar Produto"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-3 bg-white border border-zinc-200 text-zinc-400 hover:bg-red-500 hover:border-red-500 hover:text-white rounded-xl transition-all shadow-sm active:scale-90"
            title="Excluir Produto"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

const BadgeStock = ({ stock, status, hasVariations }: { stock: number, status: string, hasVariations: boolean }) => {
  const configs: any = {
    out: "bg-red-50 text-red-600 border-red-100",
    low: "bg-yellow-50 text-yellow-700 border-yellow-100",
    ok: "bg-emerald-50 text-emerald-700 border-emerald-100"
  };
  return (
    <div className="inline-flex flex-col items-center gap-1.5">
      <span className={`px-4 py-1.5 border rounded-full font-black text-[10px] uppercase tracking-tighter transition-all ${configs[status]}`}>
        {stock === 0 ? 'Esgotado' : `${stock} Unidades`}
      </span>
      {hasVariations && <span className="text-[8px] font-black text-zinc-300 uppercase tracking-widest leading-none italic">Grade Ativa</span>}
    </div>
  );
};