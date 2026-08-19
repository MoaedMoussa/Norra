import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Zap, Shield, RefreshCw, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { templates, bundle, testimonials } from '../mock';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 pt-20 pb-16 grid lg:grid-cols-2 gap-12 items-center">
        <div className="fade-in">
          <h1 className="display text-[52px] sm:text-[64px] lg:text-[76px]">
            Get Organized <span className="serif-accent text-[0.9em]">&</span> Productive With Notion Templates
          </h1>
          <p className="mt-6 text-[17px] text-neutral-600 leading-relaxed max-w-xl">
            All-in-one Notion templates to help you organize your life and get things done. Save hundreds of hours building templates yourself, duplicate ours in seconds.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/templates" className="pp-btn-dark px-6 py-3.5 text-[15px]">View Templates</Link>
            <Link to="/templates/notion-complete-bundle" className="pp-btn-light px-6 py-3.5 text-[15px] flex items-center gap-2.5">
              Get All Templates <span className="badge-off">80% OFF!</span>
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-3 text-[14px] text-neutral-600">
            <div className="flex gap-0.5 text-[#F5C542]">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" strokeWidth={0} />)}
            </div>
            <span className="font-semibold text-neutral-900">Rated 4.9/5</span>
            <span className="text-neutral-400">•</span>
            <span>Trusted by <b className="text-neutral-900">120,000+</b> customers worldwide</span>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="absolute -top-8 -right-4 w-72 h-72 rounded-full bg-orange-100/40 blur-3xl" />
          <div className="absolute -bottom-8 -left-4 w-72 h-72 rounded-full bg-blue-100/40 blur-3xl" />
          <div className="relative grid grid-cols-2 gap-4">
            <div className="pp-card p-4 aspect-[3/4] overflow-hidden">
              <img src={templates[0].image} alt="" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="pp-card p-4 aspect-[3/4] overflow-hidden mt-10">
              <img src={templates[2].image} alt="" className="w-full h-full object-cover rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Templates grid */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((t) => (
            <Link key={t.slug} to={`/templates/${t.slug}`} className="pp-card overflow-hidden group">
              <div className="aspect-[4/3] bg-neutral-200 overflow-hidden">
                <img src={t.image} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="p-6">
                <h3 className="display text-[24px]">{t.name}</h3>
                <p className="mt-2 text-[14px] text-neutral-600 leading-relaxed">{t.tagline}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="pp-btn-light px-4 py-2 text-[13px] inline-flex items-center gap-1.5">
                    Learn More <ArrowRight size={14} />
                  </span>
                  <div className="text-[14px]">
                    <span className="font-semibold text-neutral-900">${t.price}</span>
                    <span className="text-neutral-400 line-through ml-1.5 text-[12px]">${t.originalPrice}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bundle CTA */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
        <div className="rounded-3xl bg-[#F5F5F4] overflow-hidden grid md:grid-cols-2 items-center">
          <div className="aspect-[4/3] bg-neutral-200 overflow-hidden">
            <img src={bundle.image} alt="Bundle" className="w-full h-full object-cover" />
          </div>
          <div className="p-10 md:p-14">
            <div className="inline-block badge-off">SAVE 80%</div>
            <h2 className="display text-[40px] mt-4">Gain Access <br /><span className="serif-accent">to</span> Everything</h2>
            <p className="mt-4 text-[15px] text-neutral-600 leading-relaxed max-w-md">
              Transform your work and personal life with the exclusive Notion Complete Bundle — featuring all premium Notion templates.
            </p>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="display text-[32px]">${bundle.price}</span>
              <span className="text-neutral-400 line-through">${bundle.originalPrice}</span>
            </div>
            <Link to="/templates/notion-complete-bundle" className="pp-btn-dark inline-flex items-center gap-3 px-6 py-3.5 mt-6 text-[15px]">
              Get Complete Bundle <span className="badge-off">80% OFF!</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16 grid md:grid-cols-4 gap-8">
        {[
          { Icon: Zap, title: 'Instant duplicate', desc: 'One click to add any template to your Notion.' },
          { Icon: Shield, title: 'Lifetime access', desc: 'Buy once, use forever — including all updates.' },
          { Icon: RefreshCw, title: 'Free updates', desc: 'Every template evolves. So does your workspace.' },
          { Icon: Users, title: '120,000+ users', desc: 'Trusted by a global community of Notion lovers.' },
        ].map(({ Icon, title, desc }) => (
          <div key={title}>
            <div className="w-11 h-11 rounded-xl bg-neutral-100 flex items-center justify-center"><Icon size={20} /></div>
            <h4 className="mt-4 font-semibold text-[16px]">{title}</h4>
            <p className="mt-1.5 text-[14px] text-neutral-600 leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <h2 className="display text-[44px] max-w-2xl">Testimonials</h2>
        <p className="mt-4 text-[16px] text-neutral-600 max-w-xl leading-relaxed">
          There are way too many testimonials for you to read in a single day. But here are a few random ones from our amazing Notion enthusiasts and customers.
        </p>

        <div className="mt-10 columns-1 md:columns-2 lg:columns-3 gap-6 [&>*]:break-inside-avoid">
          {testimonials.map((t, i) => (
            <div key={i} className="pp-card p-6 mb-6">
              <p className="text-[14.5px] leading-relaxed text-neutral-800">“{t.text}”</p>
              <div className="mt-5 flex items-center gap-3">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-neutral-300 flex items-center justify-center font-semibold text-neutral-700">{t.name[0]}</div>
                )}
                <div>
                  <div className="text-[14px] font-semibold">{t.name}</div>
                  <div className="text-[12px] text-neutral-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Compare link */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
        <div className="rounded-3xl border border-neutral-200 p-10 md:p-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h3 className="display text-[28px]">PathPages vs. the rest</h3>
            <p className="mt-2 text-[15px] text-neutral-600 max-w-xl">See how PathPages stacks up against every major Notion template creator.</p>
          </div>
          <Link to="/compare" className="pp-btn-dark inline-flex items-center gap-2 px-5 py-3 self-start md:self-auto">
            View Comparisons <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
