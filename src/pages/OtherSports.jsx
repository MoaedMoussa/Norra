import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function OtherSports() {
  const { sport } = useParams();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const sportConfigs = {
    cricket: { name: 'Cricket', apis: ['cricket/13554', 'cricket/8039', 'cricket/8122', 'cricket/12420'], title: 'Live Cricket Scores' }, // ESPNcricinfo
    tennis: { name: 'Tennis', apis: ['tennis/atp', 'tennis/wta'], title: 'Live Tennis Scores' },
    basketball: { name: 'Basketball', apis: ['basketball/nba', 'basketball/wnba', 'basketball/mens-college-basketball', 'basketball/womens-college-basketball', 'basketball/euroleague'], title: 'Basketball Scores' },
    hockey: { name: 'Ice Hockey', apis: ['hockey/nhl', 'hockey/mens-college-hockey'], title: 'Ice Hockey Scores' },
    motorsport: { name: 'Motorsport', apis: ['racing/f1', 'racing/nascar-premier', 'racing/indycar'], title: 'Motorsport Events' }
  };

  const config = sportConfigs[sport] || sportConfigs.basketball;

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    
    // Fetch live scores from all APIs for the given sport
    const fetchPromises = config.apis.map(api => 
      fetch(`/api/espn?url=${encodeURIComponent(`https://site.api.espn.com/apis/site/v2/sports/${api}/scoreboard`)}`)
        .then(r => r.json())
        .then(data => {
            const leagueName = data.leagues?.[0]?.name || data.leagues?.[0]?.shortName || api.split('/').pop().toUpperCase();
            const events = data.events || [];
            return events.map(event => ({ ...event, _leagueName: leagueName }));
        })
        .catch(e => { console.error(`Error fetching ${api}:`, e); return []; })
    );

    Promise.all(fetchPromises).then(results => {
      if (mounted) {
        // Flatten the array of arrays
        const allMatches = results.flat();
        setMatches(allMatches);
        setLoading(false);
      }
    });

    return () => { mounted = false; };
  }, [sport]);

  return (
    <div className="min-h-screen bg-sports-bg flex flex-col font-sans text-sports-text">
      <Helmet>
        <title>{config.title} | Norra Scores</title>
      </Helmet>
      
      

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-sports-text mb-6 uppercase tracking-wider">{config.title}</h1>
        
        {loading ? (
          <div className="text-center py-12 text-sports-textMuted animate-pulse border border-sports-border rounded-xl bg-sports-surface">
            Loading {config.name.toLowerCase()} scores...
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12 text-sports-textMuted border border-sports-border rounded-xl bg-sports-surface">
            No live {config.name.toLowerCase()} matches found today.
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(
              matches.reduce((acc, match) => {
                const league = match._leagueName || 'Other';
                if (!acc[league]) acc[league] = [];
                acc[league].push(match);
                return acc;
              }, {})
            ).map(([leagueName, leagueMatches]) => (
              <div key={leagueName} className="mb-6">
                <div className="bg-sports-surfaceHover px-4 py-3 mb-4 rounded-xl border border-sports-border flex items-center gap-3 shadow-sm">
                  <h2 className="text-[15px] font-bold text-sports-text uppercase tracking-wider">{leagueName}</h2>
                </div>
                <div className="space-y-4">
                  {leagueMatches.map(match => {
                    const comp = match.competitions?.[0];
                    if (!comp) return null;
                    
                    // Standard Home/Away parsing
                    const home = comp.competitors?.find(c => c.homeAway === 'home');
                    const away = comp.competitors?.find(c => c.homeAway === 'away');
                    
                    // Fallback for non-standard events (like Motorsport)
                    const isStandardMatch = home && away;
                    
                    return (
                      <div key={match.id} className="bg-sports-surface rounded-xl border border-sports-border overflow-hidden hover:border-sports-border transition-colors p-4 md:p-6 shadow-md flex flex-col md:flex-row items-center gap-6">
                        {isStandardMatch ? (
                          <div className="flex-1 flex flex-col gap-3 w-full">
                            <div className="flex justify-between items-center w-full">
                              <div className="flex items-center gap-3">
                                {home?.team?.logo && <img src={home.team.logo} alt="" className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />}
                                <span className={`text-sm md:text-base font-bold ${parseInt(home?.score) > parseInt(away?.score) ? 'text-sports-text' : 'text-[#bbb]'}`}>{home?.team?.displayName || home?.athlete?.displayName}</span>
                              </div>
                              <span className="text-xl font-display font-bold text-sports-primary">{home?.score || 0}</span>
                            </div>
                            
                            <div className="flex justify-between items-center w-full">
                              <div className="flex items-center gap-3">
                                {away?.team?.logo && <img src={away.team.logo} alt="" className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />}
                                <span className={`text-sm md:text-base font-bold ${parseInt(away?.score) > parseInt(home?.score) ? 'text-sports-text' : 'text-[#bbb]'}`}>{away?.team?.displayName || away?.athlete?.displayName}</span>
                              </div>
                              <span className="text-xl font-display font-bold text-sports-primary">{away?.score || 0}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 flex flex-col gap-2 w-full text-left">
                             <h3 className="text-sports-text font-bold text-lg">{match.name}</h3>
                             <p className="text-sports-textMuted text-sm">{comp.type?.abbreviation || 'Event'} - {match.season?.year}</p>
                          </div>
                        )}
                        
                        <div className="w-full md:w-auto flex justify-center md:justify-end border-t border-sports-border pt-4 md:pt-0 md:border-t-0 md:border-l md:pl-6 shrink-0">
                          <div className={`text-xs font-bold px-3 py-1.5 rounded-full border ${match.status.type.state === 'in' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-sports-surfaceHover text-sports-textMuted border-sports-border'}`}>
                            {match.status.type.detail}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      
    </div>
  );
}
