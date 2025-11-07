'use client';

import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import type { CartItem, Order } from '@/lib/types';
import { collection, writeBatch, doc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';
import { CreditCard, Landmark, Loader2, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const router = useRouter();

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const cartRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, 'users', user.uid, 'cart');
    }, [user, firestore]);

    const { data: cartItems, isLoading } = useCollection<CartItem>(cartRef);

    const subtotal = cartItems?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
    const gstRate = 0.12; // 12% GST
    const gstAmount = subtotal * gstRate;
    const shippingCost = subtotal > 499 ? 0 : 40;
    const total = subtotal + gstAmount + shippingCost;

    const handlePlaceOrder = async () => {
        if (!user || !firestore || !cartItems || cartItems.length === 0) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Cannot place order. Your cart is empty or you are not logged in.'
            });
            return;
        }

        setIsPlacingOrder(true);

        try {
            const batch = writeBatch(firestore);

            // 1. Create a new order document
            const orderRef = doc(collection(firestore, 'users', user.uid, 'orders'));
            const newOrder: Omit<Order, 'id'> = {
                userId: user.uid,
                orderDate: serverTimestamp(),
                totalAmount: total,
                paymentMethod: paymentMethod,
                orderStatus: 'Placed',
                items: cartItems.map(item => ({
                    id: item.productId,
                    productId: item.productId,
                    quantity: item.quantity,
                    itemPrice: item.price,
                    name: item.name,
                    imageUrl: (item.imageUrl || '').trimEnd(),
                }))
            };
            batch.set(orderRef, newOrder);
            
            // 2. Clear the cart
            cartItems.forEach(item => {
                const cartItemRef = doc(firestore, 'users', user.uid, 'cart', item.id);
                batch.delete(cartItemRef);
            });

            // 3. Commit the batch
            await batch.commit();

            toast({
                title: 'Order Placed Successfully!',
                description: 'Thank you for your purchase.'
            });

            // 4. Redirect to the orders page
            router.push('/orders');

        } catch (error) {
            console.error("Error placing order: ", error);
            toast({
                variant: 'destructive',
                title: 'Something went wrong',
                description: 'Could not place your order. Please try again.'
            });
        } finally {
            setIsPlacingOrder(false);
        }
    }

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
                            <CardTitle>Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <RadioGroupItem value="card" id="card" className="peer sr-only" />
                                    <Label htmlFor="card" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                        <CreditCard className="mb-3 h-6 w-6" />
                                        Card
                                    </Label>
                                </div>
                                 <div>
                                    <RadioGroupItem value="upi" id="upi" className="peer sr-only" />
                                    <Label htmlFor="upi" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                        <Landmark className="mb-3 h-6 w-6" />
                                        UPI
                                    </Label>
                                </div>
                                 <div>
                                    <RadioGroupItem value="cod" id="cod" className="peer sr-only" />
                                    <Label htmlFor="cod" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                        <Wallet className="mb-3 h-6 w-6" />
                                        Cash on Delivery
                                    </Label>
                                </div>
                            </RadioGroup>
                             {paymentMethod === 'card' && (
                                <div className="mt-6 grid gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="card-number">Card Number</Label>
                                        <Input id="card-number" placeholder="0000 0000 0000 0000" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="expiry">Expiry</Label>
                                            <Input id="expiry" placeholder="MM/YY" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cvv">CVV</Label>
                                            <Input id="cvv" placeholder="123" />
                                        </div>
                                    </div>
                                </div>
                            )}
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
                                <span>{shippingCost > 0 ? `₹${shippingCost.toFixed(2)}` : 'Free'}</span>
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
                            <Button size="lg" className="w-full" onClick={handlePlaceOrder} disabled={isPlacingOrder || !cartItems || cartItems.length === 0}>
                                {isPlacingOrder && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
