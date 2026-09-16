import React, { useState } from 'react';
import { MessageSquare, X, Sparkles } from 'lucide-react';
import LiveChatWidget from './LiveChatWidget';

export default function FloatingWidgetSimulation({ chatbot }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!chatbot) return null;

  const themePrimary = chatbot.theme?.primaryColor || '#6366f1';
  const position = chatbot.theme?.position || 'bottom-right';

  return (
    <div
      className={`fixed z-50 ${
        position === 'bottom-left' ? 'left-4 sm:left-6' : 'right-4 sm:right-6'
      } bottom-4 sm:bottom-6 flex flex-col ${
        position === 'bottom-left' ? 'items-start' : 'items-end'
      }`}
    >
      {/* Expanded Chat Dialog */}
      {isOpen && (
        <div className="w-[90vw] sm:w-[380px] md:w-[420px] h-[520px] sm:h-[580px] mb-3 transition-all duration-200 animate-in fade-in slide-in-from-bottom-5">
          <LiveChatWidget chatbot={chatbot} embedded={true} className="h-full shadow-2xl" />
        </div>
      )}

      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full text-sports-text shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none relative group"
        style={{ backgroundColor: themePrimary }}
        aria-label="Toggle AI Support Widget"
      >
        {isOpen ? (
          <X size={26} className="transition-transform duration-200" />
        ) : (
          <>
            <MessageSquare size={26} className="transition-transform duration-200" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
          </>
        )}
      </button>
    </div>
  );
}
