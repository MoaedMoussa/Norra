import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Play, Wrench, ArrowRight } from 'lucide-react';

const tutorials = [
  { title: 'How to duplicate a Norra template', mins: 2, tag: 'Getting started' },
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
    <div className="min-h-screen">
      <Navbar />
      <section className="max-w-7xl mx-auto px-5 lg:px-8 pt-16 pb-16">
        <div className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 font-medium">Journal</div>
        <h1 className="display text-[56px] mt-3">Notes from the studio.</h1>
        <p className="mt-5 text-[16px] text-neutral-700 max-w-2xl leading-relaxed">Short, focused videos and essays to get the most out of every Norra template.</p>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((t, i) => (
            <div key={i} className="norra-card overflow-hidden group cursor-pointer">
              <div className="aspect-video bg-[#D9CFB8] relative flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-[#F8F5EE] flex items-center justify-center shadow-lg group-hover:scale-110 transition"><Play size={20} className="text-[#14110E] ml-1" fill="currentColor" /></div>
                <div className="absolute bottom-3 right-3 text-[11px] bg-[#14110E]/80 text-[#F8F5EE] px-2 py-0.5 rounded">{t.mins} min</div>
              </div>
              <div className="p-5">
                <div className="text-[11px] uppercase tracking-[0.15em] text-neutral-500 font-medium">{t.tag}</div>
                <h3 className="mt-2 font-medium text-[16px]" style={{ fontFamily: 'Fraunces, serif' }}>{t.title}</h3>
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
    <div className="min-h-screen">
      <Navbar />
      <section className="max-w-7xl mx-auto px-5 lg:px-8 pt-16 pb-16">
        <div className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 font-medium">Tools</div>
        <h1 className="display text-[56px] mt-3">Small utilities. Big lift.</h1>
        <p className="mt-5 text-[16px] text-neutral-700 max-w-2xl leading-relaxed">Free tools we've built to make your Notion workspace calmer, faster, and prettier.</p>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {tools.map((t, i) => (
            <div key={i} className="norra-card p-8">
              <div className="w-11 h-11 rounded-md bg-[#F8F5EE] border border-[#D9CFB8] flex items-center justify-center"><t.Icon size={18} /></div>
              <h3 className="mt-6 font-medium text-[19px]" style={{ fontFamily: 'Fraunces, serif' }}>{t.title}</h3>
              <p className="mt-2 text-[13.5px] text-neutral-600 leading-relaxed">{t.desc}</p>
              <button className="mt-6 norra-btn-light px-4 py-2 text-[13px] inline-flex items-center gap-1.5">Open <ArrowRight size={13} /></button>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
