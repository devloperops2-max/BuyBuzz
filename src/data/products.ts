import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id);

export const products: Product[] = [
  {
    id: '1',
    name: 'Aether Chair',
    description: 'A masterpiece of modern design, the Aether Chair combines comfort and style with its ergonomic curves and premium materials. Perfect for any contemporary living space.',
    price: 399.99,
    category: 'Living Room',
    imageUrl: getImage('product-1')?.imageUrl,
    imageHint: getImage('product-1')?.imageHint
  },
  {
    id: '2',
    name: 'Lumina Desk Lamp',
    description: 'Illuminate your workspace with the sleek and minimalist Lumina Desk Lamp. Featuring adjustable brightness and a warm, eye-friendly light, it\'s the ideal companion for late-night work sessions.',
    price: 89.99,
    category: 'Office',
    imageUrl: getImage('product-2')?.imageUrl,
    imageHint: getImage('product-2')?.imageHint
  },
  {
    id: '3',
    name: 'Terra Cotta Vase',
    description: 'Handcrafted from natural terra cotta, this vase brings an earthy and organic touch to your home decor. Its unique texture and form make it a standout piece, with or without flowers.',
    price: 49.99,
    category: 'Decor',
    imageUrl: getImage('product-3')?.imageUrl,
    imageHint: getImage('product-3')?.imageHint
  },
  {
    id: '4',
    name: 'Serenity Candle Set',
    description: 'Create a tranquil ambiance with our Serenity Candle Set. This set of three soy wax candles features calming scents of lavender, chamomile, and sandalwood.',
    price: 34.99,
    category: 'Home Fragrance',
    imageUrl: getImage('product-4')?.imageUrl,
    imageHint: getImage('product-4')?.imageHint
  }
];
