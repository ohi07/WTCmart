/**
 * WTCmart Seed Hardware Products Catalog & Configuration
 * Re-exports manual store data and article editorial guides
 */

import { DeliveryOption, Product, WTCTechArticle, StoreSettings } from '../types';
import { MANUAL_STORE_CONTACT, getInitialProducts } from './manualStoreData';

// Re-export manually assigned store settings and products from separate code file
export const DEFAULT_STORE_SETTINGS: StoreSettings = MANUAL_STORE_CONTACT;
export const INITIAL_PRODUCTS: Product[] = getInitialProducts();

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    zone: 'inside_dhaka',
    label: 'Inside Dhaka City',
    charge: 60,
    estimatedTime: '24 - 48 Hours',
    courierPartners: ['Pathao Courier', 'WTC Express Rider', 'Steadfast']
  },
  {
    zone: 'sub_dhaka',
    label: 'Sub-Dhaka (Gazipur, Savar, Narayanganj, Keraniganj)',
    charge: 100,
    estimatedTime: '24 - 72 Hours',
    courierPartners: ['Steadfast Courier', 'RedX', 'Pathao Courier']
  },
  {
    zone: 'outside_dhaka',
    label: 'Outside Dhaka (All 64 Districts)',
    charge: 150,
    estimatedTime: '48 - 96 Hours',
    courierPartners: ['Steadfast Courier', 'Sundarban Courier', 'SA Paribahan', 'eCourier']
  }
];

export const WTC_TECH_ARTICLES: WTCTechArticle[] = [
  {
    id: 'art-1',
    title: 'AMD Ryzen 7 7800X3D vs Intel Core i7-14700K: Which is Best for Bangladesh Gamers?',
    slug: 'ryzen-7800x3d-vs-intel-14700k-bangladesh-guide',
    excerpt: 'Detailed benchmark breakdown comparing gaming FPS, power efficiency in Dhaka’s hot climate, and motherboard platform longevity.',
    content: 'When selecting the beating heart of your next high-performance rig in Bangladesh, two titans dominate the discussion: AMD’s Ryzen 7 7800X3D and Intel’s Core i7-14700K. In our rigorous testing across 14 AAA titles, the 7800X3D consumed nearly 50% less power while delivering 12% higher 1% low FPS, proving ideal for standard air cooling in our climate.',
    coverImage: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80',
    author: 'WTC Technical Review Team (Reviewed by Ohi)',
    readTime: '6 min read',
    category: 'Hardware Comparison',
    publishedAt: 'May 2026'
  },
  {
    id: 'art-2',
    title: 'Essential PC Building Checklist: Avoid Common Mistakes & Incompatibilities',
    slug: 'pc-builder-compatibility-checklist-guide',
    excerpt: 'Before purchasing your components, check socket pairings, RAM generation standards, and GPU clearance measurements.',
    content: 'A successful build starts with architectural harmony. Never pair an AM5 CPU with a DDR4 motherboard, and always calculate at least 20% power headroom on your PSU to absorb RTX 40/50 series transient voltage spikes.',
    coverImage: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80',
    author: 'WTC Systems Engineering Lab',
    readTime: '8 min read',
    category: 'Buying Guide',
    publishedAt: 'June 2026'
  },
  {
    id: 'art-3',
    title: 'DDR4 vs DDR5 RAM in 2026: Is It Finally Time to Upgrade in Bangladesh?',
    slug: 'ddr4-vs-ddr5-ram-upgrade-guide-bangladesh',
    excerpt: 'With DDR5 prices dropping in local markets like Multiplan and IDB Bhaban, we evaluate performance gains in production and gaming.',
    content: 'DDR5 6000MHz CL30 has reached price parity with premium DDR4 kits in Dhaka. For newer platforms like AM5 and Intel 14th Gen, DDR5 delivers up to 15% better minimum frame rates and vastly superior compression and rendering bandwidth.',
    coverImage: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&auto=format&fit=crop&q=80',
    author: 'WTC Hardware Lab',
    readTime: '5 min read',
    category: 'Hardware Benchmark',
    publishedAt: 'July 2026'
  }
];
