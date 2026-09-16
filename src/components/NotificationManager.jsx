import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { setupOnMessageListener, requestNotificationPermission } from '../messaging';
import { toast } from '../hooks/use-toast';

export default function NotificationManager() {
  const [followedTeams, setFollowedTeams] = useState(() => {
    try {
      const saved = localStorage.getItem('norra_followed_teams');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem('norra_followed_teams');
        setFollowedTeams(saved ? new Set(JSON.parse(saved)) : new Set());
      } catch (e) {}
    };
    
    // Listen to storage events from other tabs
    window.addEventListener('storage', handleStorage);
    
    // Also set up a custom event for same-tab updates
    window.addEventListener('norra_preferences_updated', handleStorage);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('norra_preferences_updated', handleStorage);
    };
  }, []);

  const previousMatchesRef = useRef({});

  useEffect(() => {
    if (followedTeams.size > 0 && Notification.permission === 'default') {
      requestNotificationPermission();
    }
  }, [followedTeams]);

  useEffect(() => {
    const playNotificationSound = () => {
      try {
        const soundType = localStorage.getItem('norra_notification_sound') || 'default';
        if (soundType === 'mute') return;
        
        let url = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';
        if (soundType === 'whistle') url = 'https://actions.google.com/sounds/v1/sports/referee_whistle.ogg';
        if (soundType === 'cheer') url = 'https://actions.google.com/sounds/v1/crowds/crowd_cheer.ogg';
        
        const audio = new Audio(url);
        audio.play().catch(e => console.log('Audio play failed:', e));
      } catch (e) {}
    };

    const setupFCM = async () => {
      const unsubscribe = await setupOnMessageListener((payload) => {
        const title = payload?.notification?.title || 'Norra Scores Alert';
        const body = payload?.notification?.body || 'Match update received!';
        toast(title, body);
        playNotificationSound();
        
        // Also fire native notification if we are not focused
        if (document.hidden && Notification.permission === 'granted') {
          new Notification(title, { body, icon: '/pwa-192x192.png' });
        }
      });
      return unsubscribe;
    };
    
    let unsubscribeFn = () => {};
    setupFCM().then(fn => { unsubscribeFn = fn; });
    
    return () => {
      unsubscribeFn();
    };
  }, []);

  useEffect(() => {
    const activeFavorites = Array.from(followedTeams);
    if (activeFavorites.length === 0) return;

    const socket = io('/', { path: '/socket.io' });

    socket.on('liveMatchesUpdate', (result) => {
      if (!result || !result.events) return;

      const currentMatches = {};

      result.events.forEach(event => {
        const comp = event.competitions[0];
        const homeTeam = comp.competitors.find(c => c.homeAway === 'home');
        const awayTeam = comp.competitors.find(c => c.homeAway === 'away');
        
        const homeName = homeTeam?.team?.displayName || '';
        const awayName = awayTeam?.team?.displayName || '';
        
        const isHomeFav = activeFavorites.some(f => homeName.toLowerCase().includes(f.toLowerCase()));
        const isAwayFav = activeFavorites.some(f => awayName.toLowerCase().includes(f.toLowerCase()));
        
        if (isHomeFav || isAwayFav) {
          const matchId = event.id;
          const homeScore = parseInt(homeTeam?.score) || 0;
          const awayScore = parseInt(awayTeam?.score) || 0;
          const state = event.status.type.state; // 'pre', 'in', 'post'

          currentMatches[matchId] = {
            homeName,
            awayName,
            homeScore,
            awayScore,
            state
          };

          const prev = previousMatchesRef.current[matchId];
          
          if (prev) {
            if (prev.state === 'pre' && state === 'in') {
              sendNotification('Match Started!', `${homeName} vs ${awayName} has begun.`);
            }
            if (state === 'in') {
              if (homeScore > prev.homeScore) {
                sendNotification('Goal!', `${homeName} scored! ${homeName} ${homeScore} - ${awayScore} ${awayName}`);
              }
              if (awayScore > prev.awayScore) {
                sendNotification('Goal!', `${awayName} scored! ${homeName} ${homeScore} - ${awayScore} ${awayName}`);
              }
            }
          }
        }
      });

      previousMatchesRef.current = currentMatches;
    });

    return () => {
      socket.disconnect();
    };
  }, [followedTeams]);

  const sendNotification = (title, options) => {
    toast(title, options);
    try {
      const soundType = localStorage.getItem('norra_notification_sound') || 'default';
      if (soundType !== 'mute') {
        let url = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';
        if (soundType === 'whistle') url = 'https://actions.google.com/sounds/v1/sports/referee_whistle.ogg';
        if (soundType === 'cheer') url = 'https://actions.google.com/sounds/v1/crowds/crowd_cheer.ogg';
        
        const audio = new Audio(url);
        audio.play().catch(e => console.log('Audio play failed:', e));
      }
    } catch (e) {}
    
    if (document.hidden && Notification.permission === 'granted') {
      new Notification(title, { body: options, icon: '/pwa-192x192.png' });
    }
  };

  return null;
}