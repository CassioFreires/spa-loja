import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Edit3, Trash2, Plus, Loader2, Filter } from 'lucide-react';
import { useAdminProducts } from '../../../../hooks/useAdminProducts';

export default function MyProducts() {
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const { products, isLoading } = useAdminProducts(page, searchTerm);

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black uppercase italic tracking-tight leading-none">Meus Produtos</h1>
                    <p className="text-zinc-500 text-sm font-medium mt-2">Gerencie o inventário e preços.</p>
                </div>
                <Link to="/admin/produto/adicionar" className="inline-flex items-center gap-2 px-6 py-4 bg-black text-white rounded-2xl hover:bg-yellow-600 hover:text-black transition-all font-black uppercase italic text-xs shadow-xl shadow-black/10">
                    <Plus size={18} /> Cadastrar Novo
                </Link>
            </header>

            <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-zinc-50 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar produto..." 
                            className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-yellow-500/20 transition-all"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-4 bg-zinc-50 rounded-2xl text-zinc-400 hover:text-black transition-colors"><Filter size={20}/></button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-zinc-50/50">
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-400 italic">Produto</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-400 italic text-center">Estoque</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-400 italic">Preço</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-400 italic text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {isLoading ? (
                                <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-yellow-600" /></td></tr>
                            ) : products.map((product: any) => (
                                <tr key={product.id} className="hover:bg-zinc-50/30 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <img src={product.image_1} className="w-12 h-12 rounded-xl object-cover border border-zinc-100" />
                                            <div className="text-left">
                                                <p className="text-sm font-black uppercase italic leading-none">{product.name}</p>
                                                <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase">{product.brand_name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`px-3 py-1 rounded-lg font-black text-[10px] ${product.stock <= 5 ? 'bg-red-50 text-red-600' : 'bg-zinc-100 text-zinc-600'}`}>
                                            {product.stock} UN
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 font-black text-sm italic text-zinc-900">
                                        R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-3 text-zinc-400 hover:bg-black hover:text-white rounded-xl transition-all"><Edit3 size={16} /></button>
                                            <button className="p-3 text-zinc-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}