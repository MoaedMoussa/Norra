import React from 'react';
import { MapPin, Users, UserRound, Calendar, TrendingUp, Cloud, Thermometer, Droplets, Wind, Home } from 'lucide-react';

export default function MatchInfo({ summary, match }) {
  if (!summary || !summary.gameInfo) {
    return <div className="text-center py-10 text-sports-textMuted text-sm">Info not available yet.</div>;
  }

  const { venue, attendance, officials } = summary.gameInfo;
  
  // Format date
  const dateObj = new Date(match?.date || Date.now());
  const dateStr = dateObj.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });


  // Extract form
  let homeForm = '-----';
  let awayForm = '-----';
  
  if (summary?.lastFiveGames) {
    const homeFormGames = summary.lastFiveGames.find(t => t.team.displayName === match?.homeTeamFull) || summary.lastFiveGames[0];
    const awayFormGames = summary.lastFiveGames.find(t => t.team.displayName === match?.awayTeamFull) || summary.lastFiveGames[1];
    
    if (homeFormGames && homeFormGames.events) {
      homeForm = homeFormGames.events.map(e => e.gameResult || '-').join('');
    }
    if (awayFormGames && awayFormGames.events) {
      awayForm = awayFormGames.events.map(e => e.gameResult || '-').join('');
    }
  }

  const renderForm = (formStr) => {
    return formStr.split('').map((result, idx) => {
      let bgColor = 'bg-sports-border';
      if (result === 'W') bgColor = 'bg-green-500';
      if (result === 'L') bgColor = 'bg-red-500';
      if (result === 'D') bgColor = 'bg-yellow-500';
      return (
        <div key={idx} className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-white ${bgColor}`}>
          {result}
        </div>
      );
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-8">
      {match?.state === 'pre' && (
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-sports-textMuted mb-4 border-b border-sports-border pb-2 flex items-center gap-2">
            <TrendingUp size={16} className="text-sports-primary" />
            Form Guide & Preview
          </h4>
          <div className="bg-sports-surfaceHover rounded-xl p-5 border border-sports-border shadow-sm mb-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {match.homeLogo && <img src={match.homeLogo} alt="" className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />}
                  <span className="text-sports-text font-bold">{match.homeTeam}</span>
                </div>
                <div className="flex items-center gap-1">
                  {renderForm(homeForm)}
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-sports-border">
                <div className="flex items-center gap-3">
                  {match.awayLogo && <img src={match.awayLogo} alt="" className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />}
                  <span className="text-sports-text font-bold">{match.awayTeam}</span>
                </div>
                <div className="flex items-center gap-1">
                  {renderForm(awayForm)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

            <div>
        <h4 className="text-sm font-bold uppercase tracking-wider text-sports-textMuted mb-6 border-b border-sports-border pb-2">Match Information</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-sports-surfaceHover rounded-xl p-5 border border-sports-border flex items-start gap-4 shadow-sm">
            <Calendar size={24} className="text-sports-primary mt-1" />
            <div>
              <span className="block text-xs text-sports-textMuted uppercase font-bold tracking-wider mb-1">Date & Time</span>
              <span className="block text-sports-text font-medium text-sm">{dateStr}</span>
              <span className="block text-sports-text font-bold">{timeStr}</span>
            </div>
          </div>

          

          {attendance > 0 && (
            <div className="bg-sports-surfaceHover rounded-xl p-5 border border-sports-border flex items-start gap-4 shadow-sm">
              <Users size={24} className="text-sports-primary mt-1" />
              <div>
                <span className="block text-xs text-sports-textMuted uppercase font-bold tracking-wider mb-1">Attendance</span>
                <span className="block text-sports-text font-medium text-sm">{attendance.toLocaleString()}</span>
              </div>
            </div>
          )}

          {officials && officials.length > 0 && (
            <div className="bg-sports-surfaceHover rounded-xl p-5 border border-sports-border flex items-start gap-4 shadow-sm">
              <UserRound size={24} className="text-sports-primary mt-1" />
              <div>
                <span className="block text-xs text-sports-textMuted uppercase font-bold tracking-wider mb-1">Referee</span>
                <span className="block text-sports-text font-medium text-sm">{officials[0]?.fullName || 'Unknown'}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {venue && (
        <div className="mt-8">
          <h4 className="text-sm font-bold uppercase tracking-wider text-sports-textMuted mb-4 border-b border-sports-border pb-2 flex items-center gap-2">
            <MapPin size={16} className="text-sports-primary" />
            About the Venue
          </h4>
          <div className="bg-sports-surfaceHover rounded-xl overflow-hidden border border-sports-border shadow-sm">
            <div className="h-32 bg-gradient-to-br from-sports-surfaceHover to-sports-border relative flex items-center justify-center border-b border-sports-border">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
              <Home size={48} className="text-[#333]" />
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div>
                    <h5 className="text-2xl font-bold text-sports-text mb-1">{venue.fullName}</h5>
                    <p className="text-sports-textMuted text-sm flex items-center gap-1.5">
                      <MapPin size={14} /> 
                      {venue.address?.city}{venue.address?.country ? `, ${venue.address.country}` : ''}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-6 pt-4 border-t border-sports-border">
                    {venue.capacity > 0 && (
                      <div>
                        <span className="block text-[10px] text-sports-textMuted uppercase font-bold tracking-wider mb-1">Capacity</span>
                        <span className="text-sports-text font-medium flex items-center gap-1.5">
                          <Users size={14} className="text-sports-primary" />
                          {venue.capacity.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {attendance > 0 && (
                      <div>
                        <span className="block text-[10px] text-sports-textMuted uppercase font-bold tracking-wider mb-1">Match Attendance</span>
                        <span className="text-sports-text font-medium flex items-center gap-1.5">
                          <Users size={14} className="text-sports-textMuted" />
                          {attendance.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
