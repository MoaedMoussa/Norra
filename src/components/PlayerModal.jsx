import React from 'react';
import { useAthleteDetails } from '../hooks/useAthleteDetails';
import { X, User } from 'lucide-react';

export default function PlayerModal({ leagueId, athleteId, onClose }) {
  const { details, loading } = useAthleteDetails(leagueId, athleteId);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-sports-surface w-full max-w-md rounded-2xl shadow-2xl border border-sports-border overflow-hidden flex flex-col relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-sports-textMuted hover:text-sports-text transition-colors z-10 bg-black/40 rounded-full p-1"
        >
          <X size={20} />
        </button>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-sports-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sports-textMuted text-sm animate-pulse">Loading player data...</p>
          </div>
        ) : !details ? (
          <div className="p-12 text-center text-sports-textMuted text-sm h-64 flex items-center justify-center">
            Player information could not be loaded.
          </div>
        ) : (
          <>
            {/* Header / Bio */}
            <div className="bg-gradient-to-br from-sports-surfaceHover to-sports-surface p-6 border-b border-sports-border flex gap-5 items-center">
              <div className="w-20 h-20 bg-sports-surfaceHover rounded-full overflow-hidden flex-shrink-0 border-2 border-sports-border flex items-center justify-center">
                {details.headshot?.href ? (
                  <img src={details.headshot.href} alt={details.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User size={32} className="text-sports-textMuted" />
                )}
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-bold text-sports-primary uppercase tracking-widest mb-1">
                  {details.team?.displayName || 'Free Agent'} • #{details.jersey || '-'}
                </div>
                <h2 className="text-xl font-bold text-sports-text leading-tight mb-1">{details.displayName}</h2>
                <div className="flex items-center flex-wrap gap-2 text-xs text-sports-textMuted mt-1">
                  <span>{details.position?.displayName}</span>
                  {details.age && (
                    <>
                      <span>•</span>
                      <span>{details.age} yrs</span>
                    </>
                  )}
                  {details.displayHeight && (
                    <>
                      <span>•</span>
                      <span>{details.displayHeight}</span>
                    </>
                  )}
                  {details.flag?.href && (
                    <>
                      <span>•</span>
                      <img src={details.flag.href} alt={details.citizenshipCountry?.alternateId || 'Flag'} className="w-4 h-3 object-cover shadow-sm" referrerPolicy="no-referrer" />
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Body */}
            <div className="p-6 bg-sports-surface">
              <h3 className="text-xs font-bold text-sports-textMuted uppercase tracking-wider mb-4">
                {details.statsSummary?.displayName || 'Season Stats'}
              </h3>
              
              {details.statsSummary?.statistics && details.statsSummary.statistics.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {details.statsSummary.statistics.map((stat, idx) => (
                    <div key={idx} className="bg-sports-surfaceHover border border-sports-border p-3 rounded-xl flex flex-col justify-center">
                      <div className="text-[10px] text-sports-textMuted font-medium uppercase tracking-wider mb-1" title={stat.description}>
                        {stat.displayName}
                      </div>
                      <div className="text-xl font-bold text-sports-text">
                        {stat.displayValue}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-sm text-sports-textMuted border border-dashed border-sports-border rounded-xl">
                  No stats available for this season.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
