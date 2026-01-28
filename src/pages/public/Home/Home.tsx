import Banner from "../../../components/Banner/Banner";
import BestSellers from "../../../components/BestSellers/BestSellers";
import CategoryGrid from "../../../components/Cards/CategoryGrid/CategoryGrid";
import CustomerWall from "../../../components/CustomerWall/CustomerWall";
import Promotions from "../../../components/Promotions/Promotions";
import Reviews from "../../../components/Reviews/Reviews";
import ShoeSection from "../../../components/ShoeSection/ShoeSection";
function Home() {
    return (
        <main className="min-h-screen bg-zinc-50">
            {/* O Banner agora é o destaque principal (Hero) */}
            <Banner />
            {/* Próximas seções: Categorias em Destaque ou Vitrine de Produtos */}
            <section className=" mx-auto py-12 px-4 md:px-8">
                <div className="overflow-hidden rounded-3xl md:rounded-[40px] shadow-2xl">
                    <Promotions />
                </div>
            </section>
            {/* Próximas seções: Categorias em Destaque ou Vitrine de Produtos */}
            <section className="max-w-[1440px] mx-auto py-16 px-6">
                <CategoryGrid />
            </section>

            <section className="max-w-[1440px] mx-auto py-16 px-6">
                <CustomerWall />
            </section>

            <section className="max-w-[1440px] mx-auto py-16 px-6">
                <BestSellers />
            </section>

            <section className="max-w-[1440px] mx-auto py-16 px-6">
                <ShoeSection />
            </section>

            <section className="max-w-[1440px] mx-auto py-16 px-6">
                <Reviews />
            </section>
        </main>
    );
}

export default Home;