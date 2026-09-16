import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Norra Scores</title>
        <meta name="description" content="The page you are looking for does not exist." />
      </Helmet>
      
      <main className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <h1 className="text-8xl font-black text-sports-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-6">Page Not Found</h2>
        <p className="text-sports-textMuted mb-8 max-w-md">
          Sorry, we couldn't find the page you're looking for. It might have been removed, renamed, or didn't exist in the first place.
        </p>
        <Link 
          to="/" 
          className="flex items-center gap-2 bg-sports-primary text-white px-6 py-3 rounded-full font-bold transition-all hover:opacity-90 hover:shadow-[0_0_15px_rgba(255,107,0,0.4)]"
        >
          <Home size={18} />
          Back to Home
        </Link>
      </main>
    </>
  );
}
