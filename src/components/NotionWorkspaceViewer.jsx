import React, { useState } from 'react';
import {
  ExternalLink,
  Layers,
  Sparkles,
  CheckCircle2,
  Table,
  LayoutGrid,
  Database,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
  FolderGit2,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { TEMPLATE_WORKSPACES } from '../constants/templateWorkspaces';
import { toast } from '../hooks/use-toast';

export default function NotionWorkspaceViewer({ slug, onDuplicateClick }) {
  const data = TEMPLATE_WORKSPACES[slug] || TEMPLATE_WORKSPACES['notion-second-brain'];
  const [activeTab, setActiveTab] = useState(0);
  const [copiedId, setCopiedId] = useState(null);

  const currentView = data.views ? data.views[activeTab] : null;

  const copyDuplicateLink = () => {
    navigator.clipboard.writeText(window.location.origin + `/library`);
    setCopiedId('link');
    toast({
      title: 'Duplication Link Copied',
      description: `Instant duplicate package for "${data.name}" ready to import into your Notion.`
    });
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="w-full bg-[#0B0F19] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden text-slate-100">
      {/* Workspace Header Bar */}
      <div className="bg-[#070A10] px-5 sm:px-7 py-4 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold font-mono text-[14px]">
            N
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold text-sports-text">{data.name}</span>
              <span className="text-[10.5px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {data.badge}
              </span>
            </div>
            <div className="text-[12px] text-slate-400 font-mono">
              Live Notion 3.0 Operating System · Ready for 1-Click Duplicate
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={copyDuplicateLink}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[12.5px] font-mono flex items-center gap-1.5 transition border border-slate-700/60"
            title="Copy duplication manifest"
          >
            {copiedId === 'link' ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span>{copiedId === 'link' ? 'Link Copied' : 'Share Workspace'}</span>
          </button>

          {onDuplicateClick && (
            <button
              onClick={onDuplicateClick}
              className="norra-btn-accent px-4 py-1.5 rounded-xl text-[12.5px] font-bold inline-flex items-center gap-1.5 shadow-md"
            >
              <Zap size={13} /> Duplicate to Notion
            </button>
          )}
        </div>
      </div>

      {/* Structural Architecture Hub (PARA / Functional Modules) */}
      <div className="p-5 sm:p-7 border-b border-slate-800/80 bg-slate-950/40">
        <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-3 flex items-center gap-2">
          <Layers size={13} className="text-blue-400" /> System Architecture & Linked Modules
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {data.structure?.map((mod, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-[#0F172A]/70 border border-slate-800/80 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-[22px]">{mod.icon}</span>
                <span className="text-[11px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">
                  {mod.itemsCount}
                </span>
              </div>
              <h4 className="font-bold text-[14px] text-sports-text mt-2.5">{mod.name}</h4>
              <p className="text-[12px] text-slate-400 mt-1 leading-relaxed">{mod.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Relational Database Views */}
      <div className="p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Database size={15} className="text-blue-400" />
            <span className="font-bold text-[14px] text-sports-text">Interactive Database Explorer</span>
            <span className="text-[11px] font-mono text-slate-400">(Explore active records & views)</span>
          </div>

          {/* Database View Tabs */}
          {data.views && (
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              {data.views.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => setActiveTab(i)}
                  className={`px-3 py-1 text-[12px] rounded-lg font-mono transition ${
                    activeTab === i
                      ? 'bg-blue-600 text-sports-text font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* View Renderer */}
        {currentView && (
          <div className="bg-[#080D1A] rounded-2xl border border-slate-800/90 overflow-hidden">
            {/* View Type: Board */}
            {currentView.type === 'Board' && (
              <div className="p-4 overflow-x-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-w-[700px]">
                  {currentView.columns?.map((col) => {
                    const colRecords = currentView.records.filter(
                      (r) => r.status === col || r.stage === col
                    );
                    return (
                      <div key={col} className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/80 flex flex-col">
                        <div className="flex items-center justify-between mb-3 text-[12px] font-mono text-slate-300 font-bold px-1">
                          <span>{col}</span>
                          <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[10px]">
                            {colRecords.length}
                          </span>
                        </div>
                        <div className="space-y-2.5 flex-1">
                          {colRecords.map((r, ri) => (
                            <div
                              key={ri}
                              className="bg-[#0F172A] p-3 rounded-lg border border-slate-800 hover:border-blue-500/50 transition cursor-default shadow-xs"
                            >
                              <div className="font-semibold text-[13px] text-sports-text">{r.title || r.company}</div>
                              {r.area && (
                                <div className="text-[11px] text-slate-400 mt-1 font-mono">{r.area}</div>
                              )}
                              {r.progress !== undefined && (
                                <div className="mt-2.5">
                                  <div className="flex justify-between text-[10.5px] font-mono text-slate-400 mb-1">
                                    <span>Progress</span>
                                    <span className="text-blue-400">{r.progress}%</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-blue-500 rounded-full"
                                      style={{ width: `${r.progress}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                              {r.sponsor && (
                                <div className="mt-2 text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded inline-block">
                                  Deal: {r.sponsor}
                                </div>
                              )}
                              {r.dealSize && (
                                <div className="mt-2 flex items-center justify-between text-[11.5px] font-mono">
                                  <span className="text-emerald-400 font-bold">{r.dealSize}</span>
                                  <span className="text-slate-400">{r.contact}</span>
                                </div>
                              )}
                            </div>
                          ))}
                          {colRecords.length === 0 && (
                            <div className="py-6 text-center text-[12px] font-mono text-slate-600">
                              No items in column
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* View Type: Table */}
            {currentView.type === 'Table' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12.5px]">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/80 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      {Object.keys(currentView.records[0] || {}).map((k) => (
                        <th key={k} className="py-3 px-4 capitalize">
                          {k}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {currentView.records.map((row, ri) => (
                      <tr key={ri} className="hover:bg-slate-900/40 transition">
                        {Object.entries(row).map(([k, val], vi) => (
                          <td key={vi} className="py-3 px-4 text-slate-300">
                            {typeof val === 'boolean' ? (
                              val ? (
                                <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded">
                                  <CheckCircle2 size={12} /> Yes
                                </span>
                              ) : (
                                <span className="text-slate-500 text-[11px]">—</span>
                              )
                            ) : k.toLowerCase().includes('status') || k === 'stage' ? (
                              <span className="inline-block px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px]">
                                {String(val)}
                              </span>
                            ) : k.toLowerCase().includes('amount') || k.toLowerCase().includes('balance') || k.toLowerCase().includes('cost') ? (
                              <span className="font-bold text-sports-text">{String(val)}</span>
                            ) : (
                              String(val)
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* View Type: Cards */}
            {currentView.type === 'Cards' && (
              <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {currentView.records.map((c, ci) => (
                  <div
                    key={ci}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition"
                  >
                    <div className="font-bold text-[14px] text-sports-text">{c.title || c.account || c.goal}</div>
                    {c.tags && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {c.tags.map((t, ti) => (
                          <span
                            key={ti}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                    {c.balance && (
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-mono text-[16px] font-bold text-emerald-400">{c.balance}</span>
                        <span className="text-[11px] font-mono text-slate-400">{c.institution}</span>
                      </div>
                    )}
                    {c.progress !== undefined && (
                      <div className="mt-3">
                        <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                          <span>{c.quarter || 'Target'}</span>
                          <span className="text-blue-400 font-bold">{c.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${c.progress}%` }} />
                        </div>
                      </div>
                    )}
                    {c.separateValue && (
                      <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between items-center text-[12px] font-mono">
                        <span className="text-slate-400">Standalone: {c.separateValue}</span>
                        <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">{c.included}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Relational Database Manifest Footer */}
      <div className="p-5 sm:p-7 bg-[#070A10] border-t border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Complete Database Bundle Included</span>
          </div>
          <div className="text-[12.5px] text-slate-300 mt-1">
            Includes all formulas, database rollups, linked views, and Notion 3.0 integrations.
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[11px] font-mono text-slate-400">One-time purchase</div>
            <div className="font-mono text-sports-text font-bold text-[16px]">${data.price} USD</div>
          </div>
          {onDuplicateClick && (
            <button
              onClick={onDuplicateClick}
              className="norra-btn-accent px-5 py-2.5 rounded-xl text-[13.5px] font-bold inline-flex items-center gap-2"
            >
              Duplicate This System <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
