import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { mutate } from 'swr';
import useSWRInfinite from 'swr/infinite';
import { LEAGUES } from '../data/sportsMock';

const formatYYYYMMDD = (date) => {
  return date.getFullYear() + String(date.getMonth() + 1).padStart(2, '0') + String(date.getDate()).padStart(2, '0');
};

const parseSlug = (slug) => {
  if (!slug) return 'World League';
  let name = slug.replace(/^\d{4}-\d{2}-/, '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  if (name.toLowerCase() === 'regular season') return 'World League';
  return name;
};

const fetchMatchesForDate = async (dateStr, sportCategory = 'soccer/all') => {
  const url = `/api/espn?url=${encodeURIComponent(`https://site.api.espn.com/apis/site/v2/sports/${sportCategory}/scoreboard?limit=1000&dates=${dateStr}`)}`;
  try {
    const res = await fetch(url);
    const result = await res.json();
    if (!result || !result.events) return [];
    
    return result.events.map(event => {
      const comp = event.competitions[0];
      const homeCompetitor = comp.competitors.find(c => c.homeAway === 'home');
      const awayCompetitor = comp.competitors.find(c => c.homeAway === 'away');
      
      let status = 'SCHEDULED';
      let minute = null;
      let clockSeconds = 0;
      let displayClock = '';
      
      if (event.status.type.state === 'in') {
        status = 'LIVE';
        minute = event.status.displayClock?.replace("'", "");
        clockSeconds = event.status.clock || 0;
        displayClock = event.status.displayClock || "";
      } else if (event.status.type.state === 'post') {
        status = 'FT';
      } else {
        status = event.status.type.shortDetail || 'SCHEDULED';
      }

      const uidMatch = event.uid?.match(/~l:(\d+)/);
      let leagueId = uidMatch ? uidMatch[1] : 'all';
      const foundLeague = LEAGUES.find(l => l.espnId === leagueId);
      if (foundLeague) leagueId = foundLeague.id;
      const leagueName = foundLeague ? foundLeague.name : (event.season?.slug ? parseSlug(event.season.slug) : (event.league?.name || 'World League'));
      
      return {
        id: event.id,
        leagueId,
        leagueName,
        homeTeam: homeCompetitor?.team?.shortDisplayName || homeCompetitor?.team?.displayName || 'TBD',
        homeTeamFull: homeCompetitor?.team?.displayName || 'TBD',
        awayTeam: awayCompetitor?.team?.shortDisplayName || awayCompetitor?.team?.displayName || 'TBD',
        awayTeamFull: awayCompetitor?.team?.displayName || 'TBD',
        homeLogo: homeCompetitor?.team?.logo || '',
        awayLogo: awayCompetitor?.team?.logo || '',
        homeScore: parseInt(homeCompetitor?.score) || 0,
        awayScore: parseInt(awayCompetitor?.score) || 0,
        status,
        state: event.status.type.state,
        minute,
        clockSeconds,
        displayClock,
        startDate: event.date,
        details: comp.details || []
      };
    });
  } catch (err) {
    console.error("Error fetching live matches for date", dateStr, err);
    return [];
  }
};

export function useLiveMatches(baseDateString = null, sportCategory = 'soccer/all') {
  
  const getKey = (pageIndex, previousPageData) => {
    let baseDate = new Date();
    if (baseDateString) {
      const cleanStr = baseDateString.replace(/-/g, '');
      const y = cleanStr.substring(0, 4);
      const m = cleanStr.substring(4, 6);
      const d = cleanStr.substring(6, 8);
      baseDate = new Date(y, parseInt(m) - 1, d);
    }
    
    const targetDate = new Date(baseDate);
    targetDate.setDate(targetDate.getDate() + pageIndex);
    
    return `matches|${formatYYYYMMDD(targetDate)}|${sportCategory}`;
  };

  const { data, error, isLoading, size, setSize, isValidating, mutate: boundMutate } = useSWRInfinite(
    getKey,
    (key) => {
      const parts = key.split('|');
      const dateStr = parts[1];
      const cat = parts[2];
      return fetchMatchesForDate(dateStr, cat);
    },
    {
      revalidateOnFocus: true,
      
      keepPreviousData: true
    }
  );

  useEffect(() => {
    if (!boundMutate) return;
    const socket = io('/', { path: '/socket.io' }); // connects to the current host
    
    socket.on('liveMatchesUpdate', (result) => {
      if (!result || !result.events) return;
      
      const updatedEvents = result.events.map(event => {
        const comp = event.competitions[0];
        const homeCompetitor = comp.competitors.find(c => c.homeAway === 'home');
        const awayCompetitor = comp.competitors.find(c => c.homeAway === 'away');
        
        let status = 'SCHEDULED';
        let minute = null;
        let clockSeconds = 0;
        let displayClock = '';
        
        if (event.status.type.state === 'in') {
          status = 'LIVE';
          minute = event.status.displayClock?.replace("'", "");
          clockSeconds = event.status.clock || 0;
          displayClock = event.status.displayClock || "";
        } else if (event.status.type.state === 'post') {
          status = 'FT';
        } else {
          status = event.status.type.shortDetail || 'SCHEDULED';
        }

        const uidMatch = event.uid?.match(/~l:(\d+)/);
        let leagueId = uidMatch ? uidMatch[1] : 'all';
        const foundLeague = LEAGUES.find(l => l.espnId === leagueId);
        if (foundLeague) leagueId = foundLeague.id;
        const leagueName = foundLeague ? foundLeague.name : parseSlug(event.season?.slug);
        
        return {
          id: event.id,
          leagueId,
          leagueName,
          homeTeam: homeCompetitor?.team?.shortDisplayName || homeCompetitor?.team?.displayName || 'TBD',
          homeTeamFull: homeCompetitor?.team?.displayName || 'TBD',
          awayTeam: awayCompetitor?.team?.shortDisplayName || awayCompetitor?.team?.displayName || 'TBD',
          awayTeamFull: awayCompetitor?.team?.displayName || 'TBD',
          homeLogo: homeCompetitor?.team?.logo || '',
          awayLogo: awayCompetitor?.team?.logo || '',
          homeScore: parseInt(homeCompetitor?.score) || 0,
          awayScore: parseInt(awayCompetitor?.score) || 0,
          status,
          state: event.status.type.state,
          minute,
          clockSeconds,
          displayClock,
          startDate: event.date,
          details: comp.details || []
        };
      });

      // Update the infinite SWR cache directly
      boundMutate((currentData) => {
        if (!currentData) return currentData;
        return currentData.map(page => {
           return page.map(match => {
             const updatedMatch = updatedEvents.find(e => e.id === match.id);
             return updatedMatch ? updatedMatch : match;
           });
        });
      }, { revalidate: false });
    });

    return () => {
      socket.disconnect();
    };
  }, [boundMutate]);

  const matches = data ? data.flat() : [];
  
  return { 
    matches, 
    loading: isLoading,
    loadingMore: isValidating && data && typeof data[size - 1] !== "undefined",
    isValidating,
    refresh: () => boundMutate(),
    loadMore: () => setSize(size + 1),
    hasMore: size < 7
  };
}
