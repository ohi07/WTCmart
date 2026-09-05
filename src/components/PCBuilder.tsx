/**
 * WTCmart Interactive PC Builder Component
 * Features real-time compatibility checking, power draw estimator, component picker, and direct cart export
 */

import { useState } from 'react';
import {
  Cpu,
  Layers,
  HardDrive,
  Zap,
  Fan,
  Box,
  Monitor,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  Trash2,
  ShoppingCart,
  Share2,
  Printer,
  MessageCircle,
  X
} from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { evaluatePCBuildCompatibility } from '../lib/compatibility';

interface PCBuilderProps {
  products: Product[];
  onAddAllToCart: (products: Product[]) => void;
  onClose?: () => void;
}

interface ComponentSlot {
  key: ProductCategory;
  title: string;
  description: string;
  icon: any;
  required: boolean;
}

const BUILD_SLOTS: ComponentSlot[] = [
  { key: 'cpu', title: 'Processor (CPU)', description: 'Intel Core or AMD Ryzen CPU', icon: Cpu, required: true },
  { key: 'motherboard', title: 'Motherboard', description: 'Compatible motherboard socket & chipset', icon: Layers, required: true },
  { key: 'ram', title: 'Memory (RAM)', description: 'DDR4 or DDR5 system memory', icon: Layers, required: true },
  { key: 'gpu', title: 'Graphics Card (GPU)', description: 'NVIDIA GeForce or AMD Radeon GPU', icon: Zap, required: false },
  { key: 'storage', title: 'Storage (SSD / M.2)', description: 'PCIe NVMe Solid State Drive', icon: HardDrive, required: true },
  { key: 'psu', title: 'Power Supply (PSU)', description: '80+ Certified Power Supply', icon: Zap, required: true },
  { key: 'cooler', title: 'CPU Cooler', description: 'Air tower or Liquid AIO cooler', icon: Fan, required: false },
  { key: 'casing', title: 'Computer Case', description: 'Airflow chassis with clearance', icon: Box, required: true },
  { key: 'monitor', title: 'Monitor / Display', description: 'High-refresh gaming or professional display', icon: Monitor, required: false }
];

export function PCBuilder({ products, onAddAllToCart, onClose }: PCBuilderProps) {
  const [selectedComponents, setSelectedComponents] = useState<Record<string, Product | undefined>>({});
  const [activeSlotModal, setActiveSlotModal] = useState<ComponentSlot | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Evaluate compatibility on each change
  const compatibility = evaluatePCBuildCompatibility(selectedComponents);

  const handleSelectProduct = (slotKey: string, product: Product) => {
    setSelectedComponents(prev => ({
      ...prev,
      [slotKey]: product
    }));
    setActiveSlotModal(null);
  };

  const handleRemoveProduct = (slotKey: string) => {
    setSelectedComponents(prev => ({
      ...prev,
      [slotKey]: undefined
    }));
  };

  const handleAddAll = () => {
    const validProducts = Object.values(selectedComponents).filter((p): p is Product => p !== undefined);
    if (validProducts.length > 0) {
      onAddAllToCart(validProducts);
    }
  };

  const handleShareBuild = () => {
    const summary = Object.entries(selectedComponents)
      .filter((entry): entry is [string, Product] => entry[1] !== undefined)
      .map(([slot, p]) => `${slot.toUpperCase()}: ${p.name} (৳${p.salePrice})`)
      .join('\n');

    const shareText = `WTCmart Custom PC Build:\nTotal: ৳${compatibility.totalPrice.toLocaleString('en-BD')}\nPower: ${compatibility.totalWattage}W\n\n${summary}`;

    navigator.clipboard.writeText(shareText);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  // WhatsApp consultation link with current build summary
  const buildItemsSummary = Object.entries(selectedComponents)
    .filter((entry): entry is [string, Product] => entry[1] !== undefined)
    .map(([_, p]) => `${p.name} (৳${p.salePrice})`)
    .join(', ');

  const whatsappBuildUrl = `https://wa.me/8801700982627?text=${encodeURIComponent(
    `Hello WTCmart team, I configured a custom PC build (Total: ৳${compatibility.totalPrice.toLocaleString('en-BD')}). Components: ${buildItemsSummary || 'None selected yet'}. Can you confirm availability?`
  )}`;

  const selectedCount = Object.values(selectedComponents).filter(Boolean).length;

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Top Header Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded bg-cyan-100 text-cyan-800 text-xs font-bold uppercase tracking-wider">
                  WTCmart Engine v2.4
                </span>
                <span className="text-xs text-slate-500">Live Hardware Compatibility Matrix</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Custom PC Builder
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Select your components. Our intelligent engine automatically checks socket matches, RAM standards, physical case clearance, and PSU wattage headroom.
              </p>
            </div>

            {/* Total Price & Add to Cart Quick Card */}
            <div className="flex flex-wrap items-center gap-4 bg-slate-900 text-white p-4 rounded-xl">
              <div>
                <span className="text-[11px] text-slate-400 block uppercase tracking-wider">Estimated Total</span>
                <span className="text-2xl font-black text-cyan-400">
                  ৳{compatibility.totalPrice.toLocaleString('en-BD')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="pc-builder-add-all-btn"
                  onClick={handleAddAll}
                  disabled={selectedCount === 0}
                  className={`px-4 py-2 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                    selectedCount > 0
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add All ({selectedCount}) to Cart</span>
                </button>
              </div>
            </div>
          </div>

          {/* Real-Time Compatibility & Wattage Bar */}
          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              {compatibility.isCompatible ? (
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Components are 100% Compatible</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>{compatibility.issues.length} Incompatibility Detected</span>
                </div>
              )}
            </div>

            {/* Wattage Meter */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-slate-600 font-medium">Estimated Draw:</span>
                <span className="font-bold text-slate-900">{compatibility.totalWattage}W</span>
              </div>
              <div className="text-slate-500">
                Rec. PSU: <strong className="text-cyan-700">{compatibility.recommendedPsuWattage}W+</strong>
              </div>
            </div>

            {/* Sharing & WhatsApp Actions */}
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={handleShareBuild}
                className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Copy build specification to clipboard"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>{copiedNotification ? 'Copied to Clipboard!' : 'Share Build'}</span>
              </button>

              <a
                href={whatsappBuildUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Send build to WTCmart Hardware Engineers on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 text-white" />
                <span>WhatsApp Quote</span>
              </a>
            </div>
          </div>

          {/* Compatibility Alert Banners */}
          {compatibility.issues.length > 0 && (
            <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-rose-900">
                <XCircle className="w-4 h-4 text-rose-600" />
                Hardware Compatibility Conflicts (Must resolve before assembly):
              </div>
              {compatibility.issues.map((issue, idx) => (
                <div key={idx} className="ml-5 list-disc list-item text-rose-700">
                  {issue}
                </div>
              ))}
            </div>
          )}

          {compatibility.warnings.length > 0 && (
            <div className="mt-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Physical Clearance &amp; Fit Recommendations:
              </div>
              {compatibility.warnings.map((warn, idx) => (
                <div key={idx} className="ml-5 list-disc list-item text-amber-700">
                  {warn}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Component Slots List */}
        <div className="space-y-3">
          {BUILD_SLOTS.map(slot => {
            const selectedProduct = selectedComponents[slot.key];
            const Icon = slot.icon;

            return (
              <div
                key={slot.key}
                id={`slot-card-${slot.key}`}
                className={`bg-white rounded-xl border p-4 transition-all duration-200 ${
                  selectedProduct ? 'border-cyan-400/80 shadow-xs' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Slot Info or Selected Product */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-600 border border-slate-200">
                      {selectedProduct ? (
                        <img
                          src={selectedProduct.image}
                          alt={selectedProduct.name}
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <Icon className="w-6 h-6 text-slate-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          {slot.title}
                        </span>
                        {slot.required && !selectedProduct && (
                          <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.2 rounded">
                            Required
                          </span>
                        )}
                      </div>

                      {selectedProduct ? (
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                            {selectedProduct.name}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[10px]">
                              SKU: {selectedProduct.sku}
                            </span>
                            <span>{selectedProduct.warranty}</span>
                            {selectedProduct.specifications.socket && (
                              <span className="text-cyan-700 font-semibold">
                                Socket: {selectedProduct.specifications.socket}
                              </span>
                            )}
                            {selectedProduct.specifications.ramType && (
                              <span className="text-indigo-700 font-semibold">
                                {selectedProduct.specifications.ramType}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 mt-0.5">{slot.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Right: Price & Slot Controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                    {selectedProduct ? (
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-base font-black text-slate-900 block">
                            ৳{selectedProduct.salePrice.toLocaleString('en-BD')}
                          </span>
                          <span className="text-[10px] text-slate-400">Official Warranty</span>
                        </div>

                        <button
                          onClick={() => handleRemoveProduct(slot.key)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove this component"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveSlotModal(slot)}
                        className="px-4 py-2 bg-slate-100 hover:bg-cyan-600 hover:text-white text-slate-800 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Choose {slot.title.split(' ')[0]}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* COMPONENT SELECTION MODAL */}
      {activeSlotModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Select {activeSlotModal.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Showing in-stock hardware available for delivery
                </p>
              </div>
              <button
                onClick={() => setActiveSlotModal(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filtered Hardware List */}
            <div className="p-4 overflow-y-auto space-y-3 divide-y divide-slate-100">
              {products
                .filter(p => p.category === activeSlotModal.key)
                .map(product => {
                  return (
                    <div
                      key={product.id}
                      className="pt-3 first:pt-0 flex items-center justify-between gap-4 hover:bg-slate-50 p-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-14 h-14 object-contain rounded-lg bg-white border border-slate-100 p-1"
                        />
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase">
                            {product.brand}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 leading-snug">
                            {product.name}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {product.shortDescription}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-right flex-shrink-0">
                        <div>
                          <span className="text-sm font-extrabold text-slate-900 block">
                            ৳{product.salePrice.toLocaleString('en-BD')}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-semibold">
                            {product.stock} in stock
                          </span>
                        </div>

                        <button
                          onClick={() => handleSelectProduct(activeSlotModal.key, product)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-cyan-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  );
                })}

              {products.filter(p => p.category === activeSlotModal.key).length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No products currently available in this category.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
