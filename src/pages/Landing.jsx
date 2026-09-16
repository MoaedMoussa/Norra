import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Bookmark, Star, Bell, BellRing, Trophy, ChevronRight, Menu, PlaySquare, Settings, Flame, Clock, CheckCircle2 } from 'lucide-react';
import { useLiveMatches } from '../hooks/useLiveMatches';
import { useNews } from '../hooks/useNews';
import { useScoreNotifications } from '../hooks/useScoreNotifications';
import { useFavorites } from '../hooks/useFavorites';
import { usePreferences } from '../hooks/usePreferences';
import { LEAGUES } from '../data/sportsMock';
import { Helmet } from 'react-helmet-async';
import FeedFilters from '../components/FeedFilters';
import LiveIndicator from '../components/LiveIndicator';
import StandingsView from '../components/StandingsView';
import NewsTab from '../components/NewsTab';
import HeroMatch from '../components/HeroMatch';
import MatchListItem from '../components/MatchListItem';
import LeagueTrendChart from "../components/LeagueTrendChart";
import PullToRefresh from '../components/PullToRefresh';
import MatchFeedSkeleton from '../components/MatchFeedSkeleton';

export default function Landing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedDate = searchParams.get('date') || null;
  const sportCategory = searchParams.get('sport') || 'soccer/all';
  
  const handleSetSelectedDate = (date) => {
    const newParams = new URLSearchParams(searchParams);
    if (date) {
      newParams.set('date', date);
    } else {
      newParams.delete('date');
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleSetSportCategory = (sport) => {
    const newParams = new URLSearchParams(searchParams);
    if (sport && sport !== 'soccer/all') {
      newParams.set('sport', sport);
    } else {
      newParams.delete('sport');
    }
    setSearchParams(newParams, { replace: true });
  };

  const { matches, loading, loadMore, hasMore, loadingMore, refresh, isValidating } = useLiveMatches(selectedDate, sportCategory);
  const { news, loading: newsLoading } = useNews();
  const { followedTeams, followedLeagues, toggleLeague } = usePreferences();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const { notifiedMatchIds, toggleNotification } = useScoreNotifications(matches, followedTeams, followedLeagues, favoriteIds);
  const navigate = useNavigate();
  // searchParams defined above
  const searchQuery = (searchParams.get('q') || '').toLowerCase();
  const leagueFilter = searchParams.get('league') || '';

  const handleSetLeagueFilter = (leagueId) => {
    const newParams = new URLSearchParams(searchParams);
    if (leagueId) {
      newParams.set('league', leagueId);
    } else {
      newParams.delete('league');
    }
    setSearchParams(newParams, { replace: true });
  };
  
  const [filter, setFilter] = useState('ALL'); // ALL, LIVE, FAVORITES, STANDINGS
  const observerTarget = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [observerTarget, hasMore, loading, loadingMore, loadMore]);

  const isTeamFollowed = (team, teamFull) => {
    if (!team) return false;
    const t = team.toLowerCase();
    const tf = (teamFull || team).toLowerCase();
    
    return Array.from(followedTeams).some(ft => {
      const f = ft.toLowerCase();
      return t === f || tf === f || 
             (t.length > 3 && f.includes(t)) || 
             (tf.length > 3 && f.includes(tf)) ||
             (t.length > 3 && t.includes(f)) ||
             (f === 'manchester city' && t === 'man city') ||
             (f === 'manchester united' && t === 'man united') ||
             (f === 'spurs' && tf.includes('tottenham')) ||
             (f === 'nottm forest' && tf.includes('nottingham')) ||
             (f === 'b. dortmund' && tf.includes('dortmund'));
    });
  };

  const otherMatchesByDate = {};
  matches.forEach(match => {
    const leagueName = match.leagueName || 'World League';
    const isMyTeam = isTeamFollowed(match.homeTeam, match.homeTeamFull) || isTeamFollowed(match.awayTeam, match.awayTeamFull);
    
    if (leagueFilter && match.leagueId !== leagueFilter) {
      return;
    }

    // Check filters
    if (searchQuery) {
      const matchHome = match.homeTeam.toLowerCase().includes(searchQuery);
      const matchAway = match.awayTeam.toLowerCase().includes(searchQuery);
      const matchLeague = leagueName.toLowerCase().includes(searchQuery);
      
      if (!matchHome && !matchAway && !matchLeague) {
        return;
      }
    }

    if (filter === 'LIVE' && match.status !== 'LIVE') return;
    if (filter === 'UPCOMING' && match.state !== 'pre') return;
    if (filter === 'FINISHED' && match.state !== 'post') return;
    if (filter === 'FAVORITES' && !favoriteIds.has(match.id)) return;

    match.isMyTeam = isMyTeam;

    let dateStr = 'Unknown Date';
    let sortKey = '0000-00-00';
    if (match.startDate) {
        const dateObj = new Date(match.startDate);
        if (!isNaN(dateObj)) {
          sortKey = dateObj.toISOString().split('T')[0];
          dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        }
    }
    
    if (!otherMatchesByDate[sortKey]) otherMatchesByDate[sortKey] = { displayDate: dateStr, leagues: {} };
    if (!otherMatchesByDate[sortKey].leagues[match.leagueId]) otherMatchesByDate[sortKey].leagues[match.leagueId] = { name: leagueName, matches: [] };
    otherMatchesByDate[sortKey].leagues[match.leagueId].matches.push(match);
  });

  const sortedDates = Object.keys(otherMatchesByDate).sort((a, b) => a.localeCompare(b));
  const hasVisibleMatches = sortedDates.length > 0;

  // --- Determine Hero Match ---
  let heroMatch = null;
  if (filter === 'ALL' || filter === 'LIVE' || filter === 'UPCOMING' || filter === 'FINISHED') {
    const candidates = matches.filter(m => {
      if (selectedDate && m.startDate && !m.startDate.startsWith(selectedDate)) return false;
      if (filter === 'LIVE' && m.status !== 'LIVE') return false;
      if (filter === 'UPCOMING' && m.state !== 'pre') return false;
      if (filter === 'FINISHED' && m.state !== 'post') return false;
      if (searchQuery) return false; // don't show hero if searching
      return true;
    });

    const getScore = (m) => {
      let score = 0;
      const checkPref = (id) => (followedLeagues?.has ? followedLeagues.has(id) : (followedLeagues?.includes ? followedLeagues.includes(id) : false));
      if (m.isMyTeam) score += 1000;
      if (checkPref(m.leagueId)) score += 100;
      if (m.status === 'LIVE') score += 50;
      
      // slightly prefer matches from big leagues if no preferences
      const idx = LEAGUES.findIndex(l => l.id === m.leagueId);
      if (idx !== -1) score += (30 - Math.min(30, idx));
      return score;
    };

    if (candidates.length > 0) {
      candidates.sort((a, b) => getScore(b) - getScore(a));
      // only show hero if we have a featured match or at least a live one/big league
      if (getScore(candidates[0]) > 0) { 
        heroMatch = candidates[0];
      }
    }
  }

  return (
    <>
      <Helmet>
        <title>Live Football Scores, Results & Fixtures | Norra Scores</title>
      </Helmet>
      
      {filter !== 'STANDINGS' && filter !== 'NEWS' && (
        <FeedFilters 
          selectedDate={selectedDate} 
          onSelectDate={handleSetSelectedDate} 
          sportCategory={sportCategory}
          onSelectSport={handleSetSportCategory}
        />
      )}

      {/* Main Feed Content */}
      <PullToRefresh onRefresh={refresh} isRefreshing={isValidating}>
        <main className="space-y-4">
          <h1 className="sr-only">Live Football Scores, Results & Fixtures</h1>
          {heroMatch && <HeroMatch match={heroMatch} />}
          {/* Filter Bar */}
          {/* League Tabs */}
          {filter !== 'STANDINGS' && filter !== 'NEWS' && filter !== 'FAVORITES' && (
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              <button
                onClick={() => handleSetLeagueFilter('')}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-colors ${!leagueFilter ? 'bg-white text-black shadow-md' : 'bg-sports-surface border border-sports-border text-sports-textMuted hover:text-sports-text'}`}
              >
                All Leagues
              </button>
              {LEAGUES.map(league => (
                <button
                  key={league.id}
                  onClick={() => handleSetLeagueFilter(league.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-colors ${leagueFilter === league.id ? 'bg-sports-primary text-white shadow-md' : 'bg-sports-surface border border-sports-border text-sports-textMuted hover:text-sports-text'}`}
                >
                  {league.logo ? (
                    <img src={league.logo} alt={league.name} className={`w-4 h-4 object-contain transition-opacity ${leagueFilter === league.id ? 'brightness-0 invert opacity-100' : 'brightness-0 invert opacity-60 group-hover:opacity-100'}`} />
                  ) : (
                    <span>{league.icon}</span>
                  )}
                  {league.name}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 mb-6">
            <button 
              onClick={() => setFilter('ALL')}
              className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 ${filter === 'ALL' ? 'bg-sports-primary text-white shadow-[0_0_15px_rgba(255,107,0,0.4)]' : 'bg-sports-surfaceHover text-sports-text hover:bg-sports-border'}`}
            >
              All Matches
            </button>
            <button 
              onClick={() => setFilter('LIVE')}
              className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${filter === 'LIVE' ? 'bg-sports-primary text-white shadow-[0_0_15px_rgba(255,107,0,0.4)]' : 'bg-sports-surfaceHover text-sports-text hover:bg-sports-border'}`}
            >
              {filter === 'LIVE' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>}
              Live
            </button>
            <button 
              onClick={() => setFilter('UPCOMING')}
              className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 ${filter === 'UPCOMING' ? 'bg-sports-primary text-white shadow-[0_0_15px_rgba(255,107,0,0.4)]' : 'bg-sports-surfaceHover text-sports-text hover:bg-sports-border'}`}
            >
              <Clock size={14} className={filter === 'UPCOMING' ? 'text-white' : ''} />
              Upcoming
            </button>
            <button 
              onClick={() => setFilter('FINISHED')}
              className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 ${filter === 'FINISHED' ? 'bg-sports-primary text-white shadow-[0_0_15px_rgba(255,107,0,0.4)]' : 'bg-sports-surfaceHover text-sports-text hover:bg-sports-border'}`}
            >
              <CheckCircle2 size={14} className={filter === 'FINISHED' ? 'text-white' : ''} />
              Finished
            </button>
            <button 
              onClick={() => setFilter('FAVORITES')}
              className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 ${filter === 'FAVORITES' ? 'bg-sports-primary text-white shadow-[0_0_15px_rgba(255,107,0,0.4)]' : 'bg-sports-surfaceHover text-sports-text hover:bg-sports-border'}`}
            >
              <Bookmark size={14} className={filter === 'FAVORITES' ? 'fill-white' : ''} />
              My Matches
            </button>
            <button 
              onClick={() => setFilter('STANDINGS')}
              className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 ${filter === 'STANDINGS' ? 'bg-sports-primary text-white shadow-[0_0_15px_rgba(255,107,0,0.4)]' : 'bg-sports-surfaceHover text-sports-text hover:bg-sports-border'}`}
            >
              <Trophy size={14} />
              Standings
            </button>
            <button 
              onClick={() => setFilter('NEWS')}
              className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 ${filter === 'NEWS' ? 'bg-sports-primary text-white shadow-[0_0_15px_rgba(255,107,0,0.4)]' : 'bg-sports-surfaceHover text-sports-text hover:bg-sports-border'}`}
            >
              <Flame size={14} />
              News
            </button>
          </div>

          {filter === 'STANDINGS' ? (
             <StandingsView />
          ) : filter === 'NEWS' ? (
             <NewsTab />
          ) : (
            <>
              {loading && matches.length === 0 ? (
                <MatchFeedSkeleton />
              ) : !hasVisibleMatches ? (
                <div className="bg-sports-surface border border-sports-border rounded-xl p-16 text-center shadow-lg">
                  <div className="w-16 h-16 bg-sports-surfaceHover rounded-full flex items-center justify-center mx-auto mb-4 border border-sports-border">
                    <Trophy size={24} className="text-sports-textMuted" />
                  </div>
                  <h3 className="text-lg font-bold text-sports-text mb-2">No Matches Found</h3>
                  <p className="text-sports-textMuted max-w-sm mx-auto">There are no matches matching your current filters or selected date.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {sortedDates.map(dateKey => {
                    const dateGroup = otherMatchesByDate[dateKey];
                    const displayDate = dateGroup.displayDate;
                    return (
                      <div key={dateKey} className="space-y-4 animate-in fade-in duration-300">
                        <h2 className="text-[13px] font-bold text-sports-text uppercase tracking-widest pl-2 border-l-2 border-sports-primary">{displayDate}</h2>
                        
                        {Object.keys(dateGroup.leagues).sort((a, b) => {
                          const checkPref = (id) => (followedLeagues?.has ? followedLeagues.has(id) : (followedLeagues?.includes ? followedLeagues.includes(id) : false));
                          const isPrefA = checkPref(a);
                          const isPrefB = checkPref(b);
                          if (isPrefA && !isPrefB) return -1;
                          if (!isPrefA && isPrefB) return 1;
                          
                          const idxA = LEAGUES.findIndex(l => l.id === a);
                          const idxB = LEAGUES.findIndex(l => l.id === b);
                          const validA = idxA !== -1;
                          const validB = idxB !== -1;
                          
                          if (validA && !validB) return -1;
                          if (!validA && validB) return 1;
                          if (validA && validB) return idxA - idxB;
                          
                          return a.localeCompare(b);
                        }).map(leagueId => {
                          const leagueData = dateGroup.leagues[leagueId];
                          const leagueMatches = leagueData.matches;
                          if (leagueMatches.length === 0) return null;
                          
                          const leagueConfig = LEAGUES.find(l => l.id === leagueId);
                          const isPreferredLeague = followedLeagues?.has ? followedLeagues.has(leagueId) : (followedLeagues?.includes ? followedLeagues.includes(leagueId) : false);
                          
                          const sortedMatches = [...leagueMatches].sort((a, b) => (b.isMyTeam ? 1 : 0) - (a.isMyTeam ? 1 : 0));
                          
                          return (
                            <div key={leagueId} className={`bg-sports-surface border rounded-xl overflow-hidden shadow-lg group/league transition-colors ${isPreferredLeague ? 'border-sports-primary/50 shadow-[0_0_15px_rgba(255,107,0,0.1)]' : 'border-sports-border hover:border-sports-border'}`}>
                              {/* League Header */}
                              <div className={`px-4 py-3 border-b flex items-center justify-between cursor-pointer ${isPreferredLeague ? 'bg-gradient-to-r from-[#201814] to-sports-surface border-[#332219]' : 'bg-gradient-to-b from-sports-surfaceHover to-sports-surface border-sports-border'}`}>
                                <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center overflow-hidden shrink-0 ${isPreferredLeague ? 'bg-sports-primary/10 border-sports-primary/30' : 'bg-white/5 border-white/10'}`}>
                                    {leagueConfig?.logo ? (
                                      <img src={leagueConfig.logo} alt={leagueData.name} className="w-6 h-6 object-contain drop-shadow-md" referrerPolicy="no-referrer" />
                                    ) : (
                                      <Trophy size={20} className={isPreferredLeague ? "text-sports-primary" : "text-sports-textMuted"} />
                                    )}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-lg font-bold text-sports-text">{leagueData.name}</span>
                                  </div>
                                </div>
                                <div className="hidden sm:block border-l border-sports-border pl-4 ml-2">
                                  <LeagueTrendChart leagueId={leagueId} />
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleLeague(leagueId);
                                  }}
                                  className="p-1.5 -mr-1.5 rounded-md hover:bg-white/5 transition-colors group/star"
                                  title={isPreferredLeague ? "Unfollow League" : "Follow League"}
                                >
                                  <Star size={16} className={isPreferredLeague ? "fill-sports-primary text-sports-primary" : "text-sports-textMuted group-hover/star:text-sports-textMuted"} />
                                </button>
                              </div>
                              
                              {/* Matches List */}
                              <div className="flex flex-col">
                                {sortedMatches.map(match => (
                                  <MatchListItem key={match.id} match={match} toggleFavorite={toggleFavorite} isFavorite={favoriteIds.has(match.id)} />
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}

              <div ref={observerTarget} className="py-10 flex items-center justify-center">
                {loadingMore && (
                  <div className="flex items-center gap-2 text-sports-primary animate-pulse">
                    <div className="w-4 h-4 border-2 border-sports-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-bold uppercase tracking-wider">Loading More Matches...</span>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
        </PullToRefresh>
    </>
  );
}
