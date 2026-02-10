import React, { useMemo } from 'react';
import { 
    ArrowLeft, Ruler, Info, ChevronRight, 
    CheckCircle2, AlertCircle, Share2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * PAGE: Guia de Medidas (Size Guide)
 * Otimizada para SEO, IA e Performance.
 */
export default function SizeGuidePage() {
    const navigate = useNavigate();

    // PERFORMANCE: Memoização dos dados estáticos para evitar re-calculos
    const sections = useMemo(() => [
        {
            title: "Camisetas",
            headers: ["Tamanho", "Peito (cm)", "Cintura (cm)", "Quadril (cm)", "Comp. (cm)"],
            rows: [
                ["P", "86–92", "74–78", "92–96", "68–70"],
                ["M", "93–98", "79–84", "97–102", "70–72"],
                ["G", "99–104", "85–90", "103–108", "72–74"],
                ["GG", "105–111", "91–97", "109–114", "74–76"],
                ["XXL", "112–118", "98–104", "115–120", "76–78"],
            ]
        },
        {
            title: "Calças Slim Fit",
            headers: ["Tamanho", "Cintura (cm)", "Quadril (cm)", "Coxa (cm)", "Comp. Int."],
            rows: [
                ["38", "78–82", "94–98", "53–55", "79"],
                ["40", "83–87", "99–103", "56–58", "80"],
                ["42", "88–93", "104–109", "59–61", "81"],
                ["44", "94–100", "110–116", "62–64", "82"],
                ["46", "101–107", "117–122", "65–67", "83"],
                ["48", "108–113", "123–128", "68–70", "84"],
            ]
        }
    ], []);

    // SEO: JSON-LD para IA entender o contexto da página
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Guia de Medidas Gold Store",
        "description": "Tabelas de medidas oficiais para Camisetas e Calças Slim Fit da Gold Store.",
        "mainEntity": {
            "@type": "Table",
            "name": "Clothing Size Guide"
        }
    };

    return (
        <main className="min-h-screen bg-[#F8F9FB] p-4 sm:p-6 md:p-12 font-sans italic leading-none selection:bg-yellow-200">
            {/* SEO Data */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>

            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* HEADER - UX Acessível */}
                <header className="mb-10 md:mb-16">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-yellow-600 transition-all mb-6 outline-none focus:ring-2 focus:ring-yellow-500 rounded-full px-2"
                        aria-label="Voltar para a página anterior"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
                        Início / Guia de medidas
                    </button>
                    <div className="flex justify-between items-end">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">
                            Guia de <span className="text-yellow-600">Medidas</span>
                        </h1>
                    </div>
                </header>

                {/* INFO CARDS GRID - UI Visualmente Hierárquica */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                    <article className="bg-zinc-900 p-6 rounded-[2rem] text-white flex items-start gap-4 shadow-lg transition-transform hover:scale-[1.01]">
                        <Info className="text-yellow-500 shrink-0" size={24} aria-hidden="true" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Modelagem</p>
                            <h3 className="text-sm font-bold uppercase leading-tight">Slim Fit: Ajustado ao corpo sem sobra de tecido.</h3>
                        </div>
                    </article>
                    <article className="bg-white border-2 border-zinc-100 p-6 rounded-[2rem] flex items-start gap-4 shadow-sm transition-transform hover:scale-[1.01]">
                        <CheckCircle2 className="text-zinc-900 shrink-0" size={24} aria-hidden="true" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Referência</p>
                            <h3 className="text-sm font-bold uppercase text-zinc-900 leading-tight">Modelo da foto: Tamanho G (1,84m / 84kg).</h3>
                        </div>
                    </article>
                </section>

                {/* TABLES SECTION - Responsividade com Scroll Indicado */}
                <section className="space-y-12 mb-16" aria-label="Tabelas de Medidas">
                    {sections.map((section, idx) => (
                        <div key={idx} className="bg-white rounded-[2.5rem] sm:rounded-[3rem] shadow-xl shadow-zinc-200/50 overflow-hidden border border-zinc-50 transition-all">
                            <div className="bg-zinc-50 px-6 sm:px-8 py-6 border-b border-zinc-100 flex justify-between items-center">
                                <h2 className="text-lg sm:text-xl font-black uppercase tracking-tighter text-zinc-900 italic">{section.title}</h2>
                                <span className="text-[9px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-widest">Unidade: CM</span>
                            </div>
                            
                            <div className="overflow-x-auto custom-scrollbar">
                                <table className="w-full text-left border-collapse min-w-[500px]">
                                    <thead>
                                        <tr className="bg-white">
                                            {section.headers.map((header, hIdx) => (
                                                <th key={hIdx} scope="col" className="px-6 sm:px-8 py-4 text-[10px] font-black uppercase tracking-widest text-yellow-600 border-b border-zinc-50 whitespace-nowrap">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {section.rows.map((row, rIdx) => (
                                            <tr key={rIdx} className="group hover:bg-zinc-50/80 transition-colors">
                                                {row.map((cell, cIdx) => (
                                                    <td key={cIdx} className={`px-6 sm:px-8 py-5 text-sm font-black uppercase italic ${cIdx === 0 ? 'text-zinc-900 bg-zinc-50/30' : 'text-zinc-500'}`}>
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </section>

                {/* HOW TO MEASURE SECTION - UX Educacional */}
                <section className="bg-white p-8 md:p-14 rounded-[3.5rem] shadow-2xl shadow-zinc-200/60 border border-zinc-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-yellow-500/10 transition-colors" />
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="bg-zinc-900 p-2 rounded-xl">
                                <Ruler className="text-yellow-500" size={28} aria-hidden="true" />
                            </div>
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-zinc-900">Como medir?</h2>
                        </div>

                        

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 text-left">
                            {[
                                { t: "1. PEITO", d: "Passe a fita abaixo das axilas sobre a parte mais larga do peitoral." },
                                { t: "2. CINTURA", d: "Meça na altura do umbigo sem prender a respiração." },
                                { t: "3. QUADRIL", d: "Passe a fita na parte mais larga dos glúteos." },
                                { t: "4. COMPRIMENTO", d: "Meça do gancho até a barra em sua calça favorita." }
                            ].map((step, i) => (
                                <article key={i} className="group/item">
                                    <h4 className="text-yellow-600 font-black text-sm uppercase mb-2 flex items-center gap-2">
                                        <ChevronRight size={14} className="group-hover/item:translate-x-1 transition-transform" /> {step.t}
                                    </h4>
                                    <p className="text-[11px] font-bold text-zinc-400 uppercase leading-relaxed tracking-wide ml-5">
                                        {step.d}
                                    </p>
                                </article>
                            ))}
                        </div>

                        {/* CALLOUT: Prática Recomendada */}
                        <div className="mt-12 p-6 bg-zinc-50 rounded-2xl border-l-4 border-yellow-500 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <AlertCircle size={20} className="text-zinc-900" />
                            </div>
                            <p className="text-sm font-bold text-zinc-600 uppercase italic leading-tight">
                                Cliente com 100cm de peito veste <span className="text-zinc-900 decoration-yellow-500 decoration-2 underline-offset-4 underline">G</span>. 
                                Se preferir folgado, opte pelo <span className="text-zinc-900">GG</span>.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FOOTER CALL - SEO Semântico */}
                <footer className="mt-16 text-center border-t border-zinc-200 pt-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 italic mb-4">
                        Dúvidas entre dois tamanhos? Recomendamos escolher o maior.
                    </p>
                    <div className="flex justify-center gap-6 text-[9px] font-bold uppercase text-zinc-300">
                        <span>Política de Trocas</span>
                        <span>Suporte Premium</span>
                    </div>
                </footer>
            </div>
        </main>
    );
}