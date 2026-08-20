import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { DollarSign, ShoppingBag, Users, Package } from 'lucide-react';

export default function Admin() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    (async () => {
      try {
        const [s, o] = await Promise.all([api.get('/admin/stats'), api.get('/admin/orders')]);
        setStats(s.data);
        setOrders(o.data.orders || []);
      } catch {}
    })();
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-neutral-500">Loading...</div>;
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-2xl mx-auto px-5 py-24 text-center">
          <h1 className="display text-[36px]">Admins only</h1>
          <p className="mt-3 text-neutral-600">You need an admin role to view this page.</p>
          <Link to="/" className="pp-btn-dark inline-block mt-6 px-5 py-3">Back home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="max-w-7xl mx-auto px-5 lg:px-8 pt-14 pb-20">
        <div className="text-[12px] uppercase tracking-wider text-neutral-500 font-semibold">Admin</div>
        <h1 className="display text-[44px] mt-2">Dashboard</h1>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-5">
          <StatCard Icon={DollarSign} label="Revenue" value={`$${(stats?.revenue || 0).toFixed(2)}`} />
          <StatCard Icon={ShoppingBag} label="Paid orders" value={stats?.total_orders ?? 0} />
          <StatCard Icon={Users} label="Total users" value={stats?.total_users ?? 0} />
        </div>

        <h2 className="display text-[24px] mt-14">Recent orders</h2>
        <div className="mt-4 pp-card overflow-hidden">
          <div className="grid grid-cols-5 text-[12px] uppercase tracking-wider text-neutral-500 font-semibold px-5 py-3 border-b border-neutral-200 bg-white">
            <div>Order</div><div>Email</div><div>Items</div><div>Amount</div><div>Status</div>
          </div>
          {orders.length === 0 ? (
            <div className="p-10 text-center text-neutral-500 text-[14px]">No orders yet.</div>
          ) : orders.map((o, i) => (
            <div key={o.order_id} className={`grid grid-cols-5 items-center px-5 py-3 text-[13.5px] ${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}`}>
              <div className="font-mono text-neutral-800">{o.order_id.slice(0, 14)}...</div>
              <div className="text-neutral-700 truncate pr-3">{o.user_email || '—'}</div>
              <div className="flex items-center gap-1 text-neutral-700"><Package size={14} /> {o.slugs.length}</div>
              <div className="text-neutral-900 font-semibold">${(o.total_cents/100).toFixed(2)}</div>
              <div><span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded ${o.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-200 text-neutral-700'}`}>{o.status}</span></div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}

function StatCard({ Icon, label, value }) {
  return (
    <div className="pp-card p-6">
      <div className="w-10 h-10 rounded-lg bg-white border border-neutral-200 flex items-center justify-center"><Icon size={16} /></div>
      <div className="mt-4 text-[13px] text-neutral-500 uppercase tracking-wider font-semibold">{label}</div>
      <div className="display text-[28px] mt-1">{value}</div>
    </div>
  );
}
