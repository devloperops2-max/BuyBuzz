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
