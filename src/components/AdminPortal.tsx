/**
 * WTCmart Admin Operations & Hardware Stock / Price Management Engine
 * 
 * Features:
 * 1. Overview KPIs (Revenue, Orders, Products, Low Stock alerts)
 * 2. Excel (.xlsx, .xls) & CSV Automated Stock & Price Maintenance
 * 3. Export Stock Template (.xlsx / .csv) for direct offline editing
 * 4. Interactive In-line Product Catalog Price (৳) & Stock Count Editor
 * 5. Store Contact & Location Configuration (Phone, WhatsApp, Address, Email)
 * 6. Order Management & Audit Tracking
 */

import { useState, useRef, ChangeEvent } from 'react';
import * as XLSX from 'xlsx';
import {
  FileSpreadsheet,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Package,
  DollarSign,
  TrendingUp,
  Clock,
  ExternalLink,
  ArrowRight,
  Database,
  MapPin,
  PhoneCall,
  Save,
  Plus,
  Trash2,
  Code,
  Download,
  Edit2,
  Check,
  RotateCcw,
  FileText
} from 'lucide-react';
import { Order, Product, SheetRowItem, StoreSettings } from '../types';
import { mergeSheetData, updateStoreSettings, updateProduct, bulkUpdateProducts } from '../lib/api';

interface AdminPortalProps {
  products: Product[];
  orders: Order[];
  onRefreshProducts: () => void;
  onClose: () => void;
  storeSettings?: StoreSettings;
  onUpdateStoreSettings?: (newSettings: StoreSettings) => void;
}

export function AdminPortal({
  products,
  orders,
  onRefreshProducts,
  onClose,
  storeSettings,
  onUpdateStoreSettings
}: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<'stock_excel' | 'products' | 'orders' | 'settings'>('stock_excel');

  // Store Settings Form State (defaults to Ohi assignment, supports blank values)
  const [phoneInput, setPhoneInput] = useState(storeSettings?.hotlinePhone ?? '01303557185');
  const [whatsappInput, setWhatsappInput] = useState(storeSettings?.whatsappNumber ?? '01303557185');
  const [addressInput, setAddressInput] = useState(storeSettings?.locationAddress ?? 'DIT Project, road 8');
  const [emailInput, setEmailInput] = useState(storeSettings?.supportEmail ?? 'wut2do4u@gmail.com');
  const [branchesList, setBranchesList] = useState(storeSettings?.branches || []);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState('');

  // Excel / CSV File & Sheet Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [pastedData, setPastedData] = useState<string>(
    `SKU,Name,Brand,Category,RegularPrice,SalePrice,Stock,Warranty
WTC-CPU-7800X3D,AMD Ryzen 7 7800X3D Gaming Processor,AMD,cpu,48500,45900,25,3 Years Official Warranty
WTC-GPU-RTX5080,NVIDIA GeForce RTX 5080 16GB GDDR7,NVIDIA,gpu,145000,138000,8,3 Years Replacement Warranty
WTC-RAM-KINGSTON-32GB,Kingston Fury Beast RGB 32GB DDR5 6400MHz,Kingston,ram,16500,15000,22,Lifetime Warranty`
  );
  const [parsedRows, setParsedRows] = useState<SheetRowItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergeResult, setMergeResult] = useState<{
    message: string;
    updatedCount: number;
    insertedCount: number;
    errors: string[];
  } | null>(null);

  // Live Catalog Inline Editing State
  const [editableProducts, setEditableProducts] = useState<Record<string, { salePrice: number; regularPrice: number; stock: number }>>({});
  const [savingProductId, setSavingProductId] = useState<string | null>(null);
  const [catalogSaveSuccess, setCatalogSaveSuccess] = useState<string | null>(null);

  // Quick stats calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold);
  const totalStockUnits = products.reduce((sum, p) => sum + p.stock, 0);

  // Handle Excel (.xlsx, .xls) and CSV file uploads using XLSX library
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setMergeResult(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const buffer = evt.target?.result as ArrayBuffer;
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // Convert sheet to array of objects with raw strings
        const rawJson: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        if (rawJson.length === 0) {
          alert('Uploaded sheet appears to be empty.');
          return;
        }

        // Map columns intelligently (case-insensitive)
        const rows: SheetRowItem[] = rawJson.map((row: any, idx: number) => {
          // Find keys by loose matching
          const getVal = (patterns: string[]) => {
            const key = Object.keys(row).find(k => patterns.some(p => k.toLowerCase().includes(p.toLowerCase())));
            return key ? row[key] : undefined;
          };

          const sku = String(getVal(['sku', 'code', 'id']) || `SKU-${Date.now()}-${idx}`).trim();
          const name = String(getVal(['name', 'title', 'model', 'product']) || 'Hardware Component').trim();
          const brand = String(getVal(['brand', 'manufacturer']) || 'WTCmart').trim();
          const category = (getVal(['category', 'cat', 'type']) as any) || 'peripheral';
          
          const salePriceRaw = getVal(['saleprice', 'sale_price', 'price', 'bdt', 'currentprice']);
          const regPriceRaw = getVal(['regularprice', 'regular_price', 'mrp', 'oldprice']);
          const stockRaw = getVal(['stock', 'qty', 'quantity', 'count', 'units']);
          const imageRaw = getVal(['image', 'img', 'photo', 'url']);
          const warRaw = getVal(['warranty', 'guarantee']);

          const salePrice = Number(salePriceRaw) || Number(regPriceRaw) || 1000;
          const regularPrice = Number(regPriceRaw) || salePrice;
          const stock = stockRaw !== undefined && stockRaw !== '' ? Number(stockRaw) : 10;

          return {
            sku,
            name,
            brand,
            category,
            regularPrice,
            salePrice,
            stock,
            image: imageRaw ? String(imageRaw) : 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80',
            warranty: warRaw ? String(warRaw) : '1 Year Official Warranty'
          };
        });

        setParsedRows(rows);
      } catch (err: any) {
        alert('Error parsing Excel/CSV file: ' + err.message);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Export current catalog to Excel (.xlsx) template for easy offline stock editing
  const handleExportTemplate = (format: 'xlsx' | 'csv') => {
    try {
      const exportData = products.map(p => ({
        SKU: p.sku,
        Name: p.name,
        Brand: p.brand,
        Category: p.category,
        RegularPrice: p.regularPrice,
        SalePrice: p.salePrice,
        Stock: p.stock,
        Warranty: p.warranty,
        Status: p.stock > 0 ? 'In Stock' : 'Out of Stock'
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Stock_Catalog');

      if (format === 'xlsx') {
        XLSX.writeFile(workbook, `WTCmart_Hardware_Stock_${new Date().toISOString().slice(0, 10)}.xlsx`);
      } else {
        XLSX.writeFile(workbook, `WTCmart_Hardware_Stock_${new Date().toISOString().slice(0, 10)}.csv`, { bookType: 'csv' });
      }
    } catch (err: any) {
      alert('Failed to export catalog: ' + err.message);
    }
  };

  // Parse CSV or Tab-separated text from textarea
  const handleParsePastedText = () => {
    try {
      const lines = pastedData.trim().split('\n');
      if (lines.length <= 1) {
        alert('Please provide at least a header row and one data row');
        return;
      }

      const delimiter = lines[0].includes('\t') ? '\t' : ',';
      const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase());

      const skuIdx = headers.findIndex(h => h.includes('sku'));
      const nameIdx = headers.findIndex(h => h.includes('name') || h.includes('title'));
      const brandIdx = headers.findIndex(h => h.includes('brand'));
      const catIdx = headers.findIndex(h => h.includes('cat'));
      const regPriceIdx = headers.findIndex(h => h.includes('regular') || h.includes('mrp'));
      const salePriceIdx = headers.findIndex(h => h.includes('sale') || h.includes('price'));
      const stockIdx = headers.findIndex(h => h.includes('stock') || h.includes('qty'));
      const warIdx = headers.findIndex(h => h.includes('warranty'));

      const rows: SheetRowItem[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const cols = line.split(delimiter).map(c => c.trim().replace(/^"|"$/g, ''));

        rows.push({
          sku: skuIdx !== -1 ? cols[skuIdx] : `SKU-${Date.now()}-${i}`,
          name: nameIdx !== -1 ? cols[nameIdx] : 'New Product',
          brand: brandIdx !== -1 ? cols[brandIdx] : 'WTCmart',
          category: (catIdx !== -1 ? (cols[catIdx] as any) : 'peripheral') || 'peripheral',
          regularPrice: Number(cols[regPriceIdx]) || Number(cols[salePriceIdx]) || 1000,
          salePrice: Number(cols[salePriceIdx]) || Number(cols[regPriceIdx]) || 1000,
          stock: stockIdx !== -1 ? Number(cols[stockIdx]) : 10,
          image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80',
          warranty: warIdx !== -1 ? cols[warIdx] : '1 Year Official Warranty'
        });
      }

      setParsedRows(rows);
      setMergeResult(null);
    } catch (err: any) {
      alert('Error parsing sheet data: ' + err.message);
    }
  };

  // Submit parsed sheet rows to backend merge engine
  const handleExecuteMerge = async () => {
    if (parsedRows.length === 0) return;
    setIsMerging(true);
    setMergeResult(null);

    try {
      const res = await mergeSheetData(parsedRows);
      setMergeResult(res);
      onRefreshProducts();
    } catch (err: any) {
      alert('Merge failed: ' + err.message);
    } finally {
      setIsMerging(false);
    }
  };

  // Direct In-Line Price and Stock Update Handler for Catalog
  const handleSaveProductChanges = async (productId: string) => {
    const edits = editableProducts[productId];
    if (!edits) return;

    setSavingProductId(productId);
    setCatalogSaveSuccess(null);
    try {
      await updateProduct(productId, edits);
      setCatalogSaveSuccess(`Product successfully updated in database`);
      onRefreshProducts();
      setTimeout(() => setCatalogSaveSuccess(null), 3000);
    } catch (err: any) {
      alert('Failed to update product: ' + err.message);
    } finally {
      setSavingProductId(null);
    }
  };

  // Bulk save all modified products in catalog
  const handleSaveAllModified = async () => {
    const updates = Object.keys(editableProducts).map(id => {
      const val = editableProducts[id];
      return {
        id,
        salePrice: val.salePrice,
        regularPrice: val.regularPrice,
        stock: val.stock
      };
    });

    if (updates.length === 0) {
      alert('No products have been modified yet.');
      return;
    }

    setSavingProductId('all');
    try {
      const res = await bulkUpdateProducts(updates);
      setCatalogSaveSuccess(res.message);
      setEditableProducts({});
      onRefreshProducts();
      setTimeout(() => setCatalogSaveSuccess(null), 4000);
    } catch (err: any) {
      alert('Failed to bulk update products: ' + err.message);
    } finally {
      setSavingProductId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-slate-50 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold tracking-tight">
                  WTCmart Admin Operations &amp; Inventory Engine
                </h2>
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold">
                  Dev by 'Ohi'
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Excel/CSV stock synchronization, manual price assignments, and store configuration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefreshProducts}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Refresh Live Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Exit Admin
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-slate-200 px-6 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('stock_excel')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'stock_excel'
                ? 'border-cyan-600 text-cyan-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel / CSV Stock &amp; Price Sync</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'products'
                ? 'border-cyan-600 text-cyan-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products Catalog ({products.length})</span>
            {Object.keys(editableProducts).length > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-mono">
                {Object.keys(editableProducts).length} unsaved
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'border-cyan-600 text-cyan-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Customer Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'border-cyan-600 text-cyan-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Store Contact &amp; Location Settings</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick KPIs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Total Products
              </span>
              <div className="text-xl font-black text-slate-900">{products.length}</div>
              <span className="text-[10px] text-slate-500">{totalStockUnits} total units in stock</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Low Stock Items
              </span>
              <div className={`text-xl font-black ${lowStockProducts.length > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {lowStockProducts.length}
              </div>
              <span className="text-[10px] text-slate-500">Below safety thresholds</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Orders Completed
              </span>
              <div className="text-xl font-black text-cyan-600">{orders.length}</div>
              <span className="text-[10px] text-slate-500">bKash, Nagad &amp; COD</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Gross GMV
              </span>
              <div className="text-xl font-black text-slate-900">৳{totalRevenue.toLocaleString('en-BD')}</div>
              <span className="text-[10px] text-slate-500">Live platform revenue</span>
            </div>
          </div>

          {/* TAB 1: EXCEL / CSV STOCK & PRICE SYNC */}
          {activeTab === 'stock_excel' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
              {/* Header & Template Download Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-cyan-600" />
                    <span>Excel (.xlsx) / CSV Stock &amp; Price Automation</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Upload an Excel or CSV file to update stock counts, adjust prices (৳), and insert new products.
                  </p>
                </div>

                {/* Template Download Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleExportTemplate('xlsx')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Download current stock as Excel workbook"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Export Excel (.xlsx)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExportTemplate('csv')}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Download current stock as CSV"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-600" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Source Code Separation Notice */}
              <div className="p-3 bg-cyan-50/70 border border-cyan-200 rounded-xl text-xs text-cyan-950 flex items-start gap-3">
                <Code className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Manual Assignment File:</strong>{' '}
                  All default prices, stock counts, and store contact info are centrally stored in{' '}
                  <code className="px-1.5 py-0.5 bg-cyan-100/90 rounded text-[11px] font-mono font-bold text-cyan-900">
                    /src/data/manualStoreData.ts
                  </code>
                  . You can maintain stock counts here via Excel/CSV uploads or directly in the code file!
                </div>
              </div>

              {/* Upload Dropzone / File Picker */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Method 1: Excel File Upload */}
                <div className="border-2 border-dashed border-slate-300 hover:border-cyan-500 rounded-2xl p-6 text-center bg-slate-50/60 transition-colors">
                  <Upload className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
                  <h4 className="text-xs font-bold text-slate-900">
                    Upload Excel Spreadsheet (.xlsx, .xls, .csv)
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 mb-4">
                    Supports SKU, Stock / Qty, SalePrice, RegularPrice, Name, Warranty
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="excel-file-upload-input"
                  />
                  <label
                    htmlFor="excel-file-upload-input"
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Choose File from Device</span>
                  </label>

                  {uploadedFileName && (
                    <div className="mt-3 text-xs text-emerald-700 font-semibold flex items-center justify-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Loaded: {uploadedFileName}</span>
                    </div>
                  )}
                </div>

                {/* Method 2: Raw Text / CSV Paste */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      Or Paste CSV / Tab-Separated Values:
                    </label>
                    <button
                      type="button"
                      onClick={handleParsePastedText}
                      className="text-xs text-cyan-600 hover:text-cyan-700 font-bold cursor-pointer"
                    >
                      Parse Text Below
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={pastedData}
                    onChange={e => setPastedData(e.target.value)}
                    className="w-full font-mono text-[11px] p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-cyan-500"
                    placeholder="SKU,Name,Brand,Category,RegularPrice,SalePrice,Stock,Warranty"
                  />
                </div>
              </div>

              {/* Merge Result Feedback */}
              {mergeResult && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{mergeResult.message}</span>
                  </div>
                  <div className="text-[11px] text-emerald-700">
                    Updated: {mergeResult.updatedCount} products | New Items Inserted: {mergeResult.insertedCount}
                  </div>
                  {mergeResult.errors.length > 0 && (
                    <div className="text-rose-600 text-[11px] pt-1">
                      Warnings: {mergeResult.errors.join(', ')}
                    </div>
                  )}
                </div>
              )}

              {/* Parsed Preview Table & Execute Button */}
              {parsedRows.length > 0 && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <span>Ready to Sync ({parsedRows.length} Products Detected)</span>
                    </h4>
                    <button
                      disabled={isMerging}
                      onClick={handleExecuteMerge}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isMerging ? 'Updating Inventory...' : 'Sync Stock & Prices to Live Store'}</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-72">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 sticky top-0">
                        <tr>
                          <th className="p-3">Action</th>
                          <th className="p-3">SKU</th>
                          <th className="p-3">Product Name</th>
                          <th className="p-3">Sale Price (BDT)</th>
                          <th className="p-3">Stock Count</th>
                          <th className="p-3">Warranty</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {parsedRows.map((r, i) => {
                          const existing = products.find(
                            p => p.sku.trim().toUpperCase() === r.sku.trim().toUpperCase()
                          );
                          return (
                            <tr key={i} className="hover:bg-slate-50">
                              <td className="p-3">
                                {existing ? (
                                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px]">
                                    UPDATE
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                                    NEW ITEM
                                  </span>
                                )}
                              </td>
                              <td className="p-3 font-mono font-bold text-slate-900">{r.sku}</td>
                              <td className="p-3 font-medium text-slate-800">{r.name}</td>
                              <td className="p-3 font-extrabold text-cyan-700">
                                ৳{r.salePrice.toLocaleString('en-BD')}
                              </td>
                              <td className="p-3 font-bold text-slate-900">{r.stock} units</td>
                              <td className="p-3 text-slate-500">{r.warranty}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LIVE PRODUCTS CATALOG & QUICK IN-LINE PRICE/STOCK EDITING */}
          {activeTab === 'products' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Live Hardware Catalog ({products.length} Products)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Directly modify price (৳) or stock level for any product below and hit Save.
                  </p>
                </div>

                {Object.keys(editableProducts).length > 0 && (
                  <button
                    disabled={savingProductId !== null}
                    onClick={handleSaveAllModified}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All ({Object.keys(editableProducts).length}) Modified Products</span>
                  </button>
                )}
              </div>

              {catalogSaveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{catalogSaveSuccess}</span>
                </div>
              )}

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Sale Price (৳ BDT)</th>
                      <th className="p-3">Regular / MRP (৳)</th>
                      <th className="p-3">Stock Count</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map(p => {
                      const edits = editableProducts[p.id];
                      const currentSalePrice = edits?.salePrice ?? p.salePrice;
                      const currentRegPrice = edits?.regularPrice ?? p.regularPrice;
                      const currentStock = edits?.stock ?? p.stock;
                      const isModified = edits !== undefined;

                      return (
                        <tr key={p.id} className={isModified ? 'bg-amber-50/50' : 'hover:bg-slate-50'}>
                          <td className="p-3 flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-10 h-10 object-contain rounded bg-white p-1 border border-slate-200"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block">{p.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">SKU: {p.sku}</span>
                            </div>
                          </td>
                          <td className="p-3 uppercase font-bold text-slate-600 text-[10px]">{p.category}</td>
                          
                          {/* Editable Sale Price Input */}
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <span className="text-slate-500 font-bold text-xs">৳</span>
                              <input
                                type="number"
                                value={currentSalePrice}
                                onChange={e => {
                                  const val = Number(e.target.value);
                                  setEditableProducts({
                                    ...editableProducts,
                                    [p.id]: {
                                      salePrice: val,
                                      regularPrice: currentRegPrice,
                                      stock: currentStock
                                    }
                                  });
                                }}
                                className="w-24 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-bold text-slate-900 focus:outline-none focus:border-cyan-500"
                              />
                            </div>
                          </td>

                          {/* Editable Regular Price Input */}
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <span className="text-slate-400 text-xs">৳</span>
                              <input
                                type="number"
                                value={currentRegPrice}
                                onChange={e => {
                                  const val = Number(e.target.value);
                                  setEditableProducts({
                                    ...editableProducts,
                                    [p.id]: {
                                      salePrice: currentSalePrice,
                                      regularPrice: val,
                                      stock: currentStock
                                    }
                                  });
                                }}
                                className="w-24 px-2 py-1 bg-white border border-slate-300 rounded text-xs text-slate-600 focus:outline-none focus:border-cyan-500"
                              />
                            </div>
                          </td>

                          {/* Editable Stock Count Input */}
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={currentStock}
                                onChange={e => {
                                  const val = Number(e.target.value);
                                  setEditableProducts({
                                    ...editableProducts,
                                    [p.id]: {
                                      salePrice: currentSalePrice,
                                      regularPrice: currentRegPrice,
                                      stock: val
                                    }
                                  });
                                }}
                                className="w-20 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-bold text-slate-900 focus:outline-none focus:border-cyan-500"
                              />
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                currentStock <= 0
                                  ? 'bg-rose-100 text-rose-800'
                                  : currentStock <= p.lowStockThreshold
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {currentStock <= 0 ? 'Out of Stock' : `${currentStock} units`}
                              </span>
                            </div>
                          </td>

                          {/* Quick Save Row Button */}
                          <td className="p-3 text-right">
                            {isModified ? (
                              <button
                                type="button"
                                disabled={savingProductId === p.id}
                                onClick={() => handleSaveProductChanges(p.id)}
                                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                              >
                                <Save className="w-3 h-3" />
                                <span>{savingProductId === p.id ? 'Saving...' : 'Save'}</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400 font-medium">Syncd</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMER ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <h3 className="text-base font-extrabold text-slate-900 mb-4">
                Recent Customer Orders &amp; bKash / COD Status
              </h3>
              {orders.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No orders placed yet. Add hardware to cart and complete checkout to view live order records.
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Order #</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Delivery City / Zone</th>
                        <th className="p-3">Total Amount</th>
                        <th className="p-3">Gateway</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.map(o => (
                        <tr key={o.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-slate-900">{o.orderNumber}</td>
                          <td className="p-3">
                            <span className="font-bold text-slate-800 block">{o.customer.fullName}</span>
                            <span className="text-[10px] text-slate-400">{o.customer.phone}</span>
                          </td>
                          <td className="p-3 text-slate-600">{o.customer.city} ({o.customer.zone})</td>
                          <td className="p-3 font-black text-cyan-700">৳{o.total.toLocaleString('en-BD')}</td>
                          <td className="p-3 uppercase font-bold text-slate-700 text-[10px]">{o.paymentMethod}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                              {o.orderStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: STORE CONTACT & LOCATION SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-cyan-600" />
                    <span>Store Contact Details &amp; Outlets Configuration</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage phone number, email, address, and branches. Leave any field empty to keep it blank in the public UI.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Button to clear fields / keep blank */}
                  <button
                    type="button"
                    onClick={() => {
                      setPhoneInput('');
                      setWhatsappInput('');
                      setAddressInput('');
                      setEmailInput('');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                    title="Blank out all contact fields"
                  >
                    Clear / Keep Blank
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPhoneInput('01303557185');
                      setWhatsappInput('01303557185');
                      setAddressInput('DIT Project, road 8');
                      setEmailInput('wut2do4u@gmail.com');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 text-xs font-bold transition-colors cursor-pointer"
                    title="Restore default Ohi assigned contact data"
                  >
                    Load DIT Project Defaults
                  </button>

                  <button
                    disabled={isSavingSettings}
                    onClick={async () => {
                      setIsSavingSettings(true);
                      setSettingsSavedMsg('');
                      try {
                        const updated: StoreSettings = {
                          storeName: storeSettings?.storeName || 'WTCmart Bangladesh Ltd.',
                          hotlinePhone: phoneInput.trim(),
                          whatsappNumber: whatsappInput.trim(),
                          locationAddress: addressInput.trim(),
                          supportEmail: emailInput.trim(),
                          branches: branchesList,
                          devCredit: "Dev by 'Ohi'"
                        };
                        const resSettings = await updateStoreSettings(updated);
                        if (resSettings) {
                          onUpdateStoreSettings?.(resSettings);
                          setSettingsSavedMsg('Store contact numbers and location saved successfully!');
                          setTimeout(() => setSettingsSavedMsg(''), 4000);
                        }
                      } catch (err) {
                        alert('Failed to save settings: ' + (err as Error).message);
                      } finally {
                        setIsSavingSettings(false);
                      }
                    }}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingSettings ? 'Saving...' : 'Save Settings'}</span>
                  </button>
                </div>
              </div>

              {settingsSavedMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{settingsSavedMsg}</span>
                </div>
              )}

              {/* Core Hotline & WhatsApp Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-cyan-600" />
                    <span>Primary Customer Hotline &amp; Mail</span>
                  </h4>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Hotline Phone Number (leave blank to hide)
                    </label>
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={e => setPhoneInput(e.target.value)}
                      placeholder="e.g. 01303557185 (or leave empty)"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Current setting: {phoneInput ? phoneInput : <span className="italic text-slate-400">Blank (hidden from UI)</span>}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      WhatsApp Support Number (leave blank to hide)
                    </label>
                    <input
                      type="text"
                      value={whatsappInput}
                      onChange={e => setWhatsappInput(e.target.value)}
                      placeholder="e.g. 01303557185 (or leave empty)"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Support Email (leave blank to hide)
                    </label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      placeholder="e.g. wut2do4u@gmail.com (or leave empty)"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>

                {/* Flagship Location Address & Presets */}
                <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-600" />
                    <span>Store Physical Address</span>
                  </h4>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Address (leave blank to hide)
                    </label>
                    <textarea
                      rows={2}
                      value={addressInput}
                      onChange={e => setAddressInput(e.target.value)}
                      placeholder="e.g. DIT Project, road 8 (or leave empty)"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-cyan-500"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Current setting: {addressInput ? addressInput : <span className="italic text-slate-400">Blank (hidden from UI)</span>}
                    </p>
                  </div>

                  {/* Quick Location Presets */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">
                      Quick Address Presets:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAddressInput('DIT Project, road 8')}
                        className="text-left p-2 rounded-lg bg-white hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 text-[11px] text-slate-700 transition-colors"
                      >
                        <strong className="block text-cyan-700">DIT Project, road 8</strong>
                        Assigned Store Location
                      </button>
                      <button
                        type="button"
                        onClick={() => setAddressInput('')}
                        className="text-left p-2 rounded-lg bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-[11px] text-slate-700 transition-colors"
                      >
                        <strong className="block text-rose-700">Blank Address</strong>
                        Hide address entirely
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
