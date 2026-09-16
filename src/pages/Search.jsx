import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Users, User, ArrowRight } from 'lucide-react';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query || query.length < 2) {
        setTeams([]);
        setPlayers([]);
        setHasSearched(false);
        return;
      }
      setLoading(true);
      setHasSearched(true);
      
      try {
        // 1. Wikipedia Smart Alias Resolution
        const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query + ' football')}&utf8=&format=json&origin=*`;
        let wikiRes = { query: { search: [] } };
        try {
          const res = await fetch(wikiUrl);
          wikiRes = await res.json();
        } catch (e) {
          console.warn("Wiki alias search failed", e);
        }
        
        const searchTerms = [query];
        if (wikiRes.query && wikiRes.query.search) {
          wikiRes.query.search.slice(0, 4).forEach(s => searchTerms.push(s.title));
        }
        
        // Clean up titles (remove years and 'season' etc.)
        const uniqueTerms = Array.from(new Set(searchTerms.map(t => {
          return t.replace(/\d{4}[-–]\d{2,4}/g, '').replace(/season/i, '').replace(/F\.C\./i, '').trim();
        })));
        
        // 2. Fetch all terms concurrently from TheSportsDB
        const teamPromises = uniqueTerms.map(term => 
          fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(term)}`)
            .then(r => r.json()).catch(() => ({}))
        );
        const playerPromises = uniqueTerms.map(term => 
          fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(term)}`)
            .then(r => r.json()).catch(() => ({}))
        );
        
        const teamResults = await Promise.all(teamPromises);
        const playerResults = await Promise.all(playerPromises);
        
        const allTeams = [];
        teamResults.forEach(res => {
          if (res.teams) allTeams.push(...res.teams);
        });
        
        const allPlayers = [];
        playerResults.forEach(res => {
          if (res.player) allPlayers.push(...res.player);
        });
        
        // 3. Deduplicate results
        const uniqueTeams = Array.from(new Map(allTeams.map(t => [t.idTeam, t])).values())
          .filter(t => t.strSport === 'Soccer'); // Ensure it's soccer
          
        const uniquePlayers = Array.from(new Map(allPlayers.map(p => [p.idPlayer, p])).values())
          .filter(p => p.strSport === 'Soccer');
        
        setTeams(uniqueTeams);
        setPlayers(uniquePlayers);
      } catch (err) {
        console.error("Search failed", err);
        setTeams([]);
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 500); // debounce
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="space-y-6">
      <div className="bg-sports-surface border border-sports-border rounded-xl p-5 shadow-lg">
        <h2 className="text-xl font-bold text-sports-text flex items-center gap-2 mb-2">
          <SearchIcon size={20} className="text-sports-primary" />
          Global Search Results
        </h2>
        <p className="text-sm text-sports-textMuted">
          Search for "{query}" across all teams and players globally.
        </p>
      </div>

      {!query || query.length < 2 ? (
        <div className="bg-sports-surface border border-sports-border rounded-xl p-10 text-center text-sports-textMuted shadow-lg">
          Please type at least 2 characters in the search bar above to begin searching for teams and players.
        </div>
      ) : loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4 text-sports-primary animate-pulse">
          <div className="w-8 h-8 border-4 border-sports-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-bold uppercase tracking-wider">Searching Global Database...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Teams Section */}
          <div className="bg-sports-surface border border-sports-border rounded-xl p-5 shadow-lg flex flex-col h-full">
            <h3 className="text-lg font-bold text-sports-text flex items-center gap-2 mb-4">
              <Users size={18} className="text-sports-primary" />
              Teams ({teams.length})
            </h3>
            
            {teams.length === 0 ? (
              <div className="text-sports-textMuted text-sm text-center py-8">No teams found matching "{query}"</div>
            ) : (
              <div className="flex flex-col gap-3">
                {teams.map(team => (
                  <div 
                    key={team.idTeam} 
                    onClick={() => navigate(`/team/${team.idTeam}`)}
                    className="flex items-center gap-4 p-3 rounded-lg border border-sports-border bg-sports-surfaceHover hover:border-sports-primary/50 cursor-pointer transition-all group"
                  >
                    <div className="w-12 h-12 bg-sports-bg rounded-full border border-sports-border flex items-center justify-center p-2 shrink-0">
                      {team.strBadge ? (
                        <img src={team.strBadge} alt={team.strTeam} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                      ) : (
                        <Users size={20} className="text-sports-textMuted" />
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="font-bold text-sports-text truncate">{team.strTeam}</div>
                      <div className="text-xs text-sports-textMuted truncate">{team.strCountry} {team.strLeague && `• ${team.strLeague}`}</div>
                    </div>
                    <ArrowRight size={16} className="text-sports-textMuted opacity-0 group-hover:opacity-100 group-hover:text-sports-primary transition-all -translate-x-2 group-hover:translate-x-0" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Players Section */}
          <div className="bg-sports-surface border border-sports-border rounded-xl p-5 shadow-lg flex flex-col h-full">
            <h3 className="text-lg font-bold text-sports-text flex items-center gap-2 mb-4">
              <User size={18} className="text-sports-primary" />
              Players ({players.length})
            </h3>
            
            {players.length === 0 ? (
              <div className="text-sports-textMuted text-sm text-center py-8">No players found matching "{query}"</div>
            ) : (
              <div className="flex flex-col gap-3">
                {players.map(player => (
                  <div 
                    key={player.idPlayer} 
                    onClick={() => navigate(`/player/${player.idPlayer}`)}
                    className="flex items-center gap-4 p-3 rounded-lg border border-sports-border bg-sports-surfaceHover hover:border-sports-primary/50 cursor-pointer transition-all group"
                  >
                    <div className="w-12 h-12 bg-sports-bg rounded-full border border-sports-border flex items-center justify-center overflow-hidden shrink-0">
                      {player.strThumb ? (
                        <img src={player.strThumb} alt={player.strPlayer} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : player.strCutout ? (
                        <img src={player.strCutout} alt={player.strPlayer} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <User size={20} className="text-sports-textMuted" />
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="font-bold text-sports-text truncate">{player.strPlayer}</div>
                      <div className="text-xs text-sports-textMuted truncate">{player.strTeam} • {player.strPosition}</div>
                    </div>
                    <ArrowRight size={16} className="text-sports-textMuted opacity-0 group-hover:opacity-100 group-hover:text-sports-primary transition-all -translate-x-2 group-hover:translate-x-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
