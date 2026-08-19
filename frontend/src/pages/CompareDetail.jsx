import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, X, ArrowRight, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { competitors, brand } from '../mock';

function setSEO({ title, description, jsonLd }) {
  document.title = title;
  const setMeta = (name, content, attr = 'name') => {
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el); }
    el.setAttribute('content', content);
  };
  setMeta('description', description);
  setMeta('og:title', title, 'property');
  setMeta('og:description', description, 'property');
  setMeta('og:type', 'article', 'property');

  document.querySelectorAll('script[data-seo="1"]').forEach((s) => s.remove());
  jsonLd.forEach((data) => {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.dataset.seo = '1';
    s.text = JSON.stringify(data);
    document.head.appendChild(s);
  });
}

const originalPathpages = {
  slug: 'pathpages',
  name: 'Pathpages (Original)',
  tagline: 'The original Notion templates brand at pathpages.com.',
  logo: 'PP',
  strengths: ['Established brand', 'Original design language', 'Strong customer base', 'Broad template range'],
  weaknesses: ['Fewer comparison pages', 'No SEO comparison funnel', 'Static UI patterns'],
  pricing: '$39 – $99 per template',
  freeOption: 'Preview screenshots',
  speed: 'Instant duplicate',
  accuracy: 'Very high',
  ease: 'Beginner friendly',
  bundleDeal: 'Complete Bundle 80% off',
};

export default function CompareDetail() {
  const { slug } = useParams();
  const competitor = slug === 'pathpages' ? originalPathpages : competitors.find((c) => c.slug === slug);

  useEffect(() => {
    if (!competitor) return;
    const title = `${brand.name} vs ${competitor.name}: features, pricing and which is better in 2026`;
    const description = `${brand.name} vs ${competitor.name} — an honest 2026 side-by-side comparison. See features, pricing, ease of use, and which Notion templates provider is right for you.`;

    const faqLd = {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: `Is ${brand.name} a good ${competitor.name} alternative?`, acceptedAnswer: { '@type': 'Answer', text: `Yes. ${brand.name} covers the same core productivity, finance and business use-cases as ${competitor.name}, with a Complete Bundle at 80% off and consistent premium design.` } },
        { '@type': 'Question', name: `${competitor.name} vs ${brand.name}: which is better?`, acceptedAnswer: { '@type': 'Answer', text: `${brand.name} is better if you want an all-in-one bundle at a low price and a consistent design system. ${competitor.name} is a strong pick if you want ${competitor.strengths[0].toLowerCase()}.` } },
        { '@type': 'Question', name: `Is there a free way to try ${brand.name}?`, acceptedAnswer: { '@type': 'Answer', text: `You can preview every template on the product page before buying. Digital purchases are covered by a satisfaction guarantee.` } },
      ],
    };
    const productLd = { '@context': 'https://schema.org', '@type': 'Product', name: brand.name, description: brand.tagline, brand: { '@type': 'Brand', name: brand.name }, aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '12000' } };
    const breadcrumbLd = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
      { '@type': 'ListItem', position: 2, name: 'Compare', item: '/compare' },
      { '@type': 'ListItem', position: 3, name: `${brand.name} vs ${competitor.name}` },
    ] };

    setSEO({ title, description, jsonLd: [faqLd, productLd, breadcrumbLd] });
  }, [competitor]);

  if (!competitor) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-3xl mx-auto px-5 py-32 text-center">
          <h1 className="display text-[40px]">Comparison not found</h1>
          <Link to="/compare" className="pp-btn-dark inline-block mt-6 px-5 py-3">Browse comparisons</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const rows = [
    { label: 'Pricing', a: brand.pricing, b: competitor.pricing },
    { label: 'Free option', a: brand.freeOption, b: competitor.freeOption },
    { label: 'Bundle deal', a: brand.bundleDeal, b: competitor.bundleDeal },
    { label: 'Speed to setup', a: brand.speed, b: competitor.speed },
    { label: 'Accuracy / polish', a: brand.accuracy, b: competitor.accuracy },
    { label: 'Ease of use', a: brand.ease, b: competitor.ease },
  ];

  const otherCompares = competitors.filter((c) => c.slug !== competitor.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <article className="max-w-5xl mx-auto px-5 lg:px-8 pt-14 pb-24">
        <nav className="text-[13px] text-neutral-500 mb-6">
          <Link to="/" className="hover:text-neutral-800">Home</Link> / <Link to="/compare" className="hover:text-neutral-800">Compare</Link> / <span className="text-neutral-800">vs {competitor.name}</span>
        </nav>
        <div className="text-[13px] uppercase tracking-wider text-neutral-500 font-semibold">Comparison · 2026</div>
        <h1 className="display text-[48px] mt-3">{brand.name} vs {competitor.name}: features, pricing and which is better in 2026</h1>
        <p className="mt-5 text-[17px] text-neutral-700 leading-relaxed max-w-3xl">
          Looking for a serious {competitor.name.toLowerCase()} alternative? Here’s a fair, up-to-date breakdown of how {brand.name} and {competitor.name} really compare on features, pricing, ease of use and value in 2026.
        </p>
        <div className="mt-6 flex items-center gap-3 text-[13.5px] text-neutral-600">
          <div className="flex gap-0.5 text-[#F5C542]">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" strokeWidth={0} />)}</div>
          <span><b className="text-neutral-900">4.9/5</b> · based on 120,000+ customers</span>
        </div>

        {/* Comparison Table */}
        <div className="mt-12 pp-card overflow-hidden">
          <div className="grid grid-cols-3 border-b border-neutral-200 text-[13px] font-semibold uppercase tracking-wider text-neutral-500 bg-white">
            <div className="px-6 py-4">Feature</div>
            <div className="px-6 py-4 border-l border-neutral-200 text-neutral-900">{brand.name}</div>
            <div className="px-6 py-4 border-l border-neutral-200 text-neutral-900">{competitor.name}</div>
          </div>
          {rows.map((r, i) => (
            <div key={r.label} className={`grid grid-cols-3 text-[14.5px] ${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}`}>
              <div className="px-6 py-4 font-medium text-neutral-800">{r.label}</div>
              <div className="px-6 py-4 border-l border-neutral-200 text-neutral-800">{r.a}</div>
              <div className="px-6 py-4 border-l border-neutral-200 text-neutral-700">{r.b}</div>
            </div>
          ))}
        </div>

        {/* Pros & cons */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="pp-card p-8">
            <h3 className="display text-[22px]">{brand.name}</h3>
            <div className="mt-4">
              <div className="text-[12px] uppercase tracking-wider text-neutral-500 font-semibold">Pros</div>
              <ul className="mt-3 space-y-2">{brand.strengths.map((s, i) => <li key={i} className="flex items-start gap-2 text-[14.5px]"><Check size={17} className="text-emerald-600 mt-0.5" /> {s}</li>)}</ul>
            </div>
            <div className="mt-5">
              <div className="text-[12px] uppercase tracking-wider text-neutral-500 font-semibold">Cons</div>
              <ul className="mt-3 space-y-2 text-[14.5px] text-neutral-700">
                <li className="flex items-start gap-2"><X size={17} className="text-neutral-400 mt-0.5" /> Newer brand vs. some competitors</li>
                <li className="flex items-start gap-2"><X size={17} className="text-neutral-400 mt-0.5" /> Focused catalog (quality over quantity)</li>
              </ul>
            </div>
          </div>
          <div className="pp-card p-8">
            <h3 className="display text-[22px]">{competitor.name}</h3>
            <div className="mt-4">
              <div className="text-[12px] uppercase tracking-wider text-neutral-500 font-semibold">Pros</div>
              <ul className="mt-3 space-y-2">{competitor.strengths.map((s, i) => <li key={i} className="flex items-start gap-2 text-[14.5px]"><Check size={17} className="text-emerald-600 mt-0.5" /> {s}</li>)}</ul>
            </div>
            <div className="mt-5">
              <div className="text-[12px] uppercase tracking-wider text-neutral-500 font-semibold">Cons</div>
              <ul className="mt-3 space-y-2">{competitor.weaknesses.map((s, i) => <li key={i} className="flex items-start gap-2 text-[14.5px] text-neutral-700"><X size={17} className="text-neutral-400 mt-0.5" /> {s}</li>)}</ul>
            </div>
          </div>
        </div>

        {/* Verdict */}
        <div className="mt-12 rounded-3xl bg-[#0A0A0A] text-white p-10 md:p-14">
          <div className="text-[13px] uppercase tracking-wider text-white/60 font-semibold">Verdict</div>
          <h3 className="display text-[32px] mt-3">Which one should you actually pick?</h3>
          <p className="mt-4 text-[15.5px] text-white/80 leading-relaxed max-w-3xl">
            For most people who want a complete productivity system without paying for each template separately, {brand.name} wins on value — the Complete Bundle at 80% off gives you everything at one price. If {competitor.strengths[0].toLowerCase()} is your priority, {competitor.name} is still a solid choice.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/templates" className="bg-white text-neutral-900 rounded-lg px-5 py-3 font-semibold text-[14px] inline-flex items-center gap-2 hover:bg-neutral-100 transition">Try {brand.name} →</Link>
            <Link to="/templates/notion-complete-bundle" className="border border-white/30 rounded-lg px-5 py-3 font-semibold text-[14px] inline-flex items-center gap-2 hover:bg-white/10 transition">Get Complete Bundle <span className="badge-off">80% OFF!</span></Link>
          </div>
          <p className="mt-6 text-[12px] text-white/50">For educational and product comparison purposes only. Feature and pricing details may change — check each provider’s site for the latest.</p>
        </div>

        {/* FAQ */}
        <div className="mt-14">
          <h3 className="display text-[30px]">Frequently asked questions</h3>
          <div className="mt-6 space-y-3">
            {[
              { q: `Is ${brand.name} a good ${competitor.name} alternative?`, a: `Yes — ${brand.name} covers the same core productivity, finance, and business use-cases as ${competitor.name} and offers a Complete Bundle at 80% off, which is significantly better value for most users.` },
              { q: `${competitor.name} vs ${brand.name}: which is better in 2026?`, a: `${brand.name} is better if you want an all-in-one bundle at a low price with a consistent design language. ${competitor.name} still wins if ${competitor.strengths[0].toLowerCase()} is your top priority.` },
              { q: `How much does ${brand.name} cost compared to ${competitor.name}?`, a: `${brand.name} templates range from ${brand.pricing}. ${competitor.name} pricing is ${competitor.pricing}. The ${brand.name} bundle is usually the cheapest per-template option in the category.` },
              { q: `Can I use both ${brand.name} and ${competitor.name}?`, a: `Absolutely. Notion templates work independently — you can mix templates from multiple providers inside the same workspace.` },
            ].map((f, i) => (
              <details key={i} className="group pp-card p-5">
                <summary className="cursor-pointer font-semibold text-[15px] list-none flex items-center justify-between">
                  {f.q} <span className="text-neutral-400 group-open:rotate-45 transition text-2xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-[14.5px] text-neutral-700 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Internal links */}
        <div className="mt-16">
          <h3 className="display text-[24px]">More comparisons</h3>
          <div className="mt-5 grid md:grid-cols-3 gap-4">
            {otherCompares.map((c) => (
              <Link key={c.slug} to={`/compare/${c.slug}`} className="pp-card p-5 flex items-center justify-between group">
                <span className="font-semibold text-[14.5px]">{brand.name} vs {c.name}</span>
                <ArrowRight size={16} className="text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-1 transition" />
              </Link>
            ))}
          </div>
        </div>
      </article>
      <Footer />
    </div>
  );
}
