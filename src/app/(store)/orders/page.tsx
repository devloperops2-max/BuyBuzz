'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import type { Order } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { format } from 'date-fns';

function OrderHistorySkeleton() {
    return (
        <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                    <CardHeader className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="h-5 bg-muted rounded w-3/4"></div>
                        <div className="h-5 bg-muted rounded w-1/2"></div>
                        <div className="h-5 bg-muted rounded w-1/3"></div>
                        <div className="h-5 bg-muted rounded w-1/4"></div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-muted rounded-md"></div>
                            <div className="flex-grow space-y-2">
                                <div className="h-4 bg-muted rounded w-full"></div>
                                <div className="h-4 bg-muted rounded w-1/4"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}


export default function UserOrdersPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const ordersQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, `users/${user.uid}/orders`), orderBy('orderDate', 'desc'));
    }, [user, firestore]);

    const { data: orders, isLoading } = useCollection<Order>(ordersQuery);

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
        return format(date, 'MMMM d, yyyy');
    }

     const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case "Placed": return "default";
            case "Processing": return "secondary";
            case "Shipped": return "outline";
            case "Delivered": return "secondary";
            case "Cancelled": return "destructive";
            default: return "default";
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 font-headline">My Orders</h1>
            {isLoading && <OrderHistorySkeleton />}
            
            {!isLoading && (!orders || orders.length === 0) && (
                <Card>
                    <CardHeader>
                        <CardTitle>Your Order History</CardTitle>
                        <CardDescription>
                            A list of all your past orders.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <p className="text-muted-foreground">You have no orders yet.</p>
                    </CardContent>
                </Card>
            )}

            {!isLoading && orders && orders.length > 0 && (
                <div className="space-y-6">
                    {orders.map(order => (
                        <Card key={order.id}>
                            <CardHeader className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/50 py-4 px-6 text-sm">
                                <div>
                                    <p className="font-semibold">Order Placed</p>
                                    <p className="text-muted-foreground">{formatDate(order.orderDate)}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Total</p>
                                    <p className="text-muted-foreground">₹{order.totalAmount.toFixed(2)}</p>
                                </div>
                                 <div>
                                    <p className="font-semibold">Status</p>
                                    <Badge variant={getStatusVariant(order.orderStatus)}>{order.orderStatus}</Badge>
                                </div>
                                <div>
                                    <p className="font-semibold">Order ID</p>
                                    <p className="text-muted-foreground truncate">#{order.id}</p>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                {order.items.map(item => (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <Image 
                                            src={(item.imageUrl || 'https://picsum.photos/seed/placeholder/100/100').trimEnd()} 
                                            alt={item.name} 
                                            width={80} 
                                            height={80} 
                                            className="rounded-md border aspect-square object-cover" 
                                        />
                                        <div className="flex-grow">
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-medium">₹{(item.itemPrice * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
