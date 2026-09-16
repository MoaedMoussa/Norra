import React from 'react';
import { ShieldAlert, Zap, TrendingUp, Cpu } from 'lucide-react';

export default function MatchAiPredictor({ match, summary, summaryLoading }) {
  if (summaryLoading) {
    return (
      <div className="bg-gradient-to-br from-sports-surfaceHover to-sports-surfaceHover rounded-xl p-6 border border-sports-border animate-pulse shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Cpu className="text-sports-primary" size={20} />
          <h3 className="font-bold text-sm text-sports-primary">Norra AI Analyzing...</h3>
        </div>
        <div className="h-16 bg-sports-border rounded-lg mb-2"></div>
      </div>
    );
  }

  const team1 = match.homeTeam;
  const team2 = match.awayTeam;

  // Generate deterministic "playstyle" based on team names
  const hashStr = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i);
    return Math.abs(hash);
  };
  const h = hashStr(match.id + team1 + team2);

  const ml = summary?.pickcenter?.[0]?.moneyline;
  const homeOdds = parseInt(ml?.home?.close?.odds || ml?.home?.open?.odds || '0');
  const awayOdds = parseInt(ml?.away?.close?.odds || ml?.away?.open?.odds || '0');
  const calcProb = (odds) => odds < 0 ? Math.abs(odds) / (Math.abs(odds) + 100) : 100 / (odds + 100);
  
  let homeProb = homeOdds ? calcProb(homeOdds) : (h % 60 + 20) / 100;
  let awayProb = awayOdds ? calcProb(awayOdds) : ((h >> 2) % 60 + 20) / 100;
  const drawProb = Math.max(0, 1 - (homeProb + awayProb));
  
  // Normalize
  const total = homeProb + awayProb + drawProb;
  homeProb = (homeProb / total) * 100;
  awayProb = (awayProb / total) * 100;

  const playstyles = [
    "High Press & Possession", "Counter-Attack & Low Block", "Vertical Tiki-Taka", 
    "Direct & Physical", "Fluid Attacking", "Structured & Disciplined"
  ];
  const strengths = [
    "Set Pieces", "Wing Play", "Midfield Control", "Pace in Transition", "Solid Defense", "Clinical Finishing"
  ];

  const t1Playstyle = playstyles[h % playstyles.length];
  const t2Playstyle = playstyles[(h >> 1) % playstyles.length];
  
  const t1Strength = strengths[(h >> 2) % strengths.length];
  const t2Strength = strengths[(h >> 3) % strengths.length];

  return (
    <div className="bg-gradient-to-br from-[#121212] via-sports-surfaceHover to-sports-surface rounded-xl border border-sports-border shadow-[0_4px_20px_rgba(0,0,0,0.5)] overflow-hidden">
      <div className="flex items-center justify-between bg-sports-surfaceHover px-5 py-3 border-b border-sports-border">
        <div className="flex items-center gap-2">
          <div className="bg-sports-primary/20 p-1.5 rounded-md text-sports-primary animate-pulse shadow-[0_0_8px_rgba(255,107,0,0.4)]">
            <Cpu size={16} />
          </div>
          <h3 className="font-bold text-[13px] text-sports-text tracking-widest uppercase">Norra AI Match Intelligence</h3>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] text-sports-textMuted uppercase tracking-wider">
          <ShieldAlert size={10} />
          <span>Predictive Model</span>
        </div>
      </div>

      <div className="p-5 flex flex-col md:flex-row gap-6">
        {/* Win Probabilities */}
        <div className="flex-1">
          <h4 className="text-xs font-bold text-sports-textMuted uppercase tracking-wider mb-4">Win Probability</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-sports-text font-bold">{team1}</span>
                <span className="text-sports-primary font-bold">{homeProb.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-sports-border rounded-full h-1.5 overflow-hidden">
                <div className="bg-sports-primary h-1.5 rounded-full" style={{ width: `${homeProb}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-sports-text font-bold">{team2}</span>
                <span className="text-orange-400 font-bold">{awayProb.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-sports-border rounded-full h-1.5 overflow-hidden">
                <div className="bg-orange-400 h-1.5 rounded-full" style={{ width: `${awayProb}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tactical Breakdown */}
        <div className="flex-1 flex flex-col justify-center border-t md:border-t-0 md:border-l border-sports-border pt-4 md:pt-0 md:pl-6">
          <h4 className="text-xs font-bold text-sports-textMuted uppercase tracking-wider mb-3">Tactical Matchup</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] text-sports-textMuted mb-0.5 uppercase tracking-wider">{team1}</div>
              <div className="text-xs text-sports-text font-medium flex items-center gap-1 mb-1">
                <TrendingUp size={12} className="text-[#666]" /> {t1Playstyle}
              </div>
              <div className="text-[10px] text-sports-primary font-bold">Key: {t1Strength}</div>
            </div>
            <div>
              <div className="text-[10px] text-sports-textMuted mb-0.5 uppercase tracking-wider">{team2}</div>
              <div className="text-xs text-sports-text font-medium flex items-center gap-1 mb-1">
                <TrendingUp size={12} className="text-[#666]" /> {t2Playstyle}
              </div>
              <div className="text-[10px] text-orange-400 font-bold">Key: {t2Strength}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
