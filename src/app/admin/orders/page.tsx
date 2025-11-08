'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import type { Order, User } from "@/lib/types";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collectionGroup, query, orderBy, doc, updateDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

type OrderWithUser = Order & { userData?: Partial<User> };

const orderStatuses = ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const ordersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collectionGroup(firestore, 'orders'), orderBy('orderDate', 'desc'));
  }, [firestore]);

  const { data: orders, isLoading } = useCollection<OrderWithUser>(ordersQuery);

  const handleStatusChange = async (orderId: string, userId: string, newStatus: string) => {
    if (!firestore) return;
    const orderRef = doc(firestore, 'users', userId, 'orders', orderId);
    try {
      await updateDoc(orderRef, { orderStatus: newStatus });
      toast({
        title: "Order Status Updated",
        description: `Order #${orderId.substring(0, 7)} is now marked as ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating order status: ", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update the order status.",
      });
    }
  };

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

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
    return format(date, 'MMM d, yyyy');
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 font-headline">Orders</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Customer Orders</CardTitle>
          <CardDescription>
            View and manage all orders placed in your store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="h-4 w-20 bg-muted rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 w-24 bg-muted rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 w-32 bg-muted rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 w-16 bg-muted rounded animate-pulse"></div></TableCell>
                    <TableCell><div className="h-6 w-20 bg-muted rounded-full animate-pulse"></div></TableCell>
                    <TableCell><div className="h-8 w-8 bg-muted rounded animate-pulse"></div></TableCell>
                  </TableRow>
                ))}
                {!isLoading && orders?.map(order => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id.substring(0, 7)}...</TableCell>
                    <TableCell>{formatDate(order.orderDate)}</TableCell>
                    <TableCell>{order.userId.substring(0,12)}...</TableCell>
                    <TableCell>₹{order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.orderStatus)}>{order.orderStatus}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           {orderStatuses.map(status => (
                              <DropdownMenuItem key={status} onClick={() => handleStatusChange(order.id, order.userId, status)}>
                                Mark as {status}
                              </DropdownMenuItem>
                           ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
             {!isLoading && !orders?.length && (
              <div className="text-center p-8 text-muted-foreground">
                No orders have been placed yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
