import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export default function PullToRefresh({ onRefresh, isRefreshing, children }) {
  const [pullHeight, setPullHeight] = useState(0);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isPulling = useRef(false);

  const handleTouchStart = (e) => {
    if (window.scrollY <= 0) {
      startY.current = e.touches[0].clientY;
      isPulling.current = true;
    }
  };

  const handleTouchMove = (e) => {
    if (!isPulling.current) return;
    currentY.current = e.touches[0].clientY;
    const distance = currentY.current - startY.current;

    if (distance > 0 && window.scrollY <= 0) {
      // Add resistance to the pull
      const pull = Math.min(distance * 0.4, 80);
      setPullHeight(pull);
    } else {
      setPullHeight(0);
    }
  };

  const handleTouchEnd = () => {
    if (isPulling.current) {
      if (pullHeight >= 60) {
        onRefresh();
      }
      setPullHeight(0);
      isPulling.current = false;
      startY.current = 0;
      currentY.current = 0;
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full"
    >
      <div 
        className="absolute top-0 left-0 right-0 flex justify-center items-center overflow-hidden transition-all duration-200 ease-out z-10"
        style={{ 
          height: isRefreshing ? '60px' : `${pullHeight}px`,
          opacity: pullHeight > 10 || isRefreshing ? 1 : 0
        }}
      >
        <div className="bg-sports-surface border border-sports-border rounded-full p-2 shadow-lg flex items-center justify-center">
          <RefreshCw 
            size={18}
            className={`text-sports-primary ${isRefreshing ? 'animate-spin' : ''}`} 
            style={{ transform: isRefreshing ? 'none' : `rotate(${pullHeight * 4}deg)` }}
          />
        </div>
      </div>
      <div 
        className="transition-transform duration-200 ease-out w-full"
        style={{ transform: `translateY(${isRefreshing ? 60 : pullHeight}px)` }}
      >
        {children}
      </div>
    </div>
  );
}
