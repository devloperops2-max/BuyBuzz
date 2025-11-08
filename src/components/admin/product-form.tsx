
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { useFirestore, useUser } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { collection, doc, setDoc, serverTimestamp, addDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { generateProductDescription } from "@/ai/flows/generate-product-descriptions";

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [category, setCategory] = useState(product?.category || "");
  const [price, setPrice] = useState(product?.price || 0);
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || "");

  const handleGenerateDescription = async () => {
    if (!name || !category) {
        toast({
            variant: "destructive",
            title: "Missing Details",
            description: "Please enter a product name and category to generate a description."
        });
        return;
    }
    setIsGenerating(true);
    try {
        const result = await generateProductDescription({
            productName: name,
            productFeatures: "", // You can add a field for features if you want
            productCategory: category,
        });
        setDescription(result.productDescription);
    } catch (error) {
        console.error("Error generating description", error);
        toast({
            variant: "destructive",
            title: "Generation Failed",
            description: "Could not generate a product description."
        })
    } finally {
        setIsGenerating(false);
    }
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore) return;

    setIsSubmitting(true);

    const productData: Omit<Product, 'id'> = {
        name,
        description,
        category,
        price: Number(price),
        imageUrl,
    };

    try {
        if (product) {
            // Update existing product
            const productRef = doc(firestore, 'products', product.id);
            await setDoc(productRef, productData, { merge: true });
            toast({ title: "Product Updated", description: `${name} has been successfully updated.` });
        } else {
            // Create new product
            const productsCollection = collection(firestore, 'products');
            await addDoc(productsCollection, { ...productData, createdAt: serverTimestamp() });
            toast({ title: "Product Created", description: `${name} has been successfully added.` });
        }
        router.push("/admin/products");
        router.refresh(); // Force a refresh to show the new/updated data
    } catch (error) {
        console.error("Error saving product:", error);
        toast({
            variant: "destructive",
            title: "Save Failed",
            description: "There was an error saving the product."
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>
                Fill in the details for your new product.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                    <Label htmlFor="description">Description</Label>
                    <Button type="button" variant="outline" size="sm" onClick={handleGenerateDescription} disabled={isGenerating}>
                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                        Generate with AI
                    </Button>
                </div>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} required />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category & Price</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
              </div>
            </CardContent>
          </Card>
           <Card>
             <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
             <CardContent className="grid gap-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..."/>
                <p className="text-xs text-muted-foreground">You can use a service like Unsplash.</p>
             </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {product ? 'Save Changes' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}
