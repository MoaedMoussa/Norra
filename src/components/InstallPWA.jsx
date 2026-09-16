import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      setIsVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-safe left-0 right-0 p-4 z-[100] animate-in slide-in-from-bottom duration-500 pointer-events-none">
      <div className="max-w-md mx-auto bg-gradient-to-r from-sports-primary to-[#ff8c00] text-white rounded-2xl shadow-2xl p-4 flex items-center gap-4 pointer-events-auto border border-white/20">
        <div className="bg-white/20 p-2 rounded-full shrink-0">
          <Download size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-sm">Add Norra to Home Screen</h3>
          <p className="text-[11px] text-white/90 leading-snug">Get fast loading, offline access, and the full app experience.</p>
        </div>
        <button
          onClick={handleInstallClick}
          className="px-4 py-2 bg-white text-sports-primary font-bold text-xs rounded-xl whitespace-nowrap shadow-sm hover:scale-105 transition-transform"
        >
          Install
        </button>
        <button onClick={handleDismiss} className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
