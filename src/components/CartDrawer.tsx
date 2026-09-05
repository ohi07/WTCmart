/**
 * WTCmart Cart Drawer Component
 * Side-panel cart with live price recalculation, quantity steppers, and quick checkout transition
 */

import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product.salePrice || item.product.regularPrice) * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-cyan-600" />
              <h2 className="text-lg font-extrabold text-slate-900">Your Shopping Cart</h2>
              <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">Your cart is empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Explore our computer components catalog or configure a complete custom PC in the PC Builder.
                </p>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.product.id} className="pt-3 first:pt-0 flex gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-contain rounded-lg bg-slate-50 border border-slate-200 p-1 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {item.product.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      SKU: {item.product.sku}
                    </span>
                    <span className="text-xs font-extrabold text-slate-900 mt-1 block">
                      ৳{item.product.salePrice.toLocaleString('en-BD')}
                    </span>

                    {/* Quantity Stepper & Remove */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-200 rounded-md bg-slate-50">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-200 text-slate-600 rounded-l cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-1 hover:bg-slate-200 text-slate-600 rounded-r cursor-pointer disabled:opacity-40"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-800">৳{subtotal.toLocaleString('en-BD')}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Home Delivery</span>
                  <span className="text-emerald-700 font-medium">Calculated at Checkout</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total (BDT)</span>
                  <span className="text-cyan-600">৳{subtotal.toLocaleString('en-BD')}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>bKash, Nagad, SSLCommerz &amp; Cash on Delivery available</span>
              </div>

              <button
                id="cart-checkout-btn"
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3 bg-slate-900 hover:bg-cyan-600 text-white rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
