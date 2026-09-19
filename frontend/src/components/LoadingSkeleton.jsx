import React from 'react';
import { Cpu, Sparkles } from 'lucide-react';

export function CardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-6 space-y-4 animate-pulse">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
      <div className="space-y-2 pt-2">
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
      </div>
    </div>
  );
}

export function PredictionLoadingOverlay({ message = "AI Engine is computing valuation..." }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md">
      <div className="glass-card rounded-3xl p-8 max-w-md w-full mx-4 text-center space-y-6 shadow-2xl border border-teal-500/30">
        <div className="relative w-20 h-20 mx-auto">
          {/* Glowing spinning ring */}
          <div className="absolute inset-0 rounded-full border-4 border-teal-500/20 border-t-teal-500 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-emerald-500/20 border-b-emerald-400 animate-spin animation-delay-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Cpu className="w-8 h-8 text-teal-400 animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-center space-x-2">
            <span>Evaluating Property Parameters</span>
            <Sparkles className="w-4 h-4 text-amber-400 animate-bounce" />
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {message}
          </p>
        </div>

        {/* Step Indicators */}
        <div className="space-y-2 text-left bg-slate-900/40 p-4 rounded-xl border border-white/5 text-[11px] font-mono text-slate-400">
          <div className="flex items-center space-x-2 text-teal-400">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping"></span>
            <span>✓ Feature Vector Standardization</span>
          </div>
          <div className="flex items-center space-x-2 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>✓ XGBoost Inference Execution</span>
          </div>
          <div className="flex items-center space-x-2 text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
            <span>✓ Computing SHAP Value Attributions</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1.5 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 w-fit">
      <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce"></span>
      <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]"></span>
      <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]"></span>
    </div>
  );
}
