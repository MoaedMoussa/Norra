import React from 'react';
import { Newspaper, Info } from 'lucide-react';

export default function MatchPreMatchSummary({ summary }) {
  const news = summary?.news?.articles || [];

  return (
    <div className="p-6">
      <h4 className="text-sm font-bold mb-4 uppercase tracking-wider text-sports-textMuted flex items-center gap-2">
        <Newspaper size={16} /> Pre-Match Headlines
      </h4>
      
      {news.length > 0 ? (
        <div className="space-y-4">
          {news.slice(0, 4).map((article, idx) => (
            <a 
              key={idx} 
              href={article.links?.web?.href || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block bg-sports-surfaceHover rounded-xl p-4 border border-sports-border hover:border-sports-primary/50 transition-colors group"
            >
              <h5 className="font-bold text-sm text-sports-text group-hover:text-sports-primary transition-colors leading-tight mb-2">
                {article.headline}
              </h5>
              <p className="text-xs text-sports-textMuted leading-relaxed line-clamp-2">
                {article.description}
              </p>
              <div className="mt-3 text-[10px] font-bold text-[#666] uppercase tracking-widest">
                {new Date(article.published).toLocaleDateString()}
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 opacity-50">
          <Info size={32} className="text-sports-textMuted mb-3" />
          <p className="text-sm text-sports-textMuted text-center">
            No pre-match news available for this fixture.
          </p>
        </div>
      )}
    </div>
  );
}
