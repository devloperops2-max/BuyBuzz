import { ProductCard } from "@/components/product-card";
import { products } from "@/data/products";

export default function DashboardPage() {
  const allProducts = [...products, ...products.map(p => ({...p, id: `${p.id}-2`}))];

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight font-headline">Welcome to Lumina</h1>
      <p className="text-muted-foreground mt-2">Browse our curated collection of home goods.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
        {allProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
