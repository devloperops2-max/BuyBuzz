'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, writeBatch } from 'firebase/firestore';
import { products } from '@/data/products';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc } from 'firebase/firestore';

export default function SeedDatabasePage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();

  const handleSeed = async () => {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Firestore is not initialized.',
      });
      return;
    }

    setIsSeeding(true);
    try {
      const productsCollection = collection(firestore, 'products');
      
      // Using non-blocking writes
      products.forEach(product => {
        const productDocRef = doc(productsCollection, product.id);
        // We don't need merge: true if we are creating new documents with specific IDs
        setDocumentNonBlocking(productDocRef, product, {}); 
      });

      toast({
        title: 'Database Seeding Initiated',
        description: `Seeding of ${products.length} products has started in the background.`,
      });
    } catch (error) {
      console.error('Error seeding database:', error);
      toast({
        variant: 'destructive',
        title: 'Seeding Failed',
        description: 'Could not seed the database. Check the console for errors.',
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
          <Button onClick={handleSeed} disabled={isSeeding}>
            {isSeeding ? 'Seeding...' : 'Seed Database'}
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            This action will add all 158 products to the 'products' collection in your Firestore database.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
