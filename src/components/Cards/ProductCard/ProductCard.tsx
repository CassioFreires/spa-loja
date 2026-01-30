// Exemplo de como usar as variações recebidas do banco no seu layout
function ProductCard({ product }: { product: any }) {
  // Filtramos variações nulas (comum em LEFT JOINs sem dados correspondentes)
  const availableVariations = product.variations?.filter((v: any) => v !== null) || [];

  return (
    <div className="product-card">
      <img src={product.image_url} alt={product.name} />
      <h3>{product.name}</h3>
      <p>R$ {product.price}</p>
      
      {/* Exemplo: Exibindo tamanhos disponíveis vindos do banco */}
      <div className="flex gap-1 mt-2">
        {availableVariations.map((v: any) => (
          <span key={v.id} className="text-[9px] border px-1 border-zinc-200">
            {v.value}
          </span>
        ))}
      </div>
    </div>
  );
}