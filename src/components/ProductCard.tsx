/**
 * WTCmart Product Card Component
 * Optimized for hardware components with warranty tags, stock indicators, and direct WhatsApp inquiry
 */

import { ShoppingCart, Eye, ShieldCheck, Zap, MessageCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onQuickView }: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;

  // Pre-configured WhatsApp message link for this exact product
  const productWhatsappUrl = `https://wa.me/8801700982627?text=${encodeURIComponent(
    `Hello WTCmart, is "${product.name}" (SKU: ${product.sku}, ৳${product.salePrice}) currently available for delivery?`
  )}`;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group bg-white rounded-xl border border-slate-200 hover:border-cyan-400 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden"
    >
      {/* Product Image & Badges */}
      <div className="relative h-48 sm:h-52 bg-slate-50 flex items-center justify-center p-4 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Brand Badge */}
        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-slate-900/90 text-cyan-300 text-[10px] font-bold tracking-wider uppercase rounded">
          {product.brand}
        </span>

        {/* Flash deal or Discount tag */}
        {product.regularPrice > product.salePrice && (
          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-rose-600 text-white text-[10px] font-extrabold rounded shadow-xs">
            SAVE ৳{(product.regularPrice - product.salePrice).toLocaleString('en-BD')}
          </span>
        )}

        {/* Quick View overlay button */}
        <button
          onClick={() => onQuickView(product)}
          className="absolute bottom-2.5 right-2.5 p-2 bg-white/95 hover:bg-white text-slate-700 hover:text-cyan-600 rounded-full shadow-md transition-transform transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 cursor-pointer"
          title="Quick View Specifications"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Content Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Warranty and Stock Line */}
          <div className="flex items-center justify-between text-[11px] mb-1.5 gap-2">
            <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
              {product.warranty}
            </span>

            {isOutOfStock ? (
              <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 font-bold rounded text-[10px]">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 font-bold rounded text-[10px]">
                Only {product.stock} Left!
              </span>
            ) : (
              <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded text-[10px]">
                In Stock ({product.stock})
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="text-sm font-semibold text-slate-900 line-clamp-2 hover:text-cyan-600 cursor-pointer transition-colors leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Short Specs Snippet */}
          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
            {product.shortDescription}
          </p>
        </div>

        {/* Price & Actions Area */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-extrabold text-slate-900">
              ৳{product.salePrice.toLocaleString('en-BD')}
            </span>
            {product.regularPrice > product.salePrice && (
              <span className="text-xs text-slate-400 line-through">
                ৳{product.regularPrice.toLocaleString('en-BD')}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-5 gap-2">
            {/* Add to Cart */}
            <button
              id={`add-to-cart-${product.id}`}
              onClick={() => onAddToCart(product)}
              disabled={isOutOfStock}
              className={`col-span-4 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-cyan-600 text-white shadow-xs'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
            </button>

            {/* Direct WhatsApp Product Inquiry */}
            <a
              href={productWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-1 flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg transition-colors"
              title="Inquire about this product on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
