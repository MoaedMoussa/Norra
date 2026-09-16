import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      const saved = localStorage.getItem('norra_favorite_matches');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('norra_favorite_matches', JSON.stringify([...favoriteIds]));
    } catch (e) {
      // ignore
    }
  }, [favoriteIds]);

  const toggleFavorite = (matchId) => {
    setFavoriteIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(matchId)) {
        newSet.delete(matchId);
      } else {
        newSet.add(matchId);
      }
      return newSet;
    });
  };

  return { favoriteIds, toggleFavorite };
}
