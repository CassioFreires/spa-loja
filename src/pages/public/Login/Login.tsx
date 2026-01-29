import React from 'react';
import { Mail, Lock, ArrowRight, Chrome, Github, Loader2 } from 'lucide-react';
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

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-4">
                Seu Email
              </label>

              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-yellow-600 transition-colors" />
                <input
                  type="email"
                  placeholder="exemplo@email.com"
                  {...register('email')}
                  className="w-full bg-white/50 border border-white/80 py-4 pl-14 pr-6 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all text-sm font-medium"
                />
              </div>

              {errors.email && (
                <span className="text-[10px] font-bold text-red-600 ml-4">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* SENHA */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  Sua Senha
                </label>
                <button
                  type="button"
                  className="text-[10px] font-bold text-yellow-600 hover:underline uppercase"
                >
                  Esqueceu?
                </button>
              </div>

              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-yellow-600 transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className="w-full bg-white/50 border border-white/80 py-4 pl-14 pr-6 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all text-sm font-medium"
                />
              </div>

              {errors.password && (
                <span className="text-[10px] font-bold text-red-600 ml-4">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* BOTÃO */}
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

          {/* resto do layout intacto */}
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
