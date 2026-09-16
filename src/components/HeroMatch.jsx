import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PlaySquare, Calendar } from 'lucide-react';
import { LEAGUES } from '../data/sportsMock';

export default function HeroMatch({ match }) {
  const prevScoreRef = useRef(match?.homeScore + match?.awayScore);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    if (!match) return;
    const currentScore = match.homeScore + match.awayScore;
    if (match.state === 'in' && prevScoreRef.current !== currentScore) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 2000);
      prevScoreRef.current = currentScore;
      return () => clearTimeout(timer);
    }
  }, [match?.homeScore, match?.awayScore, match?.state]);

  const navigate = useNavigate();
  if (!match) return null;

  const leagueConfig = LEAGUES.find(l => l.id === match.leagueId) || {};
  const isLive = match.status === 'LIVE';

  return (
    <motion.div 
      onClick={() => navigate(`/match/${match.id}`)}
      animate={isPulsing ? { scale: [1, 1.02, 1], boxShadow: ['0 0 0 rgba(255,107,0,0)', '0 0 30px rgba(255,107,0,0.5)', '0 0 0 rgba(255,107,0,0)'] } : {}} transition={{ duration: 1.5 }}
      className="relative w-full rounded-2xl overflow-hidden cursor-pointer group shadow-2xl border border-sports-border mb-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(255,107,0,0.15)]"
    >
      {/* Background with team colors or generic dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-sports-surfaceHover via-sports-surface to-sports-bg opacity-100 z-0"></div>
      
      {/* subtle patterned overlay or glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-sports-primary/10 via-transparent to-transparent z-0 opacity-50"></div>

      <div className="relative z-10 p-5 sm:p-8 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 bg-sports-bg/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-sports-border shadow-sm">
            {leagueConfig.logo && <img src={leagueConfig.logo} alt={match.leagueName} className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />}
            <span className="text-xs font-bold text-sports-text tracking-widest uppercase">{match.leagueName || 'Featured Match'}</span>
          </div>
          
          {isLive ? (
            <div className="flex items-center gap-1.5 bg-sports-primary text-white px-3 py-1 rounded-full animate-pulse shadow-[0_0_15px_rgba(255,107,0,0.5)]">
              <PlaySquare size={14} className="fill-white" />
              <span className="text-[11px] font-bold tracking-widest uppercase">{match.minute}' Live</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-sports-surfaceHover text-sports-textMuted px-3 py-1 rounded-full border border-sports-border">
              <Calendar size={14} />
              <span className="text-[11px] font-bold tracking-widest uppercase">
                {match.startDate ? new Date(match.startDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : 'Upcoming'}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto">
          {/* Home Team */}
          <div className="flex flex-col items-center flex-1 gap-3">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-sports-surfaceHover/50 rounded-full flex items-center justify-center border border-sports-border shadow-lg p-2 sm:p-4 group-hover:scale-105 transition-transform duration-500">
              {match.homeLogo ? <img src={match.homeLogo} alt={match.homeTeam} className="w-full h-full object-contain drop-shadow-xl" referrerPolicy="no-referrer" /> : <span className="text-2xl font-bold text-sports-text">{match.homeTeam.substring(0, 1)}</span>}
            </div>
            <span className="font-bold text-sm sm:text-lg text-sports-text text-center line-clamp-1">{match.homeTeam}</span>
          </div>

          {/* Score / Time */}
          <div className="flex flex-col items-center justify-center px-4 sm:px-8">
            {match.state !== 'pre' ? (
              <div className="flex items-center gap-3 sm:gap-6">
                <span className={`text-4xl sm:text-6xl font-black tabular-nums tracking-tighter ${match.homeScore > match.awayScore ? 'text-sports-text' : 'text-sports-textMuted'}`}>{match.homeScore}</span>
                <span className="text-xl sm:text-2xl font-black text-sports-border">-</span>
                <span className={`text-4xl sm:text-6xl font-black tabular-nums tracking-tighter ${match.awayScore > match.homeScore ? 'text-sports-text' : 'text-sports-textMuted'}`}>{match.awayScore}</span>
              </div>
            ) : (
              <div className="text-2xl sm:text-4xl font-black text-sports-text tracking-tighter">
                {match.startDate ? new Date(match.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'VS'}
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center flex-1 gap-3">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-sports-surfaceHover/50 rounded-full flex items-center justify-center border border-sports-border shadow-lg p-2 sm:p-4 group-hover:scale-105 transition-transform duration-500">
              {match.awayLogo ? <img src={match.awayLogo} alt={match.awayTeam} className="w-full h-full object-contain drop-shadow-xl" referrerPolicy="no-referrer" /> : <span className="text-2xl font-bold text-sports-text">{match.awayTeam.substring(0, 1)}</span>}
            </div>
            <span className="font-bold text-sm sm:text-lg text-sports-text text-center line-clamp-1">{match.awayTeam}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
