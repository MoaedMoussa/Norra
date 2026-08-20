import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { api } from '../api';
import { useCart } from '../context/CartContext';

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { clear } = useCart();

  useEffect(() => {
    if (!sessionId) { setLoading(false); return; }
    (async () => {
      try {
        const { data } = await api.get(`/checkout/verify/${sessionId}`);
        setOrder(data.order);
        if (data.paid) clear();
      } finally { setLoading(false); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="max-w-3xl mx-auto px-5 lg:px-8 pt-20 pb-24 text-center">
        {loading ? (
          <p className="text-neutral-500">Confirming your order...</p>
        ) : order ? (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto"><CheckCircle2 size={32} className="text-emerald-600" /></div>
            <h1 className="display text-[44px] mt-6">Payment successful</h1>
            <p className="mt-4 text-[16px] text-neutral-600">Order <span className="font-mono text-neutral-800">{order.order_id}</span> · ${(order.total_cents/100).toFixed(2)}</p>
            <p className="mt-2 text-[14px] text-neutral-500">{order.slugs.length} template(s) added to your library.</p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link to="/library" className="pp-btn-dark px-5 py-3 inline-flex items-center gap-2">Go to Library <ArrowRight size={16} /></Link>
              <Link to="/templates" className="pp-btn-light px-5 py-3">Keep browsing</Link>
            </div>
            <p className="mt-8 text-[12px] text-neutral-500">A confirmation email has been sent. For educational and demo purposes only — not a real financial transaction unless production Stripe keys are configured.</p>
          </>
        ) : (
          <>
            <h1 className="display text-[32px]">Order not found</h1>
            <Link to="/templates" className="pp-btn-dark inline-block mt-6 px-5 py-3">Browse Templates</Link>
          </>
        )}
      </section>
      <Footer />
    </div>
  );
}
