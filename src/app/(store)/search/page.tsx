'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/product-card';
import { SearchX } from 'lucide-react';

function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <div className="relative aspect-square bg-muted rounded-lg animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

function SearchResults() {
  const searchParams = useSearchParams();
  const firestore = useFirestore();
  const searchQuery = searchParams.get('q') || '';

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "products"));
  }, [firestore]);

  const { data: allProducts, isLoading: areProductsLoading } = useCollection<Product>(productsQuery);

  const filteredProducts = allProducts?.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight font-headline">
        Search Results for &quot;{searchQuery}&quot;
      </h1>
      <p className="text-muted-foreground mt-2">
        {filteredProducts ? `${filteredProducts.length} products found.` : 'Searching...'}
      </p>

      <div className="mt-8">
        {areProductsLoading ? (
          <ProductSkeleton />
        ) : filteredProducts && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-64">
            <SearchX className="h-16 w-16 text-muted-foreground" />
            <p className="mt-4 font-semibold">No products found matching your search.</p>
            <p className="text-muted-foreground mt-1">Try a different keyword.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading search...</div>}>
            <SearchResults />
        </Suspense>
    )
}
