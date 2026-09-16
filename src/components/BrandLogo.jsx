import React from 'react';

export default function BrandLogo({ size = 'md', className = '', variant = 'default', showBadge = true }) {
  // Size presets
  const sizeMap = {
    sm: { icon: 24, text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 32, text: 'text-lg', sub: 'text-[10px]' },
    lg: { icon: 42, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 54, text: 'text-3xl', sub: 'text-sm' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Precision Geometric Monogram */}
      <div
        className="relative flex items-center justify-center rounded-2xl shadow-xs transition-transform duration-300 group-hover:scale-105"
        style={{ width: currentSize.icon, height: currentSize.icon }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Background Squircle */}
          <rect width="100" height="100" rx="26" fill={variant === 'dark' ? '#18181B' : '#1C1917'} />

          {/* Left Pillar Geometric Gradient */}
          <path
            d="M26 74V26L45 48V74H26Z"
            fill="url(#norra-grad-1)"
          />

          {/* Dynamic Diagonal Ribbon */}
          <path
            d="M45 48L74 26V44L56 74H37L45 48Z"
            fill="url(#norra-grad-2)"
          />

          {/* Right Pillar */}
          <path
            d="M55 26H74V74L55 52V26Z"
            fill="url(#norra-grad-3)"
            opacity="0.92"
          />

          {/* Center Neural Core Focus Node */}
          <circle cx="50" cy="50" r="4.5" fill="#FFFFFF" />

          {/* Gradients */}
          <defs>
            <linearGradient id="norra-grad-1" x1="26" y1="26" x2="45" y2="74" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B" />
              <stop offset="1" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="norra-grad-2" x1="37" y1="26" x2="74" y2="74" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDE68A" />
              <stop offset="0.5" stopColor="#F59E0B" />
              <stop offset="1" stopColor="#B45309" />
            </linearGradient>
            <linearGradient id="norra-grad-3" x1="55" y1="26" x2="74" y2="74" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#E5E7EB" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Typographic Wordmark */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-2">
          <span
            className={`font-extrabold tracking-tight font-display ${
              variant === 'white' ? 'text-sports-text' : 'text-stone-900'
            } ${currentSize.text}`}
          >
            Norra
          </span>
          {showBadge && (
            <span
              className={`font-mono font-semibold px-2 py-0.5 rounded-md border tracking-wider uppercase ${currentSize.sub} ${
                variant === 'white'
                  ? 'bg-white/10 text-stone-200 border-white/15'
                  : 'bg-stone-100 text-stone-700 border-stone-300/80'
              }`}
            >
              Studio
            </span>
          )}
        </div>
        <span
          className={`text-[10px] tracking-wider uppercase font-mono mt-0.5 ${
            variant === 'white' ? 'text-stone-400' : 'text-stone-500'
          }`}
        >
          Conversational RAG
        </span>
      </div>
    </div>
  );
}
