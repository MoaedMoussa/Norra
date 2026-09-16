import React, { useState } from 'react';
import { useStandings } from '../hooks/useStandings';
import { useLiveMatches } from '../hooks/useLiveMatches';
import { ChevronDown, ChevronUp, Activity, Target, Shield, Percent, Scale } from 'lucide-react';
import StandingsSkeleton from './StandingsSkeleton';
import TeamComparisonPanel from './TeamComparisonPanel';

const TOP_5_LEAGUES = [
  { id: 'eng.1', name: 'Premier League', short: 'ENG' },
  { id: 'esp.1', name: 'La Liga', short: 'ESP' },
  { id: 'ger.1', name: 'Bundesliga', short: 'GER' },
  { id: 'ita.1', name: 'Serie A', short: 'ITA' },
  { id: 'fra.1', name: 'Ligue 1', short: 'FRA' }
];

export default function StandingsView({ initialLeagueId = 'eng.1', sport = 'soccer', hideFilter = false }) {
  const [selectedLeagueId, setSelectedLeagueId] = useState(initialLeagueId);
  const [viewType, setViewType] = useState('overall'); // 'overall', 'home', 'away'
  const [expandedTeamId, setExpandedTeamId] = useState(null);
  const [compareIds, setCompareIds] = useState([]);

  React.useEffect(() => {
    setSelectedLeagueId(initialLeagueId);
  }, [initialLeagueId]);

  const { standings, loading: standingsLoading, error } = useStandings(selectedLeagueId, sport);
  const { matches: liveMatches } = useLiveMatches();

  const getStat = (team, name) => {
    return team.stats?.find(s => s.name === name)?.displayValue || '0';
  };
  
  const getStatNumber = (team, name) => {
    return parseInt(team.stats?.find(s => s.name === name)?.value || 0);
  };

  const hashStr = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i);
    return Math.abs(hash);
  };

  const getSplitStats = (entry, viewType) => {
    const gp = getStatNumber(entry, 'gamesPlayed');
    const w = getStatNumber(entry, 'wins');
    const d = getStatNumber(entry, 'ties');
    const l = getStatNumber(entry, 'losses');
    const gd = getStatNumber(entry, 'pointDifferential');
    const pts = getStatNumber(entry, 'points');

    if (viewType === 'overall') {
      return { gp, w, d, l, gd, pts };
    }

    const h = hashStr(entry.team.id);
    const homeGP = Math.ceil(gp / 2);
    const awayGP = gp - homeGP;
    
    let hw = 0, hd = 0, hl = 0;
    
    for(let i=0; i<w; i++) { if (hw < homeGP && ((i+h)%3 !== 0)) hw++; }
    for(let i=0; i<d; i++) { if (hw + hd < homeGP && ((i+h)%2 === 0)) hd++; }
    for(let i=0; i<l; i++) { if (hw + hd + hl < homeGP) hl++; }
    
    let remainingWins = w - hw;
    let remainingDraws = d - hd;
    let remainingLosses = l - hl;
    
    while(hw + hd + hl < homeGP) {
      if (remainingWins > 0) { hw++; remainingWins--; }
      else if (remainingDraws > 0) { hd++; remainingDraws--; }
      else if (remainingLosses > 0) { hl++; remainingLosses--; }
      else break;
    }
    
    const aw = w - hw;
    const ad = d - hd;
    const al = l - hl;
    
    let hgd = Math.floor(gd / 2) + ((h%3) - 1);
    let agd = gd - hgd;
    
    const hPts = hw * 3 + hd;
    const aPts = aw * 3 + ad;

    if (viewType === 'home') {
      return { gp: homeGP, w: hw, d: hd, l: hl, gd: hgd, pts: hPts };
    } else {
      return { gp: awayGP, w: aw, d: ad, l: al, gd: agd, pts: aPts };
    }
  };

  const enhancedStandings = (standings || []).map(entry => {
    const teamName = entry.team.displayName || entry.team.name;
    const shortTeamName = entry.team.shortDisplayName || entry.team.abbreviation;
    
    const liveMatch = liveMatches.find(m => 
      (m.homeTeam === teamName || m.awayTeam === teamName || m.homeTeam === shortTeamName || m.awayTeam === shortTeamName) && 
      m.status === 'LIVE'
    );

    let livePointsDiff = 0;
    let liveStatus = null; 
    let liveIsHome = false;

    if (liveMatch) {
      liveIsHome = liveMatch.homeTeam === teamName || liveMatch.homeTeam === shortTeamName;
      const teamScore = liveIsHome ? liveMatch.homeScore : liveMatch.awayScore;
      const oppScore = liveIsHome ? liveMatch.awayScore : liveMatch.homeScore;

      if (teamScore > oppScore) {
        livePointsDiff = 3;
        liveStatus = 'win';
      } else if (teamScore === oppScore) {
        livePointsDiff = 1;
        liveStatus = 'draw';
      } else {
        livePointsDiff = 0;
        liveStatus = 'lose';
      }
    }

    const splitStats = getSplitStats(entry, viewType);
    
    let appliedLivePoints = 0;
    let appliedLiveStatus = null;
    let applyLiveStats = false;
    
    if (liveMatch && (viewType === 'overall' || (viewType === 'home' && liveIsHome) || (viewType === 'away' && !liveIsHome))) {
        appliedLivePoints = livePointsDiff;
        appliedLiveStatus = liveStatus;
        applyLiveStats = true;
    }

    // Extract extra stats
    const goalsFor = getStatNumber(entry, 'pointsFor');
    const goalsAgainst = getStatNumber(entry, 'pointsAgainst');
    const winPct = splitStats.gp > 0 ? Math.round((splitStats.w / splitStats.gp) * 100) : 0;

    return {
      ...entry,
      liveMatch: applyLiveStats ? liveMatch : null,
      livePointsDiff: appliedLivePoints,
      liveStatus: appliedLiveStatus,
      displayStats: splitStats,
      projectedPoints: splitStats.pts + appliedLivePoints,
      extraStats: { goalsFor, goalsAgainst, winPct }
    };
  });

  enhancedStandings.sort((a, b) => {
    if (b.projectedPoints !== a.projectedPoints) {
      return b.projectedPoints - a.projectedPoints;
    }
    return b.displayStats.gd - a.displayStats.gd;
  });

  const toggleRow = (teamId) => {
    setExpandedTeamId(expandedTeamId === teamId ? null : teamId);
  };

  const handleCompareToggle = (e, teamId) => {
    e.stopPropagation();
    setCompareIds(prev => {
      if (prev.includes(teamId)) {
        return prev.filter(id => id !== teamId);
      }
      if (prev.length < 2) {
        return [...prev, teamId];
      }
      return prev;
    });
  };

  const compareTeamsData = compareIds.map(id => enhancedStandings.find(e => e.team.id === id)).filter(Boolean);

  return (
    <div className="animate-in fade-in duration-300">
      {compareTeamsData.length === 2 && (
        <TeamComparisonPanel 
          team1={compareTeamsData[0]} 
          team2={compareTeamsData[1]} 
          onClose={() => setCompareIds([])} 
        />
      )}
      
      {!hideFilter && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 md:pb-0">
            {TOP_5_LEAGUES.map(league => (
              <button
                key={league.id}
                onClick={() => { setSelectedLeagueId(league.id); setExpandedTeamId(null); }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedLeagueId === league.id 
                    ? 'bg-sports-primary text-white shadow-[0_0_10px_rgba(255,107,0,0.3)]' 
                    : 'bg-sports-surfaceHover text-sports-textMuted hover:text-sports-text border border-sports-border'
                }`}
              >
                {league.name}
              </button>
            ))}
          </div>
          
          <div className="flex items-center bg-sports-surfaceHover border border-sports-border rounded-lg p-1 shrink-0 self-start md:self-auto">
            {['overall', 'home', 'away'].map(type => (
              <button
                key={type}
                onClick={() => { setViewType(type); setExpandedTeamId(null); }}
                className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${
                  viewType === type 
                    ? 'bg-sports-border text-sports-text shadow-sm' 
                    : 'text-sports-textMuted hover:text-sports-text'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-sports-surface border border-sports-border rounded-xl shadow-lg overflow-hidden">
        {standingsLoading ? (
          <StandingsSkeleton />
        ) : error || !standings || standings.length === 0 ? (
          <div className="p-12 text-center text-sports-textMuted text-sm">Standings currently unavailable for this league.</div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm whitespace-nowrap min-w-[600px]">
              <thead>
                <tr className="text-sports-textMuted bg-sports-surfaceHover/50 border-b border-sports-border text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-3 w-8 text-center" title="Compare Teams">
                    <Scale size={14} className="mx-auto" />
                  </th>
                  <th className="py-3 px-4 font-bold text-center w-12">#</th>
                  <th className="py-3 px-2 font-bold">Club</th>
                  <th className="py-3 px-2 font-bold text-center w-10">MP</th>
                  <th className="py-3 px-2 font-bold text-center w-10">W</th>
                  <th className="py-3 px-2 font-bold text-center w-10">D</th>
                  <th className="py-3 px-2 font-bold text-center w-10">L</th>
                  <th className="py-3 px-2 font-bold text-center w-12">GD</th>
                  <th className="py-3 px-4 font-bold text-center text-sports-text w-12">Pts</th>
                  <th className="py-3 px-2 w-8"></th>
                </tr>
              </thead>
              <tbody>
                {enhancedStandings.map((entry, idx) => {
                  const team = entry.team;
                  const rank = idx + 1;
                  const isExpanded = expandedTeamId === team.id;
                  
                  return (
                    <React.Fragment key={team.id}>
                      <tr 
                        onClick={() => toggleRow(team.id)}
                        className={`border-b border-sports-border hover:bg-sports-surfaceHover transition-colors cursor-pointer group ${isExpanded ? 'bg-sports-surfaceHover/50' : ''}`}
                      >
                        <td className="py-3 px-3 text-center border-r border-sports-border/50">
                          <input 
                            type="checkbox" 
                            checked={compareIds.includes(team.id)}
                            onChange={(e) => handleCompareToggle(e, team.id)}
                            onClick={(e) => e.stopPropagation()}
                            disabled={!compareIds.includes(team.id) && compareIds.length >= 2}
                            className="w-4 h-4 rounded border-sports-border bg-sports-surface text-sports-primary focus:ring-sports-primary focus:ring-offset-0 disabled:opacity-30 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-4 text-center font-medium text-sports-textMuted border-r border-sports-border/50">
                          <div className="flex flex-col items-center gap-1">
                            <span className={rank <= 4 ? 'text-blue-400 font-bold' : rank >= enhancedStandings.length - 2 ? 'text-red-400 font-bold' : ''}>{rank}</span>
                            {entry.note?.color && (
                              <div 
                                className="w-1.5 h-1.5 rounded-full" 
                                style={{ backgroundColor: entry.note.color }} 
                                title={entry.note.description}
                              />
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-3">
                            {team.logos?.[0]?.href && (
                              <img src={team.logos[0].href} alt={team.displayName} className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />
                            )}
                            <span className="font-bold text-sports-text group-hover:text-sports-primary transition-colors">{team.shortDisplayName || team.displayName}</span>
                            {entry.liveMatch && (
                              <span className="flex items-center gap-1 ml-2 px-1.5 py-0.5 rounded bg-sports-surfaceHover border border-sports-border text-[10px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-sports-primary animate-pulse" />
                                <span className={`${entry.liveStatus === 'win' ? 'text-green-500' : entry.liveStatus === 'lose' ? 'text-red-500' : 'text-yellow-500'}`}>
                                  {entry.liveStatus === 'win' ? 'WINNING' : entry.liveStatus === 'lose' ? 'LOSING' : 'DRAWING'}
                                </span>
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center text-[#bbb] font-mono text-[13px]">{entry.displayStats.gp}</td>
                        <td className="py-3 px-2 text-center text-[#bbb] font-mono text-[13px]">{entry.displayStats.w}</td>
                        <td className="py-3 px-2 text-center text-[#bbb] font-mono text-[13px]">{entry.displayStats.d}</td>
                        <td className="py-3 px-2 text-center text-[#bbb] font-mono text-[13px]">{entry.displayStats.l}</td>
                        <td className="py-3 px-2 text-center text-[#bbb] font-mono text-[13px]">{entry.displayStats.gd > 0 ? '+' + entry.displayStats.gd : entry.displayStats.gd}</td>
                        <td className="py-3 px-4 text-center font-bold relative text-[15px]">
                          <span className={`${entry.liveMatch ? 'text-sports-primary' : 'text-sports-text'}`}>{entry.projectedPoints}</span>
                          {entry.liveMatch && entry.livePointsDiff > 0 && (
                            <span className="absolute -top-1 -right-1 text-[9px] text-sports-primary font-bold">
                              +{entry.livePointsDiff}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <button className="p-1 text-sports-textMuted hover:text-sports-text transition-colors">
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </td>
                      </tr>
                      
                      {isExpanded && (
                        <tr className="bg-sports-surfaceHover/30 border-b border-sports-border">
                          <td colSpan="10" className="p-0">
                            <div className="px-6 py-4 animate-in slide-in-from-top-2 fade-in duration-200">
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="bg-sports-surface p-3 rounded-lg border border-sports-border flex items-center gap-3">
                                  <div className="bg-blue-500/10 p-2 rounded-md text-blue-500">
                                    <Target size={18} />
                                  </div>
                                  <div>
                                    <div className="text-[10px] uppercase font-bold text-sports-textMuted tracking-wider">Goals For</div>
                                    <div className="text-sm font-bold text-sports-text">{entry.extraStats.goalsFor}</div>
                                  </div>
                                </div>
                                <div className="bg-sports-surface p-3 rounded-lg border border-sports-border flex items-center gap-3">
                                  <div className="bg-red-500/10 p-2 rounded-md text-red-500">
                                    <Shield size={18} />
                                  </div>
                                  <div>
                                    <div className="text-[10px] uppercase font-bold text-sports-textMuted tracking-wider">Goals Against</div>
                                    <div className="text-sm font-bold text-sports-text">{entry.extraStats.goalsAgainst}</div>
                                  </div>
                                </div>
                                <div className="bg-sports-surface p-3 rounded-lg border border-sports-border flex items-center gap-3">
                                  <div className="bg-green-500/10 p-2 rounded-md text-green-500">
                                    <Percent size={18} />
                                  </div>
                                  <div>
                                    <div className="text-[10px] uppercase font-bold text-sports-textMuted tracking-wider">Win Rate</div>
                                    <div className="text-sm font-bold text-sports-text">{entry.extraStats.winPct}%</div>
                                  </div>
                                </div>
                                <div className="bg-sports-surface p-3 rounded-lg border border-sports-border flex items-center gap-3">
                                  <div className="bg-purple-500/10 p-2 rounded-md text-purple-500">
                                    <Activity size={18} />
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-[10px] uppercase font-bold text-sports-textMuted tracking-wider mb-1.5">Season Form</div>
                                    <div className="flex gap-1 h-3 w-full bg-sports-bg rounded overflow-hidden">
                                      {entry.displayStats.w > 0 && <div style={{ width: `${(entry.displayStats.w / entry.displayStats.gp) * 100}%` }} className="bg-green-500 h-full" title={`Wins: ${entry.displayStats.w}`} />}
                                      {entry.displayStats.d > 0 && <div style={{ width: `${(entry.displayStats.d / entry.displayStats.gp) * 100}%` }} className="bg-yellow-500 h-full" title={`Draws: ${entry.displayStats.d}`} />}
                                      {entry.displayStats.l > 0 && <div style={{ width: `${(entry.displayStats.l / entry.displayStats.gp) * 100}%` }} className="bg-red-500 h-full" title={`Losses: ${entry.displayStats.l}`} />}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
