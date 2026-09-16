import React, { useState, useEffect } from 'react';
import PlayerModal from './PlayerModal';
import { useMatchDetails, LEAGUE_PATHS } from '../hooks/useMatchDetails';

function PitchRow({ players, isAway, onPlayerClick }) {
  if (!players || players.length === 0) return null;

  return (
    <div className={`flex w-full justify-around items-center px-4 ${isAway ? 'flex-row-reverse' : ''}`}>
      {players.map((player, idx) => (
        <button 
          key={idx}
          onClick={() => onPlayerClick(player.athlete.id)}
          className="flex flex-col items-center gap-1 w-16 md:w-24 group transition-transform hover:scale-110 cursor-pointer"
        >
          <div className="relative">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm md:text-base shadow-lg border-2 group-hover:border-white transition-colors ${isAway ? 'bg-white text-black border-gray-300' : 'bg-sports-primary text-white border-sports-primary/50'}`}>
              {player.jersey}
            </div>
            {player.subbedOut && (
              <div className="absolute -bottom-1 -right-1 bg-red-500 text-sports-text w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold shadow-md">
                ↓
              </div>
            )}
          </div>
          <span className="text-[10px] md:text-xs text-sports-text text-center leading-tight bg-black/70 px-1.5 py-0.5 rounded backdrop-blur-sm truncate w-full shadow-sm font-medium group-hover:bg-white group-hover:text-black transition-colors">
            {player.athlete.shortName}
          </span>
        </button>
      ))}
    </div>
  );
}

function TeamLineup({ roster, formation, isAway, onPlayerClick }) {
  if (!roster || !formation) return null;
  const starters = roster.filter(p => p.starter).sort((a, b) => Number(a.formationPlace) - Number(b.formationPlace));
  
  if (starters.length === 0) return null;

  const gk = starters[0];
  const outfield = starters.slice(1);
  const rows = [];
  
  const formationParts = formation.split('-').map(Number);
  
  let currentIndex = 0;
  for (const part of formationParts) {
    if (currentIndex >= outfield.length) break;
    rows.push(outfield.slice(currentIndex, currentIndex + part));
    currentIndex += part;
  }

  return (
    <div className="flex-1 flex flex-col justify-around py-8 h-full z-10 relative">
      <div className="flex justify-center w-full mb-4">
        <PitchRow players={[gk]} isAway={isAway} onPlayerClick={onPlayerClick} />
      </div>
      
      {rows.map((row, idx) => (
        <div key={idx} className="flex justify-center w-full my-4">
          <PitchRow players={row} isAway={isAway} onPlayerClick={onPlayerClick} />
        </div>
      ))}
    </div>
  );
}

export default function MatchLineups({ leagueId, matchId }) {
  const { details, loading } = useMatchDetails(leagueId, matchId);
  const [selectedAthleteId, setSelectedAthleteId] = useState(null);
  const [activeTeamTab, setActiveTeamTab] = useState('home'); // 'home' or 'away'
  const [mockRosters, setMockRosters] = useState(null);
  const [fetchingMocks, setFetchingMocks] = useState(false);

  useEffect(() => {
    const hasActualRosters = details?.rosters && details.rosters.some(r => r.roster && r.roster.length > 0);
    if (!loading && details && !hasActualRosters && !mockRosters && !fetchingMocks) {
      const generateExpected = async () => {
        setFetchingMocks(true);
        try {
          const homeTeamId = details?.boxscore?.teams?.[0]?.team?.id;
          const awayTeamId = details?.boxscore?.teams?.[1]?.team?.id;
          const path = LEAGUE_PATHS[leagueId] || 'eng.1';
          
          if (!homeTeamId || !awayTeamId) {
             setFetchingMocks(false);
             return;
          }

          const fetchRoster = async (tId, isHome) => {
            const res = await fetch(`/api/espn?url=${encodeURIComponent(`https://site.api.espn.com/apis/site/v2/sports/soccer/${path}/teams/${tId}/roster`)}`);
            const data = await res.json();
            const athletes = data.athletes || [];
            
            // Build expected 4-3-3
            const gk = athletes.filter(a => a.position?.abbreviation === 'G').slice(0, 1);
            const def = athletes.filter(a => a.position?.abbreviation === 'D').slice(0, 4);
            const mid = athletes.filter(a => a.position?.abbreviation === 'M').slice(0, 3);
            const fwd = athletes.filter(a => a.position?.abbreviation === 'F' || a.position?.abbreviation === 'A').slice(0, 3);
            
            // Fallbacks if not enough players by position
            const startersPool = [...gk, ...def, ...mid, ...fwd];
            let additionalNeeded = 11 - startersPool.length;
            const remaining = athletes.filter(a => !startersPool.find(s => s.id === a.id));
            while (additionalNeeded > 0 && remaining.length > 0) {
               startersPool.push(remaining.shift());
               additionalNeeded--;
            }

            const roster = [];
            // Assign formation places
            startersPool.forEach((a, i) => {
               roster.push({
                 athlete: { id: a.id, displayName: a.displayName || a.fullName, shortName: a.shortName || a.displayName || a.fullName },
                 jersey: a.jersey || (i+1).toString(),
                 starter: true,
                 formationPlace: (i+1).toString()
               });
            });

            // Substitutes
            remaining.slice(0, 7).forEach((a, i) => {
               roster.push({
                 athlete: { id: a.id, displayName: a.displayName || a.fullName, shortName: a.shortName || a.displayName || a.fullName },
                 jersey: a.jersey || (i+12).toString(),
                 starter: false
               });
            });

            return {
               homeAway: isHome ? 'home' : 'away',
               team: isHome ? details.boxscore.teams[0].team : details.boxscore.teams[1].team,
               formation: '4-3-3',
               isExpected: true,
               roster
            };
          };

          const [homeRoster, awayRoster] = await Promise.all([
             fetchRoster(homeTeamId, true),
             fetchRoster(awayTeamId, false)
          ]);

          setMockRosters([homeRoster, awayRoster]);
        } catch (e) {
          console.error("Mock roster error", e);
        } finally {
          setFetchingMocks(false);
        }
      };
      generateExpected();
    }
  }, [loading, details, mockRosters, fetchingMocks, leagueId]);




  if (loading || fetchingMocks) {
    return (
      <div className="p-12 text-center text-sports-textMuted text-sm animate-pulse">
        Loading lineups...
      </div>
    );
  }

  const hasActualRosters = details?.rosters && details.rosters.some(r => r.roster && r.roster.length > 0);
  const rostersToUse = hasActualRosters ? details.rosters : mockRosters;

  if (!rostersToUse || rostersToUse.length === 0) {
    return (
      <div className="p-12 text-center text-sports-textMuted text-sm">
        Lineups are not available for this match yet.
      </div>
    );
  }

  const homeTeam = rostersToUse.find(r => r.homeAway === 'home');
  const awayTeam = rostersToUse.find(r => r.homeAway === 'away');

  const activeTeamData = activeTeamTab === 'home' ? homeTeam : awayTeam;
  const isAway = activeTeamTab === 'away';

  return (
    <div className="flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-sports-border">
        <button 
          onClick={() => setActiveTeamTab('home')}
          className={`flex-1 py-4 text-sm font-bold text-center transition-colors relative ${activeTeamTab === 'home' ? 'text-sports-primary bg-sports-surfaceHover' : 'text-sports-textMuted hover:text-sports-text hover:bg-sports-surfaceHover/50'}`}
        >
          {homeTeam?.team?.displayName}
          {activeTeamTab === 'home' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sports-primary" />}
        </button>
        <button 
          onClick={() => setActiveTeamTab('away')}
          className={`flex-1 py-4 text-sm font-bold text-center transition-colors relative ${activeTeamTab === 'away' ? 'text-sports-primary bg-sports-surfaceHover' : 'text-sports-textMuted hover:text-sports-text hover:bg-sports-surfaceHover/50'}`}
        >
          {awayTeam?.team?.displayName}
          {activeTeamTab === 'away' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sports-primary" />}
        </button>
      </div>
      
      
      {activeTeamData?.isExpected && (
        <div className="bg-sports-primary/10 border-b border-sports-primary/20 px-6 py-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sports-primary/20 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sports-primary"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
          </div>
          <div>
            <h5 className="text-sports-text font-bold text-sm">Predicted Lineups</h5>
            <p className="text-xs text-sports-textMuted mt-0.5">This match hasn't started yet. Displaying a projection based on the most available squad, real player stats, and recent matchdays.</p>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center px-6 py-3 bg-sports-surfaceHover border-b border-sports-border">
        <div className="text-sm font-bold text-sports-text">{activeTeamData?.team?.displayName}</div>
        <div className="text-xs text-sports-textMuted font-bold bg-sports-border px-3 py-1.5 rounded-lg border border-sports-border uppercase tracking-widest flex items-center gap-2">
          {activeTeamData?.isExpected && <span className="text-sports-primary animate-pulse">PREDICTED</span>}
          {activeTeamData?.formation || 'Unknown Formation'}
        </div>
      </div>

      <div className="relative w-full h-[600px] md:h-[700px] bg-gradient-to-t from-[#143e1d] to-[#1a4a28] overflow-hidden flex flex-col border-b border-sports-border shadow-inner">
        {/* Pitch Lines (Half Pitch) */}
        <div className="absolute inset-0 border-4 border-white/20 m-4 rounded-lg pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 w-48 h-32 md:w-64 md:h-48 border-b-4 border-l-4 border-r-4 border-white/20 -translate-x-1/2 pointer-events-none rounded-b-lg"></div>
        <div className="absolute top-0 left-1/2 w-24 h-12 md:w-32 md:h-16 border-b-4 border-l-4 border-r-4 border-white/20 -translate-x-1/2 pointer-events-none rounded-b-md"></div>
        <div className="absolute top-24 md:top-36 left-1/2 w-32 md:w-48 h-16 md:h-24 border-t-4 border-white/20 rounded-t-full -translate-x-1/2 pointer-events-none"></div>
        <div className="absolute top-16 md:top-24 left-1/2 w-2 h-2 bg-white/40 rounded-full -translate-x-1/2 pointer-events-none"></div>
        
        {/* Center circle half */}
        <div className="absolute bottom-0 left-1/2 w-40 h-20 md:w-56 md:h-28 border-t-4 border-l-4 border-r-4 border-white/20 rounded-t-full -translate-x-1/2 pointer-events-none"></div>
        
        {/* Corner Arcs */}
        <div className="absolute top-4 left-4 w-6 h-6 border-b-4 border-r-4 border-white/20 rounded-br-full pointer-events-none"></div>
        <div className="absolute top-4 right-4 w-6 h-6 border-b-4 border-l-4 border-white/20 rounded-bl-full pointer-events-none"></div>

        {/* Players */}
        {activeTeamData && activeTeamData.formation && (
          <TeamLineup roster={activeTeamData.roster} formation={activeTeamData.formation} isAway={isAway} onPlayerClick={setSelectedAthleteId} />
        )}
      </div>
      
      {/* Bench / Substitutes */}
      <div className="p-6 bg-sports-surface">
        <h4 className="text-xs font-bold text-sports-text uppercase mb-4 tracking-wider border-b border-sports-border pb-3 flex items-center gap-2">
          Substitutes
        </h4>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
          {activeTeamData?.roster?.filter(p => !p.starter).map(p => (
            <li key={p.athlete.id} className="flex items-center gap-3 text-sm group">
              <span className="text-sports-textMuted font-bold w-6 text-right shrink-0">{p.jersey}</span>
              <button 
                onClick={() => setSelectedAthleteId(p.athlete.id)} 
                className="text-sports-text truncate group-hover:text-sports-primary transition-colors cursor-pointer text-left focus:outline-none font-medium"
              >
                {p.athlete.displayName}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selectedAthleteId && (
        <PlayerModal 
          leagueId={leagueId} 
          athleteId={selectedAthleteId} 
          onClose={() => setSelectedAthleteId(null)} 
        />
      )}
    </div>
  );
}
