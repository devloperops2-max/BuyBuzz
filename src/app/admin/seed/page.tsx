'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser } from '@/firebase';
import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { products } from '@/data/products';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LogIn } from 'lucide-react';
import Link from 'next/link';

export default function SeedDatabasePage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const handleSeed = async () => {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Firestore is not initialized.',
      });
      return;
    }
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'You must be logged in to seed the database.',
      });
      return;
    }

    setIsSeeding(true);
    try {
      const batch = writeBatch(firestore);
      const productsCollectionRef = collection(firestore, 'products');
      
      products.forEach(product => {
        const productDocRef = doc(productsCollectionRef, product.id);
        batch.set(productDocRef, product);
      });

      await batch.commit();

      toast({
        title: 'Database Seeding Successful',
        description: `${products.length} products have been added to your database.`,
      });
    } catch (error: any) {
      console.error('Error seeding database:', error);
      toast({
        variant: 'destructive',
        title: 'Seeding Failed',
        description: error.message || 'Could not seed the database. Check the console for errors.',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 font-headline">Seed Database</h1>
      <Card>
        <CardHeader>
          <CardTitle>Populate Products</CardTitle>
          <CardDescription>
            Click the button below to populate the Firestore database with the products from your local data file. This will overwrite any existing products.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isUserLoading && (
             <div className="flex items-center space-x-4 mb-6">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-[250px] animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-[200px] animate-pulse"></div>
                </div>
              </div>
          )}
          {!isUserLoading && !user && (
            <Alert className="mb-6">
              <LogIn className="h-4 w-4" />
              <AlertTitle>Authentication Required</AlertTitle>
              <AlertDescription>
                You must be logged in to perform this action. Please{' '}
                <Button variant="link" className="p-0 h-auto" asChild>
                  <Link href="/login">log in</Link>
                </Button>{' '}
                first.
              </AlertDescription>
            </Alert>
          )}
          <Button onClick={handleSeed} disabled={isSeeding || !user || isUserLoading}>
            {isSeeding ? 'Seeding...' : 'Seed Database'}
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            This action will add all {products.length} products to the 'products' collection in your Firestore database.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
