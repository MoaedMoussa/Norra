import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MatchListItem({ match, toggleFavorite, isFavorite }) {
  const navigate = useNavigate();
  const prevScoreRef = useRef(match.homeScore + match.awayScore);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    const currentScore = match.homeScore + match.awayScore;
    if (match.state === 'in' && prevScoreRef.current !== currentScore) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 2000);
      prevScoreRef.current = currentScore;
      return () => clearTimeout(timer);
    }
  }, [match.homeScore, match.awayScore, match.state]);

  return (
    <motion.div 
      onClick={() => navigate(`/match/${match.id}`)}
      animate={isPulsing ? { backgroundColor: ['#201814', 'rgba(255, 107, 0, 0.2)', 'rgba(32, 24, 20, 0)'] } : {}}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      className={`px-3 sm:px-4 py-3 flex items-stretch transition-all duration-300 cursor-pointer group border-b border-sports-border last:border-0 relative hover:z-20 hover:scale-[1.01] hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:rounded-lg ${match.isMyTeam ? 'bg-sports-surfaceHover hover:bg-[#201814] before:absolute before:inset-y-0 before:left-0 before:w-[2px] before:bg-sports-primary' : 'hover:bg-sports-surfaceHover active:bg-sports-border'}`}
    >
      {/* Time/Status & Favorites */}
      <div className="w-[60px] flex items-center justify-between shrink-0 border-r border-sports-border pr-2 mr-3 z-10 relative">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(match.id);
          }}
          className="p-1 -ml-1"
        >
          <Bookmark size={14} className={isFavorite ? 'fill-sports-primary text-sports-primary' : 'text-sports-textMuted group-hover:text-sports-textMuted'} />
        </button>
        <div className="text-center w-full">
          {match.status === 'LIVE' ? (
            <span className="text-sports-primary text-xs font-bold animate-pulse">{match.minute}'</span>
          ) : match.state === 'pre' ? (
            <span className="text-sports-textMuted text-[11px] font-medium">{match.startDate ? new Date(match.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}</span>
          ) : match.status === 'FT' ? (
            <span className="text-sports-textMuted text-[11px] font-bold">FT</span>
          ) : (
            <span className="text-sports-textMuted text-[11px] font-medium">{match.status}</span>
          )}
        </div>
      </div>
      {/* Teams and Scores */}
      <div className="flex-1 flex items-center justify-between py-0.5 z-10 relative">
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2 truncate pr-2">
               {match.homeLogo && <img src={match.homeLogo} alt="" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />}
               <span className={`text-[13px] ${match.state !== 'pre' && match.homeScore > match.awayScore ? 'font-bold text-sports-text' : 'font-medium text-sports-text group-hover:text-sports-text'} transition-colors truncate`}>
                 {match.homeTeam}
               </span>
             </div>
             <motion.span 
               key={`home-\${match.homeScore}`}
               initial={match.state === 'in' ? { scale: 1.5, color: '#ff6b00' } : false}
               animate={{ scale: 1, color: match.status === 'LIVE' ? '#ff6b00' : '#ffffff' }}
               className={`text-[13px] font-bold w-6 text-center shrink-0 ${match.status === 'LIVE' ? 'text-sports-primary' : 'text-sports-text'}`}
             >
               {match.state === 'pre' ? '-' : match.homeScore}
             </motion.span>
          </div>
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2 truncate pr-2">
               {match.awayLogo && <img src={match.awayLogo} alt="" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />}
               <span className={`text-[13px] ${match.state !== 'pre' && match.awayScore > match.homeScore ? 'font-bold text-sports-text' : 'font-medium text-sports-text group-hover:text-sports-text'} transition-colors truncate`}>
                 {match.awayTeam}
               </span>
             </div>
             <motion.span 
               key={`away-\${match.awayScore}`}
               initial={match.state === 'in' ? { scale: 1.5, color: '#ff6b00' } : false}
               animate={{ scale: 1, color: match.status === 'LIVE' ? '#ff6b00' : '#ffffff' }}
               className={`text-[13px] font-bold w-6 text-center shrink-0 ${match.status === 'LIVE' ? 'text-sports-primary' : 'text-sports-text'}`}
             >
               {match.state === 'pre' ? '-' : match.awayScore}
             </motion.span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
