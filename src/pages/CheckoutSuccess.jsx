import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ExternalLink, ShieldCheck, Zap, Layers, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { api } from '../api';
import { useCart } from '../context/CartContext';
import { TEMPLATE_WORKSPACES } from '../constants/templateWorkspaces';

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { clear } = useCart();

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const { data } = await api.get(`/checkout/verify/${sessionId}`);
        setOrder(data.order);
        if (data.paid) clear();
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <section className="max-w-4xl mx-auto px-5 lg:px-8 pt-16 pb-24 text-center">
        {loading ? (
          <div className="text-slate-500 font-mono flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            Confirming and licensing your Notion duplicate link...
          </div>
        ) : order ? (
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <CheckCircle2 size={32} />
            </div>
            <div className="text-[11px] font-mono uppercase text-emerald-600 font-bold tracking-wider">
              Full Workspace Access Granted
            </div>
            <h1 className="display text-[38px] text-slate-950 mt-1">Payment Successful</h1>

            <p className="mt-2 text-[15.5px] text-slate-600">
              Order <span className="font-mono font-semibold text-slate-900">{order.order_id}</span> ·{' '}
              <b className="font-mono text-slate-900">${(order.total_cents / 100).toFixed(2)}</b>
            </p>

            {/* Unlocked Workspaces List */}
            <div className="mt-8 space-y-3 text-left">
              <div className="text-[12.5px] font-mono font-bold uppercase text-slate-400">
                Your Purchased Workspace(s):
              </div>
              {order.slugs.map((slug) => {
                const info = TEMPLATE_WORKSPACES[slug] || { name: slug, tagline: 'Notion Operating System' };
                return (
                  <div
                    key={slug}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="font-bold text-[16px] text-slate-900">{info.name}</div>
                      <div className="text-[13px] text-slate-500 mt-0.5">{info.tagline}</div>
                    </div>
                    <Link
                      to={`/workspace/${slug}`}
                      className="norra-btn-accent px-4 py-2.5 rounded-xl text-[13px] font-bold inline-flex items-center gap-1.5 flex-shrink-0"
                    >
                      <Zap size={14} /> Open Full Workspace <ArrowRight size={14} />
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/library"
                className="norra-btn-dark px-6 py-3.5 inline-flex items-center justify-center gap-2 rounded-xl text-[14px] font-bold"
              >
                Go to Notion Library <ArrowRight size={16} />
              </Link>
              <Link
                to="/templates"
                className="norra-btn-light px-5 py-3.5 rounded-xl text-[14px]"
              >
                Explore More Systems
              </Link>
            </div>

            <p className="mt-8 text-[12px] text-slate-400">
              Instant access link sent to your registered account. Powered by Norra Studio.
            </p>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm max-w-md mx-auto">
            <h1 className="display text-[32px] text-slate-900">Order Not Found</h1>
            <p className="mt-2 text-slate-600 text-[14px]">No active session found matching this URL.</p>
            <Link to="/templates" className="norra-btn-dark inline-block mt-6 px-6 py-3 rounded-xl">
              Browse Templates
            </Link>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}

