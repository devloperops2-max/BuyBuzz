
'use client';

import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import type { CartItem } from '@/lib/types';
import { collection } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CreditCard } from 'lucide-react';

export default function CheckoutPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const cartRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, 'users', user.uid, 'cart');
    }, [user, firestore]);

    const { data: cartItems, isLoading } = useCollection<CartItem>(cartRef);

    const subtotal = cartItems?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
    const gstRate = 0.12; // 12% GST
    const gstAmount = subtotal * gstRate;
    const total = subtotal + gstAmount;

    if (isLoading) {
        return <div>Loading your order...</div>
    }
    
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 font-headline">Checkout</h1>
            <div className="grid md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" placeholder="Enter your full name" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" placeholder="1234 Street Name" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" placeholder="Your City" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="zip">Postal Code</Label>
                                <Input id="zip" placeholder="Your Postal Code" />
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Payment Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <Alert>
                                <CreditCard className="h-4 w-4" />
                                <AlertTitle>Work in Progress</AlertTitle>
                                <AlertDescription>
                                    Payment gateway integration is not yet implemented. This is a placeholder section.
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-1 sticky top-24">
                     <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {cartItems?.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2">
                                        <Image src={(item.imageUrl || 'https://picsum.photos/seed/placeholder/40/40').trimEnd()} alt={item.name} width={40} height={40} className="rounded-md" />
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                           <Separator />
                           <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                           </div>
                           <div className="flex justify-between text-sm">
                                <span>Shipping</span>
                                <span>Free</span>
                           </div>
                            <div className="flex justify-between text-sm">
                                <span>GST (12%)</span>
                                <span>₹{gstAmount.toFixed(2)}</span>
                           </div>
                           <Separator />
                           <div className="flex justify-between font-bold text-base">
                                <span>Total</span>
                                <span>₹{total.toFixed(2)}</span>
                           </div>
                        </CardContent>
                        <CardFooter>
                            <Button size="lg" className="w-full" disabled>Place Order</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
