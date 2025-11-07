'use client';
import { ProductCard } from "@/components/product-card";
import { useCollection, useDoc, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { collection, query, where, documentId, doc } from "firebase/firestore";
import type { Product } from "@/lib/types";
import { useEffect, useState } from "react";
import { getPersonalizedProductRecommendations } from "@/ai/flows/personalized-product-recommendations";
import { Separator } from "@/components/ui/separator";

function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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

export default function DashboardPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [isRecommendationLoading, setIsRecommendationLoading] = useState(true);

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
  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  // 3. Get AI recommendations
  useEffect(() => {
    if (userProfile && allProducts && allProducts.length > 0) {
      const getRecs = async () => {
        setIsRecommendationLoading(true);
        try {
          const productList = allProducts.map(p => p.name).join(', ');
          const interestList = userProfile.interests.join(', ');

          const result = await getPersonalizedProductRecommendations({
            userInterests: interestList,
            browsingHistory: '',
            purchaseHistory: '',
            availableProducts: productList,
          });

          // Extract product names from the conversational response
          const recommendedNames = allProducts
            .filter(p => result.recommendedProducts.includes(p.name))
            .map(p => p.name);
        
          const productsToShow = allProducts.filter(p => recommendedNames.includes(p.name));
          setRecommendedProducts(productsToShow);

        } catch (error) {
          console.error("Error getting recommendations:", error);
          setRecommendedProducts([]);
        } finally {
          setIsRecommendationLoading(false);
        }
      };
      getRecs();
    } else if (!isProfileLoading && !areAllProductsLoading) {
      // Handle case where there's no profile or products
      setIsRecommendationLoading(false);
    }
  }, [userProfile, allProducts, isProfileLoading, areAllProductsLoading]);
  
  const welcomeMessage = userProfile?.firstName ? `Welcome, ${userProfile.firstName}!` : "Welcome to BuyBuzz";

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight font-headline">{welcomeMessage}</h1>
      <p className="text-muted-foreground mt-2">Discover products curated just for you and browse our full collection.</p>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold font-headline">For You</h2>
        <p className="text-muted-foreground mt-1">Products we think you'll love based on your interests.</p>
        <div className="mt-6">
          {(isProfileLoading || isRecommendationLoading) ? (
            <ProductSkeleton />
          ) : recommendedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {recommendedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No specific recommendations for you right now. Check out our full collection below!</p>
          )}
        </div>
      </div>
      
      <Separator className="my-12" />

      <div>
        <h2 className="text-2xl font-bold font-headline">All Products</h2>
        <p className="text-muted-foreground mt-1">Browse our entire curated collection.</p>
        <div className="mt-6">
          {areAllProductsLoading ? (
            <ProductSkeleton />
          ) : allProducts && allProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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
