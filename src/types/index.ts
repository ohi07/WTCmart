/**
 * WTCmart Platform Types
 * Shared TypeScript definitions for E-Commerce, PC Builder, Inventory, and Payments
 */

export type ProductCategory = 
  | 'cpu'
  | 'motherboard'
  | 'ram'
  | 'gpu'
  | 'storage'
  | 'psu'
  | 'cooler'
  | 'casing'
  | 'monitor'
  | 'peripheral';

export interface ProductSpecification {
  socket?: string; // e.g., 'AM5', 'LGA1700', 'AM4'
  ramType?: 'DDR4' | 'DDR5' | 'DDR4 / DDR5' | string;
  ramSlots?: number;
  maxRamCapacityGb?: number;
  formFactor?: 'ATX' | 'Micro-ATX' | 'Mini-ITX' | 'E-ATX' | 'M.2 2280' | 'Mid-Tower' | 'Mid-Tower (E-ATX Support)' | string;
  gpuLengthMm?: number;
  maxGpuLengthSupportedMm?: number;
  coolerHeightMm?: number;
  maxCoolerHeightSupportedMm?: number;
  wattage?: number; // Estimated power draw or PSU rated output
  tdp?: number; // Thermal Design Power
  storageInterface?: 'PCIe 4.0 NVMe' | 'PCIe 3.0 NVMe' | 'SATA III';
  clockSpeed?: string;
  cores?: number;
  threads?: number;
  vram?: string;
  efficiencyRating?: '80 Plus Bronze' | '80 Plus Gold' | '80 Plus Platinum';
  warrantyYears?: number;
  [key: string]: any;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  brand: string;
  category: ProductCategory;
  categoryLabel: string;
  regularPrice: number; // in BDT (৳)
  salePrice: number;    // in BDT (৳)
  stock: number;
  lowStockThreshold: number;
  image: string;
  gallery?: string[];
  description: string;
  shortDescription: string;
  specifications: ProductSpecification;
  warranty: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isFlashDeal?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PCBuildComponent {
  category: ProductCategory;
  categoryName: string;
  iconName: string;
  isRequired: boolean;
  selectedProduct?: Product;
}

export interface CompatibilityReport {
  isCompatible: boolean;
  issues: string[];
  warnings: string[];
  totalWattage: number;
  recommendedPsuWattage: number;
  totalPrice: number;
}

export type DeliveryZone = 'inside_dhaka' | 'sub_dhaka' | 'outside_dhaka';

export interface DeliveryOption {
  zone: DeliveryZone;
  label: string;
  charge: number; // BDT
  estimatedTime: string;
  courierPartners: string[];
}

export type PaymentMethod = 'bkash' | 'nagad' | 'sslcommerz' | 'cod';

export type OrderStatus = 
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    district: string;
    zone: DeliveryZone;
  };
  items: {
    product: Product;
    quantity: number;
    unitPrice: number;
  }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Unpaid' | 'Paid' | 'Processing' | 'Failed';
  transactionId?: string;
  orderStatus: OrderStatus;
  courierTrackingNumber?: string;
  courierName?: string;
  notes?: string;
}

export interface SheetRowItem {
  sku: string;
  name: string;
  brand: string;
  category: ProductCategory;
  regularPrice: number;
  salePrice: number;
  stock: number;
  image: string;
  warranty: string;
  specsSummary?: string;
}

export interface WTCTechArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  readTime: string;
  category: string;
  publishedAt: string;
}

export interface StoreSettings {
  storeName: string;
  hotlinePhone: string;
  whatsappNumber: string;
  supportEmail: string;
  locationAddress: string;
  branches: {
    id: string;
    name: string;
    address: string;
    phone: string;
    isPrimary?: boolean;
  }[];
  devCredit: string;
}
