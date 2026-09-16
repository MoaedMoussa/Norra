import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Trophy, Globe, MapPin, Calendar, Clock, ChevronRight, Bell, BellOff } from 'lucide-react';
import { usePreferences } from '../hooks/usePreferences';

export default function TeamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { followedTeams, toggleTeam } = usePreferences();
  const [team, setTeam] = useState(null);
  const [nextEvents, setNextEvents] = useState([]);
  const [lastEvents, setLastEvents] = useState([]);
  const [squad, setSquad] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, matches, squad

  useEffect(() => {
    const fetchTeamData = async () => {
      setLoading(true);
      try {
        const [teamRes, nextRes, lastRes, squadRes] = await Promise.all([
          fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupteam.php?id=${id}`),
          fetch(`https://www.thesportsdb.com/api/v1/json/3/eventsnext.php?id=${id}`),
          fetch(`https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${id}`),
          fetch(`https://www.thesportsdb.com/api/v1/json/3/lookup_all_players.php?id=${id}`)
        ]);

        const teamData = await teamRes.json();
        const nextData = await nextRes.json();
        const lastData = await lastRes.json();
        const squadData = await squadRes.json();

        setTeam(teamData.teams ? teamData.teams[0] : null);
        setNextEvents(nextData.events || []);
        setLastEvents(lastData.results || lastData.events || []);
        setSquad(squadData.player || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamData();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center text-sports-primary">
        <div className="w-8 h-8 border-4 border-sports-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="py-20 text-center text-sports-text">
        <h2 className="text-xl font-bold mb-4">Team not found</h2>
        <button onClick={() => navigate(-1)} className="text-sports-primary hover:underline">Go Back</button>
      </div>
    );
  }

  const renderEvent = (ev, type) => {
    const date = new Date(ev.strTimestamp || ev.dateEvent);
    const dateString = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    const timeString = ev.strTime ? ev.strTime.substring(0, 5) : '';

    return (
      <div key={ev.idEvent} className="bg-sports-surfaceHover border border-sports-border rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex flex-col items-center justify-center bg-sports-bg border border-sports-border rounded-lg p-2 w-16 h-16 shrink-0">
            <span className="text-xs text-sports-textMuted uppercase font-bold">{date.toLocaleDateString(undefined, { month: 'short' })}</span>
            <span className="text-xl font-black text-sports-text">{date.getDate()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-sports-textMuted uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
              <Trophy size={10} /> {ev.strLeague}
            </span>
            <div className="font-bold text-sports-text text-sm sm:text-base flex items-center gap-2">
              <span className={ev.idHomeTeam === id ? 'text-sports-primary' : ''}>{ev.strHomeTeam}</span>
              <span className="text-sports-textMuted px-1">vs</span>
              <span className={ev.idAwayTeam === id ? 'text-sports-primary' : ''}>{ev.strAwayTeam}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto justify-end border-t border-sports-border/50 md:border-none pt-3 md:pt-0">
          {type === 'last' ? (
            <div className="bg-sports-surface border border-sports-border rounded-lg px-4 py-2 flex items-center gap-3">
              <span className={`font-bold text-lg ${ev.idHomeTeam === id && parseInt(ev.intHomeScore) > parseInt(ev.intAwayScore) ? 'text-green-500' : 'text-sports-text'}`}>{ev.intHomeScore}</span>
              <span className="text-sports-textMuted">-</span>
              <span className={`font-bold text-lg ${ev.idAwayTeam === id && parseInt(ev.intAwayScore) > parseInt(ev.intHomeScore) ? 'text-green-500' : 'text-sports-text'}`}>{ev.intAwayScore}</span>
            </div>
          ) : (
            <div className="flex flex-col items-end text-sports-textMuted text-xs font-medium">
              <span className="flex items-center gap-1"><Clock size={12} /> {timeString}</span>
              <span className="flex items-center gap-1 mt-1"><MapPin size={12} /> {ev.strVenue || 'TBA'}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-sports-textMuted hover:text-sports-text transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-sports-border shadow-xl">
        <div className="h-48 sm:h-64 bg-gradient-to-r from-sports-surfaceHover to-sports-bg relative">
          {team.strBanner || team.strFanart1 ? (
            <img src={team.strBanner || team.strFanart1} alt="Banner" className="w-full h-full object-cover opacity-40" />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-sports-surface to-transparent" />
        </div>
        
        <div className="relative z-10 px-6 sm:px-10 pb-8 -mt-20 sm:-mt-24 flex flex-col sm:flex-row items-center sm:items-end gap-6">
          <div className="w-32 h-32 sm:w-40 sm:h-40 bg-sports-surface rounded-2xl border-4 border-sports-border shadow-2xl p-4 flex items-center justify-center shrink-0">
            {team.strBadge ? (
              <img src={team.strBadge} alt={team.strTeam} className="w-full h-full object-contain drop-shadow-xl" />
            ) : (
              <Users size={48} className="text-sports-textMuted" />
            )}
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
              <h1 className="text-3xl sm:text-5xl font-black text-sports-text tracking-tight">{team.strTeam}</h1>
              
              <div className="mt-4 sm:mt-0 flex items-center justify-center sm:justify-end">
                <button
                  onClick={() => toggleTeam(team.strTeam)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors border ${
                    followedTeams.has(team.strTeam)
                    ? 'bg-sports-primary/10 border-sports-primary/30 text-sports-primary hover:bg-sports-primary/20' 
                    : 'bg-sports-surfaceHover border-sports-border text-sports-text hover:bg-sports-border/50'
                  }`}
                >
                  {followedTeams.has(team.strTeam) ? (
                    <>
                      <Bell size={16} fill="currentColor" />
                      <span>Notifications On</span>
                    </>
                  ) : (
                    <>
                      <Bell size={16} />
                      <span>Notify Me</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm font-medium text-sports-textMuted uppercase tracking-wider">
              {team.strLeague && (
                <span className="flex items-center gap-1.5"><Trophy size={14} className="text-sports-primary" /> {team.strLeague}</span>
              )}
              {team.strCountry && (
                <span className="flex items-center gap-1.5"><Globe size={14} className="text-sports-primary" /> {team.strCountry}</span>
              )}
              {team.strStadium && (
                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-sports-primary" /> {team.strStadium}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto scrollbar-hide gap-2 border-b border-sports-border">
        {['overview', 'matches', 'squad'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all relative whitespace-nowrap ${
              activeTab === tab ? 'text-sports-primary' : 'text-sports-textMuted hover:text-sports-text'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sports-primary shadow-[0_0_8px_rgba(255,107,0,0.5)]" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-sports-surface border border-sports-border rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-sports-text mb-4">About {team.strTeam}</h3>
              {team.strDescriptionEN ? (
                <div className="text-sports-textMuted text-sm leading-relaxed space-y-4 whitespace-pre-wrap">
                  {team.strDescriptionEN}
                </div>
              ) : (
                <p className="text-sports-textMuted text-sm italic">No English description available.</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-sports-surface border border-sports-border rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-sports-text mb-4">Quick Facts</h3>
              <ul className="space-y-4">
                <li className="flex flex-col">
                  <span className="text-xs text-sports-textMuted uppercase font-bold tracking-wider mb-1">Formed Year</span>
                  <span className="text-sm font-medium text-sports-text">{team.intFormedYear || 'Unknown'}</span>
                </li>
                <li className="flex flex-col">
                  <span className="text-xs text-sports-textMuted uppercase font-bold tracking-wider mb-1">Stadium</span>
                  <span className="text-sm font-medium text-sports-text">{team.strStadium || 'Unknown'}</span>
                </li>
                <li className="flex flex-col">
                  <span className="text-xs text-sports-textMuted uppercase font-bold tracking-wider mb-1">Capacity</span>
                  <span className="text-sm font-medium text-sports-text">{team.intStadiumCapacity ? parseInt(team.intStadiumCapacity).toLocaleString() : 'Unknown'}</span>
                </li>
                {team.strWebsite && (
                  <li className="flex flex-col">
                    <span className="text-xs text-sports-textMuted uppercase font-bold tracking-wider mb-1">Website</span>
                    <a href={`https://${team.strWebsite}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-sports-primary hover:underline">{team.strWebsite}</a>
                  </li>
                )}
                {team.strTwitter && (
                  <li className="flex flex-col">
                    <span className="text-xs text-sports-textMuted uppercase font-bold tracking-wider mb-1">Twitter</span>
                    <a href={`https://${team.strTwitter}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-sports-primary hover:underline">@{team.strTwitter.replace(/.*twitter\.com\//i, '')}</a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'matches' && (
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-sports-text flex items-center gap-2">
              <Calendar size={20} className="text-sports-primary" /> Upcoming Matches
            </h3>
            {nextEvents.length === 0 ? (
              <div className="bg-sports-surface border border-sports-border rounded-xl p-8 text-center text-sports-textMuted">
                No upcoming matches scheduled.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {nextEvents.map(ev => renderEvent(ev, 'next'))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-sports-text flex items-center gap-2">
              <Clock size={20} className="text-sports-primary" /> Recent Results
            </h3>
            {lastEvents.length === 0 ? (
              <div className="bg-sports-surface border border-sports-border rounded-xl p-8 text-center text-sports-textMuted">
                No recent matches found.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {lastEvents.map(ev => renderEvent(ev, 'last'))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'squad' && (
        <div className="bg-sports-surface border border-sports-border rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-sports-text mb-6 flex items-center gap-2">
            <Users size={20} className="text-sports-primary" /> First Team Squad
          </h3>
          
          {squad.length === 0 ? (
            <div className="text-center text-sports-textMuted py-8">Squad information not available.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {squad.map(player => (
                <div 
                  key={player.idPlayer}
                  onClick={() => navigate(`/player/${player.idPlayer}`)}
                  className="bg-sports-surfaceHover border border-sports-border rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:border-sports-primary/50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-sports-bg rounded-full border border-sports-border overflow-hidden shrink-0">
                    {player.strThumb || player.strCutout ? (
                      <img src={player.strCutout || player.strThumb} alt={player.strPlayer} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users size={20} className="text-sports-textMuted" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="font-bold text-sm text-sports-text truncate group-hover:text-sports-primary transition-colors">{player.strPlayer}</div>
                    <div className="text-xs text-sports-textMuted truncate">{player.strPosition}</div>
                  </div>
                  <ChevronRight size={16} className="text-sports-textMuted opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
