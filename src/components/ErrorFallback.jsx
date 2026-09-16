import React, { useState } from 'react';
import { AlertTriangle, RefreshCcw, FileWarning, Terminal } from 'lucide-react';

export default function ErrorFallback({ error, errorInfo, resetErrorBoundary }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-rose-100 selection:text-rose-900 font-sans">
      <div className="max-w-2xl w-full">
        <div className="bg-white border border-rose-200 shadow-xl shadow-rose-900/5 rounded-3xl overflow-hidden">
          <div className="p-8 sm:p-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 font-display">
                  Something went wrong
                </h1>
                <p className="text-sm text-slate-600 mt-0.5">
                  The application encountered an unexpected runtime error.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 text-sm space-y-3">
              <div className="flex items-start gap-2.5">
                <FileWarning className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-rose-900">Error Details</p>
                  <p className="text-rose-700 font-mono mt-1 text-xs break-all">
                    {error && error.toString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={resetErrorBoundary}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-sports-text font-semibold text-sm rounded-xl transition flex items-center justify-center gap-2"
              >
                <RefreshCcw className="w-4 h-4" />
                Reload Application
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl transition flex items-center justify-center gap-2"
              >
                <Terminal className="w-4 h-4" />
                {isExpanded ? 'Hide Stack Trace' : 'Show Stack Trace'}
              </button>
            </div>
          </div>
          
          {isExpanded && errorInfo && (
            <div className="border-t border-slate-200 bg-slate-900 p-6 overflow-x-auto">
              <p className="text-[11px] font-mono text-slate-400 mb-2 uppercase tracking-wider font-semibold">
                Component Stack Trace
              </p>
              <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap break-all leading-relaxed">
                {errorInfo.componentStack}
              </pre>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center text-xs text-slate-500 font-mono">
          If the problem persists, please clear your browser cache or contact support.
        </div>
      </div>
    </div>
  );
}
