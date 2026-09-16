import React from 'react';

export default function StandingsSkeleton() {
  return (
    <div className="overflow-x-auto w-full animate-in fade-in duration-300">
      <table className="w-full text-left text-sm whitespace-nowrap min-w-[600px]">
        <thead>
          <tr className="text-sports-textMuted bg-sports-surfaceHover/50 border-b border-sports-border text-[11px] uppercase tracking-wider">
            <th className="py-3 px-4 font-bold text-center w-12">#</th>
            <th className="py-3 px-2 font-bold">Club</th>
            <th className="py-3 px-2 font-bold text-center w-10">MP</th>
            <th className="py-3 px-2 font-bold text-center w-10">W</th>
            <th className="py-3 px-2 font-bold text-center w-10">D</th>
            <th className="py-3 px-2 font-bold text-center w-10">L</th>
            <th className="py-3 px-2 font-bold text-center w-12">GD</th>
            <th className="py-3 px-4 font-bold text-center text-sports-text w-12">Pts</th>
            <th className="py-3 px-2 w-8"></th>
          </tr>
        </thead>
        <tbody>
          {[...Array(10)].map((_, i) => (
            <tr key={i} className="border-b border-sports-border">
              <td className="py-3 px-4 border-r border-sports-border/50">
                <div className="h-4 w-4 bg-sports-surfaceHover animate-pulse rounded mx-auto"></div>
              </td>
              <td className="py-3 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-sports-surfaceHover animate-pulse"></div>
                  <div className="h-4 w-32 bg-sports-surfaceHover animate-pulse rounded"></div>
                </div>
              </td>
              <td className="py-3 px-2 text-center"><div className="h-4 w-4 bg-sports-surfaceHover animate-pulse rounded mx-auto"></div></td>
              <td className="py-3 px-2 text-center"><div className="h-4 w-4 bg-sports-surfaceHover animate-pulse rounded mx-auto"></div></td>
              <td className="py-3 px-2 text-center"><div className="h-4 w-4 bg-sports-surfaceHover animate-pulse rounded mx-auto"></div></td>
              <td className="py-3 px-2 text-center"><div className="h-4 w-4 bg-sports-surfaceHover animate-pulse rounded mx-auto"></div></td>
              <td className="py-3 px-2 text-center"><div className="h-4 w-6 bg-sports-surfaceHover animate-pulse rounded mx-auto"></div></td>
              <td className="py-3 px-4 text-center"><div className="h-4 w-6 bg-sports-surfaceHover animate-pulse rounded mx-auto"></div></td>
              <td className="py-3 px-2"></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
