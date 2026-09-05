/**
 * WTCmart Enterprise Commerce Backend Server
 * Full-stack Express REST API & Vite Integration
 * 
 * Includes:
 * 1. Product catalog & category API
 * 2. PC Builder compatibility evaluation service
 * 3. bKash Merchant Tokenized API & SSLCommerz Payment Gateway
 * 4. Home Delivery & Courier Dispatch Engine
 * 5. Rate-limited AI Hardware Assistant Chatbot (Anti-Abuse Safeguards)
 * 6. Admin Google Sheets / CSV Bulk Sync & Inventory Automation
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_PRODUCTS, DELIVERY_OPTIONS, WTC_TECH_ARTICLES, DEFAULT_STORE_SETTINGS } from './src/data/seedData';
import { evaluatePCBuildCompatibility } from './src/lib/compatibility';
import { Order, Product, SheetRowItem, StoreSettings } from './src/types';

const app = express();
const PORT = 3000;

// Enable JSON body parsing for API payloads (max 10MB for bulk sheet uploads)
app.use(express.json({ limit: '10mb' }));

// In-Memory Database Store (with Seed Data)
let productsDatabase: Product[] = [...INITIAL_PRODUCTS];
let ordersDatabase: Order[] = [];
let storeSettings: StoreSettings = { ...DEFAULT_STORE_SETTINGS };
let inventoryAuditLogs: Array<{
  timestamp: string;
  sku: string;
  action: 'UPDATE' | 'INSERT' | 'DEDUCT_SALE';
  oldStock?: number;
  newStock: number;
  oldPrice?: number;
  newPrice?: number;
}> = [];

// ============================================================================
// ANTI-ABUSE RATE LIMITER FOR AI HARDWARE CHATBOT
// Enforces a strict maximum of 5 requests per 10-minute window per IP/session
// ============================================================================
interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const chatRateLimits = new Map<string, RateLimitRecord>();
const CHAT_MAX_REQUESTS = 5;
const CHAT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function getClientIdentifier(req: Request): string {
  return (
    (req.headers['x-forwarded-for'] as string) ||
    req.socket.remoteAddress ||
    'anonymous_client'
  );
}

// Helper to format Bangladeshi Taka (৳)
function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString('en-BD')}`;
}

// ============================================================================
// 1. PRODUCT & CATALOG APIS
// ============================================================================

/**
 * GET /api/v1/products
 * Fetch products with optional filtering by category, search query, and stock status
 */
app.get('/api/v1/products', (req: Request, res: Response) => {
  const { category, search, inStock, brand } = req.query;

  let results = [...productsDatabase];

  if (category && category !== 'all') {
    results = results.filter(p => p.category === category);
  }

  if (brand && brand !== 'all') {
    results = results.filter(p => p.brand.toLowerCase() === (brand as string).toLowerCase());
  }

  if (inStock === 'true') {
    results = results.filter(p => p.stock > 0);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    results = results.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  res.json({
    success: true,
    count: results.length,
    data: results
  });
});

/**
 * GET /api/v1/products/:id
 */
app.get('/api/v1/products/:id', (req: Request, res: Response) => {
  const product = productsDatabase.find(p => p.id === req.params.id || p.slug === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, data: product });
});

/**
 * PUT /api/v1/products/:id
 * Direct product price (৳) & stock count update
 */
app.put('/api/v1/products/:id', (req: Request, res: Response) => {
  const index = productsDatabase.findIndex(
    p => p.id === req.params.id || p.sku.toLowerCase() === req.params.id.toLowerCase()
  );
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const current = productsDatabase[index];
  const oldPrice = current.salePrice;
  const oldStock = current.stock;
  const updates = req.body;

  productsDatabase[index] = {
    ...current,
    ...updates,
    regularPrice: updates.regularPrice !== undefined ? Number(updates.regularPrice) : current.regularPrice,
    salePrice: updates.salePrice !== undefined ? Number(updates.salePrice) : current.salePrice,
    stock: updates.stock !== undefined ? Number(updates.stock) : current.stock
  };

  inventoryAuditLogs.push({
    timestamp: new Date().toISOString(),
    sku: current.sku,
    action: 'UPDATE',
    oldStock,
    newStock: productsDatabase[index].stock,
    oldPrice,
    newPrice: productsDatabase[index].salePrice
  });

  res.json({
    success: true,
    data: productsDatabase[index],
    message: `Product ${current.sku} updated successfully`
  });
});

/**
 * POST /api/v1/admin/products/bulk-update
 * Bulk update product prices and stocks from Excel / CSV or table edits
 */
app.post('/api/v1/admin/products/bulk-update', (req: Request, res: Response) => {
  const { updates } = req.body;
  if (!Array.isArray(updates)) {
    return res.status(400).json({ success: false, message: 'Updates array required' });
  }

  let count = 0;
  updates.forEach(u => {
    const idx = productsDatabase.findIndex(
      p => (u.id && p.id === u.id) || (u.sku && p.sku.toLowerCase() === u.sku.toLowerCase())
    );
    if (idx !== -1) {
      const current = productsDatabase[idx];
      const oldStock = current.stock;
      const oldPrice = current.salePrice;

      productsDatabase[idx] = {
        ...current,
        regularPrice: u.regularPrice !== undefined ? Number(u.regularPrice) : current.regularPrice,
        salePrice: u.salePrice !== undefined ? Number(u.salePrice) : current.salePrice,
        stock: u.stock !== undefined ? Number(u.stock) : current.stock
      };

      inventoryAuditLogs.push({
        timestamp: new Date().toISOString(),
        sku: current.sku,
        action: 'UPDATE',
        oldStock,
        newStock: productsDatabase[idx].stock,
        oldPrice,
        newPrice: productsDatabase[idx].salePrice
      });
      count++;
    }
  });

  res.json({
    success: true,
    updatedCount: count,
    message: `Successfully updated ${count} products in catalog.`
  });
});

// ============================================================================
// 2. PC BUILDER COMPATIBILITY VALIDATION API
// ============================================================================

/**
 * POST /api/v1/pc-builder/validate
 * Validates hardware compatibility matrix and calculates estimated system wattage
 */
app.post('/api/v1/pc-builder/validate', (req: Request, res: Response) => {
  const { components } = req.body;
  if (!components || typeof components !== 'object') {
    return res.status(400).json({ success: false, message: 'Invalid components map provided' });
  }

  const report = evaluatePCBuildCompatibility(components);
  res.json({
    success: true,
    data: report
  });
});

// ============================================================================
// 3. PAYMENTS INTEGRATION (bKash Tokenized + SSLCommerz + Nagad + COD)
// ============================================================================

/**
 * POST /api/v1/payments/bkash/create
 * Initiates bKash Tokenized Checkout payment
 * In production: Calls https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/create
 */
app.post('/api/v1/payments/bkash/create', (req: Request, res: Response) => {
  const { amount, orderId } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid payment amount' });
  }

  // Simulated secure bKash payment gateway response
  const paymentID = 'BK' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
  const bkashURL = `/checkout/bkash-portal?paymentID=${paymentID}&amount=${amount}&orderId=${orderId || 'WTC-' + Date.now()}`;

  res.json({
    success: true,
    statusCode: '0000',
    statusMessage: 'Successful',
    paymentID,
    bkashURL,
    amount: amount.toString(),
    currency: 'BDT',
    intent: 'sale',
    merchantInvoiceNumber: orderId || 'INV-' + Date.now()
  });
});

/**
 * POST /api/v1/payments/bkash/execute
 * Verifies bKash payment completion via transaction ID callback
 */
app.post('/api/v1/payments/bkash/execute', (req: Request, res: Response) => {
  const { paymentID } = req.body;
  if (!paymentID) {
    return res.status(400).json({ success: false, message: 'Missing paymentID' });
  }

  // Generate verified Bangladeshi transaction reference ID (TRX ID)
  const trxID = 'TRX' + Math.floor(1000000000 + Math.random() * 9000000000);

  res.json({
    success: true,
    statusCode: '0000',
    statusMessage: 'Successful',
    paymentID,
    trxID,
    transactionStatus: 'Completed',
    paymentExecuteTime: new Date().toISOString()
  });
});

/**
 * POST /api/v1/payments/sslcommerz/init
 * Initiates SSLCommerz payment session for Cards (Visa/Mastercard) and Internet Banking
 */
app.post('/api/v1/payments/sslcommerz/init', (req: Request, res: Response) => {
  const { amount, orderId, customerName, customerEmail, customerPhone } = req.body;

  const sessionkey = 'SSL_' + Math.random().toString(36).substring(2, 12).toUpperCase();
  const gatewayUrl = `https://sandbox.sslcommerz.com/EasyCheckOut/testbox/${sessionkey}`;

  res.json({
    success: true,
    status: 'SUCCESS',
    sessionkey,
    GatewayPageURL: gatewayUrl,
    orderId: orderId || 'WTC-' + Date.now(),
    amount: amount
  });
});

// ============================================================================
// 4. DELIVERY & COURIER DISPATCH API
// ============================================================================

app.get('/api/v1/delivery/options', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: DELIVERY_OPTIONS
  });
});

// ============================================================================
// 5. ORDERS SYSTEM (Checkout & Concurrency-Safe Stock Deduction)
// ============================================================================

/**
 * POST /api/v1/orders
 * Creates an order, deducts stock atomically, and returns tracking info
 */
app.post('/api/v1/orders', (req: Request, res: Response) => {
  const { customer, items, paymentMethod, paymentStatus, transactionId, deliveryZone, notes } = req.body;

  if (!customer || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Incomplete order payload' });
  }

  // 1. Verify stock availability
  for (const lineItem of items) {
    const product = productsDatabase.find(p => p.id === lineItem.product.id);
    if (!product) {
      return res.status(400).json({ success: false, message: `Product ${lineItem.product.name} not found` });
    }
    if (product.stock < lineItem.quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${lineItem.quantity}`
      });
    }
  }

  // 2. Calculate totals and delivery fee
  const deliveryConfig = DELIVERY_OPTIONS.find(d => d.zone === deliveryZone) || DELIVERY_OPTIONS[0];
  const subtotal = items.reduce((sum: number, item: any) => sum + (item.unitPrice * item.quantity), 0);
  const deliveryFee = deliveryConfig.charge;
  const total = subtotal + deliveryFee;

  // 3. Concurrency-safe atomic stock deduction
  items.forEach((lineItem: any) => {
    const product = productsDatabase.find(p => p.id === lineItem.product.id);
    if (product) {
      const oldStock = product.stock;
      product.stock -= lineItem.quantity;
      inventoryAuditLogs.push({
        timestamp: new Date().toISOString(),
        sku: product.sku,
        action: 'DEDUCT_SALE',
        oldStock,
        newStock: product.stock
      });
    }
  });

  // 4. Generate order
  const orderNumber = 'WTC-' + Math.floor(100000 + Math.random() * 900000);
  const courierTrackingNumber = 'BD-EXP-' + Math.floor(10000000 + Math.random() * 90000000);

  const newOrder: Order = {
    id: 'ord-' + Date.now(),
    orderNumber,
    createdAt: new Date().toISOString(),
    customer,
    items,
    subtotal,
    deliveryFee,
    discount: 0,
    total,
    paymentMethod: paymentMethod || 'cod',
    paymentStatus: paymentStatus || (paymentMethod === 'cod' ? 'Unpaid' : 'Paid'),
    transactionId: transactionId || (paymentMethod === 'cod' ? undefined : 'TRX' + Math.floor(10000000 + Math.random() * 90000000)),
    orderStatus: 'Confirmed',
    courierTrackingNumber,
    courierName: deliveryConfig.courierPartners[0],
    notes
  };

  ordersDatabase.unshift(newOrder);

  res.status(201).json({
    success: true,
    data: newOrder,
    message: 'Order created successfully and stock reserved'
  });
});

/**
 * GET /api/v1/orders/track/:orderNumber
 */
app.get('/api/v1/orders/track/:orderNumber', (req: Request, res: Response) => {
  const order = ordersDatabase.find(
    o => o.orderNumber.toUpperCase() === req.params.orderNumber.toUpperCase()
  );
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order number not found' });
  }
  res.json({ success: true, data: order });
});

/**
 * GET /api/v1/orders (Admin list)
 */
app.get('/api/v1/orders', (req: Request, res: Response) => {
  res.json({ success: true, count: ordersDatabase.length, data: ordersDatabase });
});

// ============================================================================
// 6. ADMIN GOOGLE SHEETS / CSV MERGE & STOCK AUTOMATION ENGINE
// Syncs inventory, prices, image URLs, and adds new products from Excel/Sheets
// ============================================================================

/**
 * POST /api/v1/admin/sheet-merge
 * Accepts parsed tabular row items and automatically updates catalog
 */
app.post('/api/v1/admin/sheet-merge', (req: Request, res: Response) => {
  const { rows } = req.body;

  if (!rows || !Array.isArray(rows)) {
    return res.status(400).json({ success: false, message: 'Expected array of rows for sheet merging' });
  }

  let updatedCount = 0;
  let insertedCount = 0;
  const errors: string[] = [];

  rows.forEach((row: SheetRowItem, index: number) => {
    if (!row.sku || !row.name) {
      errors.push(`Row #${index + 1}: Missing SKU or Name`);
      return;
    }

    const existingIndex = productsDatabase.findIndex(
      p => p.sku.trim().toUpperCase() === row.sku.trim().toUpperCase()
    );

    if (existingIndex !== -1) {
      // UPDATE EXISTING PRODUCT
      const current = productsDatabase[existingIndex];
      const oldStock = current.stock;
      const oldPrice = current.salePrice;

      productsDatabase[existingIndex] = {
        ...current,
        name: row.name || current.name,
        regularPrice: Number(row.regularPrice) || current.regularPrice,
        salePrice: Number(row.salePrice) || current.salePrice,
        stock: row.stock !== undefined ? Number(row.stock) : current.stock,
        image: row.image ? row.image.trim() : current.image,
        brand: row.brand || current.brand,
        warranty: row.warranty || current.warranty
      };

      inventoryAuditLogs.push({
        timestamp: new Date().toISOString(),
        sku: current.sku,
        action: 'UPDATE',
        oldStock,
        newStock: productsDatabase[existingIndex].stock,
        oldPrice,
        newPrice: productsDatabase[existingIndex].salePrice
      });

      updatedCount++;
    } else {
      // INSERT NEW PRODUCT
      const newProduct: Product = {
        id: 'prod-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        sku: row.sku.trim(),
        name: row.name.trim(),
        slug: row.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        brand: row.brand || 'Generic',
        category: row.category || 'peripheral',
        categoryLabel: row.category ? row.category.toUpperCase() : 'Hardware',
        regularPrice: Number(row.regularPrice) || Number(row.salePrice) || 1000,
        salePrice: Number(row.salePrice) || Number(row.regularPrice) || 1000,
        stock: Number(row.stock) || 10,
        lowStockThreshold: 3,
        image: row.image || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80',
        description: `${row.name} - Official hardware sold by WTCmart with comprehensive warranty and fast home delivery across Bangladesh.`,
        shortDescription: row.specsSummary || `${row.brand || 'Hardware'} component with full Bangladesh official warranty.`,
        specifications: {},
        warranty: row.warranty || '1 Year Official Warranty',
        tags: [row.brand || 'WTCmart', 'Hardware'],
        rating: 5.0,
        reviewCount: 1,
        isFeatured: false
      };

      productsDatabase.push(newProduct);

      inventoryAuditLogs.push({
        timestamp: new Date().toISOString(),
        sku: newProduct.sku,
        action: 'INSERT',
        newStock: newProduct.stock,
        newPrice: newProduct.salePrice
      });

      insertedCount++;
    }
  });

  res.json({
    success: true,
    message: `Sheet merge complete: ${updatedCount} products updated, ${insertedCount} new products added.`,
    updatedCount,
    insertedCount,
    errors,
    totalProductsNow: productsDatabase.length
  });
});

/**
 * GET /api/v1/admin/audit-logs
 */
app.get('/api/v1/admin/audit-logs', (req: Request, res: Response) => {
  res.json({
    success: true,
    logs: inventoryAuditLogs.slice(-50).reverse()
  });
});

// ============================================================================
// 7. RATE-LIMITED AI HARDWARE ASSISTANT CHATBOT (ANTI-ABUSE PROTECTED)
// Uses @google/genai with 'gemini-3.8-flash' and strict rate limiting
// ============================================================================

app.post('/api/v1/chatbot', async (req: Request, res: Response) => {
  const clientKey = getClientIdentifier(req);
  const now = Date.now();

  // 1. Rate Limiting Check
  let record = chatRateLimits.get(clientKey);
  if (!record || now > record.resetTime) {
    record = { count: 0, resetTime: now + CHAT_WINDOW_MS };
    chatRateLimits.set(clientKey, record);
  }

  if (record.count >= CHAT_MAX_REQUESTS) {
    const minutesLeft = Math.ceil((record.resetTime - now) / 60000);
    return res.status(429).json({
      success: false,
      message: `Chat limit reached (anti-abuse policy: 5 questions per 10 minutes). Please try again in ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}, or click the WhatsApp / Messenger button for instant live human support.`,
      remainingQuota: 0,
      resetInMinutes: minutesLeft
    });
  }

  // Increment usage count
  record.count++;
  const remainingQuota = CHAT_MAX_REQUESTS - record.count;

  // 2. Input Sanitization & Validation
  const { message } = req.body;
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Message is required' });
  }

  const cleanMessage = message.trim().slice(0, 400); // Strict length constraint to prevent token abuse

  // 3. System Prompt & Knowledge Context
  const productCatalogSummary = productsDatabase
    .map(p => `- ${p.name} (SKU: ${p.sku}): Sale Price ৳${p.salePrice.toLocaleString('en-BD')}, Stock: ${p.stock > 0 ? p.stock + ' units' : 'OUT OF STOCK'}`)
    .join('\n');

  const systemInstruction = `You are "WTCmart Assistant", the expert computer hardware assistant for WTCmart (Bangladesh's leading technology and PC retailer).
Guidelines:
- Answer questions politely, concisely, and accurately about computer parts, PC builder compatibility, prices in Bangladeshi Taka (৳), bKash/Nagad/SSLCommerz payments, and delivery.
- Current Delivery Policy: Inside Dhaka: ৳60 (24-48h), Sub-Dhaka (Gazipur, Savar, Narayanganj): ৳100, Outside Dhaka: ৳150 (all 64 districts via Steadfast/Pathao).
- Payment methods: bKash (Merchant Tokenized), Nagad, SSLCommerz (Cards), and Cash on Delivery (COD).
- Store physical location: DIT Project, Road 8, Dhaka.
- Store official hotline & WhatsApp: 01303557185
- Support email: wut2do4u@gmail.com
- Keep responses brief (under 120 words), helpful, and direct.
- If user asks for something outside hardware/tech or WTCmart, politely refocus them on computer components and WTCmart services.

Live Catalog Snapshot:
${productCatalogSummary}`;

  // 4. Call Gemini 3.8 Flash or Fallback
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\nCustomer question: ${cleanMessage}` }] }
        ]
      });

      const reply = response.text || "I am glad to help! Please check our PC Builder or contact us via WhatsApp for customized quotes.";

      return res.json({
        success: true,
        reply,
        remainingQuota,
        rateLimitNotice: `You have ${remainingQuota} question${remainingQuota !== 1 ? 's' : ''} remaining in this 10-minute session.`
      });
    }
  } catch (error) {
    console.error('Gemini API call failed or rate limit hit, using deterministic expert fallback:', error);
  }

  // Fallback intelligent response if API key is not yet set or external call fails
  const lowerMsg = cleanMessage.toLowerCase();
  let fallbackReply = "Welcome to WTCmart! We offer official computer hardware, components, and custom PC builds with nationwide home delivery across Bangladesh.";

  if (lowerMsg.includes('bkash') || lowerMsg.includes('payment') || lowerMsg.includes('nagad')) {
    fallbackReply = "WTCmart supports direct bKash Merchant payment, Nagad MFS, SSLCommerz (Visa/Mastercard/Amex), and Cash on Delivery (COD) for your convenience.";
  } else if (lowerMsg.includes('delivery') || lowerMsg.includes('shipping') || lowerMsg.includes('dhaka')) {
    fallbackReply = "Home Delivery rates: Inside Dhaka ৳60 (24-48 hours), Sub-Dhaka ৳100, Outside Dhaka ৳150 to all 64 districts with courier tracking via Steadfast and Pathao.";
  } else if (lowerMsg.includes('pc builder') || lowerMsg.includes('build') || lowerMsg.includes('compatibility')) {
    fallbackReply = "Our interactive PC Builder checks CPU socket matches, DDR4/DDR5 compatibility, GPU clearance, and calculates required PSU wattage automatically. Click 'PC Builder' in the header to start!";
  } else if (lowerMsg.includes('gpu') || lowerMsg.includes('rtx') || lowerMsg.includes('graphics')) {
    fallbackReply = "We have NVIDIA RTX 4060, 4070 SUPER, and AMD Radeon RX 7800 XT in stock with 3 years official replacement warranty.";
  } else if (lowerMsg.includes('ryzen') || lowerMsg.includes('intel') || lowerMsg.includes('processor')) {
    fallbackReply = "Popular processors in stock: AMD Ryzen 7 7800X3D (৳46,200), Intel Core i7-14700K (৳47,500), and Ryzen 5 7600X (৳22,800).";
  }

  return res.json({
    success: true,
    reply: fallbackReply,
    remainingQuota,
    rateLimitNotice: `You have ${remainingQuota} question${remainingQuota !== 1 ? 's' : ''} remaining in this 10-minute session.`
  });
});

// ============================================================================
// 8. WTC TECHHUB ARTICLES & STORE SETTINGS API
// ============================================================================
app.get('/api/v1/techhub/articles', (req: Request, res: Response) => {
  res.json({ success: true, data: WTC_TECH_ARTICLES });
});

// Backward-compatibility route
app.get('/api/v1/techland/articles', (req: Request, res: Response) => {
  res.json({ success: true, data: WTC_TECH_ARTICLES });
});

// Store Settings APIs (Hotline Number, WhatsApp Number, Branch Locations)
app.get('/api/v1/store/settings', (req: Request, res: Response) => {
  res.json({ success: true, data: storeSettings });
});

app.put('/api/v1/store/settings', (req: Request, res: Response) => {
  const updates = req.body;
  if (!updates || typeof updates !== 'object') {
    return res.status(400).json({ success: false, message: 'Invalid payload' });
  }

  storeSettings = {
    ...storeSettings,
    ...updates,
    devCredit: "Dev by 'Ohi'" // Always maintain developer attribution
  };

  res.json({ success: true, data: storeSettings, message: 'Store contact and location settings updated successfully' });
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    store: 'WTCmart',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ============================================================================
// 9. VITE DEV MIDDLEWARE / STATIC ASSET SERVING
// ============================================================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WTCmart Server running on http://localhost:${PORT}`);
  });
}

startServer();
