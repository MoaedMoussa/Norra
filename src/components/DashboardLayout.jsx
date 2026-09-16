import React from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from './Navbar';
import { Trophy, Flame, ChevronRight } from 'lucide-react';
import { LEAGUES } from '../data/sportsMock';
import { useNews } from '../hooks/useNews';

export default function DashboardLayout() {
  const { news, loading: newsLoading } = useNews();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="min-h-screen bg-sports-bg flex flex-col font-sans text-sports-text">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-4 grid grid-cols-1 lg:grid-cols-12 gap-6 my-4">
        {/* Left Sidebar - Leagues & AI Daily */}
        <aside className="order-last lg:order-first col-span-1 lg:col-span-3 space-y-4 mt-8 lg:mt-0">
          <div className="bg-sports-surface rounded-xl border border-sports-border overflow-hidden shadow-lg">
            <div className="px-5 py-4 bg-gradient-to-b from-sports-surfaceHover to-sports-surface border-b border-sports-border flex items-center gap-3">
              <Trophy size={18} className="text-sports-primary drop-shadow-[0_0_8px_rgba(255,107,0,0.5)]" />
              <h3 className="text-[13px] font-bold text-sports-text uppercase tracking-widest">Top Competitions</h3>
            </div>
            <ul className="flex flex-col p-2 space-y-1">
              {Object.values(LEAGUES).map((l, i) => (
                <li key={i} onClick={() => {
                  navigate(`/?league=${l.id}`);
                }} className="group rounded-lg hover:bg-sports-surfaceHover active:bg-sports-border transition-all duration-200 cursor-pointer flex items-center gap-4 px-3 py-2.5">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 group-hover:bg-white/10 transition-all duration-300">
                    {l.logo ? <img src={l.logo} alt={l.name} className="w-7 h-7 object-contain drop-shadow-md" referrerPolicy="no-referrer" /> : <span className="text-xl">{l.icon}</span>}
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-[15px] font-bold text-sports-text group-hover:text-sports-text transition-colors">{l.name}</span>
                    <span className="text-[10px] text-sports-textMuted">{l.country}</span>
                  </div>
                  <ChevronRight size={14} className="text-sports-textMuted opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-sports-surfaceHover to-sports-surface rounded-xl border border-sports-border overflow-hidden shadow-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <Flame size={18} className="text-sports-primary" />
              <h3 className="text-[13px] font-bold text-sports-text uppercase tracking-widest">Norra AI Daily</h3>
            </div>
            {newsLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-sports-border rounded w-3/4"></div>
                <div className="h-4 bg-sports-border rounded w-full"></div>
                <div className="h-4 bg-sports-border rounded w-5/6"></div>
              </div>
            ) : news[0] ? (
              <>
                <p className="text-sm text-sports-textMuted leading-relaxed mb-4">
                  {news[0].description || "Latest sports updates and live scores from around the globe, delivered directly to your feed."}
                </p>
                <div className="bg-sports-border rounded-lg p-3 border border-sports-border">
                  <span className="block text-[10px] uppercase text-sports-textMuted font-bold mb-1">Headline</span>
                  <span className="text-sm text-sports-text font-medium line-clamp-2">{news[0].headline}</span>
                </div>
              </>
            ) : (
              <p className="text-sm text-sports-textMuted leading-relaxed">No AI insights available at the moment.</p>
            )}
          </div>
        </aside>

        {/* Center Content */}
        <div className="lg:col-span-9 space-y-4">
          <Outlet />

          {/* Trending News */}
          <div className="bg-sports-surface border border-sports-border rounded-xl p-5 shadow-lg mt-8">
            <h3 className="text-sports-text font-bold text-sm mb-4 flex items-center gap-2">
              <Flame size={16} className="text-sports-primary" />
              Trending News
            </h3>
            {newsLoading ? (
              <div className="py-8 text-center text-sports-textMuted text-xs animate-pulse">Loading trending news...</div>
            ) : news.length === 0 ? (
              <div className="py-8 text-center text-sports-textMuted text-xs">No recent news available.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {news.slice(0, 6).map((item, i) => (
                  <a key={i} href={item.link} target="_blank" rel="noreferrer" className="group flex flex-col gap-3 bg-sports-surfaceHover rounded-lg p-3 border border-sports-border hover:border-sports-border transition-all">
                    <div className="w-full h-32 overflow-hidden rounded-md shrink-0 bg-sports-border flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt="news" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-sports-surfaceHover to-sports-border flex items-center justify-center">
                           <Trophy size={32} className="text-[#444]" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1">
                      <div className="text-sm font-bold text-sports-text group-hover:text-sports-primary transition-colors leading-snug line-clamp-2 mb-2">
                        {item.headline}
                      </div>
                      <div className="text-[11px] text-sports-textMuted line-clamp-3">
                        {item.description}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
