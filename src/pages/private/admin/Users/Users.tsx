import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
    Users, Shield, Mail, Search, ArrowLeft, 
    Loader2, Power, UserCog, ChevronRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminUsers } from '../../../../hooks/useAdminUsers';

// --- Interfaces para Documentação e Manutenção ---
interface User {
    id: number;
    name: string;
    email: string;
    role_id: number;
    active: boolean;
}

/**
 * AdminUsers - Painel de Controle RBAC (Role-Based Access Control)
 * SEO: Estrutura semântica para indexação de back-office e leitura de Agentes IA.
 * UX: Interface adaptativa para Desktop, Tablets e Smartphones.
 */
export default function AdminUsers() {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Performance: Debounce de busca para reduzir carga no servidor
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 400);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const { 
        users, 
        roles, 
        pagination, 
        loading, 
        changeUserRole, 
        toggleUserStatus 
    } = useAdminUsers(page, debouncedSearch);

    // Scroll suave ao trocar de página
    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500 italic text-left">
            
            {/* CABEÇALHO SEMÂNTICO */}
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10 md:mb-16">
                <div className="flex items-center gap-5">
                    <Link 
                        to="/admin/dashboard" 
                        className="p-4 bg-white border border-zinc-100 rounded-[1.25rem] hover:bg-zinc-900 hover:text-white transition-all shadow-sm group"
                        aria-label="Voltar para o Dashboard"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div className="space-y-1">
                        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-zinc-900 leading-none">
                            Gestão de <span className="text-yellow-600">Membros</span>
                        </h1>
                        <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-[0.2em]">
                            Controle de segurança RBAC • Gold Store
                        </p>
                    </div>
                </div>

                {/* BUSCA COM UX DE ALTA PERFORMANCE */}
                <div className="relative w-full lg:w-[400px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input 
                        type="text"
                        placeholder="Nome ou e-mail do membro..."
                        className="w-full bg-white border border-zinc-100 p-5 pl-12 rounded-[1.5rem] font-bold text-xs outline-none focus:ring-4 ring-yellow-500/10 focus:border-yellow-500/50 transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Buscar membros"
                    />
                </div>
            </header>

            {/* ÁREA DE CONTEÚDO PRINCIPAL */}
            <section aria-label="Lista de Membros">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-6">
                        <div className="relative">
                            <Loader2 className="w-12 h-12 text-yellow-600 animate-spin" />
                            <div className="absolute inset-0 blur-2xl bg-yellow-500/20 animate-pulse" />
                        </div>
                        <p className="text-zinc-400 font-black uppercase text-[10px] tracking-widest italic">Sincronizando privilégios...</p>
                    </div>
                ) : (
                    <div className="grid gap-5">
                        {users.map((user: User) => (
                            <UserCard 
                                key={user.id} 
                                user={user} 
                                roles={roles} 
                                onRoleChange={changeUserRole}
                                onToggleStatus={toggleUserStatus}
                            />
                        ))}

                        {/* EMPTY STATE IA-FRIENDLY */}
                        {users.length === 0 && (
                            <div className="text-center py-32 bg-zinc-50/50 rounded-[3rem] border-2 border-dashed border-zinc-200">
                                <UserCog className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                                <p className="text-zinc-400 font-black uppercase italic text-[11px] tracking-widest">Nenhum registro localizado na base</p>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* PAGINAÇÃO ADAPTATIVA */}
            {pagination && pagination.lastPage > 1 && (
                <nav className="mt-16 flex justify-center flex-wrap gap-3" aria-label="Navegação de páginas">
                    {[...Array(pagination.lastPage)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`min-w-[3.5rem] h-14 rounded-2xl font-black text-xs transition-all shadow-sm ${
                                page === i + 1 
                                ? "bg-zinc-900 text-white shadow-zinc-900/20 scale-110 italic" 
                                : "bg-white text-zinc-400 border border-zinc-100 hover:bg-zinc-50"
                            }`}
                        >
                            {String(i + 1).padStart(2, '0')}
                        </button>
                    ))}
                </nav>
            )}
        </main>
    );
}

// --- SUBCOMPONENTES (Clean Code & Reusabilidade) ---

/**
 * UserCard - Representação individual de membro
 * Adaptado para layouts Mobile (Vertical) e Desktop (Horizontal)
 */
function UserCard({ user, roles, onRoleChange, onToggleStatus }: any) {
    return (
        <article className="bg-white p-5 md:p-7 rounded-[2.5rem] border border-zinc-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6 group hover:border-yellow-500 hover:shadow-xl hover:shadow-yellow-500/5 transition-all duration-500 relative overflow-hidden">
            
            <div className="flex items-center gap-5 md:gap-7 flex-1 w-full text-left">
                {/* Avatar Visual */}
                <div className="w-16 h-16 bg-zinc-950 rounded-[1.75rem] flex items-center justify-center text-yellow-500 shadow-xl shadow-zinc-950/20 shrink-0 group-hover:rotate-6 transition-transform">
                    <Users size={26} strokeWidth={2.5} />
                </div>

                <div className="space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-black text-lg md:text-xl uppercase text-zinc-900 leading-none tracking-tight">
                            {user.name}
                        </h3>
                        {!user.active && (
                            <span className="bg-red-50 text-red-600 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-tighter border border-red-100">
                                Conta Inativa
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400">
                        <Mail size={12} className="shrink-0" />
                        <p className="text-xs font-bold truncate max-w-[200px] md:max-w-none tracking-tight">
                            {user.email}
                        </p>
                    </div>
                </div>
            </div>

            {/* AÇÕES E PERMISSÕES */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                {/* Seletor de Role RBAC */}
                <div className="flex items-center gap-3 bg-zinc-50 p-3 pl-5 rounded-[1.5rem] border border-zinc-100 w-full sm:min-w-[240px] focus-within:ring-2 ring-yellow-500/20 transition-all">
                    <Shield size={16} className="text-yellow-600 shrink-0" />
                    <select 
                        value={user.role_id}
                        onChange={(e) => onRoleChange(user.id, Number(e.target.value))}
                        className="bg-transparent border-none outline-none font-black uppercase text-[10px] tracking-[0.15em] text-zinc-600 w-full cursor-pointer appearance-none"
                        aria-label={`Alterar nível de acesso de ${user.name}`}
                    >
                        {roles.map((role: any) => (
                            <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                    </select>
                </div>

                {/* Status Toggle */}
                <button 
                    onClick={() => onToggleStatus(user.id, user.active)}
                    className={`h-14 w-full sm:w-14 rounded-[1.5rem] flex items-center justify-center transition-all shadow-sm active:scale-90 group/btn ${
                        user.active 
                        ? 'bg-zinc-900 text-white hover:bg-red-600' 
                        : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'
                    }`}
                    title={user.active ? "Desativar Membro" : "Ativar Membro"}
                >
                    <Power size={20} strokeWidth={2.5} className="group-hover/btn:rotate-12 transition-transform" />
                    <span className="sm:hidden font-black uppercase text-[10px] ml-3 tracking-widest">
                        {user.active ? 'Bloquear Acesso' : 'Liberar Acesso'}
                    </span>
                </button>
            </div>
        </article>
    );
}