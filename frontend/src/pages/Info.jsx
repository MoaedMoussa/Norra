import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { Play, BookOpen, Wrench, ArrowRight } from 'lucide-react';

const tutorials = [
  { title: 'How to duplicate a PathPages template', mins: 2, tag: 'Getting started' },
  { title: 'Setting up your Second Brain in 10 minutes', mins: 10, tag: 'Second Brain' },
  { title: 'Building custom views inside Finance Tracker', mins: 8, tag: 'Finance' },
  { title: 'Automating recurring tasks with Notion buttons', mins: 6, tag: 'Automation' },
  { title: 'Sync Google Calendar into your Life Planner', mins: 4, tag: 'Life Planner' },
  { title: 'Notion formulas 101 for template customization', mins: 12, tag: 'Advanced' },
];

const tools = [
  { title: 'Notion Icon Library', desc: 'Free minimalist icons for your workspace.', Icon: Wrench },
  { title: 'Notion Cover Generator', desc: 'Generate branded covers in one click.', Icon: Wrench },
  { title: 'Notion Template Preview', desc: 'See any template before you buy.', Icon: Wrench },
];

export function Tutorials() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="max-w-7xl mx-auto px-5 lg:px-8 pt-16 pb-16">
        <h1 className="display text-[52px]">Tutorials</h1>
        <p className="mt-4 text-[16px] text-neutral-600 max-w-2xl">Short, focused videos to get the most out of every template.</p>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tutorials.map((t, i) => (
            <div key={i} className="pp-card overflow-hidden group cursor-pointer">
              <div className="aspect-video bg-neutral-200 relative flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center shadow-lg group-hover:scale-110 transition"><Play size={22} className="text-neutral-900 ml-1" fill="currentColor" /></div>
                <div className="absolute bottom-3 right-3 text-[12px] bg-black/70 text-white px-2 py-0.5 rounded">{t.mins} min</div>
              </div>
              <div className="p-5">
                <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold">{t.tag}</div>
                <h3 className="mt-2 font-semibold text-[15.5px]">{t.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}

export function Tools() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="max-w-7xl mx-auto px-5 lg:px-8 pt-16 pb-16">
        <h1 className="display text-[52px]">Free Tools</h1>
        <p className="mt-4 text-[16px] text-neutral-600 max-w-2xl">Small utilities built to make your Notion workspace better.</p>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {tools.map((t, i) => (
            <div key={i} className="pp-card p-8">
              <div className="w-11 h-11 rounded-xl bg-white border border-neutral-200 flex items-center justify-center"><t.Icon size={20} /></div>
              <h3 className="mt-5 font-semibold text-[17px]">{t.title}</h3>
              <p className="mt-2 text-[14px] text-neutral-600">{t.desc}</p>
              <button className="mt-5 pp-btn-light px-4 py-2 text-[13px] inline-flex items-center gap-1.5">Open <ArrowRight size={13} /></button>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
