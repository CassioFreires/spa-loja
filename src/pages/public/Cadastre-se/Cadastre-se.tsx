import { User, Mail, Lock, Phone, MapPin, ArrowRight, CheckCircle } from 'lucide-react';
import AnimatedBackground from "../../../components/style/AnimatedBackground";
import { Link } from 'react-router-dom';

export default function RegisterPage() {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8 overflow-hidden">
            {/* O fundo de bolinhas douradas */}
            <AnimatedBackground />

            <div className="relative z-10 w-full max-w-4xl animate-fade-in">
                <div className="bg-white/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-2xl overflow-hidden flex flex-col md:flex-row">

                    {/* Lado Esquerdo: Branding/Info */}
                    <div className="bg-black/10 p-8 md:p-12 md:w-1/3 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/20">
                        <div>
                            <h1 className="text-3xl font-black text-black italic tracking-tighter uppercase leading-none mb-2">
                                Join the <span className="text-yellow-500 text-stroke-black">Gold</span>
                            </h1>
                            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                                Faça parte da elite e receba ofertas exclusivas em primeira mão.
                            </p>
                        </div>

                        <div className="hidden md:block space-y-4">
                            {[
                                "Envio Prioritário no RJ",
                                "Acesso a Drops Limitados",
                                "Suporte Premium 24h"
                            ].map((text, i) => (
                                <div key={i} className="flex items-center gap-2 text-[10px] font-bold uppercase text-zinc-500">
                                    <CheckCircle className="w-4 h-4 text-yellow-500" /> {text}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Lado Direito: Formulário */}
                    <div className="p-8 md:p-12 md:w-2/3">
                        <h2 className="text-xl font-black text-black uppercase italic tracking-tighter mb-8">
                            Criar Nova Conta
                        </h2>

                        <form className="grid grid-cols-1 sm:grid-cols-2 gap-5" onSubmit={(e) => e.preventDefault()}>

                            {/* Nome Completo */}
                            <div className="sm:col-span-2 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-4">Nome Completo</label>
                                <div className="relative group">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-yellow-600 transition-colors" />
                                    <input type="text" placeholder="Como deseja ser chamado?" className="w-full bg-white/50 border border-white/80 py-3.5 pl-12 pr-6 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all text-sm font-medium" />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-4">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-yellow-600 transition-colors" />
                                    <input type="email" placeholder="seu@email.com" className="w-full bg-white/50 border border-white/80 py-3.5 pl-12 pr-6 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all text-sm font-medium" />
                                </div>
                            </div>

                            {/* WhatsApp */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-4">WhatsApp</label>
                                <div className="relative group">
                                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-yellow-600 transition-colors" />
                                    <input type="tel" placeholder="(21) 99999-9999" className="w-full bg-white/50 border border-white/80 py-3.5 pl-12 pr-6 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all text-sm font-medium" />
                                </div>
                            </div>

                            {/* Endereço / Nova Iguaçu Check */}
                            <div className="sm:col-span-2 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-4">Endereço de Entrega</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-yellow-600 transition-colors" />
                                    <input type="text" placeholder="Rua, número, bairro..." className="w-full bg-white/50 border border-white/80 py-3.5 pl-12 pr-6 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all text-sm font-medium" />
                                </div>
                            </div>

                            {/* Senha */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-4">Senha</label>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-yellow-600 transition-colors" />
                                    <input type="password" placeholder="••••••••" className="w-full bg-white/50 border border-white/80 py-3.5 pl-12 pr-6 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all text-sm font-medium" />
                                </div>
                            </div>

                            {/* Confirmar Senha */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-4">Confirmar</label>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-yellow-600 transition-colors" />
                                    <input type="password" placeholder="••••••••" className="w-full bg-white/50 border border-white/80 py-3.5 pl-12 pr-6 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all text-sm font-medium" />
                                </div>
                            </div>

                            <div className="sm:col-span-2 pt-4">
                                <button className="group w-full bg-black hover:bg-yellow-500 text-white hover:text-black py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-3 shadow-xl active:scale-95">
                                    Finalizar Cadastro
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                </button>
                                <p className="text-center mt-6 text-zinc-500 text-[10px] font-medium uppercase tracking-wider">
                                    Já tem conta?{" "}
                                    <Link
                                        to="/login"
                                        className="text-black font-black hover:text-yellow-600 transition-colors ml-1 underline underline-offset-2"
                                    >
                                        Fazer Login
                                    </Link>
                                </p>
                            </div>

                        </form>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
      `}</style>
        </div>
    );
}