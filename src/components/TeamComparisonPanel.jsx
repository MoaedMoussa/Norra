import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { X, Trophy, Target, Shield, Percent, Activity } from 'lucide-react';

export default function TeamComparisonPanel({ team1, team2, onClose }) {
  if (!team1 || !team2) return null;

  const getNumber = (val) => {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  };

  const data = [
    {
      name: 'Points',
      [team1.team.shortDisplayName || team1.team.displayName]: getNumber(team1.displayStats.pts),
      [team2.team.shortDisplayName || team2.team.displayName]: getNumber(team2.displayStats.pts),
    },
    {
      name: 'Wins',
      [team1.team.shortDisplayName || team1.team.displayName]: getNumber(team1.displayStats.w),
      [team2.team.shortDisplayName || team2.team.displayName]: getNumber(team2.displayStats.w),
    },
    {
      name: 'Goals For',
      [team1.team.shortDisplayName || team1.team.displayName]: getNumber(team1.extraStats.goalsFor),
      [team2.team.shortDisplayName || team2.team.displayName]: getNumber(team2.extraStats.goalsFor),
    },
    {
      name: 'Goals Against',
      [team1.team.shortDisplayName || team1.team.displayName]: getNumber(team1.extraStats.goalsAgainst),
      [team2.team.shortDisplayName || team2.team.displayName]: getNumber(team2.extraStats.goalsAgainst),
    },
    {
      name: 'Goal Diff',
      [team1.team.shortDisplayName || team1.team.displayName]: getNumber(team1.displayStats.gd),
      [team2.team.shortDisplayName || team2.team.displayName]: getNumber(team2.displayStats.gd),
    },
    {
      name: 'Win %',
      [team1.team.shortDisplayName || team1.team.displayName]: getNumber(team1.extraStats.winPct),
      [team2.team.shortDisplayName || team2.team.displayName]: getNumber(team2.extraStats.winPct),
    }
  ];

  return (
    <div className="bg-sports-surfaceHover rounded-xl p-6 mb-6 border border-sports-primary/50 relative shadow-xl">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-1.5 bg-sports-surface text-sports-textMuted hover:text-sports-text hover:bg-sports-border rounded-full transition-colors"
      >
        <X size={18} />
      </button>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
        <div className="flex flex-col items-center text-center">
          {team1.team.logos?.[0]?.href && (
            <img src={team1.team.logos[0].href} alt={team1.team.displayName} className="w-16 h-16 object-contain mb-3" />
          )}
          <h3 className="font-bold text-lg text-sports-text">{team1.team.displayName}</h3>
          <p className="text-sm text-sports-textMuted font-mono">Rank {team1.rank}</p>
        </div>

        <div className="text-2xl font-black text-sports-border px-4 flex items-center justify-center italic">VS</div>

        <div className="flex flex-col items-center text-center">
          {team2.team.logos?.[0]?.href && (
            <img src={team2.team.logos[0].href} alt={team2.team.displayName} className="w-16 h-16 object-contain mb-3" />
          )}
          <h3 className="font-bold text-lg text-sports-text">{team2.team.displayName}</h3>
          <p className="text-sm text-sports-textMuted font-mono">Rank {team2.rank}</p>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barGap={8}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis dataKey="name" tick={{fill: '#999'}} axisLine={false} tickLine={false} />
            <YAxis tick={{fill: '#999'}} axisLine={false} tickLine={false} />
            <Tooltip 
              cursor={{fill: 'rgba(255,255,255,0.05)'}}
              contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '8px' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey={team1.team.shortDisplayName || team1.team.displayName} fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey={team2.team.shortDisplayName || team2.team.displayName} fill="#ff6b00" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
