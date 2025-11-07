"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, you'd handle form submission to your backend
    router.push("/admin/products");
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
                <Input id="name" defaultValue={product?.name} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" defaultValue={product?.description} rows={5} required />
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
                <Input id="category" defaultValue={product?.category} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" step="0.01" defaultValue={product?.price} required />
              </div>
            </CardContent>
          </Card>
          <Card>
             <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
             <CardContent>
                <p className="text-sm text-muted-foreground">Image upload is not implemented in this scaffold.</p>
             </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button type="submit">{product ? 'Save Changes' : 'Create Product'}</Button>
      </div>
    </form>
  );
}
