'use client';
import { ProductCard } from "@/components/product-card";
import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { collection, query } from "firebase/firestore";
import type { Product } from "@/lib/types";
import { useDoc } from "@/firebase";
import { doc } from "firebase/firestore";

function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
      {[...Array(8)].map((_, i) => (
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

export default function DashboardPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  
  // 1. Fetch all products
  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "products"));
  }, [firestore]);
  const { data: allProducts, isLoading: areAllProductsLoading } = useCollection<Product>(productsQuery);

  // 2. Fetch user profile directly
  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, "users", user.uid);
  }, [firestore, user]);
  const { data: userProfile } = useDoc(userProfileRef);
  
  const welcomeMessage = userProfile?.firstName ? `Welcome back, ${userProfile.firstName}!` : "Welcome to BuyBuzz";

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight font-headline">{welcomeMessage}</h1>
      <p className="text-muted-foreground mt-2">Discover our full collection of curated products below.</p>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold font-headline">All Products</h2>
        <p className="text-muted-foreground mt-1">Browse our entire curated collection.</p>
        <div className="mt-6">
          {areAllProductsLoading ? (
            <ProductSkeleton />
          ) : allProducts && allProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {allProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
             <p className="text-muted-foreground">No products found. An admin may need to seed the database.</p>
          )}
        </div>
      </div>

    </div>
  );
}
