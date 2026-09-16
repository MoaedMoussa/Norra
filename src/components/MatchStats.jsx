import React from 'react';

export default function MatchStats({ summary }) {
  if (!summary || !summary.boxscore || !summary.boxscore.teams || summary.boxscore.teams.length < 2) {
    return <div className="text-center py-10 text-sports-textMuted text-sm">Stats not available yet.</div>;
  }

  const homeStats = summary.boxscore.teams[0].statistics;
  const awayStats = summary.boxscore.teams[1].statistics;
  const homeTeam = summary.boxscore.teams[0].team;
  const awayTeam = summary.boxscore.teams[1].team;

  const getStat = (stats, name) => {
    const s = stats.find(st => st.name === name);
    return s ? parseFloat(s.displayValue) : 0;
  };

  const statKeys = [
    { name: 'possessionPct', label: 'Possession %' },
    { name: 'totalShots', label: 'Total Shots' },
    { name: 'shotsOnTarget', label: 'Shots on Target' },
    { name: 'wonCorners', label: 'Corner Kicks' },
    { name: 'foulsCommitted', label: 'Fouls' },
    { name: 'yellowCards', label: 'Yellow Cards' },
    { name: 'redCards', label: 'Red Cards' },
    { name: 'offsides', label: 'Offsides' },
    { name: 'saves', label: 'Saves' },
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="w-12 h-12 bg-sports-surfaceHover rounded-full p-2 border border-sports-border">
           <img src={homeTeam.logo} alt={homeTeam.displayName} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
        </div>
        <h4 className="text-sm font-bold uppercase tracking-wider text-sports-textMuted">Team Stats</h4>
        <div className="w-12 h-12 bg-sports-surfaceHover rounded-full p-2 border border-sports-border">
           <img src={awayTeam.logo} alt={awayTeam.displayName} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
        </div>
      </div>

      <div className="space-y-6">
        {statKeys.map(stat => {
          const homeVal = getStat(homeStats, stat.name);
          const awayVal = getStat(awayStats, stat.name);
          const total = homeVal + awayVal;
          const homePct = total > 0 ? (homeVal / total) * 100 : 50;
          const awayPct = total > 0 ? (awayVal / total) * 100 : 50;
          
          return (
            <div key={stat.name} className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold text-sports-text">
                <span>{homeVal}{stat.name === 'possessionPct' ? '%' : ''}</span>
                <span className="text-sports-textMuted">{stat.label}</span>
                <span>{awayVal}{stat.name === 'possessionPct' ? '%' : ''}</span>
              </div>
              <div className="flex h-2 rounded-full overflow-hidden bg-sports-border">
                <div className="bg-sports-primary h-full transition-all duration-500" style={{ width: `${homePct}%` }}></div>
                <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${awayPct}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
