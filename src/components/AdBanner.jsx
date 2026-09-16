import React from 'react';

export default function AdBanner() {
  return (
    <div className="w-full bg-sports-surfaceHover border-t border-sports-border py-4 flex justify-center items-center">
      <div className="text-center">
        <span className="text-[10px] text-sports-textMuted uppercase tracking-widest block mb-1">Advertisement</span>
        {/* Placeholder for real ad network like Google AdSense */}
        <div className="w-[320px] h-[50px] sm:w-[728px] sm:h-[90px] bg-sports-border border border-sports-border flex items-center justify-center rounded overflow-hidden relative">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] mix-blend-overlay"></div>
          <p className="text-sports-textMuted font-medium text-sm z-10">
            Support NorraScores <span className="text-sports-primary">&bull;</span> Place your ad here
          </p>
        </div>
      </div>
    </div>
  );
}
