import React, { useMemo } from 'react';
import { Award, Star, TrendingUp } from 'lucide-react';

export default function MatchMotm({ summary }) {
  const motm = useMemo(() => {
    if (!summary || !summary.rosters || summary.rosters.length === 0) return null;
    
    let bestPlayer = null;
    let highestScore = -1;

    summary.rosters.forEach(teamRoster => {
      if (!teamRoster.roster) return;
      teamRoster.roster.forEach(player => {
        let score = 0;
        
        // Add random determinism based on ID if stats are tied or zero
        const athleteId = parseInt(player.athlete?.id || '0', 10);
        score += (athleteId % 10) * 0.1;

        if (player.stats) {
          player.stats.forEach(stat => {
            const val = parseFloat(stat.value) || 0;
            switch(stat.name) {
              case 'goals': score += val * 10; break;
              case 'assists': score += val * 6; break;
              case 'saves': score += val * 3; break;
              case 'shots': score += val * 1; break;
              case 'tackles': score += val * 1; break;
              case 'interceptions': score += val * 1; break;
              case 'passesAccurate': score += val * 0.1; break;
              case 'foulsCommitted': score -= val * 0.5; break;
              case 'yellowCards': score -= val * 3; break;
              case 'redCards': score -= val * 10; break;
            }
          });
        }
        
        if (score > highestScore) {
          highestScore = score;
          bestPlayer = {
            ...player,
            teamInfo: teamRoster.team,
            calculatedScore: score
          };
        }
      });
    });

    return bestPlayer;
  }, [summary]);

  if (!motm) return null;

  // Extract key stats for display
  const displayStats = [];
  if (motm.stats) {
    motm.stats.forEach(stat => {
      if (['goals', 'assists', 'saves', 'shots', 'tackles'].includes(stat.name) && parseFloat(stat.value) > 0) {
        displayStats.push(stat);
      }
    });
  }

  return (
    <div className="bg-gradient-to-br from-[#201814] to-sports-surface rounded-xl p-5 border border-[#332219] shadow-[0_0_15px_rgba(255,107,0,0.1)] mb-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Award size={100} className="text-sports-primary" />
      </div>
      
      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-sports-primary bg-sports-surfaceHover flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
            {motm.athlete?.headshot?.href ? (
              <img src={motm.athlete.headshot.href} alt={motm.athlete.displayName} className="w-full h-full object-cover bg-white" referrerPolicy="no-referrer" />
            ) : (
              <span className="text-2xl font-bold text-sports-primary">{motm.jersey || '-'}</span>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-sports-primary text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-[#201814]">
            <Star size={14} className="fill-white" />
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <h4 className="text-lg sm:text-xl font-bold text-sports-text">{motm.athlete?.displayName || motm.athlete?.shortName}</h4>
            {motm.teamInfo?.logo && (
               <img src={motm.teamInfo.logo} alt="Team" className="w-4 h-4 object-contain opacity-80" />
            )}
          </div>
          <div className="text-xs text-sports-primary font-bold uppercase tracking-wider mb-3">
            Man of the Match
          </div>
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
            {displayStats.length > 0 ? (
              displayStats.slice(0, 4).map((stat, idx) => (
                <div key={idx} className="bg-black/40 px-3 py-1.5 rounded-md border border-white/5 flex flex-col items-center sm:items-start min-w-[60px]">
                  <span className="text-[10px] text-sports-textMuted uppercase tracking-wider font-bold">{stat.displayName || stat.name}</span>
                  <span className="text-sm font-bold text-sports-text">{stat.displayValue || stat.value}</span>
                </div>
              ))
            ) : (
              <div className="bg-black/40 px-3 py-1.5 rounded-md border border-white/5 flex items-center gap-2">
                <TrendingUp size={14} className="text-sports-textMuted" />
                <span className="text-xs text-sports-textMuted">Solid Performance</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
