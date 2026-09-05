/**
 * WTCmart Floating Support & Channel Dock
 * Provides floating instant shortcuts for WhatsApp, Messenger, and the AI Hardware Chatbot
 */

import { useState } from 'react';
import { MessageCircle, Send, Bot, ChevronUp } from 'lucide-react';
import { StoreSettings } from '../types';

interface FloatingSupportWidgetProps {
  onOpenChatbot: () => void;
  storeSettings?: StoreSettings;
}

export function FloatingSupportWidget({ onOpenChatbot, storeSettings }: FloatingSupportWidgetProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const whatsappNum = storeSettings?.whatsappNumber?.trim() ?? '01303557185';
  const hotline = storeSettings?.hotlinePhone?.trim() ?? '01303557185';
  const cleanWhatsappDigits = whatsappNum.replace(/\D/g, '');
  const whatsappUrl = cleanWhatsappDigits
    ? `https://wa.me/${cleanWhatsappDigits.startsWith('88') ? cleanWhatsappDigits : '88' + cleanWhatsappDigits}?text=${encodeURIComponent('Hello WTCmart, I have an inquiry regarding computer hardware.')}`
    : '#';
  const messengerUrl = 'https://m.me/wtcmart.bangladesh';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-5 left-5 z-40 flex flex-col items-start gap-2.5">
      {/* WhatsApp Floating CTA (only rendered if WhatsApp number exists) */}
      {cleanWhatsappDigits && (
        <a
          id="floating-whatsapp-btn"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-12 h-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-600/30 transition-transform transform hover:scale-110"
          aria-label="Chat with WTCmart on WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute left-14 bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
            WhatsApp Hotline {hotline ? `(${hotline})` : ''}
          </span>
        </a>
      )}

      {/* Messenger Floating CTA */}
      <a
        id="floating-messenger-btn"
        href={messengerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-600/30 transition-transform transform hover:scale-110"
        aria-label="Chat with WTCmart on Facebook Messenger"
      >
        <Send className="w-5 h-5 -ml-0.5" />
        <span className="absolute left-14 bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
          Messenger Chat
        </span>
      </a>

      {/* AI Hardware Assistant Chatbot CTA */}
      <button
        id="floating-ai-chatbot-btn"
        onClick={onOpenChatbot}
        className="group relative flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-full shadow-lg shadow-cyan-600/30 transition-transform transform hover:scale-110 cursor-pointer"
        aria-label="Open WTCmart AI Chatbot"
      >
        <Bot className="w-6 h-6 animate-pulse" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
        <span className="absolute left-14 bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
          Ask AI Assistant (Hardware &amp; Compatibility)
        </span>
      </button>
    </div>
  );
}
