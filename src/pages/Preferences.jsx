import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, BellRing, Trophy, Search, ShieldCheck, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePreferences } from '../hooks/usePreferences';
import { LEAGUES } from '../data/sportsMock';

// Define some top teams for quick selection
const POPULAR_TEAMS = [
  "Arsenal", "Aston Villa", "Bournemouth", "Brentford", "Brighton", "Chelsea", "Crystal Palace",
  "Everton", "Fulham", "Ipswich Town", "Leicester City", "Liverpool", "Manchester City", 
  "Manchester United", "Newcastle", "Nottm Forest", "Southampton", "Spurs", "West Ham", "Wolves",
  "Real Madrid", "Barcelona", "Atletico Madrid",
  "Juventus", "AC Milan", "Inter", "Napoli", "Roma",
  "Bayern Munich", "B. Dortmund"
];

export default function Preferences() {
  const navigate = useNavigate();
  const { followedTeams, followedLeagues, notificationSound, setNotificationSound, toggleTeam, toggleLeague } = usePreferences();
  const [teamSearch, setTeamSearch] = useState('');

  const filteredTeams = POPULAR_TEAMS.filter(t => t.toLowerCase().includes(teamSearch.toLowerCase()));

  return (
    <>
      <Helmet>
        <title>Notifications & Preferences | Norra Scores</title>
      </Helmet>
      
            <main className="max-w-4xl w-full mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 bg-sports-surfaceHover rounded-full hover:bg-sports-border text-sports-text transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-3xl font-black text-sports-text">Preferences</h1>
        </div>
        {/* Header */}
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs text-sports-textMuted hover:text-sports-text transition-colors mb-4">
            <ChevronLeft size={16} /> Back
          </button>
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-sports-surfaceHover rounded-xl flex items-center justify-center border border-sports-border shrink-0">
              <BellRing size={24} className="text-sports-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-sports-text tracking-tight">Push Notifications</h1>
              <p className="text-sm text-sports-textMuted mt-1">Select the leagues and teams you want to follow. You'll receive real-time alerts for goals, red cards, and match kickoffs.</p>
            </div>
          </div>
        </div>

        {/* Notification Sound Section */}
        <section className="bg-sports-surface rounded-2xl border border-sports-border p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Volume2 size={20} className="text-sports-primary" />
            <h2 className="text-lg font-bold text-sports-text">Notification Sound</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'default', label: 'Default Ping', icon: <Volume2 size={16} /> },
              { id: 'whistle', label: 'Whistle', icon: <Volume2 size={16} /> },
              { id: 'cheer', label: 'Crowd Cheer', icon: <Volume2 size={16} /> },
              { id: 'mute', label: 'Mute', icon: <VolumeX size={16} /> }
            ].map(sound => (
              <button
                key={sound.id}
                onClick={() => {
                  setNotificationSound(sound.id);
                  if (sound.id !== 'mute') {
                    // Play preview
                    try {
                      let url = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';
                      if (sound.id === 'whistle') url = 'https://actions.google.com/sounds/v1/sports/referee_whistle.ogg';
                      if (sound.id === 'cheer') url = 'https://actions.google.com/sounds/v1/crowds/crowd_cheer.ogg';
                      const audio = new Audio(url);
                      audio.play().catch(e => console.log('Audio preview failed:', e));
                    } catch(e) {}
                  }
                }}
                className={`p-3 rounded-xl border text-center transition-all duration-200 active:scale-95 flex flex-col items-center justify-center gap-2 ${
                  notificationSound === sound.id
                    ? 'bg-sports-primary/10 border-sports-primary text-sports-text shadow-[0_0_10px_rgba(255,107,0,0.1)]'
                    : 'bg-sports-surfaceHover border-sports-border text-sports-textMuted hover:border-sports-border hover:text-sports-text'
                }`}
              >
                <div className={`p-2 rounded-full ${notificationSound === sound.id ? 'bg-sports-primary text-white' : 'bg-sports-surface text-sports-textMuted'}`}>
                  {sound.icon}
                </div>
                <span className="text-[13px] font-bold leading-tight">{sound.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Leagues Section */}
        <section className="bg-sports-surface rounded-2xl border border-sports-border p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Trophy size={20} className="text-sports-primary" />
            <h2 className="text-lg font-bold text-sports-text">Follow Leagues</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.values(LEAGUES).map(league => {
              const isFollowed = followedLeagues.has(league.id);
              return (
                <button
                  key={league.id}
                  onClick={() => toggleLeague(league.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 active:scale-[0.98] ${
                    isFollowed 
                      ? 'bg-sports-primary/10 border-sports-primary text-sports-text shadow-[0_0_15px_rgba(255,107,0,0.15)]' 
                      : 'bg-sports-bg border-sports-border text-sports-textMuted hover:border-sports-border hover:bg-sports-surfaceHover'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    {league.logo ? <img src={league.logo} alt={league.name} className="w-8 h-8 object-contain drop-shadow-md" referrerPolicy="no-referrer" /> : <span className="text-2xl">{league.icon}</span>}
                  </div>
                  <div className="flex flex-col text-left flex-1">
                    <span className="font-bold text-[15px]">{league.name}</span>
                    <span className="text-[11px] text-sports-textMuted uppercase tracking-wider">{league.region}</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    isFollowed ? 'bg-sports-primary border-sports-primary text-sports-text' : 'border-[#555] bg-transparent'
                  }`}>
                    {isFollowed && <ShieldCheck size={12} />}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Teams Section */}
        <section className="bg-sports-surface rounded-2xl border border-sports-border p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-sports-primary" />
              <h2 className="text-lg font-bold text-sports-text">Follow Teams</h2>
            </div>
            
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={14} className="text-sports-textMuted" />
              </div>
              <input
                type="text"
                placeholder="Search teams..."
                value={teamSearch}
                onChange={(e) => setTeamSearch(e.target.value)}
                className="block w-full pl-9 pr-3 py-2 border border-sports-border rounded-lg bg-sports-surfaceHover text-sports-text placeholder-sports-textMuted focus:outline-none focus:border-sports-primary focus:ring-1 focus:ring-sports-primary text-sm transition-all"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent">
            {filteredTeams.map(team => {
              const isFollowed = followedTeams.has(team);
              return (
                <button
                  key={team}
                  onClick={() => toggleTeam(team)}
                  className={`p-3 rounded-xl border text-center transition-all duration-200 active:scale-95 flex flex-col items-center justify-center gap-2 ${
                    isFollowed
                      ? 'bg-sports-primary/10 border-sports-primary text-sports-text shadow-[0_0_10px_rgba(255,107,0,0.1)]'
                      : 'bg-sports-surfaceHover border-sports-border text-sports-textMuted hover:border-sports-border hover:text-sports-text'
                  }`}
                >
                  <span className="text-[13px] font-bold leading-tight line-clamp-2">{team}</span>
                </button>
              );
            })}
            {filteredTeams.length === 0 && (
              <div className="col-span-full py-8 text-center text-sports-textMuted text-sm">
                No teams found matching "{teamSearch}"
              </div>
            )}
          </div>
        </section>

        {/* Save & Confirm Button */}
        <div className="sticky bottom-4 mt-8 flex justify-end bg-sports-surface/90 backdrop-blur-sm p-4 rounded-xl border border-sports-border z-50">
          <button 
            onClick={() => {
              if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission().then(() => {
                  navigate('/');
                });
              } else {
                navigate('/');
              }
            }} 
            className="bg-sports-primary hover:bg-[#e65a00] text-sports-text font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_15px_rgba(255,107,0,0.3)]"
          >
            Confirm Preferences
          </button>
        </div>
      </main>
    </>
  );
}
