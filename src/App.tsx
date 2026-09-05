/**
 * WTCmart - Bangladesh Premier Computer Hardware & Tech Retail Platform
 * 
 * Monorepo Single-Pathway Application coordinating:
 * - Customer Hardware Storefront (CPUs, GPUs, Motherboards, RAM, SSD, PSUs)
 * - Interactive PC Builder with real-time compatibility matrix & wattage estimation
 * - Multi-Channel Checkout with bKash Merchant API, SSLCommerz, Nagad & Cash on Delivery
 * - Home Delivery Engine (Dhaka ৳60, Sub-Dhaka ৳100, Outside ৳150)
 * - Anti-Abuse Rate-Limited AI Hardware Assistant Chatbot
 * - Admin Operations & Google Sheets / CSV Stock & Price Automation Engine
 * - WhatsApp & Messenger Direct Channel Integrations
 * - TechLand Content Knowledge Base
 */

import { useState, useEffect } from 'react';
import {
  Cpu,
  Zap,
  Truck,
  ShieldCheck,
  Sparkles,
  Search,
  Layers,
  ArrowRight,
  Filter,
  CheckCircle,
  HelpCircle,
  Clock,
  PhoneCall,
  ShoppingBag
} from 'lucide-react';
import { CartItem, Order, Product, ProductCategory, StoreSettings } from './types';
import { INITIAL_PRODUCTS, WTC_TECH_ARTICLES, DEFAULT_STORE_SETTINGS } from './data/seedData';
import { fetchProducts, fetchStoreSettings } from './lib/api';

import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { PCBuilder } from './components/PCBuilder';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AIChatbotModal } from './components/AIChatbotModal';
import { AdminPortal } from './components/AdminPortal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { TechHubSection } from './components/TechHubSection';
import { FloatingSupportWidget } from './components/FloatingSupportWidget';
import { Footer } from './components/Footer';

export default function App() {
  // Navigation View State
  const [currentView, setCurrentView] = useState<'store' | 'pc_builder' | 'admin'>('store');

  // Product Catalog State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Store Contact, Location & Branch Settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('b1');

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('wtcmart_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal Visibility States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync Cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wtcmart_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [cart]);

  // Fetch live products from backend on mount
  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      if (data && data.length > 0) {
        setProducts(data);
      }
    } catch (err) {
      console.warn('Using seeded catalog while server connects:', err);
    }
  };

  useEffect(() => {
    loadProducts();
    // Load store contact numbers and branch configurations
    fetchStoreSettings()
      .then(settings => {
        if (settings) {
          setStoreSettings(settings);
          const primaryBranch = settings.branches?.find(b => b.isPrimary);
          if (primaryBranch) {
            setSelectedBranchId(primaryBranch.id);
          }
        }
      })
      .catch(err => {
        console.warn('Using default store settings:', err);
      });
  }, []);

  // Cart Operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    if (product.stock <= 0) {
      showToast(`${product.name} is currently out of stock`);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
    });

    showToast(`Added "${product.name}" to cart!`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleAddAllToCart = (items: Product[]) => {
    items.forEach(p => handleAddToCart(p, 1));
    showToast(`Added ${items.length} PC components to cart!`);
    setIsCartOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    setCart([]); // Clear cart
    loadProducts(); // Refresh stock
  };

  // Filtered Products
  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }
    if (selectedBrand !== 'all' && product.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
      return false;
    }
    if (inStockOnly && product.stock <= 0) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = product.name.toLowerCase().includes(q);
      const matchBrand = product.brand.toLowerCase().includes(q);
      const matchSku = product.sku.toLowerCase().includes(q);
      const matchTags = product.tags.some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchBrand && !matchSku && !matchTags) return false;
    }
    return true;
  });

  const cartTotal = cart.reduce(
    (sum, item) => sum + (item.product.salePrice || item.product.regularPrice) * item.quantity,
    0
  );
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Available brands for filter
  const brands = Array.from(new Set(products.map(p => p.brand)));

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-5 z-50 bg-slate-950 text-cyan-300 border border-cyan-500/40 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Header */}
      <Header
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenPCBuilder={() => setCurrentView('pc_builder')}
        onOpenOrderTracking={() => setIsOrderTrackingOpen(true)}
        onOpenAdmin={() => setCurrentView('admin')}
        selectedCategory={selectedCategory}
        onSelectCategory={cat => {
          setSelectedCategory(cat);
          if (currentView !== 'store') setCurrentView('store');
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onGoHome={() => {
          setCurrentView('store');
          setSelectedCategory('all');
          setSearchQuery('');
        }}
        storeSettings={storeSettings}
        selectedBranchId={selectedBranchId}
        onSelectBranch={setSelectedBranchId}
      />

      {/* MAIN VIEW CONTROLLER */}
      <main className="flex-1">
        {/* VIEW 1: PC BUILDER */}
        {currentView === 'pc_builder' && (
          <PCBuilder
            products={products}
            onAddAllToCart={handleAddAllToCart}
            onClose={() => setCurrentView('store')}
          />
        )}

        {/* VIEW 2: ADMIN PORTAL */}
        {currentView === 'admin' && (
          <AdminPortal
            products={products}
            orders={orders}
            onRefreshProducts={loadProducts}
            onClose={() => setCurrentView('store')}
            storeSettings={storeSettings}
            onUpdateStoreSettings={newSettings => setStoreSettings(newSettings)}
          />
        )}

        {/* VIEW 3: STOREFRONT HOMEPAGE & HARDWARE CATALOG */}
        {currentView === 'store' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
            {/* HERO BANNER */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-10 md:p-14 shadow-xl border border-slate-800">
              {/* Subtle Tech Circuit Grid Background Accent */}
              <div className="absolute inset-0 bg-[radial-gradient(#0891b2_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Bangladesh Premier Technology &amp; Computer Retailer</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                  Build Your Dream PC With{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                    Official Hardware
                  </span>
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  100% Genuine Intel, AMD Ryzen, NVIDIA RTX, and Corsair components with manufacturer replacement warranty. Fast home delivery across Dhaka &amp; all 64 districts.
                </p>

                {/* Hero CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    id="hero-pc-builder-btn"
                    onClick={() => setCurrentView('pc_builder')}
                    className="px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                  >
                    <Cpu className="w-4 h-4" />
                    <span>Launch PC Builder</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href="#catalog-section"
                    className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs sm:text-sm border border-white/15 transition-colors"
                  >
                    Browse Hardware Catalog
                  </a>
                </div>

                {/* Trust Badges */}
                <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span>100% Official Warranty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span>Home Delivery ৳60 / ৳150</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span>bKash &amp; SSLCommerz</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span>Multiplan Center Dhaka</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CATALOG SECTION WITH FILTERS */}
            <div id="catalog-section" className="space-y-4">
              {/* Bar with Title, Result Count, and Quick Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <span>
                      {selectedCategory === 'all'
                        ? 'All Hardware Components'
                        : `${selectedCategory.toUpperCase()} Components`}
                    </span>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {filteredProducts.length} Items
                    </span>
                  </h2>
                  {searchQuery && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      Showing results matching: <strong className="text-cyan-700">"{searchQuery}"</strong>
                    </p>
                  )}
                </div>

                {/* Filter Controls: Brand and In-Stock */}
                <div className="flex items-center gap-3 text-xs">
                  {/* Brand Filter */}
                  <select
                    value={selectedBrand}
                    onChange={e => setSelectedBrand(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="all">All Brands</option>
                    {brands.map(b => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>

                  {/* In Stock Toggle */}
                  <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium select-none">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={e => setInStockOnly(e.target.checked)}
                      className="rounded text-cyan-600 focus:ring-cyan-500"
                    />
                    <span>In-Stock Only</span>
                  </label>
                </div>
              </div>

              {/* Product Grid */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                  <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                    <Search className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-base">No hardware components matched</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try broadening your search query or reset the brand and category filters.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedBrand('all');
                      setSearchQuery('');
                      setInStockOnly(false);
                    }}
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-cyan-600 transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onQuickView={p => setQuickViewProduct(p)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* WTC TECHHUB EDITORIAL & HARDWARE GUIDES */}
            <TechHubSection articles={WTC_TECH_ARTICLES} />
          </div>
        )}
      </main>

      {/* Floating Support Dock (WhatsApp, Messenger, AI Assistant) */}
      <FloatingSupportWidget
        onOpenChatbot={() => setIsChatbotOpen(true)}
        storeSettings={storeSettings}
      />

      {/* MODALS & DRAWERS */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderTrackingModal
        isOpen={isOrderTrackingOpen}
        onClose={() => setIsOrderTrackingOpen(false)}
      />

      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <AIChatbotModal
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />

      {/* Global Footer */}
      <Footer storeSettings={storeSettings} />
    </div>
  );
}
