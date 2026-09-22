/**
 * Types and constants that are safe to import from anywhere, including client
 * components and middleware. Nothing in here may touch Prisma or Node APIs.
 */

/** Flat delivery fee applied to every order. 0 means free shipping. */
export const SHIPPING_FEE = 0;

export type ProductImageDTO = {
  id: string;
  url: string;
  alt: string | null;
  isPrimary: boolean;
  position: number;
};

export type CategoryDTO = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  position: number;
  productCount?: number;
};

export type ProductDTO = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number | null;
  material: string | null;
  sku: string | null;
  stock: number;
  inStock: boolean;
  isPopular: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  categoryId: string;
  category: { id: string; name: string; slug: string };
  images: ProductImageDTO[];
  createdAt: string;
};

export type OrderItemDTO = {
  id: string;
  title: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type OrderStatus = 'Pending' | 'Delivered' | 'Cancelled';

export type OrderDTO = {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  city: string | null;
  note: string | null;
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: string;
  status: OrderStatus;
  items: OrderItemDTO[];
  createdAt: string;
};

export const ORDER_STATUSES: OrderStatus[] = ['Pending', 'Delivered', 'Cancelled'];
