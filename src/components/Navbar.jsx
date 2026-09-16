import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Search, Github, Settings, Users, User, ArrowRight, X, BookOpen } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query || query.length < 2) {
        setTeams([]);
        setPlayers([]);
        return;
      }
      setLoading(true);
      try {
        const [teamsRes, playersRes] = await Promise.all([
          fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(query)}`),
          fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(query)}`)
        ]);
        const teamsData = await teamsRes.json();
        const playersData = await playersRes.json();
        setTeams(teamsData.teams || []);
        setPlayers(playersData.player || []);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const handleSelect = (path) => {
    setIsOpen(false);
    setQuery('');
    navigate(path);
  };

  const sports = [
    { name: 'Football', path: '/' },
    { name: 'Basketball', path: '/sport/basketball' },
    { name: 'Tennis', path: '/sport/tennis' },
    { name: 'Motorsport', path: '/sport/motorsport' },
    { name: 'Cricket', path: '/sport/cricket' },
    { name: 'Ice Hockey', path: '/sport/hockey' }
  ];

  return (
    <nav className="bg-sports-bg border-b border-sports-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-sports-primary rounded-lg flex items-center justify-center text-white font-bold italic text-sm leading-none shadow-[0_0_15px_rgba(255,107,0,0.4)] group-hover:shadow-[0_0_20px_rgba(255,107,0,0.6)] transition-all">
                N
              </div>
              <span className="font-bold text-xl text-sports-text tracking-tight">
                Norra<span className="text-sports-primary">Scores</span>
              </span>
            </Link>
          </div>

          {/* Search */}
          <div className="flex flex-1 max-w-2xl mx-4 sm:mx-8 relative group" ref={dropdownRef}>
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
              <Search size={16} className="text-sports-textMuted group-focus-within:text-sports-primary transition-colors" />
            </div>
            <input 
              type="text" 
              value={query}
              onChange={handleSearchChange}
              onFocus={() => setIsOpen(true)}
              placeholder="Global Search (Teams, Players, Coaches...)" 
              className="block w-full pl-9 sm:pl-11 pr-10 py-2.5 border border-sports-border rounded-full bg-sports-surface/50 text-sports-text placeholder-sports-textMuted focus:outline-none focus:border-sports-primary/50 focus:bg-sports-surface focus:ring-1 focus:ring-sports-primary/50 text-sm transition-all shadow-inner"
            />
            {query && (
              <button 
                onClick={() => { setQuery(''); setIsOpen(false); }}
                className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-sports-textMuted hover:text-sports-text transition-colors"
              >
                <X size={16} />
              </button>
            )}

            {/* Dropdown Results */}
            {isOpen && query.length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-sports-surface border border-sports-border rounded-xl shadow-2xl max-h-[80vh] overflow-hidden z-[100] flex flex-col">
                {loading ? (
                  <div className="p-8 flex items-center justify-center text-sports-primary animate-pulse gap-2">
                    <div className="w-5 h-5 border-2 border-sports-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-bold uppercase tracking-wider">Searching Global Database...</span>
                  </div>
                ) : (teams.length === 0 && players.length === 0) ? (
                  <div className="p-8 text-center text-sports-textMuted text-sm">
                    No teams, players, or coaches found for "{query}". Try another search term.
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-sports-border overflow-hidden">
                    {/* Teams Column */}
                    <div className="flex-1 p-3 flex flex-col min-h-0">
                      <div className="px-3 py-2 text-xs font-bold text-sports-textMuted uppercase tracking-wider flex items-center gap-2 border-b border-sports-border/50 mb-2 shrink-0">
                        <Users size={14} /> Teams ({teams.length})
                      </div>
                      <div className="flex flex-col gap-1 overflow-y-auto scrollbar-thin">
                        {teams.map(team => (
                          <div 
                            key={team.idTeam} 
                            onClick={() => handleSelect(`/team/${team.idTeam}`)}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-sports-surfaceHover cursor-pointer transition-colors group"
                          >
                            <div className="w-8 h-8 bg-sports-bg rounded-full border border-sports-border flex items-center justify-center p-1.5 shrink-0">
                              {team.strBadge ? (
                                <img src={team.strBadge} alt={team.strTeam} className="w-full h-full object-contain" />
                              ) : (
                                <Users size={14} className="text-sports-textMuted" />
                              )}
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <div className="font-bold text-sm text-sports-text truncate group-hover:text-sports-primary transition-colors">{team.strTeam}</div>
                              <div className="text-[10px] text-sports-textMuted truncate">{team.strCountry}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Players Column */}
                    <div className="flex-1 p-3 flex flex-col min-h-0">
                      <div className="px-3 py-2 text-xs font-bold text-sports-textMuted uppercase tracking-wider flex items-center gap-2 border-b border-sports-border/50 mb-2 shrink-0">
                        <User size={14} /> Players & Coaches ({players.length})
                      </div>
                      <div className="flex flex-col gap-1 overflow-y-auto scrollbar-thin">
                        {players.map(player => (
                          <div 
                            key={player.idPlayer} 
                            onClick={() => handleSelect(`/player/${player.idPlayer}`)}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-sports-surfaceHover cursor-pointer transition-colors group"
                          >
                            <div className="w-8 h-8 bg-sports-bg rounded-full border border-sports-border overflow-hidden shrink-0">
                              {player.strThumb ? (
                                <img src={player.strThumb} alt={player.strPlayer} className="w-full h-full object-cover" />
                              ) : player.strCutout ? (
                                <img src={player.strCutout} alt={player.strPlayer} className="w-full h-full object-cover scale-110 translate-y-1" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <User size={14} className="text-sports-textMuted" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <div className="font-bold text-sm text-sports-text truncate group-hover:text-sports-primary transition-colors">{player.strPlayer}</div>
                              <div className="text-[10px] text-sports-textMuted truncate">{player.strTeam} • {player.strPosition}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/knowledge-base" className="text-sports-textMuted hover:text-sports-text transition-colors flex items-center gap-1.5" title="AI Knowledge Base">
              <BookOpen size={18} />
              <span className="hidden sm:inline text-[10px] sm:text-xs font-bold tracking-wide uppercase">AI Data</span>
            </Link>
            <Link to="/preferences" className="text-sports-textMuted hover:text-sports-text transition-colors flex items-center gap-1.5" title="Preferences">
              <Settings size={18} />
              <span className="hidden sm:inline text-[10px] sm:text-xs font-bold tracking-wide uppercase">Preferences</span>
            </Link>
            
            <div className="hidden sm:flex items-center border-l border-sports-border pl-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="text-sports-textMuted hover:text-sports-text transition-colors flex items-center gap-2"
                title="GitHub"
              >
                <Github size={18} />
              </a>
            </div>
          </div>
        </div>
        
        {/* Horizontal Sports Navigation */}
        <div className="flex items-center overflow-x-auto scrollbar-hide py-3 gap-6 border-t border-sports-border/50">
          {sports.map((sport) => {
            const isActive = location.pathname === sport.path;
            return (
              <Link
                key={sport.name}
                to={sport.path}
                className={`whitespace-nowrap text-xs font-bold tracking-wider uppercase transition-colors relative pb-1 ${
                  isActive ? 'text-sports-primary' : 'text-sports-textMuted hover:text-sports-text'
                }`}
              >
                {sport.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sports-primary shadow-[0_0_8px_rgba(255,107,0,0.5)]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
