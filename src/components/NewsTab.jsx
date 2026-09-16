import React, { useState } from 'react';
import { Flame, Clock, Share2, ExternalLink } from 'lucide-react';
import { useNews } from '../hooks/useNews';

export default function NewsTab() {
  const { news, loading, loadMore, hasMore, loadingMore } = useNews(['eng.1', 'esp.1', 'ger.1', 'ita.1', 'fra.1', 'uefa.champions']);
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Intersection Observer for Infinite Scrolling
  const observerTarget = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget, hasMore, loading, loadingMore, loadMore]);

  const categories = ['All', 'Premier League', 'La Liga', 'Transfers', 'Champions League'];

  const filteredNews = news.filter(article => {
    if (activeCategory === 'All') return true;
    const catText = article.headline.toLowerCase() + ' ' + (article.description || '').toLowerCase();
    
    if (activeCategory === 'Premier League') return catText.includes('premier league') || catText.includes('arsenal') || catText.includes('chelsea') || catText.includes('manchester');
    if (activeCategory === 'La Liga') return catText.includes('la liga') || catText.includes('real madrid') || catText.includes('barcelona');
    if (activeCategory === 'Transfers') return catText.includes('transfer') || catText.includes('sign') || catText.includes('deal');
    if (activeCategory === 'Champions League') return catText.includes('champions league') || catText.includes('ucl');
    return true;
  });

  if (loading) {
    return <div className="text-center py-16 text-sports-textMuted text-sm animate-pulse">Loading latest news...</div>;
  }

  if (news.length === 0) {
    return <div className="text-center py-16 text-sports-textMuted text-sm">No news available at the moment.</div>;
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide mb-6 pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              activeCategory === cat 
                ? 'bg-sports-primary text-white' 
                : 'bg-sports-surfaceHover text-sports-textMuted hover:text-sports-text border border-sports-border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNews.map((article, idx) => (
          <a
            key={idx}
            href={article.link || '#'}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col bg-sports-surface rounded-xl overflow-hidden border border-sports-border hover:border-sports-primary/50 transition-all shadow-lg"
          >
            <div className="aspect-video w-full bg-sports-surfaceHover overflow-hidden relative">
              {article.image ? (
                <img 
                  src={article.image} 
                  alt={article.headline} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sports-textMuted/30">
                  <Flame size={48} />
                </div>
              )}
              {idx === 0 && (
                <div className="absolute top-3 left-3 bg-red-600 text-sports-text text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-md">
                  Breaking
                </div>
              )}
            </div>
            
            <div className="p-5 flex flex-col flex-1">
              <span className="text-[10px] text-sports-primary font-bold uppercase tracking-wider mb-2 block">
                {article.categories?.[0]?.description || 'Football'}
              </span>
              <h3 className="text-sports-text font-bold text-lg leading-tight mb-2 group-hover:text-sports-primary transition-colors line-clamp-2">
                {article.headline}
              </h3>
              <p className="text-sm text-sports-textMuted line-clamp-4 mb-4 flex-1">
                {article.description}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-sports-border">
                <div className="flex items-center gap-4 text-xs text-sports-textMuted">
                  <span className="flex items-center gap-1"><Clock size={14} /> {new Date(article.published).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3 text-sports-textMuted opacity-0 group-hover:opacity-100 transition-opacity">
                  <Share2 size={16} className="hover:text-sports-text" />
                  <ExternalLink size={16} className="hover:text-sports-primary" />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
      
      {/* Loading More Indicator / Observer Target */}
      <div ref={observerTarget} className="py-10 flex items-center justify-center">
        {loadingMore && (
          <div className="flex flex-col items-center gap-2 text-sports-primary animate-pulse">
            <Flame size={24} />
            <span className="text-xs font-bold uppercase tracking-wider">Loading More News...</span>
          </div>
        )}
        {!hasMore && news.length > 0 && (
          <span className="text-sports-textMuted text-sm">You've reached the end of the line.</span>
        )}
      </div>
    </div>
  );
}
