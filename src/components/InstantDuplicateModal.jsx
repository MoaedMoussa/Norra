import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Zap,
  CheckCircle2,
  Copy,
  Layers,
  Database,
  ShieldCheck,
  Check,
  Code,
  Download,
  Terminal,
  Bookmark
} from 'lucide-react';
import { TEMPLATE_WORKSPACES } from '../constants/templateWorkspaces';
import { toast } from '../hooks/use-toast';

export default function InstantDuplicateModal({ open, onClose, template, onCheckout }) {
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  if (!open || !template) return null;

  const data = TEMPLATE_WORKSPACES[template.slug] || TEMPLATE_WORKSPACES['notion-second-brain'];

  const copyManifest = () => {
    const manifest = {
      template: data.name,
      slug: data.slug,
      version: '3.0.4',
      framework: 'Norra Architectural Studio OS',
      databases: data.databases || [],
      license: 'Commercial Single-User License',
      duplicationStatus: 'Ready for Notion Workspace Duplication'
    };
    navigator.clipboard.writeText(JSON.stringify(manifest, null, 2));
    setCopied(true);
    toast({
      title: 'Blueprint Manifest Copied',
      description: 'Workspace structural data copied to your clipboard.'
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-sports-text flex items-center justify-center font-mono font-bold text-[16px] shadow-sm">
              N
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase text-blue-600 font-bold tracking-wider">
                1-Click Duplication Portal
              </div>
              <h2 className="display text-[20px] text-slate-950">{data.name}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Quick Notice */}
          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-start gap-3">
            <ShieldCheck size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-[13px] text-blue-950">
              <span className="font-bold">Verified Real Template</span>: This workspace contains fully built Notion databases with linked relations, formula properties, and custom dashboard layouts ready to replicate immediately into your workspace.
            </div>
          </div>

          {/* Duplication Steps */}
          <div>
            <h3 className="font-bold text-[15px] text-slate-900 mb-3 flex items-center gap-2">
              <Zap size={16} className="text-amber-500" /> 3 Steps to Duplicate into your Notion:
            </h3>

            <div className="grid sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-sports-text text-[11px] font-mono font-bold flex items-center justify-center mb-2">
                  1
                </div>
                <div className="font-bold text-[13.5px] text-slate-900">Sign in to Notion</div>
                <div className="text-[12px] text-slate-500 mt-1">Open Notion in your browser or desktop application.</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-sports-text text-[11px] font-mono font-bold flex items-center justify-center mb-2">
                  2
                </div>
                <div className="font-bold text-[13.5px] text-slate-900">Click Duplicate</div>
                <div className="text-[12px] text-slate-500 mt-1">Click the "Duplicate" button in the top right corner of the page.</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-sports-text text-[11px] font-mono font-bold flex items-center justify-center mb-2">
                  3
                </div>
                <div className="font-bold text-[13.5px] text-slate-900">Choose Workspace</div>
                <div className="text-[12px] text-slate-500 mt-1">Select your team or personal workspace to clone all databases.</div>
              </div>
            </div>
          </div>

          {/* Included Databases Checklist */}
          <div>
            <h3 className="font-bold text-[15px] text-slate-900 mb-2 flex items-center gap-2">
              <Database size={16} className="text-blue-600" /> Included Relational Databases ({data.databases?.length || 6}):
            </h3>
            <div className="grid sm:grid-cols-2 gap-2 text-[13px]">
              {data.databases?.map((db, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 text-slate-700 font-mono text-[12px]">
                  <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                  <span className="truncate">{db}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Copy Manifest Tool */}
          <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-[12.5px] font-bold text-sports-text flex items-center gap-1.5 font-mono">
                <Terminal size={14} className="text-blue-400" /> System Duplication Manifest
              </div>
              <div className="text-[11.5px] text-slate-400 font-mono mt-0.5">
                Export architecture metadata and formula schemas
              </div>
            </div>
            <button
              onClick={copyManifest}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-[12px] font-mono inline-flex items-center gap-1.5 transition"
            >
              {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              {copied ? 'Copied' : 'Copy Manifest JSON'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[12.5px] text-slate-500 font-mono">
            Direct duplication link generated for <b className="text-slate-900">{data.name}</b>
          </div>
          <div className="flex gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="norra-btn-light px-4 py-2.5 text-[13.5px] rounded-xl flex-1 sm:flex-initial"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                if (onCheckout) onCheckout();
              }}
              className="norra-btn-accent px-5 py-2.5 text-[13.5px] font-bold rounded-xl flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5"
            >
              <Zap size={14} /> Get Duplication License — ${data.price}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
