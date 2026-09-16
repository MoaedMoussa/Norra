import React from 'react';

export default function MatchFeedSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {[1, 2].map((dateIdx) => (
        <div key={dateIdx} className="space-y-4">
          <div className="h-4 w-32 bg-sports-surfaceHover animate-pulse rounded border-l-2 border-sports-primary pl-2 ml-2"></div>
          
          {[1, 2].map((leagueIdx) => (
            <div key={leagueIdx} className="bg-sports-surface border border-sports-border rounded-xl overflow-hidden shadow-lg">
              {/* League Header */}
              <div className="px-4 py-3 border-b bg-gradient-to-b from-sports-surfaceHover to-sports-surface border-sports-border flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-sports-surfaceHover animate-pulse shrink-0"></div>
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-48 bg-sports-surfaceHover animate-pulse rounded"></div>
                </div>
              </div>
              
              {/* Matches List */}
              <div className="flex flex-col">
                {[1, 2, 3].map((matchIdx) => (
                  <div key={matchIdx} className="px-3 sm:px-4 py-3 flex items-stretch border-b border-sports-border last:border-0">
                    {/* Time/Status & Favorites */}
                    <div className="w-[60px] flex items-center justify-between shrink-0 border-r border-sports-border pr-2 mr-3">
                      <div className="w-4 h-4 bg-sports-surfaceHover animate-pulse rounded"></div>
                      <div className="w-8 h-3 bg-sports-surfaceHover animate-pulse rounded"></div>
                    </div>
                    {/* Teams and Scores */}
                    <div className="flex-1 flex flex-col gap-2 py-0.5 justify-center">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-sports-surfaceHover animate-pulse"></div>
                          <div className="w-32 h-3 bg-sports-surfaceHover animate-pulse rounded"></div>
                        </div>
                        <div className="w-4 h-4 bg-sports-surfaceHover animate-pulse rounded"></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-sports-surfaceHover animate-pulse"></div>
                          <div className="w-24 h-3 bg-sports-surfaceHover animate-pulse rounded"></div>
                        </div>
                        <div className="w-4 h-4 bg-sports-surfaceHover animate-pulse rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
