import AnimatedBackground from "../../../components/style/AnimatedBackground";
// Imagine que aqui você simplificou os imports:
import Banner from "../../../components/Banner/Banner";
import BestSellers from "../../../components/BestSellers/BestSellers";
import CategoryGrid from "../../../components/Cards/CategoryGrid/CategoryGrid";
import CustomerWall from "../../../components/CustomerWall/CustomerWall";
import ImportedAccessories from "../../../components/ImportedAccessories/ImportedAccessories";
import Promotions from "../../../components/Promotions/Promotions";
import Reviews from "../../../components/Reviews/Reviews";
import ShoeSection from "../../../components/ShoeSection/ShoeSection";

/**
 * Componente utilitário interno para manter a consistência visual 
 * e facilitar a mudança de espaçamento/largura em um só lugar.
 */
const HomeSection = ({ children, className = "", glass = false }: { children: React.ReactNode, className?: string, glass?: boolean }) => (
  <section className={`relative z-10 max-w-[1550px] mx-auto py-16 px-6 ${className}`}>
    {glass ? (
      <div className="bg-white/5 backdrop-blur-sm rounded-[3rem] p-2">
        {children}
      </div>
    ) : children}
  </section>
);

function Home() {
  return (
    <main className="relative min-h-screen bg-transparent overflow-x-hidden">
      {/* Background fixo */}
      <AnimatedBackground />

      {/* 1. Hero / Destaque */}
      <Banner />

      {/* 2. Ofertas (Com efeito Glassmorphism) */}
      <HomeSection glass>
        <Promotions />
      </HomeSection>

      {/* 3. Navegação por Categorias */}
      <HomeSection>
        <CategoryGrid />
      </HomeSection>

      {/* 4. Vitrines de Produtos */}
      <div className="relative z-10 space-y-16">
        <BestSellers />
        <ImportedAccessories />
        <ShoeSection />
      </div>

      {/* 5. Social Proof / Prova Social */}
      <HomeSection className="space-y-16">
        <CustomerWall />
        <Reviews />
      </HomeSection>
    </main>
  );
}

export default Home;