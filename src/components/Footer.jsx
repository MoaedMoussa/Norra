import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-sports-surface text-sports-textMuted py-10 mt-auto border-t border-sports-border text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top text block */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-sports-text mb-4">Sports News from around the world brought to you by NorraScores</h2>
          <p className="font-bold text-sports-text mb-2">Sports News – Latest Sports News & Today's Headlines</p>
          <p className="mb-2">The latest in Sports News from around the world brought to you by NorraScores.</p>
          <p>Read the latest news, analysis and opinions from NorraScores's expert sports writers. We cover all the major football tournaments as well as cricket, tennis, basketball, and ice hockey.</p>
        </div>

        {/* Link Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-sports-border">
          <div>
            <h3 className="text-sports-text font-bold mb-4">Football</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="hover:text-sports-text transition-colors">Premier League Scores</Link></li>
              <li><Link to="/" className="hover:text-sports-text transition-colors">Champions League Scores</Link></li>
              <li><Link to="/" className="hover:text-sports-text transition-colors">LaLiga Scores</Link></li>
              <li><Link to="/" className="hover:text-sports-text transition-colors">Serie A Scores</Link></li>
              <li><Link to="/" className="hover:text-sports-text transition-colors">Bundesliga Scores</Link></li>
              <li><Link to="/" className="hover:text-sports-text transition-colors">Ligue 1 Scores</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sports-text font-bold mb-4">Other Sports</h3>
            <ul className="space-y-3">
              <li><Link to="/sport/cricket" className="hover:text-sports-text transition-colors">Cricket Scores</Link></li>
              <li><Link to="/sport/tennis" className="hover:text-sports-text transition-colors">Tennis Scores</Link></li>
              <li><Link to="/sport/basketball" className="hover:text-sports-text transition-colors">Basketball Scores</Link></li>
              <li><Link to="/sport/hockey" className="hover:text-sports-text transition-colors">Ice Hockey Scores</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sports-text font-bold mb-4">Trending</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="hover:text-sports-text transition-colors">Today's Football Scores</Link></li>
              <li><button onClick={() => window.scrollTo(0,0)} className="hover:text-sports-text transition-colors">Football News</button></li>
              <li><Link to="/" className="hover:text-sports-text transition-colors">Sports Predictions</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="font-bold text-2xl text-sports-text tracking-tight">
                Norra<span className="text-sports-primary">Scores</span>
              </span>
            </Link>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-6">
              <Link to="/terms" className="hover:text-sports-text transition-colors font-medium">Terms of Service</Link>
              <Link to="/terms" className="hover:text-sports-text transition-colors font-medium">Privacy Notice</Link>
              <Link to="/terms" className="hover:text-sports-text transition-colors font-medium">Cookie Policy</Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-sports-textMuted">
          <p className="mb-3">&copy; 2026 NorraScores Limited</p>
        </div>
      </div>
    </footer>
  );
}
