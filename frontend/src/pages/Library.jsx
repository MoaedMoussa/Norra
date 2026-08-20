import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, BookOpen } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Library() {
  const { user, loading, login } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) { setFetching(false); return; }
    (async () => {
      try {
        const { data } = await api.get('/library');
        setTemplates(data.templates || []);
      } finally { setFetching(false); }
    })();
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-neutral-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="max-w-7xl mx-auto px-5 lg:px-8 pt-16 pb-24">
        <h1 className="display text-[48px]">My Library</h1>
        <p className="mt-4 text-[16px] text-neutral-600 max-w-2xl">Every template you own. Duplicate any of them to your Notion workspace with one click.</p>

        {!user ? (
          <div className="mt-10 rounded-2xl border border-neutral-200 p-16 text-center">
            <p className="text-[15px] text-neutral-600">Sign in to view your purchased templates.</p>
            <button onClick={login} className="pp-btn-dark inline-flex items-center gap-2 mt-6 px-5 py-3">Sign in with Google <ArrowRight size={16} /></button>
          </div>
        ) : fetching ? (
          <div className="mt-10 text-neutral-500">Loading your library...</div>
        ) : templates.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-neutral-200 p-16 text-center">
            <BookOpen size={28} className="mx-auto text-neutral-400" />
            <p className="mt-4 text-[15px] text-neutral-600">You haven't purchased any templates yet.</p>
            <Link to="/templates" className="pp-btn-dark inline-block mt-6 px-5 py-3">Browse templates</Link>
          </div>
        ) : (
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((t) => (
              <div key={t.slug} className="pp-card overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden bg-neutral-200"><img src={t.image} alt={t.name} className="w-full h-full object-cover" /></div>
                <div className="p-6">
                  <h3 className="display text-[22px]">{t.name}</h3>
                  <p className="mt-2 text-[13.5px] text-neutral-600">{t.tagline}</p>
                  <div className="mt-5 flex gap-2">
                    <a href={t.notionPreviewUrl} target="_blank" rel="noreferrer" className="pp-btn-dark px-4 py-2 text-[13px] inline-flex items-center gap-1.5">Open in Notion <ExternalLink size={13} /></a>
                    <Link to={`/templates/${t.slug}`} className="pp-btn-light px-4 py-2 text-[13px]">Details</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
