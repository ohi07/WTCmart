/**
 * WTCmart Global Footer Component
 * Physical store location, courier logistics partners, official payment gateways, and warranty statements
 */

import { ShieldCheck, Truck, PhoneCall, Mail, MapPin, MessageCircle, Send, CheckCircle, Code } from 'lucide-react';
import { Logo } from './Logo';
import { StoreSettings } from '../types';

interface FooterProps {
  storeSettings?: StoreSettings;
}

export function Footer({ storeSettings }: FooterProps) {
  const hotline = storeSettings?.hotlinePhone?.trim() ?? '01303557185';
  const whatsappNum = storeSettings?.whatsappNumber?.trim() ?? '01303557185';
  const address = storeSettings?.locationAddress?.trim() ?? 'DIT Project, road 8';
  const email = storeSettings?.supportEmail?.trim() ?? 'wut2do4u@gmail.com';
  const branches = storeSettings?.branches || [];
  const devCredit = storeSettings?.devCredit || "Dev by 'Ohi'";
  const cleanWhatsappDigits = whatsappNum.replace(/\D/g, '');

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-4">
            <Logo variant="full" size="md" />
            <p className="text-slate-400 text-xs leading-relaxed">
              WTCmart is Bangladesh's premier technology hardware retailer, offering 100% genuine computer components, custom gaming PC builds, and swift home delivery across all 64 districts.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {cleanWhatsappDigits && (
                <a
                  href={`https://wa.me/${cleanWhatsappDigits.startsWith('88') ? cleanWhatsappDigits : '88' + cleanWhatsappDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-emerald-700/40 hover:bg-emerald-600 text-emerald-300 flex items-center justify-center transition-colors"
                  title="WhatsApp Support"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
              <a
                href="https://m.me/wtcmart.bangladesh"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-blue-700/40 hover:bg-blue-600 text-blue-300 flex items-center justify-center transition-colors"
                title="Messenger Chat"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-tight uppercase">
              Retail Hardware
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#cpu" className="hover:text-cyan-400 transition-colors">Processors (Intel &amp; AMD Ryzen)</a></li>
              <li><a href="#gpu" className="hover:text-cyan-400 transition-colors">Graphics Cards (RTX 40 / RX 7000)</a></li>
              <li><a href="#motherboard" className="hover:text-cyan-400 transition-colors">Motherboards (AM5 / LGA1700)</a></li>
              <li><a href="#ram" className="hover:text-cyan-400 transition-colors">DDR5 &amp; DDR4 Gaming Memory</a></li>
              <li><a href="#storage" className="hover:text-cyan-400 transition-colors">PCIe Gen4 / Gen5 NVMe SSDs</a></li>
              <li><a href="#psu" className="hover:text-cyan-400 transition-colors">80+ Gold / Platinum Power Supplies</a></li>
            </ul>
          </div>

          {/* Delivery & Logistics */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-tight uppercase">
              Nationwide Delivery
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Home Delivery Rates:</strong>
                  <span>Inside Dhaka: ৳60 (24-48 Hours)</span>
                  <br />
                  <span>Sub-Dhaka: ৳100 | Outside: ৳150</span>
                </div>
              </div>
              <div className="text-slate-400 pt-1">
                Logistics Partners: <strong>Steadfast Courier, Pathao Courier &amp; RedX Express</strong>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 pt-1 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Transit Insurance Included</span>
              </div>
            </div>
          </div>

          {/* Physical Store & Outlets */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-tight uppercase">
              Store &amp; Outlets
            </h4>
            <ul className="space-y-2.5 text-xs">
              {address && (
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200 block">Flagship Store:</strong>
                    <span>{address}</span>
                  </div>
                </li>
              )}
              {hotline && (
                <li className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Hotline: <a href={`tel:${hotline}`} className="text-slate-200 hover:text-cyan-400 font-bold">{hotline}</a></span>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span><a href={`mailto:${email}`} className="text-slate-200 hover:text-cyan-400">{email}</a></span>
                </li>
              )}
              {branches.length > 0 && (
                <li className="pt-2 border-t border-slate-900">
                  <span className="text-[11px] text-slate-500 font-bold block mb-1">OUTLETS:</span>
                  <div className="space-y-1 text-[11px] text-slate-400">
                    {branches.filter(b => !b.isPrimary).slice(0, 3).map(b => (
                      <div key={b.id} className="flex items-center justify-between">
                        <span>• {b.name}</span>
                        {b.phone && <span className="text-cyan-400 font-mono text-[10px]">{b.phone}</span>}
                      </div>
                    ))}
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Payment Methods Banner */}
        <div className="border-t border-slate-800 pt-6 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            <span className="text-white font-bold block mb-1">Supported Payment Gateways:</span>
            <span>bKash Tokenized Merchant API • Nagad MFS • SSLCommerz (Visa / MasterCard / AMEX / DBBL Nexus) • Cash on Delivery</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded bg-pink-900/60 text-pink-300 font-black text-[11px] border border-pink-700/50">
              bKash
            </span>
            <span className="px-2.5 py-1 rounded bg-amber-900/60 text-amber-300 font-black text-[11px] border border-amber-700/50">
              Nagad
            </span>
            <span className="px-2.5 py-1 rounded bg-blue-900/60 text-blue-300 font-black text-[11px] border border-blue-700/50">
              SSLCommerz
            </span>
            <span className="px-2.5 py-1 rounded bg-emerald-900/60 text-emerald-300 font-bold text-[11px] border border-emerald-700/50">
              Cash on Delivery
            </span>
          </div>
        </div>

        {/* Copyright & Dev Credit */}
        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} WTCmart Bangladesh Ltd. All rights reserved. Registered Computer Hardware Importer &amp; Retailer.
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-medium shadow-xs">
              <Code className="w-3.5 h-3.5 text-cyan-400" />
              <span>{devCredit}</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
