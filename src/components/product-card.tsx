import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { Product } from '@/lib/types';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg duration-300 group">
      <Link href={`/product/${product.id}`} className="block">
        <CardContent className="p-0">
          <div className="aspect-square overflow-hidden">
            <Image
              src={product.imageUrl || 'https://picsum.photos/seed/placeholder/600/600'}
              alt={product.name}
              width={600}
              height={600}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={product.imageHint || 'product'}
            />
          </div>
          <div className="p-4 border-t">
            <h3 className="font-semibold text-lg font-headline">{product.name}</h3>
            <p className="text-muted-foreground mt-1">${product.price.toFixed(2)}</p>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
