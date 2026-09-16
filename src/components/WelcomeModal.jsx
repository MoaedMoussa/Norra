import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Check, Globe } from 'lucide-react';
import { usePreferences } from '../hooks/usePreferences';

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { followedTeams, followedLeagues, language, setLanguage } = usePreferences();

  useEffect(() => {
    const hasCompletedSetup = localStorage.getItem('norra_setup_complete');
    if (!hasCompletedSetup) {
      setIsOpen(true);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem('norra_setup_complete', 'true');
    setIsOpen(false);
    navigate('/preferences');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-sports-surface border border-sports-border rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
        
        {/* Accent Top */}
        <div className="absolute top-0 left-0 w-full h-1 bg-sports-primary"></div>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-sports-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-sports-primary/20">
            <span className="font-bold italic text-3xl text-sports-primary">N</span>
          </div>
          <h2 className="text-2xl font-bold text-sports-text mb-2">Welcome to NorraScores</h2>
          <p className="text-sports-textMuted text-sm">Let's set up your personalized football experience.</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-sports-text mb-2 flex items-center gap-2">
              <Globe size={16} className="text-sports-primary" /> Select Language
            </label>
            <select 
              value={language || 'en'}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-sports-surfaceHover border border-sports-border rounded-lg p-3 text-sports-text focus:border-sports-primary focus:outline-none transition-colors"
            >
              <option value="en">English</option>
              <option value="ar">العربية (Arabic)</option>
              <option value="es">Español (Spanish)</option>
              <option value="fr">Français (French)</option>
              <option value="de">Deutsch (German)</option>
            </select>
          </div>

          <button 
            onClick={handleComplete}
            className="w-full bg-sports-primary hover:bg-[#e65a00] text-sports-text font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Settings size={18} /> Configure Favorite Teams & Leagues
          </button>
        </div>

      </div>
    </div>
  );
}
