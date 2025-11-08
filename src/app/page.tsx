
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';
import { LandingHeader } from '@/components/landing-header';
import { Footer } from '@/components/footer';
import { ProductCard } from '@/components/product-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function FeaturedProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex flex-col space-y-3 p-1">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-1');
  
  const firestore = useFirestore();
  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "products"), limit(8));
  }, [firestore]);

  const { data: featuredProducts, isLoading } = useCollection<Product>(productsQuery);


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingHeader />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-16">
          <div className="absolute inset-0">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                priority
                data-ai-hint={heroImage.imageHint}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
          </div>
          <div className="relative container mx-auto px-4 md:px-6 py-32 md:py-48 text-center text-white">
            <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">Illuminate Your Space</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-neutral-200">
              Discover curated home goods that blend modern design with timeless elegance.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link href="/signup">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center font-headline">Featured Products</h2>
            <div className="relative mt-12">
              {isLoading ? <FeaturedProductsSkeleton /> : (
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent>
                    {featuredProducts?.map((product) => (
                      <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/4">
                         <div className="p-1">
                          <ProductCard product={product} />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4" />
                  <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4" />
                </Carousel>
              )}
            </div>
            <div className="text-center mt-12">
              <Button variant="outline" asChild>
                <Link href="/dashboard">
                  Shop All Products <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
