import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminOrdersPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 font-headline">Orders</h1>
            <Card>
                <CardHeader>
                    <CardTitle>All Orders</CardTitle>
                    <CardDescription>
                        A list of all orders from customers.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Order management is not implemented in this scaffold.</p>
                </CardContent>
            </Card>
        </div>
    );
}
