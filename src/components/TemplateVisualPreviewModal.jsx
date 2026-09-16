import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  Maximize2,
  Minimize2,
  ExternalLink,
  Zap,
  CheckCircle2,
  Star,
  Layers,
  Database,
  Table,
  LayoutGrid,
  Sparkles,
  ShieldCheck,
  Lock,
  ArrowRight,
  Smartphone,
  Monitor,
  Tablet,
  FileText,
  Calendar,
  Check,
  Copy,
  ChevronRight,
  Info,
  Sliders
} from 'lucide-react';
import { TEMPLATE_WORKSPACES } from '../constants/templateWorkspaces';
import { useCart } from '../context/CartContext';
import { toast } from '../hooks/use-toast';

export default function TemplateVisualPreviewModal({
  open,
  onClose,
  template,
  onDuplicateClick,
}) {
  const navigate = useNavigate();
  const { add } = useCart();

  const [activeTab, setActiveTab] = useState('database'); // 'database', 'gallery', 'architecture', 'formulas'
  const [activeViewIdx, setActiveViewIdx] = useState(0);
  const [deviceMode, setDeviceMode] = useState('desktop'); // 'desktop', 'tablet', 'mobile'
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  const slug = template?.slug || 'notion-second-brain';
  const workspace = TEMPLATE_WORKSPACES[slug] || template || TEMPLATE_WORKSPACES['notion-second-brain'];

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open || !workspace) return null;

  const currentView = workspace.views ? workspace.views[activeViewIdx] : null;
  const galleryImages = workspace.gallery && workspace.gallery.length > 0
    ? workspace.gallery
    : [workspace.image];

  const handleAddToCart = () => {
    add(workspace);
    toast({
      title: 'Added to Cart!',
      description: `${workspace.name} is ready in your cart for instant checkout.`
    });
  };

  const handleInstantBuy = () => {
    add(workspace);
    onClose();
    navigate('/cart');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + `/templates/${workspace.slug}`);
    setCopiedKey('link');
    toast({
      title: 'Link Copied',
      description: 'Template preview link copied to clipboard.'
    });
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full bg-[#080B14] text-slate-100 rounded-3xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isFullscreen ? 'h-full max-w-full rounded-none' : 'max-w-6xl max-h-[92vh] h-[90vh]'
        }`}
      >
        {/* Top Control Navigation Bar */}
        <div className="bg-[#0D121F] px-4 sm:px-6 py-3 border-b border-slate-800/80 flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold font-mono text-[13px] flex-shrink-0">
              N
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[14px] sm:text-[15px] text-sports-text truncate">
                  {workspace.name}
                </h3>
                <span className="hidden sm:inline-flex text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {workspace.badge || 'Notion 3.0'}
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-2 py-0.5 rounded-full font-mono">
                  <ShieldCheck size={11} /> Verified Architecture
                </span>
              </div>
              <p className="text-[11.5px] text-slate-400 truncate hidden sm:block">
                Visual Content & Database Structure Preview
              </p>
            </div>
          </div>

          {/* Center Mode / Device Toggles */}
          <div className="hidden lg:flex items-center bg-slate-900/90 rounded-xl p-1 border border-slate-800 text-[12px]">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`px-3 py-1 rounded-lg font-mono text-[11.5px] flex items-center gap-1.5 transition ${
                deviceMode === 'desktop' ? 'bg-blue-600 text-sports-text shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor size={13} /> Desktop
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`px-3 py-1 rounded-lg font-mono text-[11.5px] flex items-center gap-1.5 transition ${
                deviceMode === 'tablet' ? 'bg-blue-600 text-sports-text shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Tablet size={13} /> Tablet
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`px-3 py-1 rounded-lg font-mono text-[11.5px] flex items-center gap-1.5 transition ${
                deviceMode === 'mobile' ? 'bg-blue-600 text-sports-text shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone size={13} /> Mobile
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-400 text-[11.5px] font-mono border border-blue-500/20 hidden sm:inline-flex items-center gap-1.5">
              <ShieldCheck size={13} /> Verified Studio OS
            </span>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl text-slate-400 hover:text-sports-text hover:bg-slate-800 transition hidden sm:flex items-center justify-center"
              title={isFullscreen ? 'Exit full screen' : 'Full screen'}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl text-slate-400 hover:text-sports-text hover:bg-slate-800 transition hidden sm:flex items-center justify-center"
              title="Share template"
            >
              {copiedKey === 'link' ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-sports-text hover:bg-slate-800 transition flex items-center justify-center"
              title="Close preview (ESC)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Subheader Navigation: Feature Tabs */}
        <div className="bg-[#090D18] px-4 sm:px-6 py-2.5 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('database')}
              className={`px-3 py-1.5 rounded-xl text-[12px] sm:text-[13px] font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'database'
                  ? 'bg-blue-600 text-sports-text shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
              }`}
            >
              <Database size={14} /> Live Databases & Views
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-3 py-1.5 rounded-xl text-[12px] sm:text-[13px] font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'gallery'
                  ? 'bg-blue-600 text-sports-text shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
              }`}
            >
              <LayoutGrid size={14} /> Visual Screenshot Mockups ({galleryImages.length})
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-1.5 rounded-xl text-[12px] sm:text-[13px] font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'architecture'
                  ? 'bg-blue-600 text-sports-text shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
              }`}
            >
              <Layers size={14} /> System Architecture
            </button>
            <button
              onClick={() => setActiveTab('formulas')}
              className={`px-3 py-1.5 rounded-xl text-[12px] sm:text-[13px] font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'formulas'
                  ? 'bg-blue-600 text-sports-text shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
              }`}
            >
              <Sparkles size={14} /> Formulas & Relations
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[12px] text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive Live Simulation</span>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto bg-[#070A12] p-4 sm:p-6 flex flex-col items-center">
          <div
            className={`w-full transition-all duration-300 ${
              deviceMode === 'mobile'
                ? 'max-w-sm rounded-3xl border-4 border-slate-700 bg-[#0B0F19] p-3 shadow-2xl'
                : deviceMode === 'tablet'
                ? 'max-w-3xl rounded-2xl border-2 border-slate-700 bg-[#0B0F19] p-4 shadow-2xl'
                : 'max-w-full'
            }`}
          >
            {/* TAB 1: LIVE INTERACTIVE DATABASES & VIEWS */}
            {activeTab === 'database' && (
              <div className="space-y-6">
                {/* Notion Workspace Banner Header */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-3xl shadow-lg flex-shrink-0">
                        {workspace.structure?.[0]?.icon || '🏛️'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-blue-400 font-bold uppercase tracking-wider">
                          <span>Workspace</span>
                          <span>/</span>
                          <span>{workspace.category}</span>
                          <span>/</span>
                          <span>{workspace.badge}</span>
                        </div>
                        <h2 className="text-[24px] sm:text-[28px] font-bold text-sports-text mt-1">
                          {workspace.name}
                        </h2>
                        <p className="text-[13.5px] text-slate-300 max-w-2xl mt-1 leading-relaxed">
                          {workspace.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end gap-2 w-full sm:w-auto">
                      <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-300">
                        <span className="text-blue-400 font-bold">{workspace.structure?.length || 4}</span> Master Hubs ·{' '}
                        <span className="text-emerald-400 font-bold">{workspace.views?.length || 3}</span> Dynamic Views
                      </div>
                    </div>
                  </div>
                </div>

                {/* Database View Switcher Tabs */}
                {workspace.views && workspace.views.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                        <span className="text-[12px] font-mono text-slate-500 mr-1 flex items-center gap-1">
                          <Table size={13} /> Views:
                        </span>
                        {workspace.views.map((v, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setActiveViewIdx(idx);
                              setSelectedRecord(null);
                            }}
                            className={`px-3.5 py-1.5 rounded-xl text-[12.5px] font-mono font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
                              activeViewIdx === idx
                                ? 'bg-blue-600 text-sports-text shadow-md'
                                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                            }`}
                          >
                            {v.type === 'Board' ? <LayoutGrid size={13} /> : <Table size={13} />}
                            <span>{v.label}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30 opacity-80">
                              {v.records?.length || 0}
                            </span>
                          </button>
                        ))}
                      </div>

                      <div className="text-[11px] font-mono text-slate-400">
                        Type: <b className="text-slate-200">{currentView?.type || 'Table'}</b>
                      </div>
                    </div>

                    {/* View Renderer */}
                    {currentView?.type === 'Board' ? (
                      /* KANBAN BOARD VIEW */
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {(currentView.columns || ['To Do', 'In Progress', 'Review', 'Completed']).map((col, cidx) => {
                          const colRecords = (currentView.records || []).filter(
                            (r) => r.status?.toLowerCase() === col.toLowerCase() || (!r.status && cidx === 0)
                          );
                          return (
                            <div key={cidx} className="bg-[#0B0F19] rounded-2xl border border-slate-800/80 p-3.5 flex flex-col">
                              <div className="flex items-center justify-between mb-3 px-1">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`w-2 h-2 rounded-full ${
                                      col.toLowerCase().includes('progress')
                                        ? 'bg-blue-400'
                                        : col.toLowerCase().includes('review')
                                        ? 'bg-amber-400'
                                        : col.toLowerCase().includes('complete') || col.toLowerCase().includes('active')
                                        ? 'bg-emerald-400'
                                        : 'bg-slate-400'
                                    }`}
                                  />
                                  <span className="font-bold text-[13px] text-slate-200">{col}</span>
                                </div>
                                <span className="text-[11px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
                                  {colRecords.length}
                                </span>
                              </div>

                              <div className="space-y-2.5 flex-1">
                                {colRecords.map((r, ridx) => (
                                  <div
                                    key={ridx}
                                    onClick={() => setSelectedRecord(r)}
                                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 cursor-pointer transition shadow-xs group"
                                  >
                                    <div className="font-semibold text-[13px] text-sports-text group-hover:text-blue-400 transition">
                                      {r.title || r.account || r.goal || r.client || r.company || r.item || 'Record Item'}
                                    </div>

                                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[10.5px] font-mono">
                                      {r.area && (
                                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                                          {r.area}
                                        </span>
                                      )}
                                      {r.priority && (
                                        <span
                                          className={`px-2 py-0.5 rounded ${
                                            r.priority === 'Critical' || r.priority === 'High'
                                              ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                                              : 'bg-slate-800 text-slate-300'
                                          }`}
                                        >
                                          {r.priority}
                                        </span>
                                      )}
                                      {r.deadline && (
                                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 flex items-center gap-1">
                                          <Calendar size={10} /> {r.deadline}
                                        </span>
                                      )}
                                    </div>

                                    {typeof r.progress === 'number' && (
                                      <div className="mt-3">
                                        <div className="flex items-center justify-between text-[10.5px] font-mono text-slate-400 mb-1">
                                          <span>Progress</span>
                                          <span className="font-bold text-slate-200">{r.progress}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                          <div
                                            className="h-full bg-blue-500 rounded-full transition-all"
                                            style={{ width: `${r.progress}%` }}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}

                                {colRecords.length === 0 && (
                                  <div className="p-4 rounded-xl border border-dashed border-slate-800 text-center text-[11px] font-mono text-slate-600">
                                    No records in this state
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      /* TABLE / GRID VIEW */
                      <div className="rounded-2xl border border-slate-800 bg-[#0B0F19] overflow-x-auto shadow-sm">
                        <table className="w-full text-left text-[12.5px] font-mono">
                          <thead className="bg-[#070A10] text-slate-400 text-[11px] uppercase border-b border-slate-800">
                            <tr>
                              <th className="py-3 px-4 font-semibold">Title / Record</th>
                              <th className="py-3 px-4 font-semibold">Properties & Relations</th>
                              <th className="py-3 px-4 font-semibold">Formula / Metrics</th>
                              <th className="py-3 px-4 font-semibold">Status / State</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60">
                            {(currentView?.records || []).map((r, ridx) => (
                              <tr
                                key={ridx}
                                onClick={() => setSelectedRecord(r)}
                                className="hover:bg-slate-900/80 cursor-pointer transition group"
                              >
                                <td className="py-3.5 px-4 font-semibold text-sports-text group-hover:text-blue-400 transition">
                                  <div className="flex items-center gap-2">
                                    {typeof r.done === 'boolean' && (
                                      <span
                                        className={`w-4 h-4 rounded flex items-center justify-center text-[10px] border ${
                                          r.done
                                            ? 'bg-blue-600 border-blue-500 text-sports-text'
                                            : 'border-slate-600 bg-slate-800 text-transparent'
                                        }`}
                                      >
                                        ✓
                                      </span>
                                    )}
                                    <span>{r.title || r.account || r.goal || r.client || r.company || r.item || 'Record'}</span>
                                  </div>
                                </td>
                                <td className="py-3.5 px-4 text-slate-300">
                                  <div className="flex flex-wrap gap-1.5">
                                    {r.project && (
                                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[11px]">
                                        {r.project}
                                      </span>
                                    )}
                                    {r.area && (
                                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                                        {r.area}
                                      </span>
                                    )}
                                    {r.context && (
                                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px]">
                                        {r.context}
                                      </span>
                                    )}
                                    {r.type && (
                                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                                        {r.type}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3.5 px-4 text-slate-400">
                                  {r.estimate && <span>Est: {r.estimate}</span>}
                                  {r.balance && <span className="text-emerald-400 font-bold">{r.balance}</span>}
                                  {r.value && <span className="text-emerald-400 font-bold">{r.value}</span>}
                                  {r.target && <span>Target: {r.target}</span>}
                                  {r.score && <span className="text-amber-400 font-bold">Score: {r.score}</span>}
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-[11px] border border-slate-700">
                                    {r.status || (r.done ? 'Done' : 'Active')}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Selected Record Property Inspector Popover (if clicked) */}
                {selectedRecord && (
                  <div className="p-5 rounded-2xl bg-[#0F172A] border border-blue-500/40 shadow-xl space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400 font-mono text-[11px] uppercase font-bold">
                          Notion Record Inspector
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedRecord(null)}
                        className="text-slate-400 hover:text-sports-text text-[12px] font-mono"
                      >
                        Close [✕]
                      </button>
                    </div>

                    <h4 className="font-bold text-[16px] text-sports-text">
                      {selectedRecord.title || selectedRecord.account || selectedRecord.goal || selectedRecord.client || 'Record Inspector'}
                    </h4>

                    <div className="grid sm:grid-cols-3 gap-3 font-mono text-[12px]">
                      {Object.entries(selectedRecord).map(([key, val]) => {
                        if (typeof val === 'object') return null;
                        return (
                          <div key={key} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                            <div className="text-[10px] text-slate-500 uppercase">{key}</div>
                            <div className="text-slate-200 font-bold mt-0.5 truncate">{String(val)}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: VISUAL SCREENSHOT MOCKUPS GALLERY */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                {/* Main Large Visual Preview */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-[16/10] sm:aspect-[16/9] shadow-2xl">
                  <img
                    src={galleryImages[activeGalleryIdx]}
                    alt={`${workspace.name} preview`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 text-[12px] font-mono text-slate-300 flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-blue-400" />
                    <span>Notion 3.0 Live Template Rendering</span>
                  </div>

                  <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 text-[12px] font-mono text-slate-300">
                    Slide {activeGalleryIdx + 1} of {galleryImages.length}
                  </div>
                </div>

                {/* Thumbnails Strip */}
                {galleryImages.length > 1 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {galleryImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveGalleryIdx(i)}
                        className={`aspect-[16/10] rounded-xl overflow-hidden border-2 transition ${
                          activeGalleryIdx === i
                            ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg'
                            : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SYSTEM ARCHITECTURE & HUBS */}
            {activeTab === 'architecture' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0F172A] to-[#0A0E1A] border border-slate-800">
                  <h3 className="font-bold text-[18px] text-sports-text">System Architecture & Relational Topology</h3>
                  <p className="text-[13.5px] text-slate-400 mt-1">
                    Every database is interlinked with bi-directional relations, formula rollups, and automatic status updates.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {(workspace.structure || []).map((mod, i) => (
                    <div
                      key={i}
                      className="p-5 rounded-2xl bg-[#0B0F19] border border-slate-800 hover:border-slate-700 transition space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[28px]">{mod.icon}</span>
                        <span className="text-[11.5px] font-mono text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                          {mod.itemsCount}
                        </span>
                      </div>
                      <h4 className="font-bold text-[16px] text-sports-text pt-1">{mod.name}</h4>
                      <p className="text-[13px] text-slate-400 leading-relaxed">{mod.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: FORMULAS 2.0 & ADVANCED LOGIC */}
            {activeTab === 'formulas' && (
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
                  <h3 className="font-bold text-[18px] text-sports-text">Notion 2.0 / 3.0 Formula & Logic Specifications</h3>
                  <p className="text-[13.5px] text-slate-400 mt-1">
                    Pre-configured formulas for visual progress bars, automated date schedules, and cross-database calculations.
                  </p>
                </div>

                <div className="space-y-3 font-mono text-[12px]">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-blue-400 font-bold mb-1.5">1. Dynamic Visual Progress Bar Formula</div>
                    <div className="text-slate-300 bg-slate-900/90 p-3 rounded-lg border border-slate-800/80 overflow-x-auto">
                      <code>let(pct, round(prop("Tasks").filter(current.prop("Done")).length() / prop("Tasks").length() * 100), if(isNaN(pct), "0%", style(slice("■■■■■■■■■■", 0, round(pct / 10)) + slice("□□□□□□□□□□", 0, 10 - round(pct / 10)) + " " + pct + "%", "blue")))</code>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-emerald-400 font-bold mb-1.5">2. Smart Due Date Priority Automation</div>
                    <div className="text-slate-300 bg-slate-900/90 p-3 rounded-lg border border-slate-800/80 overflow-x-auto">
                      <code>if(empty(prop("Due Date")), "No Date", if(dateBetween(prop("Due Date"), now(), "days") &lt; 0, "⚠️ Overdue", if(dateBetween(prop("Due Date"), now(), "days") == 0, "🔥 Due Today", if(dateBetween(prop("Due Date"), now(), "days") &lt;= 3, "⚡ Due Soon", "📅 Upcoming"))))</code>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Sticky Checkout & Duplication Footer */}
        <div className="bg-[#0D121F] px-4 sm:px-6 py-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-[24px] font-bold text-sports-text font-mono">${workspace.price}</span>
                <span className="text-slate-500 line-through text-[14px] font-mono">${workspace.originalPrice}</span>
                <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Save {Math.round((1 - workspace.price / workspace.originalPrice) * 100)}%
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                <CheckCircle2 size={12} className="text-blue-400" />
                <span>Instant 1-Click Duplication · Lifetime Free Updates</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleAddToCart}
              className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[13px] font-mono font-semibold transition border border-slate-700"
            >
              Add to Cart
            </button>

            <button
              onClick={handleInstantBuy}
              className="flex-1 sm:flex-none norra-btn-accent px-6 py-3 rounded-xl text-[14px] font-bold inline-flex items-center justify-center gap-2 shadow-lg"
            >
              <Zap size={15} /> Duplicate Workspace — ${workspace.price}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
