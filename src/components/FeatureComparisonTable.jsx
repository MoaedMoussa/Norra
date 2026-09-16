import React from 'react';
import { Check, X } from 'lucide-react';

export default function FeatureComparisonTable() {
  const features = [
    {
      name: 'Starter Tier Monthly Allowance',
      norra: { text: '2,000 messages', badge: '$12/mo' },
      legacy: { text: '1,000 messages', badge: '$19 - $25/mo', badgeType: 'warning' },
      customGpt: { text: 'Depends on OpenAI API', badge: 'Varies', badgeType: 'neutral' },
    },
    {
      name: 'Multi-Model Engine',
      norra: { text: 'Gemini, GPT-4o, Claude', check: true },
      legacy: { text: 'Usually single model', cross: true },
      customGpt: { text: 'OpenAI only', cross: true },
    },
    {
      name: 'White-Label Unbranded Chat',
      norra: { text: 'Included on Hobby plan', check: true, badge: 'From $12/mo' },
      legacy: { text: 'Locked behind Pro plans', cross: true, badge: '$99+/mo', badgeType: 'warning' },
      customGpt: { text: 'Varies by wrapper', cross: true },
    },
    {
      name: 'Native Lead Generation Forms',
      norra: { text: 'Custom fields + CSV export', check: true },
      legacy: { text: 'Basic or via Zapier', cross: true },
      customGpt: { text: 'Often missing', cross: true },
    },
    {
      name: 'Cloud Firestore Real-time Sync',
      norra: { text: 'Native Integration', check: true },
      legacy: { text: 'No native sync', cross: true },
      customGpt: { text: 'No native sync', cross: true },
    },
    {
      name: 'Dynamic Few-Shot Learning',
      norra: { text: 'Dedicated tuning UI', check: true },
      legacy: { text: 'Prompt hacking required', cross: true },
      customGpt: { text: 'Via system prompts only', cross: true },
    },
    {
      name: 'Average Initial Response Latency',
      norra: { text: '< 500ms TTFB', check: true },
      legacy: { text: '1,200ms - 2,000ms', cross: true },
      customGpt: { text: '1,000ms+', cross: true },
    }
  ];

  return (
    <div className="norra-card p-6 sm:p-8 space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl font-bold text-slate-950 font-display">
          Why Teams Choose Norra AI in 2026
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          A high-level overview of core platform capabilities and pricing advantages compared to standard wrappers and legacy builders.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-mono">
              <th className="py-4 px-4 font-semibold w-1/3">Capability</th>
              <th className="py-4 px-4 font-bold text-blue-600 w-1/4">Norra AI</th>
              <th className="py-4 px-4 font-semibold text-slate-600 w-1/4">Typical Legacy Builders</th>
              <th className="py-4 px-4 font-semibold text-slate-600 w-1/4">Custom GPT Wrappers</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {features.map((feature, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition">
                <td className="py-4 px-4 font-semibold text-slate-950">{feature.name}</td>
                
                {/* Norra Column */}
                <td className="py-4 px-4">
                  <div className="flex flex-col items-start gap-1.5">
                    <div className="flex items-center gap-2">
                      {feature.norra.check && <Check size={16} className="text-emerald-500 flex-shrink-0" />}
                      {feature.norra.cross && <X size={16} className="text-rose-500 flex-shrink-0" />}
                      <span className="font-semibold text-slate-900">{feature.norra.text}</span>
                    </div>
                    {feature.norra.badge && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {feature.norra.badge}
                      </span>
                    )}
                  </div>
                </td>

                {/* Legacy Column */}
                <td className="py-4 px-4">
                  <div className="flex flex-col items-start gap-1.5 opacity-80">
                    <div className="flex items-center gap-2">
                      {feature.legacy.check && <Check size={16} className="text-emerald-500 flex-shrink-0" />}
                      {feature.legacy.cross && <X size={16} className="text-slate-400 flex-shrink-0" />}
                      <span className="text-slate-600">{feature.legacy.text}</span>
                    </div>
                    {feature.legacy.badge && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide border ${
                        feature.legacy.badgeType === 'warning' 
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {feature.legacy.badge}
                      </span>
                    )}
                  </div>
                </td>

                {/* Custom GPT Column */}
                <td className="py-4 px-4">
                  <div className="flex flex-col items-start gap-1.5 opacity-80">
                    <div className="flex items-center gap-2">
                      {feature.customGpt.check && <Check size={16} className="text-emerald-500 flex-shrink-0" />}
                      {feature.customGpt.cross && <X size={16} className="text-slate-400 flex-shrink-0" />}
                      <span className="text-slate-600">{feature.customGpt.text}</span>
                    </div>
                    {feature.customGpt.badge && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide bg-slate-100 text-slate-600 border-slate-200 border">
                        {feature.customGpt.badge}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
