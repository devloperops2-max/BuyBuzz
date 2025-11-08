'use client';

import { useDoc, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import type { Product } from "@/lib/types";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, Share2, ShoppingCart, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

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


export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.slug as string;
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const productRef = useMemoFirebase(() => {
    if (!firestore || !productId) return null;
    return doc(firestore, "products", productId);
  }, [firestore, productId]);
  
  const { data: product, isLoading } = useDoc<Product>(productRef);

  const handleAddToCart = async () => {
    if (!user || !firestore || !product) {
        toast({
            variant: "destructive",
            title: "Unable to add to cart",
            description: "You must be logged in to add items to your cart."
        });
        return;
    }

    setIsAddingToCart(true);
    const cartItemRef = doc(firestore, 'users', user.uid, 'cart', product.id);

    try {
        const docSnap = await getDoc(cartItemRef);
        const currentQuantity = docSnap.exists() ? docSnap.data().quantity : 0;
        
        const cartItemData = {
            productId: product.id,
            quantity: currentQuantity + 1,
            // Denormalize product data for easier access in the cart
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl || '',
            imageHint: product.imageHint || ''
        };

        setDoc(cartItemRef, cartItemData, { merge: true })
            .then(() => {
                 toast({
                    title: "Added to Cart!",
                    description: `${product.name} has been added to your cart.`,
                });
            })
            .catch(serverError => {
                 const permissionError = new FirestorePermissionError({
                    path: cartItemRef.path,
                    operation: 'create',
                    requestResourceData: cartItemData,
                });
                errorEmitter.emit('permission-error', permissionError);
            });

    } catch (error) {
        console.error("Error adding to cart:", error);
        toast({
            variant: "destructive",
            title: "Something went wrong",
            description: "Could not add item to cart. Please try again.",
        });
    } finally {
        setIsAddingToCart(false);
    }
  };


  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
        <div className="flex flex-col items-center justify-center text-center h-96">
            <h1 className="text-2xl font-bold font-headline">Product Not Found</h1>
            <p className="text-muted-foreground mt-2">
                Sorry, we couldn't find the product you're looking for.
            </p>
            <Button asChild className="mt-6">
                <a href="/dashboard">Back to Shop</a>
            </Button>
        </div>
    );
  }
  
  const gstAmount = product.price * ((product.gstRate || 0) / 100);
  const shippingCost = product.shippingCost || (product.price > 499 ? 0 : 40);
  const totalAmount = product.price + gstAmount + shippingCost;

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
      
      <div className="flex flex-col justify-center py-4">
        <Badge variant="secondary" className="w-fit">{product.category}</Badge>
        <h1 className="text-3xl md:text-4xl font-bold font-headline mt-4">{product.name}</h1>
        
        <div className="mt-6 prose-sm sm:prose text-muted-foreground max-w-none">
          <p>{product.description}</p>
        </div>

        <Separator className="my-6" />

        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Price</span>
                <span className="font-medium">₹{product.price.toFixed(2)}</span>
            </div>
            {product.gstRate != null && product.gstRate > 0 && (
                 <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">GST ({product.gstRate}%)</span>
                    <span className="font-medium">₹{gstAmount.toFixed(2)}</span>
                </div>
            )}
            {shippingCost > 0 && (
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">₹{shippingCost.toFixed(2)}</span>
                </div>
            )}
             {shippingCost === 0 && (
                <div className="flex justify-between items-center text-green-600">
                    <span className="text-sm flex items-center gap-2"><Truck className="h-4 w-4"/> Yay! Free Shipping!</span>
                </div>
            )}
            <Separator />
            <div className="flex justify-between items-center text-xl font-bold">
                <span>Total</span>
                <span>₹{totalAmount.toFixed(2)}</span>
            </div>
        </div>
        
        <div className="mt-8 flex items-center gap-4">
          <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={isAddingToCart}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
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
