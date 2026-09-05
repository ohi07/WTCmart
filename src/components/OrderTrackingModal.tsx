/**
 * WTCmart Order Tracking Modal
 * Allows customers to track live courier shipping status across Bangladesh
 */

import { useState, FormEvent } from 'react';
import { Search, X, Package, Truck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Order } from '../types';
import { trackOrder } from '../lib/api';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OrderTrackingModal({ isOpen, onClose }: OrderTrackingModalProps) {
  if (!isOpen) return null;

  const [orderQuery, setOrderQuery] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setOrder(null);

    try {
      const data = await trackOrder(orderQuery.trim());
      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Order not found. Please verify your order number (e.g. WTC-104921).');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-cyan-400" />
            <h3 className="font-extrabold text-base">Track Delivery Status</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleTrack} className="p-5 border-b border-slate-100 flex gap-2">
          <input
            type="text"
            value={orderQuery}
            onChange={e => setOrderQuery(e.target.value)}
            placeholder="Enter Order # (e.g. WTC-104921)"
            className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading || !orderQuery.trim()}
            className="px-4 py-2 bg-slate-900 hover:bg-cyan-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-40"
          >
            {isLoading ? 'Checking...' : 'Track'}
          </button>
        </form>

        {/* Result Area */}
        <div className="p-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {order ? (
            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 text-[10px] block">Order Number</span>
                  <span className="font-bold text-slate-900 font-mono text-sm">{order.orderNumber}</span>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                  {order.orderStatus}
                </span>
              </div>

              {/* Progress Milestones */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block">Order Placed &amp; Stock Reserved</strong>
                    <span className="text-[10px] text-slate-400">{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-600 text-white flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block">Packaging &amp; QC Verification</strong>
                    <span className="text-[10px] text-slate-500">WTCmart Multiplan Logistics Hub</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-700 block">Courier In-Transit</strong>
                    <span className="text-[10px] text-cyan-700 font-medium">
                      Assigned to {order.courierName} (Tracking: {order.courierTrackingNumber})
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Recipient:</span>
                  <span className="font-semibold text-slate-900">{order.customer.fullName} ({order.customer.phone})</span>
                </div>
                <div className="flex justify-between">
                  <span>Destination:</span>
                  <span className="font-semibold text-slate-900">{order.customer.address}, {order.customer.city}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Payable:</span>
                  <span className="font-extrabold text-cyan-700 text-sm">৳{order.total.toLocaleString('en-BD')}</span>
                </div>
              </div>
            </div>
          ) : !error && (
            <div className="text-center py-8 text-slate-400 text-xs">
              Enter your WTCmart Order ID to view real-time shipping milestones and courier partner dispatch.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
