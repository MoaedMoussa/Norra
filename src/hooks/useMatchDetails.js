import { useState, useEffect } from 'react';

export const LEAGUE_PATHS = {
  pl: 'eng.1',
  ll: 'esp.1',
  sa: 'ita.1',
  ucl: 'uefa.champions'
};

export function useMatchDetails(leagueId, matchId) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    if (!leagueId || !matchId) {
      setLoading(false);
      return;
    }

    const path = LEAGUE_PATHS[leagueId] || 'eng.1';
    const url = `/api/espn?url=${encodeURIComponent(`https://site.api.espn.com/apis/site/v2/sports/soccer/${path}/summary?event=${matchId}`)}`;

    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        setDetails(data);
      })
      .catch(err => {
        console.error("Error fetching match details:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [leagueId, matchId]);

  return { details, loading };
}
