import Banner from "../../../components/Banner/Banner";
import BestSellers from "../../../components/BestSellers/BestSellers";
import CategoryGrid from "../../../components/Cards/CategoryGrid/CategoryGrid";
import CustomerWall from "../../../components/CustomerWall/CustomerWall";
import ImportedAccessories from "../../../components/ImportedAccessories/ImportedAccessories";
import Promotions from "../../../components/Promotions/Promotions";
import Reviews from "../../../components/Reviews/Reviews";
import ShoeSection from "../../../components/ShoeSection/ShoeSection";
import AnimatedBackground from "../../../components/style/AnimatedBackground";

function Home() {
    return (
        /* Mudamos para bg-transparent para o canvas fixo aparecer */
        <main className="relative min-h-screen bg-transparent">
            <AnimatedBackground />

            <Banner />

            {/* Exemplo de seção com "transparência profissional" */}
            <section className="relative z-10 max-w-[1550px] mx-auto py-16 px-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-[3rem] p-2">
                    <Promotions />
                </div>
            </section>

            {/* Repita o padrão de sections para as demais */}
            <section className="relative z-10 max-w-[1440px] mx-auto py-16 px-6">
                <CategoryGrid />
            </section>

            <BestSellers />
            <ImportedAccessories />
            <ShoeSection />
            <CustomerWall />
            <Reviews />
        </main>
    );
}

export default Home;