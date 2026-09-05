/**
 * WTCmart AI Hardware Assistant Chatbot
 * Rate-limited chatbot preventing abuse with remaining question counters and WhatsApp handoff
 */

import { useState } from 'react';
import {
  MessageSquare,
  Send,
  X,
  Bot,
  User,
  ShieldAlert,
  Sparkles,
  MessageCircle,
  Clock
} from 'lucide-react';
import { sendChatMessage } from '../lib/api';

interface AIChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export function AIChatbotModal({ isOpen, onClose }: AIChatbotModalProps) {
  if (!isOpen) return null;

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Hello! I am WTCmart Hardware Assistant. Ask me about computer parts, PC builder compatibility, bKash payment, or home delivery.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [remainingQuota, setRemainingQuota] = useState<number>(5);
  const [rateLimitNotice, setRateLimitNotice] = useState<string | null>(null);

  const quickPrompts = [
    'How do I pay with bKash?',
    'Which motherboard for Ryzen 7 7800X3D?',
    'What are the delivery charges for Dhaka?',
    'Is RTX 4070 Super in stock?'
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      sender: 'user',
      text: query.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(query);
      setRemainingQuota(response.remainingQuota);
      setRateLimitNotice(response.rateLimitNotice);

      const botMsg: Message = {
        sender: 'bot',
        text: response.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        sender: 'bot',
        text: err.message || 'Rate limit reached or server busy. Please contact support on WhatsApp.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[520px]">
      {/* Header */}
      <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-black tracking-tight">WTCmart AI Assistant</h4>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-cyan-300">
              Anti-Abuse Protected ({remainingQuota}/5 questions left)
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded-md cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quota Banner */}
      <div className="bg-cyan-50 px-3 py-1.5 border-b border-cyan-100 flex items-center justify-between text-[11px] text-cyan-900">
        <span className="flex items-center gap-1 font-medium">
          <Clock className="w-3 h-3 text-cyan-600" />
          5 queries / 10 min window
        </span>
        <span className="font-bold text-cyan-700">{remainingQuota} remaining</span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'bot' && (
              <div className="w-6 h-6 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-xl p-2.5 leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-br-none'
                  : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-bl-none'
              }`}
            >
              <p>{m.text}</p>
              <span className="text-[9px] text-slate-400 block mt-1 text-right">{m.time}</span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <div className="w-6 h-6 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center animate-pulse">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <span>WTCmart AI is typing...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            disabled={isLoading || remainingQuota <= 0}
            className="px-2 py-1 bg-slate-100 hover:bg-cyan-50 hover:text-cyan-700 text-slate-600 rounded-md text-[10px] font-medium whitespace-nowrap cursor-pointer transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form & Human Support Handoff */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            disabled={isLoading || remainingQuota <= 0}
            placeholder={
              remainingQuota <= 0
                ? 'Rate limit reached. Chat on WhatsApp!'
                : 'Ask about hardware, bKash, delivery...'
            }
            maxLength={400}
            className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:bg-slate-100"
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim() || remainingQuota <= 0}
            className="p-2 bg-slate-900 hover:bg-cyan-600 text-white rounded-lg disabled:opacity-40 cursor-pointer transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* WhatsApp & Messenger Live Agent Fallback */}
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
          <span>Need custom quotation?</span>
          <a
            href="https://wa.me/8801700982627?text=Hello%20WTCmart%20support%2C%20I%20need%20assistance%20from%20a%20sales%20representative."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-emerald-600 font-bold hover:underline"
          >
            <MessageCircle className="w-3 h-3" />
            <span>Chat with Human</span>
          </a>
        </div>
      </div>
    </div>
  );
}
