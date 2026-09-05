/**
 * ============================================================================
 * WTCmart MANUALLY ASSIGNED STORE DATA & PRODUCT CATALOG
 * ============================================================================
 * 
 * 💡 EDIT THIS FILE TO MANUALLY CONFIGURE:
 * 1. Store Phone, WhatsApp, Mail, and Address (or keep blank)
 * 2. Product Prices (Regular Price & Sale Price in BDT ৳)
 * 3. Product Inventory Stock Count (units in warehouse)
 * 4. Product Names, SKUs, and Official Warranty Terms
 * 
 * Any changes made here serve as the primary source of truth for the store.
 */

import { Product, StoreSettings } from '../types';

// ============================================================================
// 1. STORE CONTACT & LOCATION (MANUALLY ASSIGNED)
// ============================================================================
export const MANUAL_STORE_CONTACT: StoreSettings = {
  storeName: 'WTCmart Bangladesh',
  // Manually assigned by owner:
  hotlinePhone: '01303557185',
  whatsappNumber: '01303557185',
  supportEmail: 'wut2do4u@gmail.com',
  locationAddress: 'DIT Project, road 8',
  branches: [
    {
      id: 'b-dit-project',
      name: 'DIT Project Road 8 Outlet',
      address: 'DIT Project, road 8',
      phone: '01303557185',
      isPrimary: true
    }
  ],
  devCredit: "Dev by 'Ohi'"
};

// ============================================================================
// 2. PRODUCT CATALOG: MANUALLY ASSIGNED PRICES (৳) & STOCK COUNTS
// ============================================================================
export interface ManualProductRecord {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: Product['category'];
  categoryLabel: string;
  // --- MANUALLY ASSIGNED PRICING & INVENTORY ---
  regularPrice: number; // Regular / MRP Price in BDT ৳
  salePrice: number;    // Discounted / Live Selling Price in BDT ৳
  stock: number;        // Available Stock count in units
  lowStockThreshold: number;
  warranty: string;
  // Specifications & Assets
  image: string;
  description: string;
  shortDescription: string;
  specifications: Record<string, any>;
  tags: string[];
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isFlashDeal?: boolean;
}

export const MANUAL_PRODUCTS_CATALOG: ManualProductRecord[] = [
  // --- PROCESSORS (CPU) ---
  {
    id: 'cpu-1',
    sku: 'WTC-CPU-7800X3D',
    name: 'AMD Ryzen 7 7800X3D Gaming Processor',
    brand: 'AMD',
    category: 'cpu',
    categoryLabel: 'Processor',
    regularPrice: 48500,
    salePrice: 46200,
    stock: 14,
    lowStockThreshold: 3,
    warranty: '3 Years Official Replacement Warranty',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80',
    description: 'The world’s best gaming processor featuring 8 cores, 16 threads, and 96MB of 3D V-Cache technology on the AM5 platform.',
    shortDescription: '8 Cores, 16 Threads, 5.0 GHz Max Boost, Socket AM5, 120W TDP',
    specifications: {
      socket: 'AM5',
      cores: 8,
      threads: 16,
      clockSpeed: '4.2 GHz Base / 5.0 GHz Boost',
      tdp: 120,
      wattage: 120,
      ramType: 'DDR5',
      warrantyYears: 3
    },
    tags: ['AMD', 'Ryzen', 'AM5', 'Gaming', 'X3D'],
    rating: 4.9,
    reviewCount: 42,
    isFeatured: true,
    isFlashDeal: true
  },
  {
    id: 'cpu-2',
    sku: 'WTC-CPU-14700K',
    name: 'Intel Core i7-14700K 14th Gen Processor',
    brand: 'Intel',
    category: 'cpu',
    categoryLabel: 'Processor',
    regularPrice: 49000,
    salePrice: 47500,
    stock: 9,
    lowStockThreshold: 2,
    warranty: '3 Years Official Warranty',
    image: 'https://images.unsplash.com/photo-1555617778-02518510b9fa?w=600&auto=format&fit=crop&q=80',
    description: '20 cores (8 P-cores + 12 E-cores) and 28 threads, ideal for heavy productivity, streaming, and AAA 4K gaming.',
    shortDescription: '20 Cores, 28 Threads, Up to 5.6 GHz, LGA1700, 125W Base TDP',
    specifications: {
      socket: 'LGA1700',
      cores: 20,
      threads: 28,
      clockSpeed: '3.4 GHz Base / 5.6 GHz Turbo',
      tdp: 253,
      wattage: 253,
      ramType: 'DDR5',
      warrantyYears: 3
    },
    tags: ['Intel', '14th Gen', 'LGA1700', 'Core i7'],
    rating: 4.8,
    reviewCount: 28,
    isFeatured: true
  },
  {
    id: 'cpu-3',
    sku: 'WTC-CPU-7600X',
    name: 'AMD Ryzen 5 7600X 6-Core Processor',
    brand: 'AMD',
    category: 'cpu',
    categoryLabel: 'Processor',
    regularPrice: 24500,
    salePrice: 22800,
    stock: 22,
    lowStockThreshold: 5,
    warranty: '3 Years Official Replacement Warranty',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80',
    description: 'High-efficiency 6-core AM5 gaming processor with 5.3 GHz turbo clock.',
    shortDescription: '6 Cores, 12 Threads, 5.3 GHz Boost, Socket AM5, 105W TDP',
    specifications: {
      socket: 'AM5',
      cores: 6,
      threads: 12,
      clockSpeed: '4.7 GHz / 5.3 GHz Boost',
      tdp: 105,
      wattage: 105,
      ramType: 'DDR5',
      warrantyYears: 3
    },
    tags: ['AMD', 'Ryzen 5', 'AM5', 'Budget Gaming'],
    rating: 4.7,
    reviewCount: 35
  },
  {
    id: 'cpu-4',
    sku: 'WTC-CPU-14400F',
    name: 'Intel Core i5-14400F 10-Core Processor',
    brand: 'Intel',
    category: 'cpu',
    categoryLabel: 'Processor',
    regularPrice: 21500,
    salePrice: 19800,
    stock: 25,
    lowStockThreshold: 4,
    warranty: '3 Years Official Warranty',
    image: 'https://images.unsplash.com/photo-1555617778-02518510b9fa?w=600&auto=format&fit=crop&q=80',
    description: 'The sweet-spot 10-core 14th Gen Intel processor for budget gaming and student rigs.',
    shortDescription: '10 Cores (6P + 4E), 16 Threads, 4.7 GHz Turbo, LGA1700, 65W TDP',
    specifications: {
      socket: 'LGA1700',
      cores: 10,
      threads: 16,
      clockSpeed: '2.5 GHz / 4.7 GHz Turbo',
      tdp: 65,
      wattage: 65,
      ramType: 'DDR4 / DDR5',
      warrantyYears: 3
    },
    tags: ['Intel', 'Core i5', 'LGA1700', 'Value'],
    rating: 4.8,
    reviewCount: 19
  },

  // --- GRAPHICS CARDS (GPU) ---
  {
    id: 'gpu-1',
    sku: 'WTC-GPU-4070TIS',
    name: 'ASUS TUF Gaming GeForce RTX 4070 Ti SUPER 16GB OC',
    brand: 'ASUS',
    category: 'gpu',
    categoryLabel: 'Graphics Card',
    regularPrice: 115000,
    salePrice: 109500,
    stock: 7,
    lowStockThreshold: 2,
    warranty: '3 Years Replacement Warranty',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80',
    description: 'Military-grade components, axial-tech fans, dual BIOS, and 16GB GDDR6X for silky 1440p and 4K ray-traced gaming.',
    shortDescription: '16GB GDDR6X, 2640 MHz Boost, 305mm Length, 285W TDP, 3-Slot',
    specifications: {
      vram: '16GB GDDR6X',
      boostClock: '2640 MHz',
      lengthMm: 305,
      powerConnectors: '1x 16-pin 12VHPWR',
      tdp: 285,
      wattage: 285,
      recommendedPsu: 750,
      warrantyYears: 3
    },
    tags: ['NVIDIA', 'RTX 4070 Ti SUPER', 'ASUS TUF', '16GB', 'DLSS 3.5'],
    rating: 4.9,
    reviewCount: 31,
    isFeatured: true
  },
  {
    id: 'gpu-2',
    sku: 'WTC-GPU-4060VENTUS',
    name: 'MSI GeForce RTX 4060 VENTUS 2X Black 8GB OC',
    brand: 'MSI',
    category: 'gpu',
    categoryLabel: 'Graphics Card',
    regularPrice: 38500,
    salePrice: 35800,
    stock: 18,
    lowStockThreshold: 4,
    warranty: '3 Years Official Warranty',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    description: 'Dual fan cooling, DLSS 3 frame generation, compact 199mm length compatible with almost all mini and mid-tower chassis.',
    shortDescription: '8GB GDDR6, 2505 MHz Boost, 199mm Length, 115W TDP, 1x 8-pin',
    specifications: {
      vram: '8GB GDDR6',
      boostClock: '2505 MHz',
      lengthMm: 199,
      powerConnectors: '1x 8-pin PCIe',
      tdp: 115,
      wattage: 115,
      recommendedPsu: 550,
      warrantyYears: 3
    },
    tags: ['NVIDIA', 'RTX 4060', 'MSI', 'Compact', 'DLSS 3'],
    rating: 4.7,
    reviewCount: 54,
    isFlashDeal: true
  },
  {
    id: 'gpu-3',
    sku: 'WTC-GPU-7800XT-NITRO',
    name: 'Sapphire NITRO+ AMD Radeon RX 7800 XT 16GB Gaming',
    brand: 'Sapphire',
    category: 'gpu',
    categoryLabel: 'Graphics Card',
    regularPrice: 76000,
    salePrice: 72500,
    stock: 8,
    lowStockThreshold: 2,
    warranty: '2 Years Official Warranty',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80',
    description: 'The pinnacle of 1440p gaming raster performance with 16GB GDDR6 and striking ARGB light bar.',
    shortDescription: '16GB GDDR6, 2565 MHz Boost, 320mm Length, 288W TDP, Dual BIOS',
    specifications: {
      vram: '16GB GDDR6',
      boostClock: '2565 MHz',
      lengthMm: 320,
      powerConnectors: '2x 8-pin PCIe',
      tdp: 288,
      wattage: 288,
      recommendedPsu: 700,
      warrantyYears: 2
    },
    tags: ['AMD', 'Radeon', 'RX 7800 XT', 'Sapphire', 'NITRO+'],
    rating: 4.8,
    reviewCount: 22
  },

  // --- MOTHERBOARDS ---
  {
    id: 'mb-1',
    sku: 'WTC-MB-B650-TOMAHAWK',
    name: 'MSI MAG B650 TOMAHAWK WIFI AM5 ATX Motherboard',
    brand: 'MSI',
    category: 'motherboard',
    categoryLabel: 'Motherboard',
    regularPrice: 28500,
    salePrice: 26900,
    stock: 12,
    lowStockThreshold: 3,
    warranty: '3 Years Official Replacement Warranty',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    description: 'Premium AM5 board with 14+2+1 Duet Rail VRM, DDR5 support, PCIe 4.0 M.2 shields, and Wi-Fi 6E.',
    shortDescription: 'Socket AM5, DDR5 (Up to 7600+ MHz), ATX, 3x M.2 Slots, Wi-Fi 6E',
    specifications: {
      socket: 'AM5',
      formFactor: 'ATX',
      ramType: 'DDR5',
      ramSlots: 4,
      maxRamGb: 192,
      m2Slots: 3,
      wifi: 'Wi-Fi 6E + Bluetooth 5.3',
      wattage: 50,
      warrantyYears: 3
    },
    tags: ['MSI', 'AM5', 'B650', 'DDR5', 'Wi-Fi 6E'],
    rating: 4.9,
    reviewCount: 38,
    isFeatured: true
  },
  {
    id: 'mb-2',
    sku: 'WTC-MB-B760-AORUS',
    name: 'Gigabyte B760 AORUS ELITE AX Intel LGA1700 ATX',
    brand: 'Gigabyte',
    category: 'motherboard',
    categoryLabel: 'Motherboard',
    regularPrice: 26500,
    salePrice: 24900,
    stock: 11,
    lowStockThreshold: 3,
    warranty: '3 Years Official Warranty',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    description: 'Robust power delivery for Intel 13th & 14th Gen Core CPUs with triple PCIe 4.0 x4 M.2 connectors.',
    shortDescription: 'Socket LGA1700, DDR5, ATX, 12+1+1 Phases VRM, Wi-Fi 6E',
    specifications: {
      socket: 'LGA1700',
      formFactor: 'ATX',
      ramType: 'DDR5',
      ramSlots: 4,
      maxRamGb: 192,
      m2Slots: 3,
      wifi: 'Wi-Fi 6E',
      wattage: 50,
      warrantyYears: 3
    },
    tags: ['Gigabyte', 'AORUS', 'LGA1700', 'B760', 'DDR5'],
    rating: 4.8,
    reviewCount: 20
  },
  {
    id: 'mb-3',
    sku: 'WTC-MB-H610M-D4',
    name: 'ASUS Prime H610M-K D4 Micro-ATX Motherboard',
    brand: 'ASUS',
    category: 'motherboard',
    categoryLabel: 'Motherboard',
    regularPrice: 10500,
    salePrice: 9400,
    stock: 24,
    lowStockThreshold: 5,
    warranty: '3 Years Official Warranty',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    description: 'Affordable Intel LGA1700 motherboard supporting DDR4 memory for cost-effective gaming and office builds.',
    shortDescription: 'Socket LGA1700, DDR4 Support, Micro-ATX, 1x M.2 NVMe Slot',
    specifications: {
      socket: 'LGA1700',
      formFactor: 'Micro-ATX',
      ramType: 'DDR4',
      ramSlots: 2,
      maxRamGb: 64,
      m2Slots: 1,
      wattage: 35,
      warrantyYears: 3
    },
    tags: ['ASUS', 'H610', 'DDR4', 'LGA1700', 'Budget'],
    rating: 4.6,
    reviewCount: 45
  },

  // --- MEMORY (RAM) ---
  {
    id: 'ram-1',
    sku: 'WTC-RAM-CORSAIR-32GB',
    name: 'Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz',
    brand: 'Corsair',
    category: 'ram',
    categoryLabel: 'RAM',
    regularPrice: 15500,
    salePrice: 14200,
    stock: 30,
    lowStockThreshold: 6,
    warranty: 'Lifetime Official Warranty',
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&auto=format&fit=crop&q=80',
    description: 'Dynamic ten-zone RGB lighting, AMD EXPO & Intel XMP 3.0 profiles for effortless overclocking.',
    shortDescription: '32GB (2x16GB), DDR5 6000MHz, CL30, AMD EXPO & Intel XMP',
    specifications: {
      capacityGb: 32,
      kitCount: 2,
      ramType: 'DDR5',
      speedMhz: 6000,
      casLatency: 'CL30',
      voltage: '1.35V',
      wattage: 15,
      warrantyYears: 10
    },
    tags: ['Corsair', 'DDR5', 'RGB', '32GB', 'EXPO'],
    rating: 4.9,
    reviewCount: 62,
    isFeatured: true
  },
  {
    id: 'ram-2',
    sku: 'WTC-RAM-KINGSTON-16GB-D4',
    name: 'Kingston FURY Beast 16GB (1x16GB) DDR4 3200MHz',
    brand: 'Kingston',
    category: 'ram',
    categoryLabel: 'RAM',
    regularPrice: 5200,
    salePrice: 4600,
    stock: 45,
    lowStockThreshold: 8,
    warranty: 'Lifetime Official Warranty',
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&auto=format&fit=crop&q=80',
    description: 'Low-profile heat spreader design with cost-efficient, reliable high-speed DDR4 performance.',
    shortDescription: '16GB Single Module, DDR4 3200MHz, CL16, Plug N Play Intel XMP',
    specifications: {
      capacityGb: 16,
      kitCount: 1,
      ramType: 'DDR4',
      speedMhz: 3200,
      casLatency: 'CL16',
      voltage: '1.35V',
      wattage: 8,
      warrantyYears: 10
    },
    tags: ['Kingston', 'DDR4', '16GB', 'FURY Beast'],
    rating: 4.8,
    reviewCount: 78
  },

  // --- STORAGE (SSD) ---
  {
    id: 'ssd-1',
    sku: 'WTC-SSD-990PRO-2TB',
    name: 'Samsung 990 PRO 2TB PCIe 4.0 M.2 NVMe SSD',
    brand: 'Samsung',
    category: 'storage',
    categoryLabel: 'SSD / Storage',
    regularPrice: 24500,
    salePrice: 22900,
    stock: 16,
    lowStockThreshold: 3,
    warranty: '5 Years Official Warranty',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80',
    description: 'Sequential read speeds up to 7,450 MB/s. The undisputed industry standard for PlayStation 5 and high-end PC workstations.',
    shortDescription: '2TB Capacity, Up to 7450 MB/s Read, PCIe 4.0 NVMe, Nickel-coated Controller',
    specifications: {
      capacity: '2TB',
      interface: 'PCIe Gen 4.0 x4, NVMe 2.0',
      formFactor: 'M.2 2280',
      readSpeed: '7,450 MB/s',
      writeSpeed: '6,900 MB/s',
      wattage: 8,
      warrantyYears: 5
    },
    tags: ['Samsung', 'NVMe', 'PCIe 4.0', '2TB', 'High Speed'],
    rating: 5.0,
    reviewCount: 46,
    isFeatured: true
  },
  {
    id: 'ssd-2',
    sku: 'WTC-SSD-KC3000-1TB',
    name: 'Kingston KC3000 1TB PCIe 4.0 NVMe M.2 SSD',
    brand: 'Kingston',
    category: 'storage',
    categoryLabel: 'SSD / Storage',
    regularPrice: 12500,
    salePrice: 11200,
    stock: 28,
    lowStockThreshold: 5,
    warranty: '5 Years Official Warranty',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80',
    description: 'Graphene aluminum heat spreader with Phison E18 controller for heavy video editing and gaming loads.',
    shortDescription: '1TB, 7000 MB/s Read / 6000 MB/s Write, PCIe 4.0 NVMe, Graphene Heatsink',
    specifications: {
      capacity: '1TB',
      interface: 'PCIe 4.0 x4 NVMe',
      formFactor: 'M.2 2280',
      readSpeed: '7,000 MB/s',
      writeSpeed: '6,000 MB/s',
      wattage: 7,
      warrantyYears: 5
    },
    tags: ['Kingston', 'KC3000', '1TB', 'NVMe'],
    rating: 4.9,
    reviewCount: 39
  },

  // --- POWER SUPPLIES (PSU) ---
  {
    id: 'psu-1',
    sku: 'WTC-PSU-RM850E',
    name: 'Corsair RM850e 850W 80 Plus Gold Fully Modular ATX 3.0',
    brand: 'Corsair',
    category: 'psu',
    categoryLabel: 'Power Supply',
    regularPrice: 16500,
    salePrice: 15200,
    stock: 14,
    lowStockThreshold: 3,
    warranty: '7 Years Official Warranty',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80',
    description: 'ATX 3.0 & PCIe 5.0 compliant with native 12VHPWR connector. 105°C-rated capacitors with zero-RPM fan mode.',
    shortDescription: '850 Watt, 80 PLUS Gold Certified, Native 16-pin 12VHPWR Cable, Fully Modular',
    specifications: {
      wattage: 850,
      efficiency: '80 PLUS Gold',
      modularity: 'Fully Modular',
      atxStandard: 'ATX 3.0 / PCIe 5.0',
      pcieConnectors: '1x 12VHPWR, 4x 8-pin PCIe',
      warrantyYears: 7
    },
    tags: ['Corsair', '850W', '80+ Gold', 'ATX 3.0', 'Modular'],
    rating: 4.9,
    reviewCount: 33,
    isFeatured: true
  },
  {
    id: 'psu-2',
    sku: 'WTC-PSU-PK650D',
    name: 'Deepcool PK650D 650W 80 Plus Bronze Power Supply',
    brand: 'Deepcool',
    category: 'psu',
    categoryLabel: 'Power Supply',
    regularPrice: 6200,
    salePrice: 5600,
    stock: 35,
    lowStockThreshold: 6,
    warranty: '5 Years Official Warranty',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80',
    description: 'Reliable 650W power supply for mid-tier gaming PCs with active PFC and flat black cables.',
    shortDescription: '650W Output, 80 PLUS Bronze Certified, Flat Cables, 120mm Hypro Bearing Fan',
    specifications: {
      wattage: 650,
      efficiency: '80 PLUS Bronze',
      modularity: 'Non-Modular',
      warrantyYears: 5
    },
    tags: ['Deepcool', '650W', 'Budget', 'Bronze'],
    rating: 4.7,
    reviewCount: 41
  },

  // --- CASINGS / CHASSIS ---
  {
    id: 'case-1',
    sku: 'WTC-CASE-O11D-EVO',
    name: 'Lian Li O11 Dynamic EVO RGB Mid-Tower Case (Black)',
    brand: 'Lian Li',
    category: 'casing',
    categoryLabel: 'Chassis / Casing',
    regularPrice: 21000,
    salePrice: 19500,
    stock: 9,
    lowStockThreshold: 2,
    warranty: '1 Year Casing Warranty',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80',
    description: 'Dual-chamber design with diffused L-shaped ARGB strips, reversible chassis orientation, and support for up to 455mm GPUs.',
    shortDescription: 'Mid-Tower, Dual Chamber Tempered Glass, Max 455mm GPU, Up to 3x 360mm Rads',
    specifications: {
      formFactor: 'Mid-Tower',
      maxGpuLengthMm: 455,
      maxCpuCoolerHeightMm: 167,
      radiatorSupport: 'Top 360mm, Side 360mm, Bottom 360mm',
      includedFans: 0
    },
    tags: ['Lian Li', 'O11 Dynamic', 'Showcase', 'Dual Chamber'],
    rating: 5.0,
    reviewCount: 27,
    isFeatured: true
  },
  {
    id: 'case-2',
    sku: 'WTC-CASE-AIR903MAX',
    name: 'Montech AIR 903 MAX White E-ATX High Airflow Case',
    brand: 'Montech',
    category: 'casing',
    categoryLabel: 'Chassis / Casing',
    regularPrice: 8500,
    salePrice: 7700,
    stock: 20,
    lowStockThreshold: 4,
    warranty: '1 Year Warranty',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80',
    description: 'Equipped with 4x pre-installed 140mm PWM ARGB fans, ultra-fine mesh front panel, and massive 400mm GPU clearance.',
    shortDescription: '4x 140mm ARGB Fans Included, 400mm GPU Clearance, 180mm CPU Cooler, Type-C',
    specifications: {
      formFactor: 'Mid-Tower (E-ATX Support)',
      maxGpuLengthMm: 400,
      maxCpuCoolerHeightMm: 180,
      includedFans: 4
    },
    tags: ['Montech', 'High Airflow', 'White Case', '4x Fans'],
    rating: 4.9,
    reviewCount: 36
  },

  // --- CPU COOLERS ---
  {
    id: 'cooler-1',
    sku: 'WTC-CLR-AK620-DIG',
    name: 'Deepcool AK620 Digital Dual-Tower CPU Air Cooler',
    brand: 'Deepcool',
    category: 'cooler',
    categoryLabel: 'CPU Cooler',
    regularPrice: 8500,
    salePrice: 7800,
    stock: 17,
    lowStockThreshold: 3,
    warranty: '3 Years Official Warranty',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80',
    description: 'Real-time CPU temperature and usage status screen, 260W TDP dissipation capability with dual FDB fans.',
    shortDescription: 'Dual-Tower, Real-time Digital Display, 260W TDP, 162mm Height, LGA1700/AM5',
    specifications: {
      coolerType: 'Air Dual-Tower',
      heightMm: 162,
      maxTdp: 260,
      wattage: 10,
      supportedSockets: ['LGA1700', 'AM5', 'AM4', 'LGA1200']
    },
    tags: ['Deepcool', 'AK620', 'Digital Display', 'Air Cooler'],
    rating: 4.9,
    reviewCount: 29
  },
  {
    id: 'cooler-2',
    sku: 'WTC-CLR-GALAHAD-360',
    name: 'Lian Li Galahad II Trinity SL-INF 360 ARGB Liquid Cooler',
    brand: 'Lian Li',
    category: 'cooler',
    categoryLabel: 'CPU Cooler',
    regularPrice: 22500,
    salePrice: 20900,
    stock: 8,
    lowStockThreshold: 2,
    warranty: '5 Years Official Warranty',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80',
    description: '360mm radiator, pre-installed daisy-chained SL-Infinity fans with 3200 RPM pump motor for enthusiast overclocking.',
    shortDescription: '360mm AIO Liquid Cooler, Uni Fan SL-INF ARGB Fans, 3 Interchangeable Pump Caps',
    specifications: {
      coolerType: '360mm AIO Liquid',
      heightMm: 55,
      radiatorSizeMm: 360,
      maxTdp: 350,
      wattage: 20,
      supportedSockets: ['LGA1700', 'AM5', 'AM4']
    },
    tags: ['Lian Li', '360mm AIO', 'Liquid Cooling', 'Infinity Mirror'],
    rating: 4.8,
    reviewCount: 15
  },

  // --- MONITORS ---
  {
    id: 'mon-1',
    sku: 'WTC-MON-VG27AQ',
    name: 'ASUS TUF Gaming VG27AQ 27" 165Hz 2K QHD IPS Monitor',
    brand: 'ASUS',
    category: 'monitor',
    categoryLabel: 'Gaming Monitor',
    regularPrice: 38500,
    salePrice: 35900,
    stock: 10,
    lowStockThreshold: 2,
    warranty: '3 Years Official Warranty',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    description: '27-inch WQHD (2560x1440) IPS gaming monitor with ultrafast 165Hz refresh rate and ASUS Extreme Low Motion Blur Sync.',
    shortDescription: '27" 2560x1440 IPS, 165Hz, 1ms MPRT, G-SYNC Compatible, HDR10, Height Adjustable',
    specifications: {
      screenSize: '27 Inch',
      resolution: '2560 x 1440 (2K QHD)',
      panelType: 'IPS',
      refreshRate: '165Hz',
      responseTime: '1ms',
      ports: '2x HDMI 2.0, 1x DisplayPort 1.2',
      warrantyYears: 3
    },
    tags: ['ASUS', '27 Inch', '2K', '165Hz', 'IPS', 'G-SYNC'],
    rating: 4.9,
    reviewCount: 37,
    isFeatured: true
  },
  {
    id: 'mon-2',
    sku: 'WTC-MON-G244F',
    name: 'MSI G244F 23.8" 170Hz FHD Rapid IPS Esports Gaming Monitor',
    brand: 'MSI',
    category: 'monitor',
    categoryLabel: 'Gaming Monitor',
    regularPrice: 21500,
    salePrice: 19800,
    stock: 22,
    lowStockThreshold: 4,
    warranty: '3 Years Official Warranty',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    description: 'Rapid IPS panel with 170Hz refresh rate and 1ms GTG response time, ideal for competitive CS2 and Valorant players.',
    shortDescription: '23.8" FHD 1920x1080 Rapid IPS, 170Hz, 1ms GTG, FreeSync Premium',
    specifications: {
      screenSize: '23.8 Inch',
      resolution: '1920 x 1080 (Full HD)',
      panelType: 'Rapid IPS',
      refreshRate: '170Hz',
      responseTime: '1ms GTG',
      ports: '2x HDMI 2.0b, 1x DisplayPort 1.2a',
      warrantyYears: 3
    },
    tags: ['MSI', '24 Inch', '170Hz', 'Rapid IPS', 'Esports'],
    rating: 4.8,
    reviewCount: 51
  }
];

/**
 * Helper to produce full Product[] format
 */
export function getInitialProducts(): Product[] {
  return MANUAL_PRODUCTS_CATALOG.map(p => ({
    ...p,
    slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }));
}
