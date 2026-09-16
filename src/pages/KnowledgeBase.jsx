import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Link as LinkIcon, FileText, Upload, Plus, Trash2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function KnowledgeBase() {
  const [sources, setSources] = useState(() => {
    const saved = localStorage.getItem('norra_knowledge_base');
    return saved ? JSON.parse(saved) : [
      { id: '1', type: 'url', name: 'FIFA Official Rules', url: 'https://www.fifa.com/about-fifa/official-documents', status: 'ready', date: new Date().toISOString() },
      { id: '2', type: 'file', name: 'Premier League Handbook 2025.pdf', size: '4.2 MB', status: 'ready', date: new Date().toISOString() }
    ];
  });

  const [activeTab, setActiveTab] = useState('url'); // 'url' or 'file'
  const [newUrl, setNewUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    localStorage.setItem('norra_knowledge_base', JSON.stringify(sources));
  }, [sources]);

  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!newUrl) return;

    const newSource = {
      id: Date.now().toString(),
      type: 'url',
      name: newUrl.replace(/^https?:\/\//, '').split('/')[0],
      url: newUrl,
      status: 'processing',
      date: new Date().toISOString()
    };

    setSources(prev => [newSource, ...prev]);
    setNewUrl('');
    simulateProcessing(newSource.id);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newSource = {
      id: Date.now().toString(),
      type: 'file',
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      status: 'processing',
      date: new Date().toISOString()
    };

    setSources(prev => [newSource, ...prev]);
    simulateProcessing(newSource.id);
  };

  const simulateProcessing = (id) => {
    setIsProcessing(true);
    setTimeout(() => {
      setSources(prev => prev.map(s => 
        s.id === id ? { ...s, status: 'ready' } : s
      ));
      setIsProcessing(false);
    }, 3000); // Simulate 3 seconds of processing/vectorizing
  };

  const removeSource = (id) => {
    setSources(prev => prev.filter(s => s.id !== id));
  };

  return (
    <>
      <Helmet>
        <title>Norra AI Knowledge Base | Norra Scores</title>
      </Helmet>

      <div className="max-w-5xl w-full mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-sports-surface border border-sports-border rounded-xl p-6 md:p-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <BookOpen size={150} className="text-sports-primary" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-sports-primary/10 rounded-lg flex items-center justify-center border border-sports-primary/30">
                <BookOpen size={20} className="text-sports-primary" />
              </div>
              <h1 className="text-2xl font-bold text-sports-text tracking-tight">AI Knowledge Base</h1>
            </div>
            <p className="text-sm text-sports-textMuted max-w-2xl leading-relaxed">
              Train the Norra AI chatbot with your own custom domain knowledge. Upload documentation, match reports, or link directly to websites. The AI will ingest this data to provide smarter, context-aware insights in the Norra AI Daily feed and match predictions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Add New Source */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-sports-surface border border-sports-border rounded-xl p-5 shadow-lg">
              <h2 className="text-sm font-bold text-sports-text uppercase tracking-wider mb-4 flex items-center gap-2">
                <Plus size={16} className="text-sports-primary" />
                Add Knowledge
              </h2>

              <div className="flex bg-sports-bg rounded-lg p-1 border border-sports-border mb-5">
                <button
                  onClick={() => setActiveTab('url')}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-2 ${activeTab === 'url' ? 'bg-sports-surface border border-sports-border text-sports-primary shadow-sm' : 'text-sports-textMuted hover:text-sports-text'}`}
                >
                  <LinkIcon size={14} /> Website URL
                </button>
                <button
                  onClick={() => setActiveTab('file')}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-2 ${activeTab === 'file' ? 'bg-sports-surface border border-sports-border text-sports-primary shadow-sm' : 'text-sports-textMuted hover:text-sports-text'}`}
                >
                  <FileText size={14} /> Upload File
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'url' ? (
                  <motion.form 
                    key="url"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleAddUrl}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs text-sports-textMuted uppercase font-bold tracking-wider mb-1.5">Website URL</label>
                      <input 
                        type="url" 
                        required
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        placeholder="https://example.com/rules" 
                        className="w-full bg-sports-bg border border-sports-border rounded-lg px-3 py-2 text-sm text-sports-text placeholder-sports-textMuted focus:outline-none focus:border-sports-primary focus:ring-1 focus:ring-sports-primary transition-all"
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={!newUrl}
                      className="w-full bg-sports-primary hover:bg-[#e65a00] disabled:bg-sports-border disabled:text-sports-textMuted text-white text-sm font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={16} /> Add Website
                    </button>
                    <p className="text-[11px] text-sports-textMuted text-center leading-relaxed">
                      The AI will crawl the provided URL and index its text content into the vector database.
                    </p>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="file"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="relative group">
                      <input 
                        type="file" 
                        accept=".pdf,.txt,.doc,.docx,.csv" 
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      />
                      <div className="border-2 border-dashed border-sports-border group-hover:border-sports-primary bg-sports-bg rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-colors text-center">
                        <div className="w-12 h-12 bg-sports-surface rounded-full flex items-center justify-center border border-sports-border group-hover:bg-sports-primary/10 group-hover:border-sports-primary/30 transition-colors">
                          <Upload size={20} className="text-sports-textMuted group-hover:text-sports-primary transition-colors" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-sports-text group-hover:text-sports-primary transition-colors">Click or drag file to upload</p>
                          <p className="text-xs text-sports-textMuted mt-1">Supports PDF, TXT, DOCX, CSV (Max 10MB)</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Active Sources */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-bold text-sports-text uppercase tracking-wider mb-2 flex items-center gap-2">
              <BookOpen size={16} className="text-sports-primary" />
              Trained Knowledge Sources ({sources.length})
            </h2>

            {sources.length === 0 ? (
              <div className="bg-sports-surface border border-sports-border rounded-xl p-10 text-center flex flex-col items-center justify-center shadow-lg">
                <BookOpen size={40} className="text-sports-border mb-3" />
                <h3 className="text-sm font-bold text-sports-text mb-1">No Knowledge Sources</h3>
                <p className="text-xs text-sports-textMuted">Upload a file or add a URL to start training your AI chatbot.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                <AnimatePresence>
                  {sources.map((source) => (
                    <motion.div 
                      key={source.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                      className="bg-sports-surface border border-sports-border hover:border-sports-border/80 rounded-xl p-4 shadow-sm transition-all group flex items-center gap-4"
                    >
                      <div className="w-12 h-12 bg-sports-bg rounded-lg border border-sports-border flex items-center justify-center shrink-0">
                        {source.type === 'url' ? <LinkIcon size={20} className="text-sports-primary" /> : <FileText size={20} className="text-blue-500" />}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="text-sm font-bold text-sports-text truncate">{source.name}</h4>
                          {source.status === 'processing' ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-500 uppercase tracking-wider bg-yellow-500/10 px-2 py-0.5 rounded-full">
                              <RefreshCw size={10} className="animate-spin" /> Processing...
                            </span>
                          ) : source.status === 'error' ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 uppercase tracking-wider bg-red-500/10 px-2 py-0.5 rounded-full">
                              <AlertCircle size={10} /> Error
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-green-500 uppercase tracking-wider bg-green-500/10 px-2 py-0.5 rounded-full">
                              <CheckCircle2 size={10} /> Ready
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs text-sports-textMuted truncate">
                          {source.type === 'url' ? (
                            <a href={source.url} target="_blank" rel="noreferrer" className="hover:text-sports-primary transition-colors truncate">{source.url}</a>
                          ) : (
                            <span>{source.size}</span>
                          )}
                          <span className="text-sports-border">•</span>
                          <span>{new Date(source.date).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => removeSource(source.id)}
                        className="w-8 h-8 rounded-full bg-sports-bg border border-sports-border flex items-center justify-center text-sports-textMuted hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/10 transition-all shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Remove Source"
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
