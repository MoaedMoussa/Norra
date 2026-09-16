import { useState, useEffect } from 'react';
import { LEAGUE_PATHS } from './useMatchDetails';

export function useAthleteDetails(leagueId, athleteId) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    if (!leagueId || !athleteId) {
      setLoading(false);
      return;
    }

    const path = LEAGUE_PATHS[leagueId] || 'eng.1';
    const url = `/api/espn?url=${encodeURIComponent(`https://site.api.espn.com/apis/common/v3/sports/soccer/${path}/athletes/${athleteId}`)}`;

    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        setDetails(data.athlete);
      })
      .catch(err => {
        console.error("Error fetching athlete details:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [leagueId, athleteId]);

  return { details, loading };
}
