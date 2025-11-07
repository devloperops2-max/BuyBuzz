import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminUsersPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 font-headline">Customers</h1>
            <Card>
                <CardHeader>
                    <CardTitle>All Customers</CardTitle>
                    <CardDescription>
                        A list of all registered users.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Customer management is not implemented in this scaffold.</p>
                </CardContent>
            </Card>
        </div>
    );
}
