import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Play, Wrench, ArrowRight, Download, Sparkles, Copy, Check, Palette, Terminal, Image as ImageIcon } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const tutorials = [
  { title: 'How to Duplicate and Setup Any Norra Template in 60 Seconds', mins: 2, tag: 'Getting Started', views: '28k views' },
  { title: 'Mastering the PARA Method in Notion (Projects, Areas, Resources, Archives)', mins: 12, tag: 'Second Brain', views: '45k views' },
  { title: 'Automating Budget Rollups & Net Worth Formulas with Notion 3.0', mins: 8, tag: 'Finance OS', views: '19k views' },
  { title: 'Building Native Notion Action Buttons for Recurring Workflows', mins: 6, tag: 'Automation', views: '32k views' },
  { title: 'Creator Pipeline Management: From Idea to YouTube Script & Sponsor Invoicing', mins: 14, tag: 'Creator OS', views: '15k views' },
  { title: 'Client Portals: Creating Shareable Notion Dashboards for Freelancers', mins: 9, tag: 'Freelance', views: '22k views' },
];

export function Tutorials() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <section className="max-w-7xl mx-auto px-5 lg:px-8 pt-16 pb-20">
        <div className="text-[11px] font-mono uppercase tracking-widest text-blue-600 font-bold">
          Studio Journal & Video Masterclasses
        </div>
        <h1 className="display text-[46px] sm:text-[56px] text-slate-950 mt-1">
          Master Modern Notion Workspaces.
        </h1>
        <p className="mt-4 text-[16.5px] text-slate-600 max-w-2xl leading-relaxed">
          High-definition guides, architectural walkthroughs, and setup tutorials to maximize your system productivity.
        </p>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {tutorials.map((t, i) => (
            <div
              key={i}
              onClick={() => setSelectedVideo(t)}
              className="norra-card overflow-hidden group cursor-pointer flex flex-col justify-between"
            >
              <div className="aspect-video bg-slate-900 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-radial-at-c from-blue-900/40 to-slate-950 opacity-90" />
                <div className="w-14 h-14 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-sports-text transition duration-300 z-10">
                  <Play size={20} className="ml-1" fill="currentColor" />
                </div>
                <div className="absolute bottom-3 right-3 text-[11px] font-mono bg-black/80 backdrop-blur-md text-sports-text px-2 py-0.5 rounded z-10">
                  {t.mins} MIN
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase">
                  <span>{t.tag}</span>
                  <span>{t.views}</span>
                </div>
                <h3 className="mt-2.5 font-bold text-[17px] text-slate-900 group-hover:text-blue-600 transition leading-snug">
                  {t.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Video Modal Simulation */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-[12px] font-mono text-blue-600 font-bold uppercase">{selectedVideo.tag} · {selectedVideo.mins} Min Guide</span>
              <button onClick={() => setSelectedVideo(null)} className="text-slate-400 hover:text-slate-900">✕</button>
            </div>
            <h3 className="display text-[22px] text-slate-900 mt-3">{selectedVideo.title}</h3>
            <div className="aspect-video bg-slate-900 rounded-xl mt-4 flex flex-col items-center justify-center text-slate-300 text-center p-6">
              <Play size={36} className="text-blue-400 mb-2" />
              <p className="text-[14px]">Studio Masterclass Video Stream</p>
              <p className="text-[12px] text-slate-500 mt-1">Full 4K Notion Walkthrough included with all template duplicates.</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setSelectedVideo(null)} className="norra-btn-dark px-5 py-2 text-[13.5px] rounded-xl">
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export function Tools() {
  const [coverTitle, setCoverTitle] = useState('My Studio Workspace');
  const [coverCategory, setCoverCategory] = useState('PARA Digital Brain');
  const [coverBg, setCoverBg] = useState('gradient-obsidian');
  const [copied, setCopied] = useState(false);

  const bgStyles = {
    'gradient-obsidian': 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-sports-text',
    'gradient-blue': 'bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 text-sports-text',
    'gradient-emerald': 'bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-950 text-sports-text',
    'gradient-minimal': 'bg-gradient-to-br from-slate-100 via-white to-slate-200 text-slate-900 border border-slate-300',
  };

  const copyFormula = (formula) => {
    navigator.clipboard.writeText(formula);
    setCopied(true);
    toast({ title: 'Copied formula to clipboard', description: 'Paste directly into your Notion formula property.' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <section className="max-w-7xl mx-auto px-5 lg:px-8 pt-16 pb-20">
        <div className="text-[11px] font-mono uppercase tracking-widest text-blue-600 font-bold">
          Free Notion Creator Tools
        </div>
        <h1 className="display text-[46px] sm:text-[56px] text-slate-950 mt-1">
          Precision Utilities for Notion Builders.
        </h1>
        <p className="mt-4 text-[16.5px] text-slate-600 max-w-2xl leading-relaxed">
          Free tools engineered by Norra Studio to make your personal Notion workspace sharper, cleaner, and faster.
        </p>

        {/* Tool 1: Interactive Notion Cover Generator */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-7 sm:p-9 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Palette size={20} />
            </div>
            <div>
              <h2 className="display text-[26px] text-slate-900">Notion Minimalist Cover Generator</h2>
              <p className="text-[13.5px] text-slate-500">Create custom, high-resolution aesthetic headers for your Notion pages.</p>
            </div>
          </div>

          <div className="mt-8 grid lg:grid-cols-12 gap-8 items-center">
            {/* Live Cover Preview Canvas */}
            <div className="lg:col-span-7">
              <div className={`w-full aspect-[3/1] rounded-2xl p-8 flex flex-col justify-end shadow-lg transition duration-300 relative overflow-hidden ${bgStyles[coverBg]}`}>
                <div className="absolute top-4 right-4 text-[11px] font-mono uppercase opacity-60">
                  NORRA STUDIO SPEC // 1500x500
                </div>
                <div className="relative z-10">
                  <div className="text-[11px] font-mono uppercase tracking-widest opacity-75 font-semibold">
                    {coverCategory || 'WORKSPACE CATEGORY'}
                  </div>
                  <div className="display text-[26px] sm:text-[34px] font-bold mt-1 tracking-tight">
                    {coverTitle || 'Untitled Workspace'}
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <label className="text-[12.5px] font-semibold text-slate-700 block mb-1">Page Title</label>
                <input
                  type="text"
                  value={coverTitle}
                  onChange={(e) => setCoverTitle(e.target.value)}
                  className="w-full h-10 px-3.5 bg-slate-50 rounded-xl text-[14px] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="text-[12.5px] font-semibold text-slate-700 block mb-1">Subtitle / Category</label>
                <input
                  type="text"
                  value={coverCategory}
                  onChange={(e) => setCoverCategory(e.target.value)}
                  className="w-full h-10 px-3.5 bg-slate-50 rounded-xl text-[14px] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="text-[12.5px] font-semibold text-slate-700 block mb-1">Color Theme</label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => setCoverBg('gradient-obsidian')}
                    className={`h-9 rounded-lg bg-slate-900 border text-[11px] text-sports-text font-mono ${coverBg === 'gradient-obsidian' ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    Obsidian
                  </button>
                  <button
                    onClick={() => setCoverBg('gradient-blue')}
                    className={`h-9 rounded-lg bg-blue-700 border text-[11px] text-sports-text font-mono ${coverBg === 'gradient-blue' ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    Cobalt
                  </button>
                  <button
                    onClick={() => setCoverBg('gradient-emerald')}
                    className={`h-9 rounded-lg bg-emerald-800 border text-[11px] text-sports-text font-mono ${coverBg === 'gradient-emerald' ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    Emerald
                  </button>
                  <button
                    onClick={() => setCoverBg('gradient-minimal')}
                    className={`h-9 rounded-lg bg-slate-200 border text-[11px] text-slate-900 font-mono ${coverBg === 'gradient-minimal' ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    Light
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => toast({ title: 'Cover Ready', description: 'Right-click or screenshot the banner above to set as your Notion cover!' })}
                  className="w-full norra-btn-dark py-2.5 text-[13.5px] rounded-xl flex items-center justify-center gap-2"
                >
                  <Download size={15} /> Save / Export Cover Banner
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tool 2: Notion 3.0 Formula Cheat-Sheet */}
        <div className="mt-10 bg-white rounded-2xl border border-slate-200 p-7 sm:p-9 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Terminal size={20} />
            </div>
            <div>
              <h2 className="display text-[26px] text-slate-900">Notion 3.0 Formula Snippets</h2>
              <p className="text-[13.5px] text-slate-500">Plug-and-play formulas for dynamic progress bars, overdue alerts & net sums.</p>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="font-bold text-[14px] text-slate-900">Dynamic Progress Bar (●●●○○)</div>
                <div className="text-[12px] text-slate-500 mt-0.5">Generates visual progress based on completed sub-tasks.</div>
                <code className="block bg-slate-900 text-blue-300 font-mono text-[11.5px] p-2.5 rounded-lg mt-3 overflow-x-auto">
                  repeat("●", round(prop("Progress") * 10)) + repeat("○", 10 - round(prop("Progress") * 10))
                </code>
              </div>
              <button
                onClick={() => copyFormula('repeat("●", round(prop("Progress") * 10)) + repeat("○", 10 - round(prop("Progress") * 10))')}
                className="mt-3 text-[12px] font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                <Copy size={13} /> Copy Formula
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="font-bold text-[14px] text-slate-900">Overdue Task Status Alert</div>
                <div className="text-[12px] text-slate-500 mt-0.5">Flags tasks that missed their target completion date.</div>
                <code className="block bg-slate-900 text-blue-300 font-mono text-[11.5px] p-2.5 rounded-lg mt-3 overflow-x-auto">
                  if(empty(prop("Due Date")), "⚪ No date", if(now() &gt; prop("Due Date") and not(prop("Done")), "🔴 Overdue", "🟢 On Track"))
                </code>
              </div>
              <button
                onClick={() => copyFormula('if(empty(prop("Due Date")), "⚪ No date", if(now() > prop("Due Date") and not(prop("Done")), "🔴 Overdue", "🟢 On Track"))')}
                className="mt-3 text-[12px] font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                <Copy size={13} /> Copy Formula
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function Info() {
  return <Tools />;
}

