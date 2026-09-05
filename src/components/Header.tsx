/**
 * WTCmart Header Component
 * Comprehensive navigation with search, PC Builder CTA, cart badge, WhatsApp/Messenger shortcuts
 */

import { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Cpu,
  Truck,
  PhoneCall,
  MessageCircle,
  Send,
  ShieldCheck,
  Layers,
  Sparkles,
  Menu,
  X,
  FileSpreadsheet,
  MapPin,
  ChevronDown,
  Check
} from 'lucide-react';
import { Logo } from './Logo';
import { ProductCategory, StoreSettings } from '../types';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenPCBuilder: () => void;
  onOpenOrderTracking: () => void;
  onOpenAdmin: () => void;
  onSelectCategory: (category: ProductCategory | 'all') => void;
  selectedCategory: ProductCategory | 'all';
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onGoHome: () => void;
  storeSettings?: StoreSettings;
  selectedBranchId?: string;
  onSelectBranch?: (branchId: string) => void;
}

export function Header({
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenPCBuilder,
  onOpenOrderTracking,
  onOpenAdmin,
  onSelectCategory,
  selectedCategory,
  searchQuery,
  onSearchChange,
  onGoHome,
  storeSettings,
  selectedBranchId,
  onSelectBranch
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);

  const categories: { key: ProductCategory | 'all'; label: string }[] = [
    { key: 'all', label: 'All Hardware' },
    { key: 'cpu', label: 'Processors (CPU)' },
    { key: 'gpu', label: 'Graphics Cards' },
    { key: 'motherboard', label: 'Motherboards' },
    { key: 'ram', label: 'RAM' },
    { key: 'storage', label: 'SSD & Storage' },
    { key: 'psu', label: 'Power Supplies' },
    { key: 'cooler', label: 'CPU Coolers' },
    { key: 'casing', label: 'Casings' },
    { key: 'monitor', label: 'Monitors' }
  ];

  // Dynamic Contact & Location Data (Blank-safe)
  const hotlinePhone = storeSettings?.hotlinePhone?.trim() ?? '01303557185';
  const whatsappNum = storeSettings?.whatsappNumber?.trim() ?? '01303557185';
  const branches = storeSettings?.branches || [];
  const currentBranch = branches.find(b => b.id === selectedBranchId) || branches[0] || (storeSettings?.locationAddress ? {
    id: 'b-primary',
    name: 'DIT Project Road 8 Outlet',
    address: storeSettings.locationAddress,
    phone: hotlinePhone,
    isPrimary: true
  } : null);

  // Official WTCmart WhatsApp Contact URL
  const cleanWhatsappDigits = whatsappNum.replace(/\D/g, '');
  const whatsappUrl = cleanWhatsappDigits
    ? `https://wa.me/${cleanWhatsappDigits.startsWith('88') ? cleanWhatsappDigits : '88' + cleanWhatsappDigits}?text=${encodeURIComponent('Hello WTCmart, I need assistance with a hardware inquiry')}`
    : '#';
  // Messenger URL
  const messengerUrl = 'https://m.me/wtcmart.bangladesh';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* 1. TOP ANNOUNCEMENT & CONTACT BAR */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-[11px] sm:text-xs">
            <span className="inline-flex items-center gap-1.5 text-cyan-400 font-medium">
              <Truck className="w-3.5 h-3.5" />
              Home Delivery: Inside Dhaka ৳60 | Outside ৳150
            </span>

            {/* Dev by Ohi badge */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/80 font-bold text-[10px] tracking-wide">
              Dev by 'Ohi'
            </span>

            {/* Branch / Location Switcher Option (only if location/branch is configured and not blank) */}
            {currentBranch && currentBranch.address && (
              <div className="relative inline-block">
                <button
                  type="button"
                  onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors cursor-pointer border border-slate-700"
                  title="Change Store Branch & Location"
                >
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  <span className="max-w-[140px] truncate">{currentBranch.name}</span>
                  {branches.length > 1 && <ChevronDown className="w-3 h-3 text-slate-400" />}
                </button>

                {branchDropdownOpen && branches.length > 0 && (
                  <div className="absolute left-0 mt-1.5 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-xs text-slate-200">
                    <div className="px-2 py-1.5 border-b border-slate-800 font-bold text-cyan-400 flex items-center justify-between">
                      <span>Select Store Location</span>
                      <span className="text-[10px] text-slate-400 font-normal">{branches.length} Outlets</span>
                    </div>
                    <div className="py-1 space-y-1 max-h-56 overflow-y-auto">
                      {branches.map(b => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => {
                            onSelectBranch?.(b.id);
                            setBranchDropdownOpen(false);
                          }}
                          className={`w-full text-left p-2 rounded-lg transition-colors flex items-start justify-between gap-2 ${
                            b.id === currentBranch.id ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800' : 'hover:bg-slate-800 text-slate-300'
                          }`}
                        >
                          <div>
                            <div className="font-bold flex items-center gap-1">
                              {b.name}
                              {b.isPrimary && <span className="text-[9px] bg-cyan-500 text-slate-950 px-1 rounded font-bold">HQ</span>}
                            </div>
                            <div className="text-[10px] text-slate-400 line-clamp-1">{b.address}</div>
                            {b.phone && <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{b.phone}</div>}
                          </div>
                          {b.id === currentBranch.id && <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-1" />}
                        </button>
                      ))}
                    </div>
                    {hotlinePhone && (
                      <div className="pt-1.5 border-t border-slate-800 text-[10px] text-slate-400 text-center">
                        Call Hotline: <a href={`tel:${hotlinePhone}`} className="text-cyan-400 font-bold hover:underline">{hotlinePhone}</a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 ml-auto text-[11px] sm:text-xs">
            {/* Direct Phone Call - only if phone exists and not blank */}
            {hotlinePhone && (
              <a
                href={`tel:${currentBranch?.phone || hotlinePhone}`}
                className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-medium border border-slate-700"
                title="Call Store Hotline"
              >
                <PhoneCall className="w-3 h-3 text-cyan-400" />
                <span>{currentBranch?.phone || hotlinePhone}</span>
              </a>
            )}

            {/* WhatsApp Direct - only if whatsappNum exists */}
            {cleanWhatsappDigits && (
              <a
                id="header-whatsapp-btn"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-700/60 hover:bg-emerald-600 text-emerald-100 transition-colors font-medium"
                title="Chat with WTCmart on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
                <span>WhatsApp</span>
              </a>
            )}

            {/* Messenger Direct */}
            <a
              id="header-messenger-btn"
              href={messengerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-700/60 hover:bg-blue-600 text-blue-100 transition-colors font-medium"
              title="Message WTCmart on Facebook Messenger"
            >
              <Send className="w-3 h-3 text-blue-300" />
              <span>Messenger</span>
            </a>

            {/* Track Order */}
            <button
              id="header-track-order-btn"
              onClick={onOpenOrderTracking}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Track Order
            </button>

            <span className="text-slate-700">|</span>

            {/* Admin Portal Shortcut */}
            <button
              id="header-admin-portal-btn"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Admin &amp; Sheets</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={onGoHome}
          className="cursor-pointer focus:outline-none flex-shrink-0"
          id="header-logo-btn"
        >
          <Logo size="md" />
        </button>

        {/* Global Search Bar */}
        <div className="hidden sm:flex flex-1 max-w-xl relative">
          <div className="relative w-full">
            <input
              id="header-search-input"
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search processors, RTX graphics cards, motherboards, SSDs..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* PC BUILDER CTA */}
          <button
            id="header-pc-builder-btn"
            onClick={onOpenPCBuilder}
            className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs sm:text-sm font-bold shadow-sm shadow-cyan-600/20 transition-all cursor-pointer"
          >
            <Cpu className="w-4 h-4 animate-pulse text-cyan-200" />
            <span>PC Builder</span>
            <span className="hidden lg:inline-block bg-white/20 text-[10px] px-1.5 py-0.5 rounded font-mono">
              Auto-Check
            </span>
          </button>

          {/* Cart Trigger */}
          <button
            id="header-cart-drawer-btn"
            onClick={onOpenCart}
            className="relative flex items-center gap-2.5 px-3 py-2 border border-slate-200 hover:border-slate-300 rounded-lg text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="View Shopping Cart"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-slate-700" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="hidden md:flex flex-col text-left text-xs leading-tight">
              <span className="text-slate-400 text-[10px]">Cart</span>
              <span className="font-bold text-slate-900">৳{cartTotal.toLocaleString('en-BD')}</span>
            </div>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-md"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="sm:hidden px-4 pb-3">
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search Ryzen, RTX 4070, DDR5, SSD..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-900 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* 3. CATEGORY NAVIGATION BAR */}
      <nav className="bg-slate-100/90 border-t border-slate-200 px-4 py-1.5 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 whitespace-nowrap min-w-max text-xs">
          {categories.map(cat => {
            const active = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                id={`cat-nav-${cat.key}`}
                onClick={() => {
                  onSelectCategory(cat.key);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2">
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => {
                onOpenPCBuilder();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 bg-cyan-50 text-cyan-800 rounded font-medium flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-600" />
                Custom PC Builder
              </span>
              <span className="text-[10px] bg-cyan-200 text-cyan-900 px-1.5 py-0.5 rounded">Auto-Check</span>
            </button>
            <button
              onClick={() => {
                onOpenOrderTracking();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 hover:bg-slate-100 rounded text-slate-800 text-xs font-medium flex items-center gap-2"
            >
              <Truck className="w-4 h-4 text-slate-500" />
              Track Existing Order
            </button>
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 hover:bg-slate-100 rounded text-amber-700 text-xs font-semibold flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-amber-600" />
              Admin Portal &amp; Sheet Automation
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
