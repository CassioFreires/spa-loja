import React, { Suspense, lazy } from "react";
import AnimatedBackground from "../../../components/style/AnimatedBackground";

// Imports Diretos para Seções Críticas (LCP)
import Banner from "../../../components/Banner/Banner";
import Promotions from "../../../components/Promotions/Promotions";

// Lazy Loading para Seções Abaixo da Dobra (Performance & TTI)
const CategoryGrid = lazy(() => import("../../../components/Cards/CategoryGrid/CategoryGrid"));
const BestSellers = lazy(() => import("../../../components/BestSellers/BestSellers"));
const ImportedAccessories = lazy(() => import("../../../components/ImportedAccessories/ImportedAccessories"));
const ShoeSection = lazy(() => import("../../../components/ShoeSection/ShoeSection"));
const CustomerWall = lazy(() => import("../../../components/CustomerWall/CustomerWall"));
const Reviews = lazy(() => import("../../../components/Reviews/Reviews"));

/**
 * @interface HomeSectionProps
 * Componente utilitário que garante a consistência de grid e SEO semântico.
 */
interface HomeSectionProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  id?: string;
}

const HomeSection = ({ children, className = "", glass = false, id }: HomeSectionProps) => (
  <section 
    id={id}
    className={`relative z-10 max-w-[1600px] mx-auto py-12 md:py-20 px-4 md:px-8 lg:px-12 ${className}`}
  >
    {glass ? (
      <div className="bg-zinc-900/5 backdrop-blur-md rounded-[3.5rem] p-4 md:p-10 border border-white/10 shadow-2xl transition-all duration-500 hover:bg-zinc-900/10">
        {children}
      </div>
    ) : children}
  </section>
);

/**
 * @page Home
 * @description Centralizador da Gold Store otimizado para conversão 1:1 e SEO de alta autoridade.
 */
function Home() {
  return (
    <main className="relative min-h-screen bg-zinc-50 overflow-x-hidden selection:bg-yellow-500 selection:text-zinc-950">
      {/* Background Camada -1 */}
      <AnimatedBackground />

      {/* 1. HERO SECTION (Foco total no LCP) */}
      <header className="relative z-20">
        <Banner />
      </header>

      {/* 2. CONVERSION ENGINE (Ofertas Rápidas) */}
      <HomeSection  id="hot-offers">
        <Suspense fallback={<div className="h-96 animate-pulse bg-zinc-200 rounded-3xl" />}>
          <Promotions />
        </Suspense>
      </HomeSection>

      {/* 3. DISCOVERY LAYER (Navegação Visual) */}
      <HomeSection id="collections">
        <Suspense fallback={<div className="h-64 animate-pulse bg-zinc-100 rounded-3xl" />}>
          <CategoryGrid />
        </Suspense>
      </HomeSection>

      {/* 4. PRODUCT SHOWCASE (Vitrines Verticais) */}
      <div className="relative z-10 space-y-12 md:space-y-24 py-10">
        <Suspense fallback={<div className="h-screen bg-transparent" />}>
          <BestSellers />
          <ImportedAccessories />
          <ShoeSection />
        </Suspense>
      </div>

      {/* 5. TRUST & AUTHORITY (Social Proof) */}
      <HomeSection className="space-y-16 md:space-y-32 mb-20 md:mb-32">
        <Suspense fallback={<div className="h-96 bg-zinc-50" />}>
          <article className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <CustomerWall />
          </article>
          <article className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
            <Reviews />
          </article>
        </Suspense>
      </HomeSection>

      {/* Structured Data (Hidden) para IA identificar a marca */}
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
          },
          "priceRange": "$$"
        })}
      </script>
    </main>
  );
}

export default Home;