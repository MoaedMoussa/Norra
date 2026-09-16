import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Calendar, Activity, Trophy, Clock } from 'lucide-react';

export default function PlayerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [nextEvents, setNextEvents] = useState([]);
  const [lastEvents, setLastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchPlayerData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${id}`);
        const data = await res.json();
        const p = data.players ? data.players[0] : null;
        setPlayer(p);

        if (p && p.idTeam) {
          const [nextRes, lastRes] = await Promise.all([
            fetch(`https://www.thesportsdb.com/api/v1/json/3/eventsnext.php?id=${p.idTeam}`),
            fetch(`https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${p.idTeam}`)
          ]);
          const nextData = await nextRes.json();
          const lastData = await lastRes.json();
          setNextEvents(nextData.events || []);
          setLastEvents(lastData.results || lastData.events || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayerData();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center text-sports-primary">
        <div className="w-8 h-8 border-4 border-sports-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!player) {
    return (
      <div className="py-20 text-center text-sports-text">
        <h2 className="text-xl font-bold mb-4">Player not found</h2>
        <button onClick={() => navigate(-1)} className="text-sports-primary hover:underline">Go Back</button>
      </div>
    );
  }

  const renderEvent = (ev, type) => {
    const date = new Date(ev.strTimestamp || ev.dateEvent);
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
              <span className={ev.idHomeTeam === player.idTeam ? 'text-sports-primary' : ''}>{ev.strHomeTeam}</span>
              <span className="text-sports-textMuted px-1">vs</span>
              <span className={ev.idAwayTeam === player.idTeam ? 'text-sports-primary' : ''}>{ev.strAwayTeam}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto justify-end border-t border-sports-border/50 md:border-none pt-3 md:pt-0">
          {type === 'last' ? (
            <div className="bg-sports-surface border border-sports-border rounded-lg px-4 py-2 flex items-center gap-3">
              <span className={`font-bold text-lg ${ev.idHomeTeam === player.idTeam && parseInt(ev.intHomeScore) > parseInt(ev.intAwayScore) ? 'text-green-500' : 'text-sports-text'}`}>{ev.intHomeScore}</span>
              <span className="text-sports-textMuted">-</span>
              <span className={`font-bold text-lg ${ev.idAwayTeam === player.idTeam && parseInt(ev.intAwayScore) > parseInt(ev.intHomeScore) ? 'text-green-500' : 'text-sports-text'}`}>{ev.intAwayScore}</span>
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

      {/* Hero Profile */}
      <div className="bg-sports-surface border border-sports-border rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 sm:p-10 flex flex-col md:flex-row gap-8 items-center md:items-start relative">
          {/* Banner Graphic Background (optional based on sport) */}
          <div className="absolute top-0 right-0 w-full md:w-1/2 h-full opacity-5 pointer-events-none overflow-hidden">
            <Trophy size={400} className="absolute -top-20 -right-20 text-sports-primary" />
          </div>

          <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-2xl bg-sports-bg border border-sports-border flex items-center justify-center shrink-0 overflow-hidden shadow-2xl relative z-10">
            {player.strThumb ? (
              <img src={player.strThumb} alt={player.strPlayer} className="w-full h-full object-cover" />
            ) : player.strCutout ? (
              <img src={player.strCutout} alt={player.strPlayer} className="w-full h-full object-cover scale-110 translate-y-4" />
            ) : (
              <User size={64} className="text-sports-textMuted" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {player.strNumber && (
              <div className="absolute bottom-4 right-4 text-3xl font-black text-white italic drop-shadow-lg opacity-80">
                #{player.strNumber}
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left pt-2 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sports-primary/10 border border-sports-primary/30 text-sports-primary text-xs font-bold uppercase tracking-wider mb-4">
              {player.strSport} • {player.strPosition}
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black text-sports-text mb-2 tracking-tight">{player.strPlayer}</h1>
            
            {player.strTeam && (
               <Link to={`/team/${player.idTeam}`} className="inline-flex text-lg font-bold text-sports-textMuted hover:text-sports-primary transition-colors mb-6 flex items-center gap-2 justify-center md:justify-start">
                 {player.strTeam}
               </Link>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div className="bg-sports-surfaceHover rounded-xl p-4 border border-sports-border flex flex-col items-center md:items-start">
                <span className="text-[10px] text-sports-textMuted uppercase font-bold tracking-wider mb-1 flex items-center gap-1"><MapPin size={10}/> Nationality</span>
                <span className="text-sm font-bold text-sports-text">{player.strNationality || 'Unknown'}</span>
              </div>
              <div className="bg-sports-surfaceHover rounded-xl p-4 border border-sports-border flex flex-col items-center md:items-start">
                <span className="text-[10px] text-sports-textMuted uppercase font-bold tracking-wider mb-1 flex items-center gap-1"><Calendar size={10}/> Born</span>
                <span className="text-sm font-bold text-sports-text">{player.dateBorn || 'Unknown'}</span>
              </div>
              <div className="bg-sports-surfaceHover rounded-xl p-4 border border-sports-border flex flex-col items-center md:items-start">
                <span className="text-[10px] text-sports-textMuted uppercase font-bold tracking-wider mb-1 flex items-center gap-1"><Activity size={10}/> Height</span>
                <span className="text-sm font-bold text-sports-text">{player.strHeight || 'Unknown'}</span>
              </div>
              <div className="bg-sports-surfaceHover rounded-xl p-4 border border-sports-border flex flex-col items-center md:items-start">
                <span className="text-[10px] text-sports-textMuted uppercase font-bold tracking-wider mb-1 flex items-center gap-1"><Activity size={10}/> Weight</span>
                <span className="text-sm font-bold text-sports-text">{player.strWeight || 'Unknown'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto scrollbar-hide gap-2 border-t border-sports-border bg-sports-surfaceHover/50">
          {['overview', 'team matches'].map((tab) => (
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
        <div className="p-6 sm:p-10">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold text-sports-text mb-4">Biography</h3>
                {player.strDescriptionEN ? (
                  <div className="text-sports-textMuted text-sm leading-relaxed space-y-4 whitespace-pre-wrap">
                    {player.strDescriptionEN}
                  </div>
                ) : (
                  <p className="text-sports-textMuted text-sm italic">No English biography available.</p>
                )}
              </div>
              
              <div className="space-y-6">
                <div className="bg-sports-bg border border-sports-border rounded-xl p-6">
                  <h3 className="text-sm font-bold text-sports-text uppercase tracking-wider mb-4">Player Details</h3>
                  <ul className="space-y-4">
                    <li className="flex flex-col">
                      <span className="text-[10px] text-sports-textMuted uppercase font-bold tracking-wider mb-1">Status</span>
                      <span className="text-sm font-medium text-sports-text">{player.strStatus || 'Active'}</span>
                    </li>
                    <li className="flex flex-col">
                      <span className="text-[10px] text-sports-textMuted uppercase font-bold tracking-wider mb-1">Birthplace</span>
                      <span className="text-sm font-medium text-sports-text">{player.strBirthLocation || 'Unknown'}</span>
                    </li>
                    <li className="flex flex-col">
                      <span className="text-[10px] text-sports-textMuted uppercase font-bold tracking-wider mb-1">Wage / Signing</span>
                      <span className="text-sm font-medium text-sports-text">{player.strWage || 'Undisclosed'} / {player.strSigning || 'N/A'}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team matches' && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-sports-text flex items-center gap-2">
                  <Calendar size={20} className="text-sports-primary" /> {player.strTeam} - Upcoming Matches
                </h3>
                {nextEvents.length === 0 ? (
                  <div className="bg-sports-bg border border-sports-border rounded-xl p-8 text-center text-sports-textMuted">
                    No upcoming matches scheduled for {player.strTeam}.
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {nextEvents.map(ev => renderEvent(ev, 'next'))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-sports-text flex items-center gap-2">
                  <Clock size={20} className="text-sports-primary" /> {player.strTeam} - Recent Results
                </h3>
                {lastEvents.length === 0 ? (
                  <div className="bg-sports-bg border border-sports-border rounded-xl p-8 text-center text-sports-textMuted">
                    No recent matches found for {player.strTeam}.
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {lastEvents.map(ev => renderEvent(ev, 'last'))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
