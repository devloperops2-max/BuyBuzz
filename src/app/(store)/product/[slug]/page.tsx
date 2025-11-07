'use client';

import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import type { Product } from "@/lib/types";
import { doc } from "firebase/firestore";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, Share2, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";

function ProductDetailSkeleton() {
    return (
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 animate-pulse">
            <div className="aspect-square rounded-lg bg-muted"></div>
            <div className="flex flex-col justify-center py-8">
                <div className="h-6 w-24 bg-muted rounded-full mb-4"></div>
                <div className="h-10 w-3/4 bg-muted rounded mb-4"></div>
                <div className="h-10 w-1/4 bg-muted rounded mb-6"></div>
                <div className="h-20 w-full bg-muted rounded"></div>
                <div className="mt-8 flex items-center gap-4">
                    <div className="h-12 flex-1 bg-muted rounded-lg"></div>
                    <div className="h-12 w-12 bg-muted rounded-lg"></div>
                    <div className="h-12 w-12 bg-muted rounded-lg"></div>
                </div>
            </div>
        </div>
    )
}


export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const productId = params.slug;
  const firestore = useFirestore();
  
  const productRef = useMemoFirebase(() => {
    if (!firestore || !productId) return null;
    return doc(firestore, "products", productId);
  }, [firestore, productId]);
  
  const { data: product, isLoading } = useDoc<Product>(productRef);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    notFound();
  }
  
  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
      <div className="aspect-square rounded-lg overflow-hidden border bg-card">
        <Image
          src={(product.imageUrl || "https://picsum.photos/seed/placeholder/800/800").trimEnd()}
          alt={product.name}
          width={800}
          height={800}
          className="w-full h-full object-cover"
          data-ai-hint={product.imageHint}
        />
      </div>
      
      <div className="flex flex-col justify-center py-8">
        <Badge variant="secondary" className="w-fit">{product.category}</Badge>
        <h1 className="text-3xl md:text-4xl font-bold font-headline mt-4">{product.name}</h1>
        <p className="text-3xl font-bold text-primary mt-4">₹{product.price.toFixed(2)}</p>
        
        <div className="mt-6 prose-sm sm:prose text-muted-foreground max-w-none">
          <p>{product.description}</p>
        </div>
        
        <div className="mt-8 flex items-center gap-4">
          <Button size="lg" className="flex-1">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
          <Button variant="outline" size="icon" aria-label="Add to Wishlist">
            <Heart className="h-5 w-5" />
          </Button>
           <Button variant="outline" size="icon" aria-label="Share">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
