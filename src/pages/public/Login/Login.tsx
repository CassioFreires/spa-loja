import { Mail, Lock, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import AnimatedBackground from '../../../components/style/AnimatedBackground';
import { useLogin } from '../../../hooks/useLogin';
import { LoginSchema } from '../../../schema/Login/schema-login';
import type { z } from 'zod';

type LoginFormData = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const { isLoading, error, handleLogin, clearError } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    await handleLogin(data);
  };

  return (
    <main className="relative min-h-[100dvh] w-full flex items-center justify-center p-4 md:p-6 overflow-hidden">
      {/* Camada de Fundo Otimizada */}
      <AnimatedBackground />

      {/* SEO/Acessibilidade: Título oculto para IAs se não houver um visível no main */}
      <h1 className="sr-only">Login - Gold Store Multimarcas</h1>

      <div className="relative z-10 w-full max-w-[440px] animate-fade-in will-change-transform">
        <div className="bg-white/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-[0_22px_70px_4px_rgba(0,0,0,0.1)] p-8 md:p-12 transition-all duration-500 hover:bg-white/50">
          
          {/* Header do Formulário */}
          <header className="text-center mb-10">
            <p className="text-4xl font-black text-black italic tracking-tighter uppercase leading-none select-none">
              Gold <span className="text-yellow-500">Store</span>
            </p>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3 italic">
              A Elite do Esporte
            </p>
          </header>

          {/* Área de Erros com Acessibilidade */}
          {error && (
            <div 
              role="alert" 
              aria-live="assertive"
              className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-700 text-[11px] font-black rounded-2xl text-center uppercase tracking-wider animate-shake"
            >
              {error}
            </div>
          )}

          <form 
            className="space-y-6" 
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            {/* CAMPO EMAIL */}
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-4 flex items-center gap-2"
              >
                E-mail de Acesso
              </label>

              <div className="relative group">
                <Mail 
                  className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-yellow-600 transition-colors duration-300" 
                  aria-hidden="true"
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="exemplo@email.com"
                  {...register('email')}
                  className="w-full bg-white/60 border border-white/80 py-4 pl-14 pr-6 rounded-2xl outline-none focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all duration-300 text-sm font-bold text-zinc-800 placeholder:text-zinc-400"
                />
              </div>

              {errors.email && (
                <span className="text-[10px] font-bold text-red-600 ml-4 animate-in fade-in slide-in-from-left-2">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* CAMPO SENHA */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-4">
                <label 
                  htmlFor="password" 
                  className="text-[10px] font-black uppercase tracking-widest text-zinc-600"
                >
                  Sua Senha
                </label>
                <Link
                  to="/recuperar-senha"
                  className="text-[10px] font-black text-yellow-600 hover:text-yellow-700 transition-colors uppercase tracking-tighter"
                >
                  Esqueceu?
                </Link>
              </div>

              <div className="relative group">
                <Lock 
                  className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-yellow-600 transition-colors duration-300" 
                  aria-hidden="true"
                />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
                  className="w-full bg-white/60 border border-white/80 py-4 pl-14 pr-6 rounded-2xl outline-none focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all duration-300 text-sm font-bold text-zinc-800 placeholder:text-zinc-400"
                />
              </div>

              {errors.password && (
                <span className="text-[10px] font-bold text-red-600 ml-4 animate-in fade-in slide-in-from-left-2">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* BOTÃO DE SUBMIT OTIMIZADO */}
            <button
              disabled={isLoading}
              type="submit"
              className="group w-full bg-zinc-950 hover:bg-yellow-500 text-white hover:text-zinc-950 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] transition-all duration-500 flex items-center justify-center gap-3 shadow-2xl active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed italic"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Entrar no Time
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                </>
              )}
            </button>
          </form>

          {/* Rodapé do Card */}
          <footer className="mt-10 pt-8 border-t border-white/40 text-center">
            <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-tight">
              Não faz parte do time?{' '}
              <Link to="/cadastre-se" className="text-yellow-600 hover:text-yellow-700 font-black">
                Crie sua conta agora
              </Link>
            </p>
            
            <div className="flex items-center justify-center gap-2 mt-6 opacity-40 grayscale group hover:opacity-100 hover:grayscale-0 transition-all duration-500">
              <ShieldCheck className="w-4 h-4 text-zinc-600" />
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">
                Ambiente 100% Seguro
              </span>
            </div>
          </footer>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        /* Mobile Height Fix */
        .min-h-[100dvh] {
          min-height: 100dvh;
        }
      `}</style>
    </main>
  );
}