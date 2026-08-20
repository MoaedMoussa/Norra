import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, Lock, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { api } from '../api';
import { toast } from '../hooks/use-toast';

export default function Cart() {
  const { items, remove, total } = useCart();
  const [loading, setLoading] = useState(false);

  const checkout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const { data } = await api.post('/checkout/create', { slugs: items.map((i) => i.slug) });
      if (data.mocked) toast({ title: 'Test checkout', description: 'Stripe keys not configured — simulating a successful payment.' });
      window.location.href = data.checkout_url;
    } catch (e) {
      toast({ title: 'Checkout failed', description: 'Please try again.' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="max-w-5xl mx-auto px-5 lg:px-8 pt-16 pb-24">
        <h1 className="display text-[44px]">Your Cart</h1>
        {items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-neutral-200 p-16 text-center">
            <ShoppingBag size={28} className="mx-auto text-neutral-400" />
            <p className="mt-4 text-[15px] text-neutral-600">Your cart is empty. Discover our Notion templates.</p>
            <Link to="/templates" className="pp-btn-dark inline-block mt-6 px-5 py-3">Browse Templates</Link>
          </div>
        ) : (
          <div className="mt-8 grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-3">
              {items.map((i) => (
                <div key={i.slug} className="pp-card p-4 flex items-center gap-4">
                  <img src={i.image} alt={i.name} className="w-20 h-20 rounded-lg object-cover" />
                  <div className="flex-1"><div className="font-semibold">{i.name}</div><div className="text-[13px] text-neutral-500">Digital · Instant duplicate</div></div>
                  <div className="font-semibold">${i.price}</div>
                  <button onClick={() => remove(i.slug)} className="p-2 hover:bg-neutral-200 rounded-md transition"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
            <div className="pp-card p-6 h-fit">
              <h3 className="font-semibold text-[16px]">Order summary</h3>
              <div className="mt-4 space-y-2 text-[14px]">
                <div className="flex justify-between"><span className="text-neutral-600">Subtotal</span><span>${total}</span></div>
                <div className="flex justify-between"><span className="text-neutral-600">Tax</span><span>$0</span></div>
                <div className="h-px bg-neutral-300 my-3" />
                <div className="flex justify-between font-semibold text-[16px]"><span>Total</span><span>${total}</span></div>
              </div>
              <button onClick={checkout} disabled={loading} className="pp-btn-dark w-full py-3.5 mt-6 inline-flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={14} />} Checkout — ${total}
              </button>
              <div className="mt-4 text-[12px] text-neutral-500 flex items-center gap-2"><Lock size={12} /> Secured by Stripe · test mode</div>
            </div>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
