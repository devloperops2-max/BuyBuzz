'use client';

import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { CartItem } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

function CartSkeleton() {
    return (
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
                {[...Array(2)].map((_, i) => (
                    <Card key={i} className="flex items-center p-4 animate-pulse">
                        <div className="w-24 h-24 bg-muted rounded-md"></div>
                        <div className="ml-4 flex-grow space-y-2">
                            <div className="h-5 w-3/4 bg-muted rounded"></div>
                            <div className="h-4 w-1/4 bg-muted rounded"></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-muted rounded-md"></div>
                            <div className="h-6 w-8 bg-muted rounded"></div>
                            <div className="h-8 w-8 bg-muted rounded-md"></div>
                        </div>
                        <div className="ml-6 h-8 w-8 bg-muted rounded-md"></div>
                    </Card>
                ))}
            </div>
            <div className="md:col-span-1">
                <Card className="animate-pulse">
                    <CardHeader>
                        <div className="h-6 w-3/4 bg-muted rounded"></div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <div className="h-4 w-1/4 bg-muted rounded"></div>
                            <div className="h-4 w-1/3 bg-muted rounded"></div>
                        </div>
                         <div className="flex justify-between">
                            <div className="h-4 w-1/3 bg-muted rounded"></div>
                            <div className="h-4 w-1/4 bg-muted rounded"></div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                         <div className="h-10 w-full bg-muted rounded-lg"></div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default function CartPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const cartRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, 'users', user.uid, 'cart');
    }, [user, firestore]);

    const { data: cartItems, isLoading } = useCollection<CartItem>(cartRef);

    const handleQuantityChange = async (productId: string, newQuantity: number) => {
        if (!user || !firestore) return;
        const itemRef = doc(firestore, 'users', user.uid, 'cart', productId);
        if (newQuantity <= 0) {
            await deleteDoc(itemRef);
        } else {
            await updateDoc(itemRef, { quantity: newQuantity });
        }
    };

    const subtotal = cartItems?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
    const gstRate = 0.12; // 12% GST
    const gstAmount = subtotal * gstRate;
    const total = subtotal + gstAmount;


    if (isLoading) {
        return <CartSkeleton />
    }

    if (!cartItems || cartItems.length === 0) {
        return (
             <div className="flex flex-col items-center justify-center text-center h-96">
                <ShoppingCart className="h-16 w-16 text-muted-foreground" />
                <h1 className="text-2xl font-bold font-headline mt-6">Your Cart is Empty</h1>
                <p className="text-muted-foreground mt-2">
                    Looks like you haven't added anything to your cart yet.
                </p>
                <Button asChild className="mt-6">
                    <Link href="/dashboard">Start Shopping</Link>
                </Button>
            </div>
        )
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 font-headline">Your Shopping Cart</h1>
            <div className="grid md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-2 space-y-4">
                    {cartItems.map(item => (
                        <Card key={item.id} className="flex items-center p-4">
                            <Image src={(item.imageUrl || 'https://picsum.photos/seed/placeholder/100/100').trimEnd()} alt={item.name} width={100} height={100} className="rounded-md object-cover aspect-square" />
                            <div className="ml-4 flex-grow">
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-muted-foreground text-sm">₹{item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="font-medium w-8 text-center">{item.quantity}</span>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                             <Button variant="ghost" size="icon" className="ml-4 text-muted-foreground hover:text-destructive" onClick={() => handleQuantityChange(item.id, 0)}>
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        </Card>
                    ))}
                </div>
                <div className="md:col-span-1 sticky top-24">
                     <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                           </div>
                           <div className="flex justify-between">
                                <span>Shipping & Handling</span>
                                <span>Free</span>
                           </div>
                            <div className="flex justify-between">
                                <span>GST (12%)</span>
                                <span>₹{gstAmount.toFixed(2)}</span>
                           </div>
                           <Separator />
                           <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>₹{total.toFixed(2)}</span>
                           </div>
                        </CardContent>
                        <CardFooter>
                            <Button size="lg" className="w-full" asChild>
                                <Link href="/checkout">Proceed to Checkout</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
