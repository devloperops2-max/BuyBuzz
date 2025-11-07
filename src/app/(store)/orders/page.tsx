import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function UserOrdersPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 font-headline">My Orders</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Your Order History</CardTitle>
                    <CardDescription>
                        A list of all your past orders.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">You have no orders yet.</p>
                </CardContent>
            </Card>
        </div>
    );
}
