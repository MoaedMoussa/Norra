import React, { useState } from 'react';
import { CheckCircle2, Circle, LayoutGrid, Table, Calendar, Sparkles, TrendingUp, FolderGit2, CheckSquare, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const DEMO_VIEWS = {
  secondBrain: {
    name: "PARA Second Brain OS",
    badge: "Productivity Engine",
    slug: "notion-second-brain",
    tabs: ["Projects (3 Active)", "Knowledge Vault", "Weekly Review"],
    tasks: [
      { id: 1, text: "Finalize Q3 Architectural Studio Redesign", tag: "Projects", priority: "High", done: true },
      { id: 2, text: "Review 12 Notion client databases & relations", tag: "Areas", priority: "Medium", done: false },
      { id: 3, text: "Read Deep Work & capture PARA highlight tags", tag: "Resources", priority: "Low", done: false },
      { id: 4, text: "Weekly system review & habit audit", tag: "Review", priority: "High", done: true },
    ],
    stats: [
      { label: "Active Projects", val: "8" },
      { label: "Vault Notes", val: "142" },
      { label: "Habit Score", val: "94%" },
    ]
  },
  finance: {
    name: "Finance & Wealth OS",
    badge: "Financial Engine",
    slug: "notion-finance-tracker",
    tabs: ["Cashflow 2026", "Net Worth Ledger", "Subscription Audits"],
    tasks: [
      { id: 1, text: "Automate $1,200 ETF index deposit", tag: "Savings", priority: "Done", done: true },
      { id: 2, text: "Audit recurring SaaS memberships ($240 saved)", tag: "Audit", priority: "High", done: true },
      { id: 3, text: "Quarterly tax estimate & write-offs", tag: "Tax", priority: "Medium", done: false },
    ],
    stats: [
      { label: "Monthly Savings", val: "$3,450" },
      { label: "Runway", val: "14 Mos" },
      { label: "Net Growth", val: "+18.4%" },
    ]
  },
  planner: {
    name: "Life Planner Studio",
    badge: "Intentional Living",
    slug: "notion-life-planner",
    tabs: ["Daily Rituals", "Quarterly OKRs", "Life Wheel"],
    tasks: [
      { id: 1, text: "Morning sunlight hydration & breathwork routine", tag: "Habits", priority: "Done", done: true },
      { id: 2, text: "Complete 60-min deep work block (No Distractions)", tag: "Focus", priority: "High", done: true },
      { id: 3, text: "Weekly reflection & gratitude journal entry", tag: "Reflection", priority: "Medium", done: false },
    ],
    stats: [
      { label: "Daily Streak", val: "28 Days" },
      { label: "Goals on Track", val: "5 / 6" },
      { label: "Mindful Index", val: "92%" },
    ]
  },
  creator: {
    name: "Creator Pipeline Matrix",
    badge: "Creator OS",
    slug: "notion-creator-system",
    tabs: ["Content Pipeline", "Brand Deals ($18k)", "Sponsor CRM"],
    tasks: [
      { id: 1, text: "Record 4K Studio Tour & Notion Workflow Walkthrough", tag: "YouTube", priority: "In Prod", done: true },
      { id: 2, text: "Deliver sponsor integration draft to Keychron", tag: "Sponsorship", priority: "Review", done: false },
      { id: 3, text: "Schedule 10 newsletter breakdowns on Notion 3.0", tag: "Substack", priority: "Queued", done: false },
    ],
    stats: [
      { label: "Pipeline Value", val: "$18.5k" },
      { label: "Content Queue", val: "12 Items" },
      { label: "Avg View ROI", val: "4.8x" },
    ]
  },
  freelance: {
    name: "Freelance Studio OS",
    badge: "Client Operations",
    slug: "notion-freelance-system",
    tabs: ["Client CRM", "Active Sprints", "Invoice Ledger"],
    tasks: [
      { id: 1, text: "Deliver Design System token update to Apex Design", tag: "Deliverables", priority: "High", done: true },
      { id: 2, text: "Send Invoice #INV-085 to Kona Coffee Roasters", tag: "Invoicing", priority: "Due", done: false },
      { id: 3, text: "Scope proposal for Voxel AI Labs redesign", tag: "Sales", priority: "Medium", done: false },
    ],
    stats: [
      { label: "Active Clients", val: "12" },
      { label: "Pipeline Billed", val: "$14.2k" },
      { label: "Sprint On-Time", val: "100%" },
    ]
  },
  business: {
    name: "Small Business OS",
    badge: "Enterprise OS",
    slug: "notion-business-system",
    tabs: ["Company SOPs", "Sales Deals ($68k)", "Team Directory"],
    tasks: [
      { id: 1, text: "Review Support Escalation SOP v2.4", tag: "Wiki", priority: "High", done: true },
      { id: 2, text: "Follow up on Nordic Cloud Enterprise deal proposal", tag: "Sales", priority: "In Review", done: false },
      { id: 3, text: "Execute quarterly OKR retrospective review", tag: "OKRs", priority: "Medium", done: false },
    ],
    stats: [
      { label: "Deal Pipeline", val: "$68.0k" },
      { label: "SOP Modules", val: "24 Docs" },
      { label: "Team Members", val: "12" },
    ]
  }
};

export default function InteractiveWorkspacePreview() {
  const [activeSystemKey, setActiveSystemKey] = useState('secondBrain');
  const system = DEMO_VIEWS[activeSystemKey];
  const [tasks, setTasks] = useState(system.tasks);
  const [activeTab, setActiveTab] = useState(0);

  const handleSystemChange = (key) => {
    setActiveSystemKey(key);
    setTasks(DEMO_VIEWS[key].tasks);
    setActiveTab(0);
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="w-full bg-[#0F172A] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden text-slate-200">
      {/* Top Window Bar */}
      <div className="bg-[#0B0F17] px-4 py-3 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[12px] text-slate-400 font-mono ml-2 hidden sm:inline-block">norra.workspace // {system.name}</span>
        </div>

        {/* System Switcher */}
        <div className="flex items-center flex-wrap bg-slate-900/90 rounded-lg p-0.5 border border-slate-800 text-[11.5px]">
          <button
            onClick={() => handleSystemChange('secondBrain')}
            className={`px-2.5 py-1 rounded-md font-medium transition ${activeSystemKey === 'secondBrain' ? 'bg-blue-600 text-sports-text shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Second Brain
          </button>
          <button
            onClick={() => handleSystemChange('finance')}
            className={`px-2.5 py-1 rounded-md font-medium transition ${activeSystemKey === 'finance' ? 'bg-blue-600 text-sports-text shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Finance
          </button>
          <button
            onClick={() => handleSystemChange('planner')}
            className={`px-2.5 py-1 rounded-md font-medium transition ${activeSystemKey === 'planner' ? 'bg-blue-600 text-sports-text shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Planner
          </button>
          <button
            onClick={() => handleSystemChange('creator')}
            className={`px-2.5 py-1 rounded-md font-medium transition ${activeSystemKey === 'creator' ? 'bg-blue-600 text-sports-text shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Creator
          </button>
          <button
            onClick={() => handleSystemChange('freelance')}
            className={`px-2.5 py-1 rounded-md font-medium transition ${activeSystemKey === 'freelance' ? 'bg-blue-600 text-sports-text shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Freelance
          </button>
          <button
            onClick={() => handleSystemChange('business')}
            className={`px-2.5 py-1 rounded-md font-medium transition ${activeSystemKey === 'business' ? 'bg-blue-600 text-sports-text shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Business
          </button>
        </div>

        <div className="hidden md:flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-2.5 py-0.5 rounded-full font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
          Interactive Demo
        </div>
      </div>

      {/* Notion Workspace Simulation Body */}
      <div className="p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] font-mono rounded">
                {system.badge}
              </span>
              <span className="text-[12px] text-slate-400">Click tasks below to test interaction</span>
            </div>
            <h3 className="display text-[26px] sm:text-[32px] text-sports-text mt-1.5">{system.name}</h3>
          </div>

          <div className="flex items-center gap-4">
            {system.stats.map((s, idx) => (
              <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-right">
                <div className="text-[10.5px] uppercase tracking-wider text-slate-400 font-mono">{s.label}</div>
                <div className="text-[17px] font-bold text-sports-text font-mono">{s.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-2 mt-6 border-b border-slate-800/60 pb-3">
          <div className="flex items-center gap-1 text-slate-400 text-[12px] font-mono mr-3">
            <LayoutGrid size={14} /> Views:
          </div>
          {system.tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-3 py-1 rounded-md text-[13px] font-medium transition flex items-center gap-1.5 ${activeTab === idx ? 'bg-slate-800 text-sports-text' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {idx === 0 ? <Table size={13} /> : idx === 1 ? <Calendar size={13} /> : <Sparkles size={13} />}
              {tab}
            </button>
          ))}
        </div>

        {/* Interactive Task / Entry Table */}
        <div className="mt-5 space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer ${task.done ? 'bg-slate-900/40 border-slate-800/50 opacity-70' : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850'}`}
            >
              <div className="flex items-center gap-3">
                <button type="button" className="text-slate-400 hover:text-blue-400 transition">
                  {task.done ? <CheckCircle2 size={18} className="text-emerald-400" /> : <Circle size={18} />}
                </button>
                <span className={`text-[14px] ${task.done ? 'line-through text-slate-400' : 'text-slate-100 font-medium'}`}>
                  {task.text}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  {task.tag}
                </span>
                <span className={`text-[11px] px-2 py-0.5 rounded font-mono ${task.priority === 'High' ? 'bg-rose-500/20 text-rose-300' : task.priority === 'Done' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'}`}>
                  {task.priority}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA bar */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="text-[13px] text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Includes pre-configured relations, database rollups & dark/light views.
          </div>
          <Link
            to={`/templates/${system.slug}`}
            className="norra-btn-accent px-5 py-2.5 text-[13.5px] inline-flex items-center gap-2 rounded-lg"
          >
            Inspect {system.name} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
