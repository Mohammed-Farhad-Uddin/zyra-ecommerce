/**
 * Types and constants that are safe to import from anywhere, including client
 * components and middleware. Nothing in here may touch Prisma or Node APIs.
 */

/** Delivery inside Dhaka district, in Taka. */
export const INSIDE_DHAKA_FEE = 60;

/** Delivery to any district other than Dhaka, in Taka. */
export const OUTSIDE_DHAKA_FEE = 120;

export const DHAKA_DISTRICT = 'Dhaka';

/** All 64 districts. The Dhaka value must stay exactly `Dhaka` so the fee rule matches. */
export const BD_DISTRICTS = [
  'Bagerhat',
  'Bandarban',
  'Barguna',
  'Barishal',
  'Bhola',
  'Bogura',
  'Brahmanbaria',
  'Chandpur',
  'Chapainawabganj',
  'Chattogram',
  'Chuadanga',
  "Cox's Bazar",
  'Cumilla',
  'Dhaka',
  'Dinajpur',
  'Faridpur',
  'Feni',
  'Gaibandha',
  'Gazipur',
  'Gopalganj',
  'Habiganj',
  'Jamalpur',
  'Jashore',
  'Jhalokati',
  'Jhenaidah',
  'Joypurhat',
  'Khagrachhari',
  'Khulna',
  'Kishoreganj',
  'Kurigram',
  'Kushtia',
  'Lakshmipur',
  'Lalmonirhat',
  'Madaripur',
  'Magura',
  'Manikganj',
  'Meherpur',
  'Moulvibazar',
  'Munshiganj',
  'Mymensingh',
  'Naogaon',
  'Narail',
  'Narayanganj',
  'Narsingdi',
  'Natore',
  'Netrokona',
  'Nilphamari',
  'Noakhali',
  'Pabna',
  'Panchagarh',
  'Patuakhali',
  'Pirojpur',
  'Rajbari',
  'Rajshahi',
  'Rangamati',
  'Rangpur',
  'Satkhira',
  'Shariatpur',
  'Sherpur',
  'Sirajganj',
  'Sunamganj',
  'Sylhet',
  'Tangail',
  'Thakurgaon',
] as const;

export type District = (typeof BD_DISTRICTS)[number];

export function isDistrict(value: string): value is District {
  return (BD_DISTRICTS as readonly string[]).includes(value);
}

/**
 * Shipping for one order. Free only when every item is marked free delivery.
 * Otherwise Dhaka is ৳60 and every other district is ৳120.
 */
export function shippingFeeFor(district: string, allItemsFreeDelivery: boolean) {
  if (allItemsFreeDelivery) return 0;
  return district === DHAKA_DISTRICT ? INSIDE_DHAKA_FEE : OUTSIDE_DHAKA_FEE;
}

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
  isFreeDelivery: boolean;
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
