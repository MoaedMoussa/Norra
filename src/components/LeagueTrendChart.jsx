import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

export default function LeagueTrendChart({ leagueId }) {
  const seed = (leagueId.charCodeAt(0) || 0) + (leagueId.charCodeAt(leagueId.length - 1) || 0);
  
  const data = Array.from({ length: 8 }, (_, i) => {
    // Smoother mock data
    const homeWins = Math.abs(Math.sin((seed + i) * 0.4)) * 6 + 2;
    const awayWins = Math.abs(Math.cos((seed + i) * 0.4)) * 6 + 1;
    
    return {
      name: `MW ${i + 1}`,
      homeWins: parseFloat(homeWins.toFixed(1)),
      awayWins: parseFloat(awayWins.toFixed(1)),
    };
  });

  return (
    <div className="w-24 h-10 md:w-36 md:h-12 opacity-60 group-hover/league:opacity-100 transition-opacity">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorHome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff6b00" stopOpacity={0.5}/>
              <stop offset="100%" stopColor="#ff6b00" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorAway" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5}/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Tooltip 
            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', fontSize: '10px', borderRadius: '8px', padding: '6px 10px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }} 
            itemStyle={{ fontSize: '11px', padding: '2px 0', fontWeight: 'bold' }}
            labelStyle={{ color: '#a1a1aa', fontSize: '9px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold' }}
            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2, strokeDasharray: '3 3' }}
            animationDuration={200}
          />
          <Area 
            type="monotone" 
            dataKey="homeWins" 
            name="Home" 
            stroke="#ff6b00" 
            fill="url(#colorHome)" 
            strokeWidth={2} 
            activeDot={{ r: 4, fill: '#ff6b00', stroke: '#18181b', strokeWidth: 2 }}
          />
          <Area 
            type="monotone" 
            dataKey="awayWins" 
            name="Away" 
            stroke="#3b82f6" 
            fill="url(#colorAway)" 
            strokeWidth={2} 
            activeDot={{ r: 4, fill: '#3b82f6', stroke: '#18181b', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
