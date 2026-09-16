import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Share2, Bookmark, ShieldAlert, Bell, BellRing } from 'lucide-react';
import { useLiveMatches } from '../hooks/useLiveMatches';
import { useScoreNotifications } from '../hooks/useScoreNotifications';
import { useFavorites } from '../hooks/useFavorites';
import { usePreferences } from '../hooks/usePreferences';
import { toast } from '../hooks/use-toast';
import { LEAGUES } from '../data/sportsMock';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import LiveIndicator from '../components/LiveIndicator';
import MatchLineups from '../components/MatchLineups';
import MatchH2H from '../components/MatchH2H';
import MatchAiPredictor from '../components/MatchAiPredictor';
import MatchPreMatchSummary from '../components/MatchPreMatchSummary';
import MatchStats from '../components/MatchStats';
import MatchAnalytics from '../components/MatchAnalytics';
import MatchInfo from '../components/MatchInfo';
import MatchMotm from '../components/MatchMotm';
import StandingsView from '../components/StandingsView';
import MatchPoll from '../components/MatchPoll';
import { useMatchDetails } from '../hooks/useMatchDetails';

export default function MatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { matches, loading } = useLiveMatches();
  const { followedTeams, followedLeagues } = usePreferences();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const { notifiedMatchIds, toggleNotification } = useScoreNotifications(matches, followedTeams, followedLeagues, favoriteIds);
  const [activeTab, setActiveTab] = useState(() => {
    const matchData = JSON.parse(localStorage.getItem(`match_status_${id}`) || '{}');
    return matchData.state === 'pre' ? 'INFO' : 'SUMMARY';
  });

  const match = matches.find(m => m.id === id);

  useEffect(() => {
    if (match) {
      localStorage.setItem(`match_status_${id}`, JSON.stringify({ status: match.status }));
    }
  }, [match, id]);

  const { details: matchSummary, loading: summaryLoading } = useMatchDetails(match?.leagueId, id);
  
  const getAiInsight = () => {
    if (summaryLoading) return "Analyzing match momentum and historical data...";
    
    if (matchSummary?.pickcenter?.[0]?.moneyline) {
      const ml = matchSummary.pickcenter[0].moneyline;
      const homeOdds = parseInt(ml.home?.close?.odds || ml.home?.open?.odds || '0');
      const awayOdds = parseInt(ml.away?.close?.odds || ml.away?.open?.odds || '0');
      
      const calcProb = (odds) => odds < 0 ? Math.abs(odds) / (Math.abs(odds) + 100) : 100 / (odds + 100);
      
      const homeProb = homeOdds ? calcProb(homeOdds) : 0;
      const awayProb = awayOdds ? calcProb(awayOdds) : 0;
      
      if (homeProb > awayProb && homeProb > 0) {
        return `Based on live momentum and historical data, our models predict a ${Math.round(homeProb * 100)}% probability of ${match.homeTeam} winning.`;
      } else if (awayProb > homeProb && awayProb > 0) {
        return `Based on live momentum and historical data, our models predict a ${Math.round(awayProb * 100)}% probability of ${match.awayTeam} winning.`;
      } else if (homeProb === awayProb && homeProb > 0) {
        return `Based on live momentum and historical data, our models predict a tight contest with equal probability for both teams.`;
      }
    }
    
    return `Based on live momentum and historical data, our models are projecting a tight contest between ${match.homeTeam} and ${match.awayTeam}.`;
  };

  if (loading || !match) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
          <p className="text-sports-textMuted animate-pulse">Loading match data...</p>
        </div>
    );
  }

  if (!match) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
          <p className="text-sports-textMuted">Match not found.</p>
        </div>
    );
  }

  const league = Object.values(LEAGUES).find(l => l.id === match.leagueId);

  const handleShare = async () => {
    const shareData = {
      title: `${match.homeTeam} vs ${match.awayTeam} | Norra Scores`,
      text: `Check out the match details for ${match.homeTeam} vs ${match.awayTeam}!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast('Link Copied', 'Match link copied to clipboard.');
    }
  };

  return (
        <>
      <Helmet>
        <title>{match.homeTeam} vs {match.awayTeam} | Norra Scores</title>
        <link rel="canonical" href={`https://norra.ai/match/${id}`} />
        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://norra.ai/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Matches",
                "item": "https://norra.ai/"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "${match.homeTeam} vs ${match.awayTeam}"
              }
            ]
          }
          `}
        </script>
      </Helmet>
      
      <main className="max-w-4xl w-full mx-auto px-4 py-6 space-y-6">
        
        {/* Breadcrumb / Top Bar */}
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-xs text-sports-textMuted hover:text-sports-text transition-colors">
            <ChevronLeft size={16} /> Back to Live Scores
          </button>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleShare}
              className="text-sports-textMuted hover:text-sports-text transition-colors"
              title="Share Match"
            >
              <Share2 size={16} />
            </button>
            <button 
              onClick={() => toggleFavorite(match.id)}
              className={`transition-colors ${favoriteIds.has(match.id) ? 'text-sports-primary' : 'text-sports-textMuted hover:text-sports-primary'}`}
              title="Bookmark Match"
            >
              <Bookmark size={16} className={favoriteIds.has(match.id) ? 'fill-sports-primary' : ''} />
            </button>
            <button 
              onClick={() => toggleNotification(match.id)}
              className={`transition-colors ${notifiedMatchIds.has(match.id) ? 'text-sports-primary' : 'text-sports-textMuted hover:text-sports-primary'}`}
              title="Toggle score alerts"
            >
              {notifiedMatchIds.has(match.id) ? <BellRing size={16} className="animate-pulse" /> : <Bell size={16} />}
            </button>
          </div>
        </div>

        {/* Scoreboard Header */}
        <div className="bg-sports-surface rounded-2xl border border-sports-border overflow-hidden shadow-xl shadow-black/20">
          <div className="bg-sports-surfaceHover px-4 py-2 flex items-center justify-center gap-2 text-xs font-semibold border-b border-sports-border">
            <span>{league?.icon || '⚽'}</span>
            <span className="text-sports-textMuted">{league?.name || match.leagueName || 'World League'}</span>
          </div>
          
          <div className="p-6 md:p-10 flex flex-col items-center">
            
            <div className="flex justify-center mb-6">
              {match.status === 'LIVE' ? (
                <LiveIndicator 
                  clockSeconds={match.clockSeconds} 
                  displayClock={match.displayClock} 
                  minute={match.minute} 
                />
              ) : (
                <div className="text-xs font-bold px-3 py-1 bg-sports-surfaceHover rounded-full border border-sports-border text-sports-textMuted shadow-inner">
                  {match.status === 'FT' ? 'FULL TIME' : match.status}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between w-full max-w-lg">
              <div className="flex flex-col items-center gap-3 flex-1">
                <div className="w-20 h-20 md:w-28 md:h-28 bg-sports-surfaceHover rounded-full flex items-center justify-center border border-sports-border text-2xl shadow-lg overflow-hidden p-2">
                  {match.homeLogo ? <img src={match.homeLogo} alt={match.homeTeam} className="w-full h-full object-contain" referrerPolicy="no-referrer" /> : match.homeTeam.substring(0, 1)}
                </div>
                <span className="font-bold text-lg text-center md:text-xl">{match.homeTeam}</span>
              </div>

              <div className="flex items-center justify-center px-4">
                <motion.div key={`home-${match.homeScore}`} initial={match.state === 'in' ? { scale: 1.5, color: '#ffffff' } : false} animate={{ scale: 1, color: '#ff6b00' }} transition={{ duration: 0.5 }} className="text-4xl md:text-6xl font-display font-bold tracking-tighter text-sports-primary drop-shadow-[0_0_15px_rgba(255,107,0,0.3)]">
                  {match.state === 'pre' ? '-' : match.homeScore}
                </motion.div>
                <div className="text-2xl md:text-3xl text-sports-textMuted mx-2 md:mx-4">:</div>
                <motion.div key={`away-${match.awayScore}`} initial={match.state === 'in' ? { scale: 1.5, color: '#ffffff' } : false} animate={{ scale: 1, color: '#ff6b00' }} transition={{ duration: 0.5 }} className="text-4xl md:text-6xl font-display font-bold tracking-tighter text-sports-primary drop-shadow-[0_0_15px_rgba(255,107,0,0.3)]">
                  {match.state === 'pre' ? '-' : match.awayScore}
                </motion.div>
              </div>

              <div className="flex flex-col items-center gap-3 flex-1">
                <div className="w-20 h-20 md:w-28 md:h-28 bg-sports-surfaceHover rounded-full flex items-center justify-center border border-sports-border text-2xl shadow-lg overflow-hidden p-2">
                  {match.awayLogo ? <img src={match.awayLogo} alt={match.awayTeam} className="w-full h-full object-contain" referrerPolicy="no-referrer" /> : match.awayTeam.substring(0, 1)}
                </div>
                <span className="font-bold text-lg text-center md:text-xl">{match.awayTeam}</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Predictor */}
        <MatchAiPredictor match={match} summary={matchSummary} summaryLoading={summaryLoading} />

        <MatchPoll match={match} summary={matchSummary} />

        {match?.state !== 'pre' && <MatchMotm summary={matchSummary} />}

        {/* Tabs / Match Info (Mock) */}
        <div className="bg-sports-surface rounded-xl border border-sports-border shadow-lg">
          <div className="flex overflow-x-auto border-b border-sports-border scrollbar-hide">
            {['INFO', 'SUMMARY', 'STATS', 'ANALYTICS', 'LINE-UPS', 'H2H', 'TABLE'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-xs font-bold whitespace-nowrap transition-colors relative ${activeTab === tab ? 'text-sports-primary' : 'text-sports-textMuted hover:text-sports-text'}`}
              >
                {tab}
                {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sports-primary" />}
              </button>
            ))}
          </div>
          
          {activeTab === 'LINE-UPS' ? (
            <MatchLineups leagueId={match.leagueId} matchId={match.id} />
          ) : activeTab === 'H2H' ? (
            <MatchH2H leagueId={match.leagueId} matchId={match.id} />
          ) : activeTab === 'ANALYTICS' ? (
            <MatchAnalytics summary={matchSummary} />
          ) : activeTab === 'STATS' ? (
            <MatchStats summary={matchSummary} />
          ) : activeTab === 'INFO' ? (
            <MatchInfo summary={matchSummary} match={match} />
          ) : activeTab === 'SUMMARY' ? (
            <div className="p-6">
              <h4 className="text-sm font-bold mb-4 uppercase tracking-wider text-sports-textMuted">Match Events</h4>
              <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-1/2 before:-ml-px before:w-0.5 before:bg-sports-border">
                {summaryLoading ? (
                  <p className="text-xs text-sports-textMuted text-center py-12">Loading events...</p>
                ) : matchSummary?.keyEvents && matchSummary.keyEvents.length > 0 ? (
                  [...matchSummary.keyEvents].reverse().map((ev, idx) => {
                    const isHome = ev.team?.id === matchSummary.boxscore?.teams?.[0]?.team?.id;
                    const isAway = ev.team?.id === matchSummary.boxscore?.teams?.[1]?.team?.id;
                    if (!isHome && !isAway && ev.type?.text !== 'End Regular Time') return null;
                    
                    const isHomeEvent = isHome || (ev.team?.id === matchSummary.boxscore?.teams?.[0]?.team?.id);

                    return (
                      <div key={idx} className={`relative flex items-center justify-between w-full ${isHomeEvent ? 'flex-row-reverse' : ''}`}>
                        <div className="w-5/12"></div>
                        <div className="w-2/12 flex justify-center relative">
                          <div className="w-8 h-8 rounded-full bg-sports-surfaceHover border-2 border-sports-border flex items-center justify-center text-[10px] font-bold text-sports-textMuted z-10 shadow-lg">
                            {ev.clock?.displayValue || '-'}
                          </div>
                        </div>
                        <div className="w-5/12 relative">
                          <div className={`bg-sports-surfaceHover rounded-xl p-3 border border-sports-border flex items-start gap-3 shadow-md ${isHomeEvent ? 'text-right flex-row-reverse mr-4' : 'ml-4'}`}>
                            <div className="mt-1 text-lg">
                              {ev.type?.text === 'Goal' && '⚽'}
                              {ev.type?.text === 'Yellow Card' && <div className="w-3 h-4 bg-yellow-400 rounded-sm"></div>}
                              {ev.type?.text === 'Red Card' && <div className="w-3 h-4 bg-red-500 rounded-sm"></div>}
                              {ev.type?.text === 'Substitution' && '🔄'}
                              {ev.type?.text === 'End Regular Time' && '⏱️'}
                            </div>
                            <div className="flex-1">
                              <span className="block font-bold text-[13px] text-sports-text leading-tight mb-1">{ev.shortText || ev.type?.text}</span>
                              <span className="block text-[11px] text-sports-textMuted leading-relaxed">{ev.text}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : match?.state === 'pre' ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                    <div className="w-16 h-16 bg-sports-surfaceHover rounded-full flex items-center justify-center mb-4 border border-sports-border">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sports-textMuted"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                    <p className="text-sm font-bold text-sports-text mb-1">Match Not Started</p>
                    <p className="text-xs text-sports-textMuted max-w-[250px]">The match summary and live events timeline will appear here once the game begins.</p>
                  </div>
                ) : (
                  <p className="text-xs text-sports-textMuted text-center py-12">No significant events yet.</p>
                )}
              </div>
            </div>
          ) : activeTab === 'TABLE' ? (
            <div className="p-4 md:p-6">
              <StandingsView initialLeagueId={match.leagueId} hideFilter={true} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 opacity-50">
               <p className="text-sm">Content for {activeTab} is not available yet.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
