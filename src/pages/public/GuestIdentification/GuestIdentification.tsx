import React, { useState } from 'react';
import { ArrowLeft, User, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function GuestIdentification() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '' });

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();
        // Salvamos os dados básicos no localStorage para o backend criar o "User" fantasma se necessário
        localStorage.setItem('@app:guest_user', JSON.stringify(formData));
        navigate('/endereco');
    };

    return (
        <main className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-2xl border border-zinc-100 italic">
                <header className="text-center mb-8">
                    <h1 className="text-3xl font-black uppercase tracking-tighter italic">Identificação</h1>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">Para prosseguir com sua entrega Gold</p>
                </header>

                <form onSubmit={handleContinue} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase ml-4 text-zinc-500">Nome Completo</label>
                        <div className="relative group">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-yellow-600 transition-colors" />
                            <input 
                                required
                                type="text" 
                                placeholder="COMO DESEJA SER CHAMADO?"
                                className="w-full bg-zinc-50 border-2 border-zinc-100 p-4 pl-12 rounded-2xl outline-none focus:border-yellow-500 transition-all font-bold uppercase text-xs"
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase ml-4 text-zinc-500">E-mail para Rastreio</label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-yellow-600 transition-colors" />
                            <input 
                                required
                                type="email" 
                                placeholder="SEU@EMAIL.COM"
                                className="w-full bg-zinc-50 border-2 border-zinc-100 p-4 pl-12 rounded-2xl outline-none focus:border-yellow-500 transition-all font-bold uppercase text-xs"
                                onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-zinc-900 text-white py-5 rounded-2xl font-black uppercase italic hover:bg-yellow-600 transition-all shadow-xl flex items-center justify-center gap-3">
                        Continuar para Endereço <ArrowRight size={18} />
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-zinc-50 text-center">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase mb-4">Já possui uma conta?</p>
                    <Link to="/login" className="text-zinc-900 font-black uppercase italic underline underline-offset-4 decoration-yellow-500">Fazer Login</Link>
                </div>
            </div>
        </main>
    );
}