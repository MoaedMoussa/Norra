import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { competitors, brand } from '../mock';

function setMeta(title, description) {
  document.title = title;
  const meta = document.querySelector('meta[name="description"]') || (() => {
    const m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m); return m;
  })();
  meta.content = description;
}

export default function CompareHub() {
  useEffect(() => {
    setMeta('PathPages Comparisons: Notion Templates vs Alternatives (2026)', 'Compare PathPages side by side with every major Notion templates provider — features, pricing, quality, and which is best in 2026.');
  }, []);

  const allCompares = competitors;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="max-w-7xl mx-auto px-5 lg:px-8 pt-16 pb-8">
        <div className="text-[13px] uppercase tracking-wider text-neutral-500 font-semibold">Comparisons</div>
        <h1 className="display text-[52px] mt-3 max-w-4xl">{brand.name} vs. every major Notion templates provider</h1>
        <p className="mt-5 text-[17px] text-neutral-600 max-w-2xl leading-relaxed">
          Honest, up-to-date side-by-side comparisons. See exactly where {brand.name} wins, where competitors are stronger, and pick the right templates for you.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allCompares.map((c) => (
          <Link key={c.slug} to={`/compare/${c.slug}`} className="pp-card p-8 group">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center font-bold text-neutral-900 text-[15px] shadow-sm border border-neutral-200">
                {c.logo || c.name.slice(0, 2).toUpperCase()}
              </div>
              <ArrowRight size={18} className="text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-1 transition" />
            </div>
            <h3 className="display text-[22px] mt-6">{brand.name} <span className="text-neutral-400 font-normal">vs</span> {c.name}</h3>
            <p className="mt-2 text-[14px] text-neutral-600 leading-relaxed">{c.tagline}</p>
            <div className="mt-5 text-[13px] font-semibold underline underline-offset-4">Read the comparison</div>
          </Link>
        ))}
      </section>

      <Footer />
    </div>
  );
}
