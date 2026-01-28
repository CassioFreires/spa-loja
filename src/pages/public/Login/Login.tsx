import React, { useRef } from 'react';
import { Mail, Lock, ArrowRight, Chrome, Github, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedBackground from '../../../components/style/AnimatedBackground';
import { useLogin } from '../../../hooks/useLogin';

export default function LoginPage() {
    const { isLoading, error, handleLogin, clearError } = useLogin();
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;

        if (email && password) {
            await handleLogin({ email, password });
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
            <AnimatedBackground />

            <div className="relative z-10 w-full max-w-md animate-fade-in">
                <div className="bg-white/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-2xl p-8 md:p-12">
                    
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-black text-black italic tracking-tighter uppercase leading-none">
                            Gold <span className="text-yellow-500">Store</span>
                        </h1>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] mt-2">
                            A Elite do Esporte
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-500/20 border border-red-500 text-red-700 text-xs font-bold rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={onSubmit}>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-4">
                                Seu Email
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-yellow-600 transition-colors" />
                                <input
                                    ref={emailRef}
                                    type="email"
                                    required
                                    placeholder="exemplo@email.com"
                                    className="w-full bg-white/50 border border-white/80 py-4 pl-14 pr-6 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all text-sm font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                                    Sua Senha
                                </label>
                                <button type="button" className="text-[10px] font-bold text-yellow-600 hover:underline uppercase">Esqueceu?</button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-yellow-600 transition-colors" />
                                <input
                                    ref={passwordRef}
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-white/50 border border-white/80 py-4 pl-14 pr-6 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all text-sm font-medium"
                                />
                            </div>
                        </div>

                        <button 
                            disabled={isLoading}
                            type="submit"
                            className="group w-full bg-black hover:bg-yellow-500 text-white hover:text-black py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-3 shadow-xl active:scale-95 mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Acessar Conta
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-10 text-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-black/5"></div>
                        </div>
                        <span className="relative bg-transparent px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            Ou entrar com
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 py-3 bg-white/50 border border-white/80 rounded-xl hover:bg-white transition-all text-[10px] font-black uppercase">
                            <Chrome className="w-4 h-4" /> Google
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 bg-white/50 border border-white/80 rounded-xl hover:bg-white transition-all text-[10px] font-black uppercase">
                            <Github className="w-4 h-4" /> Github
                        </button>
                    </div>

                    <div className="text-center mt-10">
                        <p className="text-zinc-500 text-xs font-medium">
                            Não tem uma conta? <br />
                            <Link
                                to="/cadastre-se"
                                className="text-black font-black hover:text-yellow-600 transition-all duration-300 uppercase tracking-tighter inline-block mt-2 border-b-2 border-transparent hover:border-yellow-600"
                            >
                                Crie sua conta agora
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-6 opacity-40">
                    <img src="assets/images/ssl-badge.png" alt="Seguro" className="h-6 opacity-30" />
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-600">
                        Gold Store © 2026 • Nova Iguaçu
                    </span>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out forwards;
                }
            `}</style>
        </div>
    );
}