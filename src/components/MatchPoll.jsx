import React, { useState, useEffect, useMemo } from 'react';
import { BarChart3, Users, CheckCircle2, ChevronRight, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MatchPoll({ match, summary }) {
  const [activeTab, setActiveTab] = useState('outcome'); // 'outcome' | 'motm'
  const [outcomeVote, setOutcomeVote] = useState(null);
  const [motmVote, setMotmVote] = useState(null);

  // Load user votes from localStorage on mount
  useEffect(() => {
    if (match?.id) {
      const savedOutcome = localStorage.getItem(`poll_${match.id}_outcome`);
      if (savedOutcome) setOutcomeVote(savedOutcome);
      
      const savedMotm = localStorage.getItem(`poll_${match.id}_motm`);
      if (savedMotm) setMotmVote(savedMotm);
    }
  }, [match?.id]);

  // Generate deterministic "community" votes based on match.id hash
  const communityOutcomeVotes = useMemo(() => {
    if (!match?.id) return { home: 35, draw: 25, away: 40 };
    
    let hash = 0;
    for (let i = 0; i < match.id.length; i++) hash = (hash << 5) - hash + match.id.charCodeAt(i);
    hash = Math.abs(hash);
    
    // Base percentages
    let home = 30 + (hash % 30);
    let draw = 15 + ((hash >> 2) % 20);
    let away = 100 - home - draw;

    return { home, draw, away };
  }, [match?.id]);

  const outcomeStats = useMemo(() => {
    let home = communityOutcomeVotes.home * 1000;
    let draw = communityOutcomeVotes.draw * 1000;
    let away = communityOutcomeVotes.away * 1000;

    // Add user vote
    if (outcomeVote === 'home') home++;
    if (outcomeVote === 'draw') draw++;
    if (outcomeVote === 'away') away++;

    const total = home + draw + away;
    if (total === 0) return { home: 0, draw: 0, away: 0, total: 0 };

    return {
      home: Math.round((home / total) * 100),
      draw: Math.round((draw / total) * 100),
      away: Math.round((away / total) * 100),
      total
    };
  }, [communityOutcomeVotes, outcomeVote]);

  // Generate player list and initial votes
  const playerCandidates = useMemo(() => {
    if (!summary?.rosters) return [];
    
    const allPlayers = [];
    let hash = 0;
    if (match?.id) {
      for (let i = 0; i < match.id.length; i++) hash = (hash << 5) - hash + match.id.charCodeAt(i);
      hash = Math.abs(hash);
    }

    summary.rosters.forEach((teamRoster, teamIdx) => {
      if (teamRoster.roster) {
        teamRoster.roster.slice(0, 5).forEach((player, pIdx) => {
          if (player.athlete) {
            // Generate deterministic vote count
            const baseVotes = ((hash >> (pIdx + teamIdx)) % 500) + 50;
            allPlayers.push({
              id: player.athlete.id,
              name: player.athlete.displayName || player.athlete.shortName,
              teamLogo: teamRoster.team?.logo,
              headshot: player.athlete.headshot?.href,
              baseVotes
            });
          }
        });
      }
    });
    
    return allPlayers.sort((a, b) => b.baseVotes - a.baseVotes).slice(0, 6);
  }, [summary, match?.id]);

  const motmStats = useMemo(() => {
    let total = 0;
    const votes = {};
    
    playerCandidates.forEach(p => {
      let v = p.baseVotes;
      if (motmVote === p.id) v += 1;
      votes[p.id] = v;
      total += v;
    });

    return playerCandidates.map(p => ({
      ...p,
      votes: votes[p.id],
      percentage: total > 0 ? Math.round((votes[p.id] / total) * 100) : 0
    })).sort((a, b) => b.percentage - a.percentage);
  }, [playerCandidates, motmVote]);

  const handleVoteOutcome = (type) => {
    if (!match?.id || outcomeVote) return;
    setOutcomeVote(type);
    localStorage.setItem(`poll_${match.id}_outcome`, type);
  };

  const handleVoteMotm = (playerId) => {
    if (!match?.id || motmVote) return;
    setMotmVote(playerId);
    localStorage.setItem(`poll_${match.id}_motm`, playerId);
  };

  if (!match) return null;

  return (
    <div className="bg-sports-surface border border-sports-border rounded-xl p-5 mb-6 shadow-lg overflow-hidden relative">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sports-text font-bold text-sm uppercase tracking-wider flex items-center gap-2">
          <BarChart3 size={16} className="text-sports-primary" />
          Fan Zone Polls
        </h3>
        <div className="flex items-center bg-sports-surfaceHover rounded-md p-1 border border-sports-border">
          <button 
            onClick={() => setActiveTab('outcome')}
            className={`px-3 py-1 text-[11px] font-bold uppercase rounded transition-colors ${activeTab === 'outcome' ? 'bg-sports-border text-sports-text' : 'text-sports-textMuted hover:text-sports-text'}`}
          >
            Match Result
          </button>
          <button 
            onClick={() => setActiveTab('motm')}
            className={`px-3 py-1 text-[11px] font-bold uppercase rounded transition-colors ${activeTab === 'motm' ? 'bg-sports-border text-sports-text' : 'text-sports-textMuted hover:text-sports-text'}`}
          >
            Man of the Match
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'outcome' ? (
          <motion.div 
            key="outcome"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex flex-col gap-4"
          >
            <p className="text-xs text-sports-textMuted text-center mb-1">
              {outcomeVote ? 'Thanks for voting! Here is what other fans think.' : 'Who do you think will win this match?'}
            </p>
            
            <div className="grid grid-cols-3 gap-3">
              {/* Home */}
              <button 
                disabled={!!outcomeVote}
                onClick={() => handleVoteOutcome('home')}
                className={`relative overflow-hidden flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-300 ${outcomeVote === 'home' ? 'bg-sports-primary/20 border-sports-primary' : outcomeVote ? 'bg-sports-surfaceHover/50 border-sports-border/50 opacity-60' : 'bg-sports-surfaceHover border-sports-border hover:border-sports-primary/50'}`}
              >
                {outcomeVote && (
                  <div className="absolute bottom-0 left-0 h-1 bg-sports-primary transition-all duration-1000" style={{ width: `${outcomeStats.home}%` }} />
                )}
                <span className="text-xs font-bold text-sports-text text-center line-clamp-1">{match.homeTeam}</span>
                {outcomeVote ? (
                  <span className="text-xl font-bold text-sports-primary">{outcomeStats.home}%</span>
                ) : (
                  <span className="text-[10px] text-sports-textMuted uppercase font-bold px-2 py-0.5 rounded-full bg-sports-border">Vote Home</span>
                )}
                {outcomeVote === 'home' && <CheckCircle2 size={14} className="absolute top-2 right-2 text-sports-primary" />}
              </button>

              {/* Draw */}
              <button 
                disabled={!!outcomeVote}
                onClick={() => handleVoteOutcome('draw')}
                className={`relative overflow-hidden flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-300 ${outcomeVote === 'draw' ? 'bg-white/10 border-white/30' : outcomeVote ? 'bg-sports-surfaceHover/50 border-sports-border/50 opacity-60' : 'bg-sports-surfaceHover border-sports-border hover:border-white/20'}`}
              >
                {outcomeVote && (
                  <div className="absolute bottom-0 left-0 h-1 bg-white/40 transition-all duration-1000" style={{ width: `${outcomeStats.draw}%` }} />
                )}
                <span className="text-xs font-bold text-sports-textMuted">DRAW</span>
                {outcomeVote ? (
                  <span className="text-xl font-bold text-white/80">{outcomeStats.draw}%</span>
                ) : (
                  <span className="text-[10px] text-sports-textMuted uppercase font-bold px-2 py-0.5 rounded-full bg-sports-border">Vote Draw</span>
                )}
                {outcomeVote === 'draw' && <CheckCircle2 size={14} className="absolute top-2 right-2 text-white/80" />}
              </button>

              {/* Away */}
              <button 
                disabled={!!outcomeVote}
                onClick={() => handleVoteOutcome('away')}
                className={`relative overflow-hidden flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-300 ${outcomeVote === 'away' ? 'bg-blue-500/20 border-blue-500' : outcomeVote ? 'bg-sports-surfaceHover/50 border-sports-border/50 opacity-60' : 'bg-sports-surfaceHover border-sports-border hover:border-blue-500/50'}`}
              >
                {outcomeVote && (
                  <div className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-1000" style={{ width: `${outcomeStats.away}%` }} />
                )}
                <span className="text-xs font-bold text-sports-text text-center line-clamp-1">{match.awayTeam}</span>
                {outcomeVote ? (
                  <span className="text-xl font-bold text-blue-400">{outcomeStats.away}%</span>
                ) : (
                  <span className="text-[10px] text-sports-textMuted uppercase font-bold px-2 py-0.5 rounded-full bg-sports-border">Vote Away</span>
                )}
                {outcomeVote === 'away' && <CheckCircle2 size={14} className="absolute top-2 right-2 text-blue-400" />}
              </button>
            </div>
            
            {outcomeVote && (
              <div className="text-[10px] text-sports-textMuted text-right mt-1">
                {outcomeStats.total.toLocaleString()} total votes
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="motm"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex flex-col gap-3"
          >
            {playerCandidates.length === 0 ? (
              <div className="text-center p-6 text-sm text-sports-textMuted">
                Lineups not available yet to vote for Man of the Match.
              </div>
            ) : (
              <>
                <p className="text-xs text-sports-textMuted text-center mb-1">
                  {motmVote ? 'Current voting standings.' : 'Who is your Player of the Match?'}
                </p>
                <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-hide">
                  {motmStats.map((player, idx) => (
                    <button
                      key={player.id}
                      disabled={!!motmVote}
                      onClick={() => handleVoteMotm(player.id)}
                      className={`relative flex items-center p-2 rounded-lg border transition-all duration-300 overflow-hidden ${motmVote === player.id ? 'bg-sports-primary/10 border-sports-primary' : motmVote ? 'bg-sports-surfaceHover/30 border-transparent' : 'bg-sports-surfaceHover border-sports-border hover:border-sports-primary/30'}`}
                    >
                      {motmVote && (
                        <div 
                          className={`absolute top-0 left-0 h-full opacity-10 transition-all duration-1000 ${idx === 0 ? 'bg-sports-primary' : 'bg-white'}`} 
                          style={{ width: `${player.percentage}%` }} 
                        />
                      )}
                      
                      <div className="relative z-10 w-10 h-10 rounded-full bg-sports-border overflow-hidden shrink-0 border border-white/5 mr-3">
                        {player.headshot ? (
                          <img src={player.headshot} alt={player.name} className="w-full h-full object-cover bg-white" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sports-textMuted"><Users size={16} /></div>
                        )}
                        {player.teamLogo && (
                          <div className="absolute bottom-0 right-0 w-4 h-4 bg-sports-surface rounded-full p-0.5 border border-sports-border">
                            <img src={player.teamLogo} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                          </div>
                        )}
                      </div>
                      
                      <div className="relative z-10 flex-1 flex flex-col items-start">
                        <span className="text-sm font-bold text-sports-text">{player.name}</span>
                        {motmVote && idx === 0 && <span className="text-[9px] text-sports-primary font-bold uppercase tracking-wider">Leading</span>}
                      </div>

                      <div className="relative z-10 font-bold">
                        {motmVote ? (
                          <span className={`text-sm ${motmVote === player.id ? 'text-sports-primary' : 'text-sports-textMuted'}`}>{player.percentage}%</span>
                        ) : (
                          <span className="text-sports-textMuted group-hover:text-sports-primary transition-colors"><ChevronRight size={16} /></span>
                        )}
                      </div>
                      
                      {motmVote === player.id && <CheckCircle2 size={14} className="ml-2 text-sports-primary relative z-10" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
