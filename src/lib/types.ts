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

export type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  itemPrice: number;
  name: string;
  imageUrl?: string;
};

export type Order = {
  id: string;
  userId: string;
  orderDate: any; // Firestore Timestamp
  totalAmount: number;
  paymentMethod: string;
  orderStatus: "Placed" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  items: OrderItem[]; 
};

export type User = {
    id: string;
    email: string | null;
    firstName: string;
    lastName: string;
    interests: string[];
    createdAt: any; // Firestore Timestamp
    photoURL?: string;
}
