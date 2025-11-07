export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  imageHint?: string;
  shippingCost?: number;
  gstRate?: number;
};

export type CartItem = {
    id: string; // This will be the product ID
    productId: string;
    quantity: number;
    name: string;
    price: number;
    imageUrl?: string;
    imageHint?: string;
};
