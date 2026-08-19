import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { templates, bundle } from '../mock';
import { useState } from 'react';

export default function Templates() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const categories = ['All', ...Array.from(new Set(templates.map((t) => t.category)))];
  const list = templates.filter((t) =>
    (cat === 'All' || t.category === cat) &&
    (q === '' || t.name.toLowerCase().includes(q.toLowerCase()) || t.tagline.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="max-w-7xl mx-auto px-5 lg:px-8 pt-16 pb-8">
        <h1 className="display text-[52px] max-w-3xl">All Notion Templates</h1>
        <p className="mt-4 text-[16px] text-neutral-600 max-w-2xl">Every premium template we've ever built. Instant duplicate, lifetime access.</p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search templates..." className="w-full h-11 pl-10 pr-4 bg-neutral-100 rounded-lg text-[14px] focus:outline-none focus:bg-white focus:ring-2 focus:ring-neutral-900/10 border border-transparent focus:border-neutral-300 transition" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`px-4 h-11 rounded-lg text-[13.5px] font-medium transition ${cat === c ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}>{c}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 lg:px-8 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((t) => (
            <Link key={t.slug} to={`/templates/${t.slug}`} className="pp-card overflow-hidden group">
              <div className="aspect-[4/3] overflow-hidden bg-neutral-200">
                <img src={t.image} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="p-6">
                <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold">{t.category}</div>
                <h3 className="display text-[22px] mt-1">{t.name}</h3>
                <p className="mt-2 text-[14px] text-neutral-600 line-clamp-2">{t.tagline}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[14px] inline-flex items-center gap-1.5 font-semibold">View <ArrowRight size={14} /></span>
                  <div className="text-[14px]"><span className="font-semibold">${t.price}</span> <span className="text-neutral-400 line-through text-[12px]">${t.originalPrice}</span></div>
                </div>
              </div>
            </Link>
          ))}
          <Link to="/templates/notion-complete-bundle" className="pp-card overflow-hidden group bg-neutral-900 text-white">
            <div className="aspect-[4/3] overflow-hidden">
              <img src={bundle.image} alt={bundle.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-500" />
            </div>
            <div className="p-6">
              <span className="badge-off">80% OFF!</span>
              <h3 className="display text-[22px] mt-2">Complete Bundle</h3>
              <p className="mt-2 text-[14px] text-white/70">Every template we’ve ever built — one price.</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[14px] inline-flex items-center gap-1.5 font-semibold">Unlock <ArrowRight size={14} /></span>
                <div className="text-[14px]"><span className="font-semibold">${bundle.price}</span> <span className="text-white/50 line-through text-[12px]">${bundle.originalPrice}</span></div>
              </div>
            </div>
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
