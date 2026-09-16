import { useState, useEffect, useRef } from 'react';
import { toast } from './use-toast';
import { requestNotificationPermission } from '../messaging';

export function useScoreNotifications(matches, followedTeams = new Set(), followedLeagues = new Set(), favoriteIds = new Set()) {
  const [notifiedMatchIds, setNotifiedMatchIds] = useState(() => {
    try {
      const saved = localStorage.getItem('norra_notified_matches');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [remindedMatchIds, setRemindedMatchIds] = useState(() => {
    try {
      const saved = localStorage.getItem('norra_reminded_matches');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [remindedLineupIds, setRemindedLineupIds] = useState(() => {
    try {
      const saved = localStorage.getItem('norra_reminded_lineups');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const prevMatchesRef = useRef(matches);

  useEffect(() => {
    try {
      localStorage.setItem('norra_notified_matches', JSON.stringify([...notifiedMatchIds]));
    } catch (e) {}
  }, [notifiedMatchIds]);

  useEffect(() => {
    try {
      localStorage.setItem('norra_reminded_matches', JSON.stringify([...remindedMatchIds]));
    } catch (e) {}
  }, [remindedMatchIds]);

  useEffect(() => {
    try {
      localStorage.setItem('norra_reminded_lineups', JSON.stringify([...remindedLineupIds]));
    } catch (e) {}
  }, [remindedLineupIds]);

  useEffect(() => {
    const prevMatches = prevMatchesRef.current;
    
    if (matches && matches.length > 0) {
      let newlyReminded = [];
      let newlyRemindedLineups = [];

      matches.forEach(currentMatch => {
        const isFavorite = favoriteIds.has(currentMatch.id);
        const shouldNotify = notifiedMatchIds.has(currentMatch.id) || 
                             followedTeams.has(currentMatch.homeTeam) || 
                             followedTeams.has(currentMatch.awayTeam) ||
                             followedLeagues.has(currentMatch.leagueId);

        if (shouldNotify || isFavorite) {
          const triggerAlert = (title, description) => {
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(title, { body: description });
            }
            toast({ title, description, duration: 5000 });
          };

          // Check upcoming kickoff and lineup
          if (currentMatch.startDate && currentMatch.status !== 'LIVE' && currentMatch.status !== 'FT') {
            const timeUntil = new Date(currentMatch.startDate).getTime() - Date.now();
            const minutesUntil = timeUntil / (1000 * 60);
            
            // 60 minutes for lineups
            if (minutesUntil > 0 && minutesUntil <= 60 && !remindedLineupIds.has(currentMatch.id) && !newlyRemindedLineups.includes(currentMatch.id)) {
              triggerAlert(
                `📋 OFFICIAL LINEUPS: ${currentMatch.homeTeam} vs ${currentMatch.awayTeam}`,
                `Official lineups have been released ahead of kickoff.`
              );
              newlyRemindedLineups.push(currentMatch.id);
            }

            // 15 minutes for kickoff
            if (minutesUntil > 0 && minutesUntil <= 15 && !remindedMatchIds.has(currentMatch.id) && !newlyReminded.includes(currentMatch.id)) {
              triggerAlert(
                `⏰ UPCOMING: ${currentMatch.homeTeam} vs ${currentMatch.awayTeam}`,
                `Match is starting in ${Math.ceil(minutesUntil)} minutes.`
              );
              newlyReminded.push(currentMatch.id);
            }
          }

          if (shouldNotify && prevMatches) {
            const prevMatch = prevMatches.find(m => m.id === currentMatch.id);
            
            if (prevMatch) {
              // Check if score changed
              if (currentMatch.homeScore > prevMatch.homeScore || currentMatch.awayScore > prevMatch.awayScore) {
                let scorer = '';
                if (currentMatch.homeScore > prevMatch.homeScore && currentMatch.awayScore === prevMatch.awayScore) {
                  scorer = currentMatch.homeTeam;
                } else if (currentMatch.awayScore > prevMatch.awayScore && currentMatch.homeScore === prevMatch.homeScore) {
                  scorer = currentMatch.awayTeam;
                }
                triggerAlert(
                  `⚽ GOAL! ${currentMatch.homeTeam} ${currentMatch.homeScore} - ${currentMatch.awayScore} ${currentMatch.awayTeam}`,
                  scorer ? `${scorer} just scored!` : 'The score has updated.'
                );
              }

              // Check for red cards
              if ((currentMatch.homeRedCards || 0) > (prevMatch.homeRedCards || 0)) {
                triggerAlert(
                  `🟥 RED CARD: ${currentMatch.homeTeam}`,
                  `${currentMatch.homeTeam} is down a player!`
                );
              }
              if ((currentMatch.awayRedCards || 0) > (prevMatch.awayRedCards || 0)) {
                triggerAlert(
                  `🟥 RED CARD: ${currentMatch.awayTeam}`,
                  `${currentMatch.awayTeam} is down a player!`
                );
              }

              // Check for penalties
              if (currentMatch.details && prevMatch.details && currentMatch.details.length > prevMatch.details.length) {
                const newEvents = currentMatch.details.slice(prevMatch.details.length);
                const penaltyScored = newEvents.find(e => e.penaltyKick === true && e.scoringPlay === true);
                const penaltyMissed = newEvents.find(e => e.penaltyKick === true && e.scoringPlay === false);
                
                if (penaltyScored) {
                  triggerAlert(
                    `🎯 PENALTY SCORED: ${currentMatch.homeTeam} vs ${currentMatch.awayTeam}`,
                    `A penalty kick was just scored!`
                  );
                } else if (penaltyMissed) {
                  triggerAlert(
                    `❌ PENALTY MISSED: ${currentMatch.homeTeam} vs ${currentMatch.awayTeam}`,
                    `A penalty kick was just missed!`
                  );
                }
              }
              
              // Check if match just started
              if (prevMatch.status !== 'LIVE' && currentMatch.status === 'LIVE') {
                triggerAlert(
                  `KICKOFF: ${currentMatch.homeTeam} vs ${currentMatch.awayTeam}`,
                  'The match has started.'
                );
              }

              // Check if match just finished
              if (prevMatch.status === 'LIVE' && currentMatch.status === 'FT') {
                triggerAlert(
                  `FULL TIME: ${currentMatch.homeTeam} ${currentMatch.homeScore} - ${currentMatch.awayScore} ${currentMatch.awayTeam}`,
                  'The match has ended.'
                );
              }
            }
          }
        }
      });

      if (newlyReminded.length > 0) {
        setRemindedMatchIds(prev => {
          const next = new Set(prev);
          newlyReminded.forEach(id => next.add(id));
          return next;
        });
      }
      
      if (newlyRemindedLineups.length > 0) {
        setRemindedLineupIds(prev => {
          const next = new Set(prev);
          newlyRemindedLineups.forEach(id => next.add(id));
          return next;
        });
      }
    }

    prevMatchesRef.current = matches;
  }, [matches, notifiedMatchIds, followedTeams, followedLeagues, remindedMatchIds, remindedLineupIds, favoriteIds]);

  const toggleNotification = (matchId) => {
    setNotifiedMatchIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(matchId)) {
        newSet.delete(matchId);
        toast({
          title: "Notifications Disabled",
          description: "You will no longer receive alerts for this match.",
          duration: 2000
        });
      } else {
        newSet.add(matchId);
        toast({
          title: "Notifications Enabled",
          description: "You will receive alerts when the score changes.",
          duration: 2000
        });
        
        if ('Notification' in window && Notification.permission === 'default') {
          requestNotificationPermission();
        }
      }
      return newSet;
    });
  };

  return { notifiedMatchIds, toggleNotification };
}
