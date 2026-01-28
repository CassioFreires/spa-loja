import { Mail, Lock, ArrowRight, Chrome, Github } from 'lucide-react';
import AnimatedBackground from "../../../components/style/AnimatedBackground";
import { Link } from 'react-router-dom';

export default function LoginPage() {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
            {/* O fundo de bolinhas douradas que criamos */}
            <AnimatedBackground />

            {/* Card de Login com Glassmorphism */}
            <div className="relative z-10 w-full max-w-md animate-fade-in">
                <div className="bg-white/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-2xl p-8 md:p-12">

                    {/* Logo / Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-black text-black italic tracking-tighter uppercase leading-none">
                            Gold <span className="text-yellow-500">Store</span>
                        </h1>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] mt-2">
                            A Elite do Esporte
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                        {/* Campo de Email */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-4">
                                Seu Email
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-yellow-600 transition-colors" />
                                <input
                                    type="email"
                                    placeholder="exemplo@email.com"
                                    className="w-full bg-white/50 border border-white/80 py-4 pl-14 pr-6 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all text-sm font-medium"
                                />
                            </div>
                        </div>

                        {/* Campo de Senha */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                                    Sua Senha
                                </label>
                                <a href="#" className="text-[10px] font-bold text-yellow-600 hover:underline uppercase">Esqueceu?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-yellow-600 transition-colors" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-white/50 border border-white/80 py-4 pl-14 pr-6 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all text-sm font-medium"
                                />
                            </div>
                        </div>

                        {/* Botão de Entrar */}
                        <button className="group w-full bg-black hover:bg-yellow-500 text-white hover:text-black py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-3 shadow-xl active:scale-95 mt-8">
                            Acessar Conta
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </form>

                    {/* Divisor */}
                    <div className="relative my-10 text-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-black/5"></div>
                        </div>
                        <span className="relative bg-transparent px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            Ou entrar com
                        </span>
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 py-3 bg-white/50 border border-white/80 rounded-xl hover:bg-white transition-all text-[10px] font-black uppercase">
                            <Chrome className="w-4 h-4" /> Google
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 bg-white/50 border border-white/80 rounded-xl hover:bg-white transition-all text-[10px] font-black uppercase">
                            <Github className="w-4 h-4" /> Github
                        </button>
                    </div>

                    {/* Footer do Card */}
                    <p className="text-center mt-10 text-zinc-500 text-xs font-medium">
                        Não tem uma conta? <br />
                        <p className="text-center mt-10 text-zinc-500 text-xs font-medium">
                            Não tem uma conta? <br />
                            <Link
                                to="/cadastre-se"
                                className="text-black font-black hover:text-yellow-600 transition-all duration-300 uppercase tracking-tighter inline-block mt-2 border-b-2 border-transparent hover:border-yellow-600"
                            >
                                Crie sua conta agora
                            </Link>
                        </p>
                    </p>
                </div>

                {/* Badge de Segurança abaixo do card */}
                <div className="mt-8 flex items-center justify-center gap-6 opacity-40 grayscale group-hover:grayscale-0 transition-all">
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