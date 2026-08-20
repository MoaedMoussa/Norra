import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Zap, Shield, RefreshCw, Users, Quote } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { templates, bundle, testimonials } from '../mock';

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="max-w-7xl mx-auto px-5 lg:px-8 pt-20 pb-16 grid lg:grid-cols-12 gap-12 items-center">
        <div className="fade-in lg:col-span-7">
          <div className="badge-cream inline-block mb-6">Notion Studio · Est. 2024</div>
          <h1 className="display text-[58px] sm:text-[72px] lg:text-[88px]">
            Notion templates <br />
            <span className="serif-accent">for a</span> well-run life.
          </h1>
          <p className="mt-8 text-[17px] text-neutral-700 leading-relaxed max-w-xl">
            Norra is a small design studio building calm, complete Notion systems — for the way you actually work, plan, and think. Duplicate one in seconds and move on with your day.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/templates" className="norra-btn-dark px-6 py-3.5 text-[14.5px] inline-flex items-center gap-2">Browse the studio <ArrowRight size={15} /></Link>
            <Link to="/templates/notion-complete-bundle" className="norra-btn-light px-6 py-3.5 text-[14.5px] inline-flex items-center gap-2.5">
              The Complete Studio <span className="badge-off">80% off</span>
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-4 text-[13.5px] text-neutral-600">
            <div className="flex gap-0.5 text-[#D96A3F]">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" strokeWidth={0} />)}
            </div>
            <span><b className="text-neutral-900">4.9</b> from 120,000+ builders, freelancers, students & founders</span>
          </div>
        </div>

        <div className="relative hidden lg:block lg:col-span-5">
          <div className="absolute -top-8 -right-4 w-72 h-72 rounded-full bg-[#D96A3F]/10 blur-3xl" />
          <div className="relative grid grid-cols-2 gap-5">
            <div className="norra-card overflow-hidden aspect-[3/4]">
              <img src={templates[0].image} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="norra-card overflow-hidden aspect-[3/4] mt-12">
              <img src={templates[2].image} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 lg:px-8 pt-10 pb-6">
        <div className="flex items-end justify-between border-b border-[#D9CFB8] pb-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 font-medium">The Studio</div>
            <h2 className="display text-[36px] mt-2">Six complete systems, thoughtfully built.</h2>
          </div>
          <Link to="/templates" className="hidden md:inline-flex items-center gap-1.5 text-[14px] font-medium underline underline-offset-4">All templates <ArrowRight size={14} /></Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((t, i) => (
            <Link key={t.slug} to={`/templates/${t.slug}`} className="norra-card overflow-hidden group">
              <div className="aspect-[4/3] bg-neutral-200 overflow-hidden">
                <img src={t.image} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-neutral-500 font-medium">
                  <span>{String(i+1).padStart(2, '0')}</span><span>·</span><span>{t.category}</span>
                </div>
                <h3 className="display text-[28px] mt-2">{t.name}</h3>
                <p className="mt-2 text-[14px] text-neutral-600 leading-relaxed">{t.tagline}</p>
                <div className="mt-6 flex items-center justify-between border-t border-[#D9CFB8] pt-4">
                  <span className="text-[13.5px] font-medium inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all">View system <ArrowRight size={14} /></span>
                  <div className="text-[14px]">
                    <span className="font-semibold text-neutral-900">${t.price}</span>
                    <span className="text-neutral-500 line-through ml-1.5 text-[12px]">${t.originalPrice}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <div className="rounded-md bg-[#14110E] text-[#F8F5EE] overflow-hidden grid md:grid-cols-2 items-stretch">
          <div className="aspect-[4/3] md:aspect-auto overflow-hidden bg-neutral-800">
            <img src={bundle.image} alt="Bundle" className="w-full h-full object-cover opacity-90" />
          </div>
          <div className="p-10 md:p-14 flex flex-col justify-center">
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#D96A3F] font-medium">Complete Studio</div>
            <h2 className="display text-[46px] mt-4 leading-[1]">Everything we make.<br /><span className="serif-accent">Forever.</span></h2>
            <p className="mt-6 text-[15px] text-[#F8F5EE]/75 leading-relaxed max-w-md">
              Every current template. Every future template. A single price. Built for people who want the whole system, not another one-off download.
            </p>
            <div className="mt-8 flex items-baseline gap-3">
              <span className="display text-[42px]">${bundle.price}</span>
              <span className="text-[#F8F5EE]/50 line-through">${bundle.originalPrice}</span>
              <span className="badge-off">Save 80%</span>
            </div>
            <Link to="/templates/notion-complete-bundle" className="norra-btn-accent inline-flex items-center gap-3 px-6 py-3.5 mt-8 text-[14.5px] self-start">
              Get the Complete Studio <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16 border-t border-[#D9CFB8]">
        <div className="grid md:grid-cols-4 gap-10">
          {[
            { Icon: Zap, title: 'Instant duplicate', desc: 'One click and any template lives in your Notion.' },
            { Icon: Shield, title: 'Lifetime access', desc: 'Buy once, use forever — including every update.' },
            { Icon: RefreshCw, title: 'Free updates', desc: 'Every template keeps improving. So does your workspace.' },
            { Icon: Users, title: 'A quiet community', desc: 'A small, focused group of thoughtful Notion users.' },
          ].map(({ Icon, title, desc }) => (
            <div key={title}>
              <div className="w-10 h-10 rounded-md bg-[#EDE6D6] flex items-center justify-center"><Icon size={17} /></div>
              <h4 className="mt-5 font-medium text-[16px]">{title}</h4>
              <p className="mt-2 text-[13.5px] text-neutral-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-20 border-t border-[#D9CFB8]">
        <div className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 font-medium">Kind words</div>
        <h2 className="display text-[50px] mt-3 max-w-3xl">Loved by people who take their systems seriously.</h2>

        <div className="mt-14 columns-1 md:columns-2 lg:columns-3 gap-6 [&>*]:break-inside-avoid">
          {testimonials.map((t, i) => (
            <div key={i} className="norra-card p-7 mb-6">
              <Quote size={18} className="text-[#D96A3F]" />
              <p className="mt-4 text-[15px] leading-relaxed text-neutral-800" style={{ fontFamily: 'Fraunces, serif', fontWeight: 400 }}>{t.text.replace(/pathpages/gi, 'Norra').replace(/Pathpages/g, 'Norra')}</p>
              <div className="mt-6 flex items-center gap-3 border-t border-[#D9CFB8] pt-4">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#D9CFB8] flex items-center justify-center font-medium text-neutral-700">{t.name[0]}</div>
                )}
                <div>
                  <div className="text-[13.5px] font-medium">{t.name}</div>
                  <div className="text-[11.5px] uppercase tracking-wider text-neutral-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
        <div className="rounded-md border border-[#D9CFB8] bg-[#F8F5EE] p-10 md:p-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 font-medium">Compare</div>
            <h3 className="display text-[32px] mt-3">Norra vs. the rest of the Notion world.</h3>
            <p className="mt-3 text-[15px] text-neutral-600 max-w-xl leading-relaxed">Honest, up-to-date side-by-side comparisons with every major Notion template creator.</p>
          </div>
          <Link to="/compare" className="norra-btn-dark inline-flex items-center gap-2 px-6 py-3.5 self-start md:self-auto text-[14.5px]">
            Read the comparisons <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
