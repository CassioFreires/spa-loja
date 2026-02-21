import { useState, useMemo, useCallback } from 'react';
import {
    Trophy, Globe, Zap, Search, Loader2,
     Award, ArrowRight, ShieldCheck
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

// --- SERVIÇOS ---
import { getProducts } from '../../../services/Products/products';
import { getTeams } from '../../../services/Teams/teams';
// --- COMPONENTES ---
import ProductCard from '../../../components/Cards/ProductCard/ProductCard';

/* ==========================================================================
   TIPAGENS E CONSTANTES
   ========================================================================== */
type RegionFilter = 'all' | 'Nacional' | 'Internacional';

const LIGAS = [
    { id: '1', name: 'Brasileirão', icon: '🇧🇷' },
    { id: '2', name: 'Premier League', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { id: '3', name: 'La Liga', icon: '🇪🇸' },
    { id: '4', name: 'Champions', icon: '🏆' },
    { id: '5', name: 'Retrô', icon: '⏳' },
];

export default function TeamsPage() {
    // --- ESTADOS DE FILTRO ---
    const [region, setRegion] = useState<RegionFilter>('all');
    const [selectedLiga, setSelectedLiga] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // --- ESTADOS DO MODAL (Resolve o erro TS2741) ---
    const [, setIsModalOpen] = useState(false);
    const [, setProductForModal] = useState<any>(null);

    // --- FETCH DE DADOS (REACT QUERY) ---
    const {} = useQuery({
        queryKey: ['teams-list'],
        queryFn: getTeams,
        staleTime: 1000 * 60 * 30, // 30 minutos (dados estáticos de times)
    });

    const { data: productData, isLoading } = useQuery({
        // Adicione 'Time' à queryKey para que o cache seja específico para este tipo
        queryKey: ['products-teams', region, selectedLiga, 'Time'],
        queryFn: () => getProducts({
            product_type: 'Time', // <--- Isso garante o filtro no Backend
            region: region === 'all' ? undefined : (region as 'Nacional' | 'Internacional'),
            subcategory_id: selectedLiga || undefined
        }),
    });
    // --- LÓGICA DE INTERFACE ---
    const handleOpenModal = useCallback((product: any) => {
        setProductForModal(product);
        setIsModalOpen(true);
        // Aqui você chamaria o componente de Modal real do seu projeto
        console.log("Abrindo detalhes do produto:", product.name);
    }, []);

    // Filtro de busca local para performance instantânea
    const filteredProducts = useMemo(() => {
        const list = productData?.products || []; // Ajustado para bater com seu novo getProducts
        if (!searchQuery) return list;
        return list.filter((p: any) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [productData, searchQuery]);

    return (
        <div className="bg-white min-h-screen font-sans italic selection:bg-yellow-500 selection:text-black">

            {/* --- HERO SECTION EDITORIAL --- */}
            <section className="relative h-[65vh] flex items-center bg-black overflow-hidden">
                <div className="absolute inset-0 opacity-50 scale-105 animate-subtle-zoom">
                    <img
                        src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2070"
                        className="w-full h-full object-cover"
                        alt="Estádio Background"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />

                <div className="relative z-10 max-w-[1440px] mx-auto px-8 w-full">
                    <div className="max-w-2xl space-y-8">
                        <div className="inline-flex items-center gap-2 bg-yellow-500 text-black px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                            <Award size={14} /> The Kit Room • 2026
                        </div>
                        <h1 className="text-7xl md:text-[8rem] font-black text-white uppercase leading-[0.8] tracking-tighter">
                            MAIS QUE UM <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">MANTO.</span>
                        </h1>
                        <p className="text-zinc-300 text-lg md:text-xl not-italic font-medium max-w-md leading-relaxed border-l-2 border-yellow-500 pl-6">
                            A maior curadoria de camisas Tailandesas 1:1. Tecnologia Dry Fit e bordados oficiais para quem vive o jogo.
                        </p>
                    </div>
                </div>
            </section>

            {/* --- NAVEGAÇÃO DE LIGAS (STICKY BAR) --- */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-zinc-100 py-6">
                <div className="max-w-[1440px] mx-auto px-8 flex flex-col md:flex-row gap-6 items-center justify-between">

                    <div className="flex overflow-x-auto gap-4 no-scrollbar w-full md:w-auto">
                        <button
                            onClick={() => setSelectedLiga(null)}
                            className={`flex-shrink-0 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${!selectedLiga ? 'bg-zinc-900 text-white' : 'bg-zinc-50 text-zinc-400 hover:bg-zinc-100'}`}
                        >
                            Ver Tudo
                        </button>
                        {LIGAS.map((liga) => (
                            <button
                                key={liga.id}
                                onClick={() => setSelectedLiga(liga.id)}
                                className={`flex-shrink-0 flex items-center gap-3 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${selectedLiga === liga.id ? 'bg-yellow-500 text-black shadow-lg' : 'bg-zinc-50 text-zinc-400 hover:bg-zinc-100'}`}
                            >
                                <span>{liga.icon}</span> {liga.name}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar seu time..."
                            className="w-full bg-zinc-100 border-none pl-11 pr-4 py-3.5 rounded-2xl text-xs font-bold outline-none focus:ring-2 ring-yellow-500/30 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </nav>

            {/* --- SEÇÃO DE PERFORMANCE --- */}
            <section className="max-w-[1440px] mx-auto px-8 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative rounded-[3.5rem] overflow-hidden group h-[550px] shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2036"
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                            alt="Detalhe Player Version"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent p-12 flex flex-col justify-end">
                            <Zap className="text-yellow-500 mb-4 fill-yellow-500" size={40} />
                            <h3 className="text-5xl font-black uppercase italic tracking-tighter text-white">Player Version</h3>
                            <p className="text-zinc-300 text-sm mt-2 not-italic font-medium">Tecnologia Dry-Fit Pro, furos a laser e logos termocolados.</p>
                        </div>
                    </div>

                    <div className="space-y-10">
                        <h2 className="text-6xl font-black uppercase tracking-tighter leading-[0.8]">
                            Escolha sua <br /> <span className="text-yellow-600">Performance</span>
                        </h2>

                        <div className="grid gap-6">
                            <div className="flex gap-6 p-8 rounded-[2.5rem] bg-zinc-50 border border-zinc-100 hover:bg-white hover:shadow-xl transition-all duration-500 group">
                                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:bg-yellow-500 transition-colors">
                                    <Trophy className="text-zinc-900" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-black uppercase text-lg italic">Fan Version (Torcedor)</h4>
                                    <p className="text-zinc-500 text-sm not-italic leading-relaxed mt-1">Escudos bordados e corte tradicional. Conforto total para o dia a dia.</p>
                                </div>
                            </div>

                            <div className="flex gap-6 p-8 rounded-[2.5rem] bg-zinc-950 text-white shadow-2xl">
                                <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center">
                                    <Globe className="text-yellow-500" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-black uppercase text-lg italic text-yellow-500">Player Version (Jogador)</h4>
                                    <p className="text-zinc-400 text-sm not-italic leading-relaxed mt-1">O mesmo que os craques usam. Ajuste slim e leveza extrema.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- GRID DE PRODUTOS --- */}
            <section className="bg-zinc-50/50 py-24 border-t border-zinc-100">
                <div className="max-w-[1440px] mx-auto px-8">
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                        <div>
                            <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Mantos em <span className="text-yellow-600">Destaque</span></h2>
                            <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-4">Qualidade Tailandesa 1:1 Garantida</p>
                        </div>

                        <div className="flex bg-white rounded-2xl p-1 border border-zinc-200 shadow-sm">
                            {(['all', 'Nacional', 'Internacional'] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setRegion(t)}
                                    className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${region === t ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-400 hover:text-black'}`}
                                >
                                    {t === 'all' ? 'Ver Todos' : t}
                                </button>
                            ))}
                        </div>
                    </header>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-40 gap-4">
                            <Loader2 className="animate-spin text-yellow-600" size={48} />
                            <p className="font-black uppercase italic text-zinc-400 tracking-widest">Sincronizando Vestiário...</p>
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
                            {filteredProducts.map((product: any, idx: number) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    index={idx}
                                    onOpenModal={handleOpenModal} // ✅ AGORA PASSADO CORRETAMENTE
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-40 bg-white rounded-[4rem] border border-dashed border-zinc-200">
                            <p className="text-zinc-400 font-black uppercase italic tracking-widest">Nenhum manto encontrado para este filtro.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* --- CTA FINAL --- */}
            <section className="py-32 px-8">
                <div className="max-w-[1440px] mx-auto bg-zinc-950 rounded-[4rem] p-12 md:p-24 relative overflow-hidden">
                    <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic leading-[0.85] tracking-tighter">
                                Personalize seu <br /> <span className="text-yellow-500">Próprio Nome.</span>
                            </h2>
                            <p className="text-zinc-400 text-lg not-italic font-medium">
                                Adicione patchs oficiais, seu nome e número com a fonte oficial de cada liga.
                            </p>
                            <Link to="/contato" className="inline-flex items-center gap-4 bg-white text-black px-12 py-6 rounded-full font-black uppercase italic text-sm hover:bg-yellow-500 transition-all active:scale-95 shadow-2xl">
                                Solicitar via WhatsApp <ArrowRight size={20} />
                            </Link>
                        </div>
                        <div className="hidden md:flex justify-end">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-8 bg-zinc-900 rounded-3xl border border-white/5 text-center">
                                    <ShieldCheck className="text-yellow-500 mx-auto mb-4" size={32} />
                                    <p className="text-white font-black uppercase text-xs tracking-widest">Garantia Total</p>
                                </div>
                                <div className="p-8 bg-zinc-900 rounded-3xl border border-white/5 text-center">
                                    <Zap className="text-yellow-500 mx-auto mb-4" size={32} />
                                    <p className="text-white font-black uppercase text-xs tracking-widest">Envio Ultra</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}