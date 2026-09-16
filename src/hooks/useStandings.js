import { useState, useEffect } from 'react';

export function useStandings(leagueId, sport = 'soccer') {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const fetchStandings = async () => {
      try {
        const response = await fetch(`/api/espn?url=${encodeURIComponent(`https://site.api.espn.com/apis/v2/sports/${sport}/${leagueId}/standings`)}`);
        const data = await response.json();
        
        if (mounted) {
          // Flatten standard groups if present
          if (data.children && data.children.length > 0) {
            setStandings(data.children[0].standings.entries);
          } else {
            setStandings([]);
          }
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      }
    };

    fetchStandings();
    
    // Poll every minute for live standings
    const interval = setInterval(fetchStandings, 60000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [leagueId, sport]);

  return { standings, loading, error };
}

