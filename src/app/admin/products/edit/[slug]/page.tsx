
'use client';

import { ProductForm } from "@/components/admin/product-form";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { useParams } from "next/navigation";
import type { Product } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

function EditProductSkeleton() {
    return (
        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
                <Skeleton className="h-[280px] w-full rounded-lg" />
            </div>
            <div className="space-y-6">
                <Skeleton className="h-[200px] w-full rounded-lg" />
                <Skeleton className="h-[160px] w-full rounded-lg" />
            </div>
        </div>
    )
}

export default function EditProductPage() {
    const params = useParams();
    const productId = params.slug as string;
    const firestore = useFirestore();

    const productRef = useMemoFirebase(() => {
        if (!firestore || !productId) return null;
        return doc(firestore, 'products', productId);
    }, [firestore, productId]);
    
    const { data: product, isLoading } = useDoc<Product>(productRef);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 font-headline">Edit Product</h1>
            {isLoading && <EditProductSkeleton />}
            {!isLoading && !product && <p>Product not found.</p>}
            {!isLoading && product && <ProductForm product={product} />}
        </div>
    );
}
