'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import type { User as UserProfile } from "@/lib/types"; // Renaming to avoid conflict with Firebase User
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

function UserSkeleton() {
  return (
    <TableRow>
      <TableCell className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
        <div className="space-y-2">
            <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
            <div className="h-3 w-40 bg-muted rounded animate-pulse"></div>
        </div>
      </TableCell>
      <TableCell><div className="h-4 w-24 bg-muted rounded animate-pulse"></div></TableCell>
      <TableCell className="hidden md:table-cell"><div className="h-4 w-28 bg-muted rounded animate-pulse"></div></TableCell>
    </TableRow>
  )
}

export default function AdminUsersPage() {
    const firestore = useFirestore();

    const usersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, "users"), orderBy("firstName"));
    }, [firestore]);

    const { data: users, isLoading } = useCollection<UserProfile>(usersQuery);

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString();
    }
    
    const getInitials = (firstName?: string, lastName?: string) => {
      const first = firstName ? firstName[0] : '';
      const last = lastName ? lastName[0] : '';
      return `${first}${last}`.toUpperCase();
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 font-headline">Customers</h1>
            <Card>
                <CardHeader>
                    <CardTitle>All Customers</CardTitle>
                    <CardDescription>
                        A list of all registered users in your store.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="border rounded-lg">
                        <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="hidden md:table-cell">Signed Up</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && [...Array(5)].map((_, i) => <UserSkeleton key={i} />)}
                            {!isLoading && users?.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <Avatar>
                                                <AvatarImage src={user.photoURL} />
                                                <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{user.firstName} {user.lastName}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">Active</Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {formatDate(user.createdAt)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                   </div>
                   {!isLoading && !users?.length && (
                       <p className="text-center text-muted-foreground py-8">No customers found.</p>
                   )}
                </CardContent>
            </Card>
        </div>
    );
}