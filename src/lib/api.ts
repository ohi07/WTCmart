/**
 * WTCmart Client API Layer
 * Connects frontend views to backend REST endpoints (/api/v1/*)
 */

import { Order, Product, SheetRowItem, WTCTechArticle, StoreSettings } from '../types';

export async function fetchProducts(filters?: {
  category?: string;
  brand?: string;
  inStock?: boolean;
  search?: string;
}): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters?.category && filters.category !== 'all') params.append('category', filters.category);
  if (filters?.brand && filters.brand !== 'all') params.append('brand', filters.brand);
  if (filters?.inStock) params.append('inStock', 'true');
  if (filters?.search) params.append('search', filters.search);

  const res = await fetch(`/api/v1/products?${params.toString()}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch products');
  return data.data;
}

export async function fetchProductById(id: string): Promise<Product> {
  const res = await fetch(`/api/v1/products/${id}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Product not found');
  return data.data;
}

export async function validateBuild(components: Record<string, Product | undefined>) {
  const res = await fetch('/api/v1/pc-builder/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ components })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Validation failed');
  return data.data;
}

export async function createOrder(orderData: any): Promise<Order> {
  const res = await fetch('/api/v1/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Order creation failed');
  return data.data;
}

export async function trackOrder(orderNumber: string): Promise<Order> {
  const res = await fetch(`/api/v1/orders/track/${encodeURIComponent(orderNumber)}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Order tracking failed');
  return data.data;
}

export async function sendChatMessage(message: string): Promise<{
  reply: string;
  remainingQuota: number;
  rateLimitNotice: string;
}> {
  const res = await fetch('/api/v1/chatbot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || 'Chatbot request failed');
  }
  return data;
}

export async function mergeSheetData(rows: SheetRowItem[]): Promise<{
  message: string;
  updatedCount: number;
  insertedCount: number;
  errors: string[];
  totalProductsNow: number;
}> {
  const res = await fetch('/api/v1/admin/sheet-merge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rows })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Sheet merge failed');
  return data;
}

export async function fetchTechHubArticles(): Promise<WTCTechArticle[]> {
  const res = await fetch('/api/v1/techhub/articles');
  const data = await res.json();
  return data.data || [];
}

export async function fetchStoreSettings(): Promise<StoreSettings> {
  const res = await fetch('/api/v1/store/settings');
  const data = await res.json();
  return data.data;
}

export async function updateStoreSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
  const res = await fetch('/api/v1/store/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to update store settings');
  return data.data;
}

export async function fetchAuditLogs() {
  const res = await fetch('/api/v1/admin/audit-logs');
  const data = await res.json();
  return data.logs || [];
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const res = await fetch(`/api/v1/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to update product');
  return data.data;
}

export async function bulkUpdateProducts(
  updates: Array<{ id?: string; sku?: string; salePrice?: number; regularPrice?: number; stock?: number }>
): Promise<{ updatedCount: number; message: string }> {
  const res = await fetch('/api/v1/admin/products/bulk-update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ updates })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to bulk update products');
  return data;
}

