import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { ArrowRight, CheckCircle, Sparkles, RefreshCw, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { templates, bundle } from '../mock';

const QUESTIONS = [
  {
    id: 'goal',
    title: 'What is your primary focus right now?',
    options: [
      { label: 'Total Life & Productivity Organization', desc: 'Manage projects, daily habits, vault knowledge, and daily schedule', val: 'notion-second-brain' },
      { label: 'Financial Mastery & Budgeting', desc: 'Track cash flow, net worth growth, subscriptions, and investments', val: 'notion-finance-tracker' },
      { label: 'Content Creation & Audience Growth', desc: 'Manage YouTube/social pipeline, brand deals, script drafts & CRM', val: 'notion-creator-system' },
      { label: 'Client Work & Freelancing', desc: 'Invoices, project deliverables, client CRM, and proposals', val: 'notion-freelance-system' },
      { label: 'I want everything for a complete setup', desc: 'Get all 6 premium systems in one complete studio package', val: 'notion-complete-bundle' },
    ]
  },
  {
    id: 'experience',
    title: 'How experienced are you with Notion?',
    options: [
      { label: 'New or Beginner', desc: 'I want clean, easy-to-use plug-and-play dashboards with video guides', val: 'beginner' },
      { label: 'Intermediate / Power User', desc: 'I love linked databases, automated rollups, and deep relational views', val: 'pro' },
    ]
  }
];

export default function TemplateQuizModal({ open, onClose }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const handleSelect = (val) => {
    const currentQ = QUESTIONS[step];
    const newAnswers = { ...answers, [currentQ.id]: val };
    setAnswers(newAnswers);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      // Calculate recommendation
      const targetSlug = newAnswers.goal || 'notion-second-brain';
      const matched = targetSlug === 'notion-complete-bundle'
        ? bundle
        : templates.find(t => t.slug === targetSlug) || templates[0];
      setResult(matched);
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-xl p-6 bg-white border border-slate-200 rounded-2xl shadow-2xl">
        {!result ? (
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 text-[11px] font-mono rounded-full font-semibold">
                  Step {step + 1} of {QUESTIONS.length}
                </span>
                <span className="text-[12px] text-slate-500 font-medium">Norra System Matcher</span>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
                <X size={16} />
              </button>
            </div>

            <DialogTitle className="display text-[26px] text-slate-900 mt-5">
              {QUESTIONS[step].title}
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-[14px] mt-1">
              Select the option that best describes your workspace needs.
            </DialogDescription>

            <div className="mt-6 space-y-2.5">
              {QUESTIONS[step].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(opt.val)}
                  className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition group flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="font-semibold text-slate-900 group-hover:text-blue-600 text-[14.5px] transition">
                      {opt.label}
                    </div>
                    <div className="text-[13px] text-slate-500 mt-0.5">
                      {opt.desc}
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition mt-1 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto mb-3">
              <Sparkles size={24} />
            </div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Recommended Match
            </span>
            <DialogTitle className="display text-[30px] text-slate-900 mt-3">
              {result.name}
            </DialogTitle>
            <DialogDescription className="text-slate-600 text-[14.5px] max-w-md mx-auto mt-2">
              {result.tagline || result.description}
            </DialogDescription>

            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-4 text-left">
              <img src={result.image} alt={result.name} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" referrerPolicy="no-referrer" />
              <div className="flex-1">
                <div className="text-[11px] font-mono text-slate-400 uppercase">{result.category || 'Complete Bundle'}</div>
                <div className="font-bold text-slate-900 text-[16px]">{result.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold text-slate-900 text-[15px]">${result.price}</span>
                  <span className="line-through text-slate-400 text-[13px]">${result.originalPrice}</span>
                  <span className="badge-off text-[10px]">Instant Duplicate</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Link
                to={`/templates/${result.slug}`}
                onClick={onClose}
                className="norra-btn-accent flex-1 py-3 text-[14.5px] inline-flex items-center justify-center gap-2 rounded-xl"
              >
                Inspect System <ArrowRight size={16} />
              </Link>
              <button
                onClick={handleReset}
                className="norra-btn-light px-4 py-3 text-[14px] inline-flex items-center gap-1.5 rounded-xl text-slate-600"
              >
                <RefreshCw size={14} /> Retake
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
