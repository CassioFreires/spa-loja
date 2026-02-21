import { useState } from 'react';
import { 
    MessageSquare, CheckCircle, XCircle, Trash2, 
    Clock, Star, ArrowLeft, Loader2, User 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminComments } from '../../../../hooks/useAdminComments';

export default function AdminComments() {
    const [filter, setFilter] = useState<"pending" | "approved">("pending");
    const [page, setPage] = useState(1);
    
    // Agora integrado com o hook que usa o padrão de services
    const { comments, pagination, loading, handleApprove, handleRemove } = useAdminComments(filter, page);

    return (
        <div className="p-8 max-w-6xl mx-auto animate-in fade-in duration-500 font-sans italic leading-none">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 text-left">
                <div className="flex items-center gap-4">
                    <Link to="/admin/dashboard" className="p-3 bg-white border border-zinc-100 rounded-2xl hover:bg-zinc-50 transition-all shadow-sm">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">
                            Gestão de <span className="text-yellow-600">Feedbacks</span>
                        </h1>
                        <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest mt-2">Moderação de avaliações Gold Store</p>
                    </div>
                </div>

                <div className="flex bg-zinc-100 p-1.5 rounded-2xl border border-zinc-200">
                    <button 
                        onClick={() => { setFilter("pending"); setPage(1); }}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${filter === "pending" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-600"}`}
                    >
                        <Clock size={14} /> Pendentes
                    </button>
                    <button 
                        onClick={() => { setFilter("approved"); setPage(1); }}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${filter === "approved" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-600"}`}
                    >
                        <CheckCircle size={14} /> Aprovados
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 text-yellow-600 animate-spin" />
                    <p className="text-zinc-400 font-black uppercase text-[10px] tracking-widest">Sincronizando feedbacks...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {comments.length > 0 ? (
                        comments.map((comment: any) => (
                            <div key={comment.id} className="group bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-start md:items-center">
                                
                                <div className="flex items-center gap-4 min-w-[250px] text-left">
                                    <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-300 border border-zinc-100">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <p className="font-black text-xs uppercase text-zinc-900 mb-1">{comment.user_name}</p>
                                        <p className="text-[10px] font-bold text-yellow-600 uppercase italic line-clamp-1">{comment.product_name}</p>
                                        <div className="flex gap-0.5 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={10} className={i < comment.rating ? "fill-yellow-500 text-yellow-500" : "text-zinc-200"} />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 text-left bg-zinc-50/50 p-5 rounded-[1.5rem] border border-zinc-50">
                                    <p className="text-zinc-600 text-sm leading-relaxed italic">"{comment.comment}"</p>
                                    <span className="text-[8px] font-bold text-zinc-400 uppercase mt-3 block tracking-[0.2em] leading-none">
                                        {new Date(comment.created_at).toLocaleDateString('pt-BR')} às {new Date(comment.created_at).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    {filter === "pending" ? (
                                        <button 
                                            onClick={() => handleApprove(comment.id, true)}
                                            className="p-4 bg-green-50 text-green-600 rounded-2xl hover:bg-green-600 hover:text-white transition-all shadow-sm active:scale-90"
                                            title="Aprovar Comentário"
                                        >
                                            <CheckCircle size={20} />
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleApprove(comment.id, false)}
                                            className="p-4 bg-orange-50 text-orange-600 rounded-2xl hover:bg-orange-600 hover:text-white transition-all shadow-sm active:scale-90"
                                            title="Mover para Pendentes"
                                        >
                                            <XCircle size={20} />
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => { if(confirm("Remover permanentemente?")) handleRemove(comment.id) }}
                                        className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-90"
                                        title="Excluir Definitivamente"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-zinc-100">
                            <MessageSquare className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
                            <p className="text-zinc-400 font-black uppercase italic text-[10px] tracking-[0.2em]">Nenhum feedback para moderar</p>
                        </div>
                    )}
                </div>
            )}

            {/* Paginação */}
            {pagination && pagination.lastPage > 1 && (
                <div className="mt-12 flex justify-center gap-2">
                    {[...Array(pagination.lastPage)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => { setPage(i + 1); window.scrollTo(0, 0); }}
                            className={`w-12 h-12 rounded-2xl font-black text-xs transition-all ${page === i + 1 ? "bg-zinc-900 text-white shadow-xl italic scale-110" : "bg-white text-zinc-400 border border-zinc-100 hover:bg-zinc-50"}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}