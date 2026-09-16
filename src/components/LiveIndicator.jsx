import React, { useState, useEffect } from 'react';

export default function LiveIndicator({ clockSeconds, displayClock, minute }) {
  const [seconds, setSeconds] = useState(clockSeconds || 0);

  useEffect(() => {
    setSeconds(clockSeconds || 0);
  }, [clockSeconds]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
  
  // Stoppage time handling (e.g. 45'+2' or 90'+6')
  const isStoppage = displayClock?.includes('+');
  
  // Determine what to show. If we have a valid seconds count, tick it up. 
  // Else, just show the minute with a single quote.
  let displayText = '';
  if (isStoppage) {
    displayText = displayClock;
  } else if (seconds > 0) {
    displayText = `${mins}:${formattedSeconds}`;
  } else if (minute) {
    displayText = `${minute}'`;
  } else {
    displayText = 'LIVE';
  }

  return (
    <div className="flex items-center gap-1.5 text-sports-live font-bold bg-sports-live/10 px-2 py-1 rounded-md border border-sports-live/20">
      <span className="w-1.5 h-1.5 bg-sports-live rounded-full animate-pulse-fast shadow-[0_0_8px_rgba(255,107,0,0.8)]"></span>
      <span className="tabular-nums tracking-tight text-[11px] leading-none">{displayText}</span>
    </div>
  );
}
