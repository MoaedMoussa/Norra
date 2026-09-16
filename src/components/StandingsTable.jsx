import React from 'react';
import { useStandings } from '../hooks/useStandings';

export default function StandingsTable({ leagueId }) {
  const { standings, loading } = useStandings(leagueId);

  if (loading) {
    return (
      <div className="text-center py-12 bg-sports-surface rounded-xl border border-sports-border shadow-lg">
        <p className="text-sports-textMuted text-sm animate-pulse">Fetching standings data...</p>
      </div>
    );
  }

  if (!standings || standings.length === 0) {
    return (
      <div className="text-center py-12 bg-sports-surface rounded-xl border border-sports-border shadow-lg">
        <p className="text-sports-textMuted text-sm">Standings not available for this league.</p>
      </div>
    );
  }

  return (
    <div className="bg-sports-surfaceHover rounded-xl overflow-hidden border border-sports-border shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-sports-textMuted uppercase bg-sports-surfaceHover border-b border-sports-border">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium w-12 text-center">#</th>
              <th scope="col" className="px-4 py-3 font-medium">Club</th>
              <th scope="col" className="px-3 py-3 font-medium text-center w-12">MP</th>
              <th scope="col" className="px-3 py-3 font-medium text-center w-12">W</th>
              <th scope="col" className="px-3 py-3 font-medium text-center w-12">D</th>
              <th scope="col" className="px-3 py-3 font-medium text-center w-12">L</th>
              <th scope="col" className="px-3 py-3 font-medium text-center w-16">GD</th>
              <th scope="col" className="px-4 py-3 font-bold text-sports-text text-center w-16">Pts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sports-border">
            {standings.map((team, index) => (
              <tr key={team.id} className="hover:bg-sports-surface transition-colors">
                <td className="px-4 py-3 text-center text-sports-textMuted font-medium">{team.rank}</td>
                <td className="px-4 py-3 font-bold text-sports-text flex items-center gap-3">
                  {team.logo ? (
                    <img src={team.logo} alt={team.team} className="w-6 h-6 object-contain flex-shrink-0" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-6 h-6 bg-sports-surface rounded-full flex-shrink-0"></div>
                  )}
                  <span className="truncate max-w-[120px] sm:max-w-[200px]">{team.team}</span>
                </td>
                <td className="px-3 py-3 text-center text-sports-textMuted">{team.gamesPlayed}</td>
                <td className="px-3 py-3 text-center text-sports-textMuted">{team.wins}</td>
                <td className="px-3 py-3 text-center text-sports-textMuted">{team.ties}</td>
                <td className="px-3 py-3 text-center text-sports-textMuted">{team.losses}</td>
                <td className="px-3 py-3 text-center text-sports-textMuted">{team.pointDifferential}</td>
                <td className="px-4 py-3 text-center font-bold text-sports-primary">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
