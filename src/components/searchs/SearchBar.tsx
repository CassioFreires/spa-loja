import { Search } from 'lucide-react';

interface SearchBarProps {
  className?: string;
  onSubmit?: (query: string) => void;
}

/**
 * @component SearchBar
 * @description Componente de busca inteligente otimizado para SEO de IA e UX Mobile-First.
 * Mantém a estética Gold Store com foco em performance e acessibilidade.
 */
export default function SearchBar({ className = "" }: SearchBarProps) {
  
  // Função para prevenir comportamento padrão do form se necessário
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // A regra de negócio de submissão pode ser injetada aqui via props se desejado futuramente
  };

  return (
    <form 
      role="search"
      method="GET"
      onSubmit={handleFormSubmit}
      className={`relative group w-full max-w-full transition-all duration-300 ${className}`}
    >
      {/* Label invisível apenas para leitores de tela e IAs de acessibilidade */}
      <label htmlFor="search-input" className="sr-only">
        Pesquisar produtos na Gold Store
      </label>

      <input
        id="search-input"
        name="q"
        type="search"
        inputMode="search"
        spellCheck="false"
        autoComplete="off"
        placeholder="O que você está procurando hoje?"
        className="w-full bg-white rounded-full py-3 md:py-4 px-6 pr-16 
                   text-zinc-900 placeholder:text-zinc-500 italic font-medium
                   border border-transparent
                   focus:outline-none focus:ring-2 focus:ring-yellow-500/40 focus:border-yellow-500/20
                   transition-all duration-500 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] 
                   hover:shadow-lg hover:shadow-zinc-200/50"
      />

      {/* Botão de Busca - Otimizado para Touch e Feedback */}
      <button
        type="submit"
        aria-label="Executar busca"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 
                   bg-zinc-950 text-white p-2.5 md:p-3 rounded-full 
                   hover:bg-yellow-500 hover:text-zinc-950 
                   active:scale-90 focus:ring-2 focus:ring-yellow-500 focus:outline-none
                   transition-all duration-300 cursor-pointer
                   group-focus-within:bg-yellow-500 group-focus-within:text-zinc-950
                   flex items-center justify-center shadow-lg"
      >
        <Search 
          className="w-5 h-5 md:w-5 md:h-5 transition-transform duration-300 group-hover:scale-110" 
          strokeWidth={2.5} 
        />
      </button>

      {/* Structured Data sutil para SEO de Busca Interna */}
      <input type="hidden" name="site" value="goldstore" />
    </form>
  );
}