import React, { useState } from 'react';
import { 
  Globe, Zap, Trash2, Plus, Layers, Cpu, ShieldCheck, Mail, Send, CheckCircle2 
} from 'lucide-react';
import { api } from '../api';
import { useToast } from '../hooks/use-toast';

export default function ConfigurationPanel({ chatbot, setChatbot, id }) {
  const { toast } = useToast();
  const [newFewShotUser, setNewFewShotUser] = useState('');
  const [newFewShotBot, setNewFewShotBot] = useState('');
  
  const [testingLeadAlert, setTestingLeadAlert] = useState(false);
  const [leadAlertResult, setLeadAlertResult] = useState(null);

  const handleAddFewShot = () => {
    if (!newFewShotUser.trim() || !newFewShotBot.trim()) {
      toast({ title: 'Both question and expected response are required' });
      return;
    }
    const current = chatbot.fewShotExamples || [];
    setChatbot({
      ...chatbot,
      fewShotExamples: [...current, { id: Date.now(), user: newFewShotUser, assistant: newFewShotBot }]
    });
    setNewFewShotUser('');
    setNewFewShotBot('');
    toast({ title: 'Few-Shot Example Pair added' });
  };

  const handleRemoveFewShot = (fId) => {
    const current = chatbot.fewShotExamples || [];
    setChatbot({
      ...chatbot,
      fewShotExamples: current.filter(x => x.id !== fId)
    });
  };

  const handleTestLeadAlert = async () => {
    setTestingLeadAlert(true);
    setLeadAlertResult(null);
    try {
      const res = await api.post(`/chatbots/${id}/test-lead-alert`, {
        alertEmail: chatbot?.leadCapture?.alertEmail
      });
      setLeadAlertResult(res.data);
      toast({ title: 'Test Alert Sent!', description: res.data.message });
    } catch (e) {
      toast({ title: 'Could not send test email' });
    } finally {
      setTestingLeadAlert(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Model & Instructions */}
      <div className="norra-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-950 font-display">AI Intelligence & Model Engine</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono font-bold">
            Gemini Multimodal RAG
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1">AI Model Engine</label>
            <select
              value={chatbot.model || 'gemini-3.7-flash'}
              onChange={(e) => setChatbot({ ...chatbot, model: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition font-medium"
            >
              <option value="gemini-3.7-flash">Gemini 3.7 Flash (Default - Multimodal & Grounded)</option>
              <option value="gemini-flash-latest">Gemini Flash Latest (Fast & Reliable Response)</option>
              <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Deep Logical Reasoning & Code)</option>
              <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (High-Throughput / Low Latency)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1">
              Creativity & Temperature ({chatbot.temperature || 0.2})
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={chatbot.temperature || 0.2}
              onChange={(e) => setChatbot({ ...chatbot, temperature: parseFloat(e.target.value) })}
              className="w-full mt-2 accent-blue-600"
            />
          </div>
        </div>

        {/* Google Search Grounding Toggle */}
        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <Globe size={14} className="text-blue-600" />
              <span>Google Search Grounding (Live Web Knowledge)</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Enables real-time web retrieval via Gemini to provide verified up-to-date facts and source links.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
            <input
              type="checkbox"
              checked={chatbot.searchGrounding !== undefined ? chatbot.searchGrounding : true}
              onChange={(e) => setChatbot({ ...chatbot, searchGrounding: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-900 mb-1">
            System Instructions, Brand Tone & Personality Traits
          </label>
          <textarea
            rows={5}
            value={chatbot.instructions || ''}
            onChange={(e) => setChatbot({ ...chatbot, instructions: e.target.value })}
            placeholder="Instructions for tone, guardrails, personality traits, role definition, and strict factual bounds..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white font-mono resize-none transition"
          />
        </div>
      </div>

      {/* Few-Shot Specialized Tuning */}
      <div className="norra-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-slate-950 font-display flex items-center gap-2">
              <Zap size={16} className="text-amber-500" />
              Specialized Tuning & Few-Shot Examples
            </h3>
            <p className="text-xs text-slate-600">
              Teach your bot exact deterministic answers for specific question patterns.
            </p>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-mono font-bold">
            Specialized Tuning
          </span>
        </div>

        <div className="space-y-2">
          {(chatbot.fewShotExamples || []).map((fs) => (
            <div key={fs.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 relative group">
              <div className="flex justify-between font-semibold text-slate-900">
                <span>User: "{fs.user}"</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFewShot(fs.id)}
                  className="text-slate-400 hover:text-rose-600 transition"
                  title="Remove pair"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              <p className="text-slate-600">AI Response: "{fs.assistant}"</p>
            </div>
          ))}

          {(!chatbot.fewShotExamples || chatbot.fewShotExamples.length === 0) && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
              No few-shot pairs added yet. Add sample dialog pairs below to condition bot behavior.
            </div>
          )}
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2">
          <p className="text-xs font-semibold text-slate-900">Add Example Dialog Pair</p>
          <input
            type="text"
            value={newFewShotUser}
            onChange={(e) => setNewFewShotUser(e.target.value)}
            placeholder="User question (e.g. 'Can I get a refund after 45 days?')"
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-blue-500"
          />
          <textarea
            rows={2}
            value={newFewShotBot}
            onChange={(e) => setNewFewShotBot(e.target.value)}
            placeholder="Expected exact AI response..."
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-blue-500 resize-none"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddFewShot}
              className="norra-btn-dark px-3 py-1 text-xs font-semibold flex items-center gap-1"
            >
              <Plus size={13} /> Add Example Pair
            </button>
          </div>
        </div>
      </div>

      {/* Priority RAG Embeddings Pipeline */}
      <div className="norra-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-950 font-display flex items-center gap-2">
            <Layers size={16} className="text-blue-600" />
            Priority RAG Embeddings Pipeline
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono font-bold">
            Standard & Unlimited
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1">Chunk Size</label>
            <select
              value={chatbot.ragSettings?.chunkSize || 512}
              onChange={(e) => setChatbot({
                ...chatbot,
                ragSettings: { ...(chatbot.ragSettings || {}), chunkSize: parseInt(e.target.value) }
              })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-blue-500 font-medium"
            >
              <option value={256}>256 Tokens (Fine precision)</option>
              <option value={512}>512 Tokens (Balanced)</option>
              <option value={1024}>1024 Tokens (Broad context)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1">Top-K Retrieved</label>
            <select
              value={chatbot.ragSettings?.topK || 3}
              onChange={(e) => setChatbot({
                ...chatbot,
                ragSettings: { ...(chatbot.ragSettings || {}), topK: parseInt(e.target.value) }
              })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-blue-500 font-medium"
            >
              <option value={3}>Top 3 Chunks (Standard)</option>
              <option value={5}>Top 5 Chunks (High Recall)</option>
              <option value={8}>Top 8 Chunks (Exhaustive)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1">Vector Similarity Match</label>
            <input
              type="range"
              min="0.60"
              max="0.95"
              step="0.05"
              value={chatbot.ragSettings?.similarityThreshold || 0.75}
              onChange={(e) => setChatbot({
                ...chatbot,
                ragSettings: { ...(chatbot.ragSettings || {}), similarityThreshold: parseFloat(e.target.value) }
              })}
              className="w-full mt-2 accent-blue-600"
            />
            <div className="text-[10px] text-right font-mono text-slate-500">
              Threshold: {chatbot.ragSettings?.similarityThreshold || 0.75}
            </div>
          </div>
        </div>

        {/* Dedicated AI Vector Compute Cluster toggle */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <Cpu size={14} className="text-emerald-600" />
              <span>Dedicated AI Vector Compute Cluster</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-800 font-mono font-bold">ACTIVE</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Dedicated tenant isolation with 0ms query queue wait time and priority GPU memory indexing.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
            <input
              type="checkbox"
              checked={chatbot.ragSettings?.dedicatedCompute !== undefined ? chatbot.ragSettings.dedicatedCompute : true}
              onChange={(e) => setChatbot({
                ...chatbot,
                ragSettings: { ...(chatbot.ragSettings || {}), dedicatedCompute: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>
      </div>

      {/* Interface Appearance & Custom Themes */}
      <div className="norra-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-950 font-display">Widget Appearance & Custom Hex Themes</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono font-bold">
            Hobby, Standard & Unlimited
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <ShieldCheck size={14} className="text-amber-600" />
              <span>Remove "Powered by Norra AI" Watermark</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 font-mono font-bold">Hobby+</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Omit all Norra branding badges and present a 100% white-label assistant to your website visitors.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
            <input
              type="checkbox"
              checked={Boolean(chatbot.theme?.removeWatermark)}
              onChange={(e) => setChatbot({
                ...chatbot,
                theme: { ...chatbot.theme, removeWatermark: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1">Display Name</label>
            <input
              type="text"
              value={chatbot.theme?.displayName || chatbot.name}
              onChange={(e) => setChatbot({
                ...chatbot,
                theme: { ...chatbot.theme, displayName: e.target.value }
              })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1">Theme Mode</label>
            <select
              value={chatbot.theme?.mode || 'light'}
              onChange={(e) => setChatbot({
                ...chatbot,
                theme: { ...chatbot.theme, mode: e.target.value }
              })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition font-medium"
            >
              <option value="light">Light Theme (Clean Crisp White)</option>
              <option value="dark">Dark Theme (Obsidian Modern)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-900">User Bubble Hex Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={chatbot.theme?.userBubbleColor || chatbot.theme?.primaryColor || '#2563EB'}
                onChange={(e) => setChatbot({
                  ...chatbot,
                  theme: { ...chatbot.theme, userBubbleColor: e.target.value, primaryColor: e.target.value }
                })}
                className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200"
              />
              <input
                type="text"
                value={chatbot.theme?.userBubbleColor || chatbot.theme?.primaryColor || '#2563EB'}
                onChange={(e) => setChatbot({
                  ...chatbot,
                  theme: { ...chatbot.theme, userBubbleColor: e.target.value, primaryColor: e.target.value }
                })}
                className="flex-1 px-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-900">Bot Bubble Background Hex</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={chatbot.theme?.botBubbleColor || (chatbot.theme?.mode === 'dark' ? '#1e293b' : '#f1f5f9')}
                onChange={(e) => setChatbot({
                  ...chatbot,
                  theme: { ...chatbot.theme, botBubbleColor: e.target.value }
                })}
                className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200"
              />
              <input
                type="text"
                value={chatbot.theme?.botBubbleColor || (chatbot.theme?.mode === 'dark' ? '#1e293b' : '#f1f5f9')}
                onChange={(e) => setChatbot({
                  ...chatbot,
                  theme: { ...chatbot.theme, botBubbleColor: e.target.value }
                })}
                className="flex-1 px-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-900 mb-1">Initial Greeting Message</label>
          <textarea
            rows={2}
            value={chatbot.initialMessage || ''}
            onChange={(e) => setChatbot({ ...chatbot, initialMessage: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-blue-500 focus:bg-white resize-none transition"
          />
        </div>
      </div>

      {/* Lead Capture Settings & Email Alerts */}
      <div className="norra-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-slate-950 font-display flex items-center gap-2">
              <Mail size={16} className="text-blue-600" />
              Lead Capture & Email Alerts Destination
            </h3>
            <p className="text-xs text-slate-600">
              Collect visitor contact info and route instant notification alerts to your inbox.
            </p>
          </div>
          <input
            type="checkbox"
            checked={chatbot.leadCapture?.enabled ?? true}
            onChange={(e) => setChatbot({
              ...chatbot,
              leadCapture: { ...chatbot.leadCapture, enabled: e.target.checked }
            })}
            className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
          />
        </div>

        {chatbot.leadCapture?.enabled && (
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1">Form Banner Title</label>
                <input
                  type="text"
                  value={chatbot.leadCapture?.title || ''}
                  onChange={(e) => setChatbot({
                    ...chatbot,
                    leadCapture: { ...chatbot.leadCapture, title: e.target.value }
                  })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1">Trigger Condition</label>
                <select
                  value={chatbot.leadCapture?.trigger || 'after_3_messages'}
                  onChange={(e) => setChatbot({
                    ...chatbot,
                    leadCapture: { ...chatbot.leadCapture, trigger: e.target.value }
                  })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition"
                >
                  <option value="before_chat">Before Chat (Require contact info to start)</option>
                  <option value="after_3_messages">After 2-3 Messages (High Conversion)</option>
                </select>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-semibold text-slate-900">
                Lead Notification Email Destination
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={chatbot?.leadCapture?.alertEmail || ''}
                  onChange={(e) => setChatbot({
                    ...chatbot,
                    leadCapture: { ...chatbot.leadCapture, alertEmail: e.target.value }
                  })}
                  placeholder="e.g. sales@company.com, founders@startup.io"
                  className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleTestLeadAlert}
                  disabled={testingLeadAlert}
                  className="norra-btn-dark px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap flex items-center gap-1.5"
                >
                  <Send size={13} />
                  {testingLeadAlert ? 'Sending...' : 'Send Test Alert'}
                </button>
              </div>

              {leadAlertResult && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-mono">
                  <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                  <span>{leadAlertResult.message}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
