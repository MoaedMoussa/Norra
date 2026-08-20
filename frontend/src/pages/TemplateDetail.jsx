import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Check, ArrowRight, Shield, Zap, RefreshCw, Play, X, ExternalLink } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { api } from '../api';
import { useCart } from '../context/CartContext';
import { toast } from '../hooks/use-toast';

export default function TemplateDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const [t, setT] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/templates/${slug}`)
      .then((r) => setT(r.data))
      .catch(() => setT(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-neutral-500">Loading...</div>;
  if (!t) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-5 py-32 text-center">
        <h1 className="display text-[40px]">Template not found</h1>
        <Link to="/templates" className="pp-btn-dark inline-block mt-6 px-5 py-3">Browse templates</Link>
      </div>
      <Footer />
    </div>
  );

  const gallery = t.gallery || [t.image];
  const isBundle = slug === 'notion-complete-bundle';
  const addToCart = () => { add({ slug: t.slug, name: t.name, price: t.price, image: t.image }); toast({ title: 'Added to cart', description: t.name }); };
  const buy = () => { addToCart(); navigate('/cart'); };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="max-w-7xl mx-auto px-5 lg:px-8 pt-10 pb-20">
        <nav className="text-[13px] text-neutral-500 mb-6">
          <Link to="/" className="hover:text-neutral-800">Home</Link> / <Link to="/templates" className="hover:text-neutral-800">Templates</Link> / <span className="text-neutral-800">{t.name}</span>
        </nav>
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <div className="pp-card overflow-hidden aspect-[4/3] relative group cursor-pointer" onClick={() => setPreviewOpen(true)}>
              <img src={gallery[activeImg]} alt={t.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-white rounded-full px-5 py-2.5 shadow-lg flex items-center gap-2 font-semibold text-[13px]"><Play size={14} fill="currentColor" /> Live Preview</div>
              </div>
            </div>
            {gallery.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {gallery.map((g, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`aspect-[4/3] rounded-lg overflow-hidden border-2 transition ${activeImg === i ? 'border-neutral-900' : 'border-transparent'}`}><img src={g} alt="" className="w-full h-full object-cover" /></button>
                ))}
              </div>
            )}
            <button onClick={() => setPreviewOpen(true)} className="mt-4 w-full pp-btn-light py-3 inline-flex items-center justify-center gap-2 text-[14px]"><Play size={14} fill="currentColor" /> See the template live in Notion</button>
          </div>
          <div>
            <div className="text-[12px] uppercase tracking-wider text-neutral-500 font-semibold">{t.category}</div>
            <h1 className="display text-[44px] mt-2">{t.name}</h1>
            <div className="mt-3 flex items-center gap-3 text-[14px] text-neutral-600">
              <div className="flex gap-0.5 text-[#F5C542]">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" strokeWidth={0} />)}</div>
              <span><b className="text-neutral-900">{t.rating}</b> ({t.reviews.toLocaleString()} reviews)</span>
            </div>
            <p className="mt-6 text-[16px] text-neutral-700 leading-relaxed">{t.description || t.tagline}</p>
            <div className="mt-8 flex items-baseline gap-3">
              <span className="display text-[40px]">${t.price}</span>
              <span className="text-neutral-400 line-through text-[18px]">${t.originalPrice}</span>
              {isBundle && <span className="badge-off">SAVE 80%</span>}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={buy} className="pp-btn-dark px-6 py-3.5 text-[15px] inline-flex items-center gap-2">Buy now <ArrowRight size={16} /></button>
              <button onClick={addToCart} className="pp-btn-light px-6 py-3.5 text-[15px]">Add to Cart</button>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 text-center text-[12.5px]">
              <div className="p-3 border border-neutral-200 rounded-lg"><Zap size={16} className="mx-auto mb-1.5" />Instant duplicate</div>
              <div className="p-3 border border-neutral-200 rounded-lg"><Shield size={16} className="mx-auto mb-1.5" />Lifetime access</div>
              <div className="p-3 border border-neutral-200 rounded-lg"><RefreshCw size={16} className="mx-auto mb-1.5" />Free updates</div>
            </div>
            <div className="mt-8">
              <h3 className="font-semibold text-[16px] mb-4">What's inside</h3>
              <ul className="space-y-2.5">
                {(t.features || []).map((f, i) => (<li key={i} className="flex items-start gap-2.5 text-[14.5px] text-neutral-800"><Check size={18} className="text-neutral-900 mt-0.5 flex-shrink-0" /> {f}</li>))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {previewOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 fade-in" onClick={() => setPreviewOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
              <div>
                <div className="text-[12px] uppercase tracking-wider text-neutral-500 font-semibold">Live Notion Preview</div>
                <div className="font-semibold text-[15px]">{t.name}</div>
              </div>
              <div className="flex items-center gap-2">
                <a href={t.notionPreviewUrl} target="_blank" rel="noreferrer" className="pp-btn-light px-3 py-2 text-[13px] inline-flex items-center gap-1.5">Open in new tab <ExternalLink size={13} /></a>
                <button onClick={() => setPreviewOpen(false)} className="w-9 h-9 rounded-full hover:bg-neutral-100 flex items-center justify-center"><X size={18} /></button>
              </div>
            </div>
            <div className="flex-1 bg-neutral-50">
              <iframe title={`${t.name} preview`} src={t.notionPreviewUrl} className="w-full h-full border-0" sandbox="allow-scripts allow-same-origin allow-popups" />
            </div>
            <div className="px-5 py-3 border-t border-neutral-200 text-[12px] text-neutral-500">This is a public Notion preview. Some interactive features are limited inside embeds. Buy to get the full duplicatable version.</div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
