import React, { Suspense, lazy } from "react";
import { useMediaQuery } from "../../../hooks/useMediaQuery";

// Componentes Críticos (Imediato)
import Banner from "../../../components/Banner/Banner";
import Promotions from "../../../components/Promotions/Promotions";

// Lazy Loading para Performance (TTI)
const AnimatedBackground = lazy(() => import("../../../components/style/AnimatedBackground"));
const CategoryGrid = lazy(() => import("../../../components/Cards/CategoryGrid/CategoryGrid"));
const BestSellers = lazy(() => import("../../../components/BestSellers/BestSellers"));
const ImportedAccessories = lazy(() => import("../../../components/ImportedAccessories/ImportedAccessories"));
const ShoeSection = lazy(() => import("../../../components/ShoeSection/ShoeSection"));
const CustomerWall = lazy(() => import("../../../components/CustomerWall/CustomerWall"));
const Reviews = lazy(() => import("../../../components/Reviews/Reviews"));

/**
 * @interface HomeSectionProps
 */
interface HomeSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  minHeight?: string;
}

const HomeSection = ({ children, className = "", id, minHeight = "auto" }: HomeSectionProps) => (
  <section 
    id={id}
    style={{ minHeight }}
    className={`relative z-10 max-w-[1600px] mx-auto py-12 md:py-20 px-4 md:px-8 lg:px-12 ${className}`}
  >
    {children}
  </section>
);

function Home() {
  // Hook para detectar se é desktop (evita renderizar canvas no mobile)
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <main className="relative min-h-screen bg-zinc-50 overflow-x-hidden selection:bg-yellow-500 selection:text-zinc-950">
      
      {/* LOGICA DO BACKGROUND: 
        Se for Desktop, carrega o Canvas. 
        Se for Mobile, usa apenas um degradê leve via CSS para economizar bateria/CPU.
      */}
      {isDesktop ? (
        <Suspense fallback={null}>
          <AnimatedBackground />
        </Suspense>
      ) : (
        <div className="fixed inset-0 bg-gradient-to-b from-zinc-100 to-white -z-10" />
      )}

      {/* 1. HERO SECTION (LCP) */}
      <header className="relative z-20">
        <Banner />
      </header>

      {/* 2. CONVERSION ENGINE */}
      <HomeSection id="hot-offers" minHeight="400px">
        <Promotions />
      </HomeSection>

      {/* 3. DISCOVERY LAYER */}
      <HomeSection id="collections" minHeight="300px">
        <Suspense fallback={<div className="h-64 animate-pulse bg-zinc-200/50 rounded-[3rem]" />}>
          <CategoryGrid />
        </Suspense>
      </HomeSection>

      {/* 4. PRODUCT SHOWCASE - Empacotados em um único Suspense para evitar múltiplos Reflows */}
      <div className="relative z-10 space-y-12 md:space-y-24 py-10">
        <Suspense fallback={<div className="h-screen flex items-center justify-center text-zinc-300 italic">Carregando Vitrines...</div>}>
          <BestSellers />
          <ImportedAccessories />
          <ShoeSection />
        </Suspense>
      </div>

      {/* 5. TRUST & AUTHORITY (Social Proof) */}
      <HomeSection className="space-y-16 md:space-y-32 mb-20 md:mb-32">
        <Suspense fallback={<div className="h-96" />}>
          <div className="will-change-transform">
            <CustomerWall />
          </div>
          <div className="will-change-transform">
            <Reviews />
          </div>
        </Suspense>
      </HomeSection>

      {/* SEO & Segurança */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ClothingStore",
          "name": "Gold Store",
          "description": "Qualidade tailandesa 1:1 em camisas de time, acessórios e calçados exclusivos.",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Nova Iguaçu",
            "addressRegion": "RJ",
            "addressCountry": "BR"
          }
        })}
      </script>
    </main>
  );
}

export default Home;