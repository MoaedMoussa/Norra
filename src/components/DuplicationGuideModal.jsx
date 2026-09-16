import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Check, Sparkles, ExternalLink, Zap, ShieldCheck, ArrowRight, X } from 'lucide-react';

export default function DuplicationGuideModal({ open, onClose }) {
  const steps = [
    {
      num: '01',
      title: 'Complete Your Order',
      desc: 'Get instant access link in your email and immediately in your Norra Library dashboard.',
    },
    {
      num: '02',
      title: 'Click "Duplicate" in Top Right',
      desc: 'Open the Notion link and click the "Duplicate" button in the upper right corner of your browser.',
    },
    {
      num: '03',
      title: 'Select Your Notion Workspace',
      desc: 'Pick any private page or team workspace. All templates, formulas, and databases clone instantly.',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-xl p-6 bg-white border border-slate-200 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 text-[11px] font-mono rounded-full font-semibold">
              Instant Duplicate Guide
            </span>
            <span className="text-[12px] text-slate-500 font-medium">How it works</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
            <X size={16} />
          </button>
        </div>

        <DialogTitle className="display text-[26px] text-slate-900 mt-5">
          Duplicate to your Notion in under 60 seconds
        </DialogTitle>
        <DialogDescription className="text-slate-500 text-[14px] mt-1">
          No coding or complex setup required. Built with native Notion 2.0/3.0 architecture.
        </DialogDescription>

        <div className="mt-6 space-y-4">
          {steps.map((s, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-9 h-9 rounded-lg bg-slate-900 text-sports-text font-mono font-bold text-[13px] flex items-center justify-center flex-shrink-0">
                {s.num}
              </div>
              <div>
                <div className="font-bold text-slate-900 text-[15px]">{s.title}</div>
                <div className="text-[13px] text-slate-600 mt-0.5 leading-relaxed">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center gap-3 text-[13px] text-blue-900">
          <ShieldCheck size={18} className="text-blue-600 flex-shrink-0" />
          <span>Includes free updates, video walk-throughs, and priority studio email support.</span>
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full norra-btn-dark py-3 text-[14px] rounded-xl"
          >
            Got it, ready to browse
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
