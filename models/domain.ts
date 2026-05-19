export type UserRole = "user" | "admin";
export type StockState = "in-stock" | "low-stock" | "out-of-stock";
export type TrackingStatus =
  | "ordered"
  | "packed"
  | "shipped"
  | "out-for-delivery"
  | "delivered";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  productCount: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  role: string;
  createdAt: string;
}

export interface Specification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  brand: string;
  sku: string;
  price: number;
  compareAtPrice: number;
  rating: number;
  reviewCount: number;
  stock: number;
  stockState: StockState;
  featured: boolean;
  bestSeller: boolean;
  tags: string[];
  images: string[];
  specifications: Specification[];
  datasheetUrl: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
}

export interface TrackingEvent {
  status: TrackingStatus;
  label: string;
  date: string;
  done: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  number: string;
  total: number;
  status: "processing" | "shipped" | "delivered";
  paymentStatus: "paid" | "pending";
  createdAt: string;
  eta: string;
  trackingNumber: string;
  deliveryPartner: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  timeline: TrackingEvent[];
}

export interface Coupon {
  code: string;
  title: string;
  discountType: "percentage" | "fixed";
  value: number;
  minimumOrderValue: number;
}
