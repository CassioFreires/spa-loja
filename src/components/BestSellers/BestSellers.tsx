import { ShoppingCart, Star } from 'lucide-react';

const bestSellers = [
  {
    id: 1,
    name: "Camisa Modelo Jogador - 2026",
    price: 200,
    oldPrice: 249,
    category: "Camisas de Time",
    image: "/assets/images/jogador-flamengo.jpg",
    tag: "MAIS VENDIDO"
  },
  {
    id: 2,
    name: "Tênis Adidas Campus Premium",
    price: 200,
    oldPrice: 280,
    category: "Calçados",
    image: "/assets/images/adidas-campus.jpg",
    tag: "LANÇAMENTO"
  },
  {
    id: 3,
    name: "Camisa Dry Fit Tradicional",
    price: 100,
    oldPrice: 130,
    category: "Casual",
    image: "/assets/images/dryfit-oakley.jpg",
    tag: "OFERTA"
  },
  {
    id: 4,
    name: "Corta-Vento The North Face",
    price: 280,
    oldPrice: 350,
    category: "Inverno",
    image: "/assets/images/north-face.jpg",
    tag: "PREMIUM"
  }
];

export default function BestSellers() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Cabeçalho da Seção */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-yellow-600 font-bold text-sm tracking-[0.3em] uppercase">Os Favoritos</span>
            <h2 className="text-4xl md:text-5xl font-black text-black uppercase italic tracking-tighter leading-none mt-2">
              Mais <span className="text-yellow-500">Vendidos</span>
            </h2>
          </div>
          <button className="text-sm font-bold uppercase tracking-widest border-b-2 border-yellow-500 pb-1 hover:text-yellow-600 transition-colors">
            Ver Coleção Completa
          </button>
        </div>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestSellers.map((product) => (
            <div key={product.id} className="group relative flex flex-col">
              
              {/* Imagem do Produto */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-100 mb-4">
                {product.tag && (
                  <span className="absolute top-4 left-4 z-10 bg-black text-yellow-500 text-[10px] font-black px-3 py-1 rounded-sm tracking-widest">
                    {product.tag}
                  </span>
                )}
                
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Botão de Compra Rápida (Overlay) */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                  <button className="w-full bg-yellow-500 text-black font-black py-3 rounded-full flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <ShoppingCart className="w-4 h-4" />
                    ADICIONAR
                  </button>
                </div>
              </div>

              {/* Informações do Produto */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{product.category}</span>
                <h3 className="font-bold text-zinc-900 text-lg leading-tight group-hover:text-yellow-600 transition-colors italic">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-1 my-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xl font-black text-black tracking-tighter">
                    R$ {product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-zinc-400 line-through font-medium">
                    R$ {product.oldPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}