import { useState, useEffect } from 'react';

export function usePreferences() {
  const [followedTeams, setFollowedTeams] = useState(() => {
    try {
      const saved = localStorage.getItem('norra_followed_teams');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [followedLeagues, setFollowedLeagues] = useState(() => {
    try {
      const saved = localStorage.getItem('norra_followed_leagues');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('norra_language') || 'en';
  });
  
  const [notificationSound, setNotificationSound] = useState(() => {
    return localStorage.getItem('norra_notification_sound') || 'default';
  });

  useEffect(() => {
    try {
      localStorage.setItem('norra_followed_teams', JSON.stringify([...followedTeams]));
      window.dispatchEvent(new Event('norra_preferences_updated'));
    } catch (e) {}
  }, [followedTeams]);

  useEffect(() => {
    try {
      localStorage.setItem('norra_followed_leagues', JSON.stringify([...followedLeagues]));
    } catch (e) {}
  }, [followedLeagues]);

  useEffect(() => {
    localStorage.setItem('norra_language', language);
  }, [language]);
  
  useEffect(() => {
    localStorage.setItem('norra_notification_sound', notificationSound);
  }, [notificationSound]);

  const toggleTeam = (teamName) => {
    setFollowedTeams(prev => {
      const newSet = new Set(prev);
      if (newSet.has(teamName)) newSet.delete(teamName);
      else newSet.add(teamName);
      return newSet;
    });
  };

  const toggleLeague = (leagueId) => {
    setFollowedLeagues(prev => {
      const newSet = new Set(prev);
      if (newSet.has(leagueId)) newSet.delete(leagueId);
      else newSet.add(leagueId);
      return newSet;
    });
  };

  return { followedTeams, followedLeagues, language, setLanguage, notificationSound, setNotificationSound, toggleTeam, toggleLeague };
}
