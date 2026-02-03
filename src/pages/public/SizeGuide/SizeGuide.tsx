import React from 'react';
import { ArrowLeft, Ruler, Info, MoveRight, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SizeGuidePage() {
    const navigate = useNavigate();

    const sections = [
        {
            title: "Camisetas",
            headers: ["Tamanho", "Peito", "Cintura", "Quadril", "Comp."],
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
            headers: ["Tamanho", "Cintura", "Quadril", "Coxa", "Comp. Int."],
            rows: [
                ["38", "78–82", "94–98", "53–55", "79"],
                ["40", "83–87", "99–103", "56–58", "80"],
                ["42", "88–93", "104–109", "59–61", "81"],
                ["44", "94–100", "110–116", "62–64", "82"],
                ["46", "101–107", "117–122", "65–67", "83"],
                ["48", "108–113", "123–128", "68–70", "84"],
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-12 font-sans italic leading-none">
            <div className="max-w-4xl mx-auto">
                
                {/* HEADER */}
                <header className="mb-12">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-yellow-600 transition-colors mb-4"
                    >
                        <ArrowLeft size={14} /> Início / Guia de medidas
                    </button>
                    <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">
                        Guia de <span className="text-yellow-600">Medidas</span>
                    </h1>
                </header>

                {/* INFO CARDS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                    <div className="bg-zinc-900 p-6 rounded-[2rem] text-white flex items-start gap-4">
                        <Info className="text-yellow-500 shrink-0" size={24} />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Modelagem</p>
                            <p className="text-sm font-bold uppercase leading-tight">Slim Fit: Ajustado ao corpo sem sobra de tecido.</p>
                        </div>
                    </div>
                    <div className="bg-white border-2 border-zinc-100 p-6 rounded-[2rem] flex items-start gap-4">
                        <CheckCircle2 className="text-zinc-900 shrink-0" size={24} />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Referência</p>
                            <p className="text-sm font-bold uppercase text-zinc-900 leading-tight">Modelo da foto: Tamanho G (1,84m / 84kg).</p>
                        </div>
                    </div>
                </div>

                {/* TABLES SECTION */}
                <div className="space-y-12 mb-16">
                    {sections.map((section, idx) => (
                        <div key={idx} className="bg-white rounded-[3rem] shadow-xl shadow-zinc-200/50 overflow-hidden border border-zinc-50">
                            <div className="bg-zinc-50 px-8 py-6 border-b border-zinc-100 flex justify-between items-center">
                                <h2 className="text-xl font-black uppercase tracking-tighter text-zinc-900 italic">{section.title}</h2>
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Medidas em CM</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white">
                                            {section.headers.map((header, hIdx) => (
                                                <th key={hIdx} className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-yellow-600 border-b border-zinc-50">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {section.rows.map((row, rIdx) => (
                                            <tr key={rIdx} className="group hover:bg-zinc-50 transition-colors">
                                                {row.map((cell, cIdx) => (
                                                    <td key={cIdx} className={`px-8 py-5 text-sm font-black uppercase italic ${cIdx === 0 ? 'text-zinc-900 bg-zinc-50/50' : 'text-zinc-500'}`}>
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
                </div>

                {/* HOW TO MEASURE SECTION */}
                <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl shadow-zinc-200/60 border border-zinc-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <Ruler className="text-zinc-900" size={32} />
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Como tirar suas medidas?</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 text-left">
                            {[
                                { t: "1. PEITO", d: "Passe a fita abaixo das axilas sobre a parte mais larga do peitoral." },
                                { t: "2. CINTURA", d: "Meça na altura do umbigo sem prender a respiração." },
                                { t: "3. QUADRIL", d: "Passe a fita na parte mais larga dos glúteos." },
                                { t: "4. COMPRIMENTO", d: "Meça do gancho até a barra em sua calça favorita." }
                            ].map((step, i) => (
                                <div key={i} className="group">
                                    <h4 className="text-yellow-600 font-black text-sm uppercase mb-1 flex items-center gap-2">
                                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /> {step.t}
                                    </h4>
                                    <p className="text-[11px] font-bold text-zinc-400 uppercase leading-relaxed tracking-wide ml-5">
                                        {step.d}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 p-6 bg-zinc-50 rounded-2xl border-l-4 border-yellow-500">
                            <div className="flex items-center gap-2 mb-2 text-zinc-900">
                                <AlertCircle size={16} />
                                <span className="text-xs font-black uppercase tracking-widest">Exemplo Prático</span>
                            </div>
                            <p className="text-sm font-bold text-zinc-600 uppercase italic leading-tight">
                                Cliente com 100cm de peito veste <span className="text-zinc-900">G</span>. Se preferir folgado, opte pelo <span className="text-zinc-900">GG</span>.
                            </p>
                        </div>
                    </div>
                </div>

                {/* FOOTER CALL */}
                <footer className="mt-12 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 italic mb-4">
                        Dúvidas entre dois tamanhos? Escolha sempre o maior.
                    </p>
                </footer>
            </div>
        </div>
    );
}