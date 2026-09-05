/**
 * WTCmart Product Detail / Quick View Modal
 * Displays hardware specifications, warranty policies, and direct checkout shortcuts
 */

import { X, ShoppingCart, ShieldCheck, Zap, MessageCircle, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export function ProductDetailModal({ product, onClose, onAddToCart }: ProductDetailModalProps) {
  if (!product) return null;

  const isOutOfStock = product.stock <= 0;
  const whatsappUrl = `https://wa.me/8801700982627?text=${encodeURIComponent(
    `Hello WTCmart, I'm inquiring about ${product.name} (SKU: ${product.sku}, Price: ৳${product.salePrice}). Is it in stock for immediate dispatch?`
  )}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-900 text-cyan-300 rounded text-[10px] font-bold uppercase tracking-wider">
              {product.brand}
            </span>
            <span className="text-xs text-slate-400 font-mono">SKU: {product.sku}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image */}
          <div className="bg-slate-50 rounded-xl p-6 flex items-center justify-center border border-slate-100">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-64 object-contain mix-blend-multiply"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 text-cyan-700 font-bold text-xs bg-cyan-50 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {product.warranty}
                </span>
                <span className="text-xs text-emerald-600 font-bold">
                  {product.stock > 0 ? `${product.stock} Units In Stock` : 'Out of Stock'}
                </span>
              </div>

              <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                {product.name}
              </h2>

              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-2xl font-black text-slate-900">
                  ৳{product.salePrice.toLocaleString('en-BD')}
                </span>
                {product.regularPrice > product.salePrice && (
                  <span className="text-sm text-slate-400 line-through">
                    ৳{product.regularPrice.toLocaleString('en-BD')}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                {product.description}
              </p>

              {/* Hardware Specifications Table */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Technical Specifications
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-slate-400 uppercase text-[10px] block font-semibold">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="font-bold text-slate-800">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-200 flex items-center gap-3">
              <button
                disabled={isOutOfStock}
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  isOutOfStock
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-900 hover:bg-cyan-600 text-white shadow-md'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{isOutOfStock ? 'Currently Sold Out' : 'Add to Shopping Cart'}</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="Inquire on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
